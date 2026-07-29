import { prisma } from "./prisma";
import { sendMessage } from "./sender";
import { MessageChannel, LeadStatus, MessageStatus, MessageDirection } from "@prisma/client";
import { toZonedTime, fromZonedTime } from "date-fns-tz";
import { getDay, getHours } from "date-fns";

type BusinessHours = {
  [key: string]: [number, number] | null; // e.g. { mon: [9, 18], tue: [9, 18], sun: null }
};

const DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

/**
 * Checks if the current time in the given timezone falls within business hours.
 */
function isWithinBusinessHours(
  businessHours: BusinessHours,
  timezone: string
): boolean {
  const now = new Date();
  const zoned = toZonedTime(now, timezone);
  const dayKey = DAY_KEYS[getDay(zoned)];
  const hour = getHours(zoned);

  const hours = businessHours[dayKey];
  if (!hours) return false; // Closed on this day

  const [open, close] = hours;
  return hour >= open && hour < close;
}

/**
 * Renders a message template body, substituting dynamic variables.
 */
function renderTemplate(
  body: string,
  vars: {
    clientName?: string;
    businessName?: string;
    currentTime?: string;
    callbackLink?: string;
  }
): string {
  return body
    .replace(/\{client_name\}/gi, vars.clientName ?? "there")
    .replace(/\{business_name\}/gi, vars.businessName ?? "our team")
    .replace(/\{current_time\}/gi, vars.currentTime ?? "")
    .replace(/\{callback_link\}/gi, vars.callbackLink ?? "");
}

/**
 * Main automation trigger. Called after a missed call is logged.
 * Looks up automation rules, picks the right template, sends the message,
 * creates/updates the lead, and schedules follow-ups.
 */
export async function triggerAutomation(callId: string): Promise<void> {
  const call = await prisma.call.findUnique({
    where: { id: callId },
    include: {
      business: true,
      line: true,
    },
  });

  if (!call) return;

  const { business, line } = call;

  // Find the most specific automation rule: line-specific first, then global
  const rule = await prisma.automationRule.findFirst({
    where: {
      businessId: business.id,
      isActive: true,
      OR: [{ lineId: line?.id ?? null }, { lineId: null }],
    },
    orderBy: { lineId: "asc" }, // line-specific (non-null) sorts first
    include: {
      template: true,
      afterHoursTemplate: true,
    },
  });

  if (!rule) return; // No automation configured

  // Pick template based on business hours
  let template = rule.template;

  if (rule.respectBusinessHours && line?.businessHours) {
    const hours = line.businessHours as BusinessHours;
    const inHours = isWithinBusinessHours(hours, business.timezone);
    if (!inHours && rule.afterHoursTemplate) {
      template = rule.afterHoursTemplate;
    }
  }

  // Build template variables
  const now = toZonedTime(new Date(), business.timezone);
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  const rendered = renderTemplate(template.body, {
    businessName: business.name,
    currentTime: timeStr,
  });

  // Create or update lead
  const existingLead = await prisma.lead.findFirst({
    where: {
      businessId: business.id,
      phoneNumber: call.callerNumber,
      status: { notIn: [LeadStatus.lost, LeadStatus.cold] },
    },
    orderBy: { createdAt: "desc" },
  });

  const lead = existingLead
    ? await prisma.lead.update({
        where: { id: existingLead.id },
        data: {
          status: LeadStatus.messaged,
          updatedAt: new Date(),
        },
      })
    : await prisma.lead.create({
        data: {
          businessId: business.id,
          callId: call.id,
          phoneNumber: call.callerNumber,
          status: LeadStatus.messaged,
          sourceLineId: line?.id,
          sequenceStep: 1,
        },
      });

  // Send the message
  const channel = template.channel as MessageChannel;
  const result = await sendMessage(business.id, call.callerNumber, rendered, channel);

  // Log the outbound message
  await prisma.message.create({
    data: {
      businessId: business.id,
      leadId: lead.id,
      direction: MessageDirection.outbound,
      channel,
      body: rendered,
      status: result.success ? MessageStatus.sent : MessageStatus.failed,
      providerMessageId: result.providerMessageId,
      sentAt: result.success ? new Date() : null,
    },
  });

  // Schedule follow-up if there's a step 2 template
  if (result.success) {
    const followUpTemplate = await prisma.messageTemplate.findFirst({
      where: {
        businessId: business.id,
        isActive: true,
        sequenceStep: 2,
        channel: template.channel,
      },
    });

    if (followUpTemplate && followUpTemplate.delayMinutes > 0) {
      const nextFollowUpAt = new Date(
        Date.now() + followUpTemplate.delayMinutes * 60 * 1000
      );
      await prisma.lead.update({
        where: { id: lead.id },
        data: { nextFollowUpAt, sequenceStep: 2 },
      });
    }
  }
}

/**
 * Processes due follow-up sequence messages.
 * Called by the cron job every 5 minutes.
 */
export async function processFollowUpSequences(): Promise<number> {
  const dueLeads = await prisma.lead.findMany({
    where: {
      automationPaused: false,
      nextFollowUpAt: { lte: new Date() },
      status: { in: [LeadStatus.messaged, LeadStatus.new] },
    },
    include: { business: true, sourceLine: true },
  });

  let processed = 0;

  for (const lead of dueLeads) {
    const template = await prisma.messageTemplate.findFirst({
      where: {
        businessId: lead.businessId,
        isActive: true,
        sequenceStep: lead.sequenceStep,
      },
    });

    if (!template) {
      // No more steps — clear follow-up
      await prisma.lead.update({
        where: { id: lead.id },
        data: { nextFollowUpAt: null },
      });
      continue;
    }

    const rendered = renderTemplate(template.body, {
      businessName: lead.business.name,
    });

    const result = await sendMessage(
      lead.businessId,
      lead.phoneNumber,
      rendered,
      template.channel as MessageChannel
    );

    await prisma.message.create({
      data: {
        businessId: lead.businessId,
        leadId: lead.id,
        direction: MessageDirection.outbound,
        channel: template.channel as MessageChannel,
        body: rendered,
        status: result.success ? MessageStatus.sent : MessageStatus.failed,
        providerMessageId: result.providerMessageId,
        sentAt: result.success ? new Date() : null,
      },
    });

    // Check for next step
    const nextTemplate = await prisma.messageTemplate.findFirst({
      where: {
        businessId: lead.businessId,
        isActive: true,
        sequenceStep: lead.sequenceStep + 1,
      },
    });

    await prisma.lead.update({
      where: { id: lead.id },
      data: {
        nextFollowUpAt: nextTemplate
          ? new Date(Date.now() + nextTemplate.delayMinutes * 60 * 1000)
          : null,
        sequenceStep: nextTemplate ? lead.sequenceStep + 1 : lead.sequenceStep,
      },
    });

    processed++;
  }

  return processed;
}
