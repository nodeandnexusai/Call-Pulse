import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { scoreLead } from "@/lib/scoring";
import { checkRateLimit, getClientIp, validateTwilioWebhook } from "@/lib/webhook-guards";
import {
  LeadStatus,
  MessageDirection,
  MessageChannel,
  MessageStatus,
} from "@prisma/client";

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    if (!checkRateLimit(`twilio-sms:${ip}`, { limit: 30, windowMs: 60_000 })) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const text = await req.text();
    if (!validateTwilioWebhook(req, text)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = new URLSearchParams(text);

    const from = params.get("From") ?? "";
    const body = params.get("Body") ?? "";
    const to = params.get("To") ?? ""; // Your Twilio number

    if (!from || !body) {
      return new NextResponse("<Response/>", {
        headers: { "Content-Type": "text/xml" },
      });
    }

    // Find matching business line
    const line = await prisma.businessLine.findFirst({
      where: { phoneNumber: to, isActive: true },
    });

    const businessId = line?.businessId;

    if (!businessId) {
      return new NextResponse("<Response/>", {
        headers: { "Content-Type": "text/xml" },
      });
    }

    // Match to existing lead by phone number
    const lead = await prisma.lead.findFirst({
      where: {
        businessId,
        phoneNumber: from,
        status: { notIn: [LeadStatus.lost] },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!lead) {
      // Unknown caller reply — create a new lead
      const newLead = await prisma.lead.create({
        data: {
          businessId,
          phoneNumber: from,
          status: LeadStatus.replied,
          score: scoreLead(body),
          sourceLineId: line?.id,
        },
      });

      await prisma.message.create({
        data: {
          businessId,
          leadId: newLead.id,
          direction: MessageDirection.inbound,
          channel: MessageChannel.sms,
          body,
          status: MessageStatus.replied,
          sentAt: new Date(),
        },
      });

      return new NextResponse("<Response/>", {
        headers: { "Content-Type": "text/xml" },
      });
    }

    const score = scoreLead(body);

    // Update lead score and status
    await prisma.lead.update({
      where: { id: lead.id, businessId },
      data: {
        status: score === "hot" ? LeadStatus.qualified : LeadStatus.replied,
        score,
        automationPaused: true, // Stop follow-up sequences once they reply
        nextFollowUpAt: null,
        updatedAt: new Date(),
      },
    });

    // Log inbound message
    await prisma.message.create({
      data: {
        businessId,
        leadId: lead.id,
        direction: MessageDirection.inbound,
        channel: MessageChannel.sms,
        body,
        status: MessageStatus.replied,
        sentAt: new Date(),
      },
    });

    return new NextResponse("<Response/>", {
      headers: { "Content-Type": "text/xml" },
    });
  } catch (err) {
    console.error("SMS inbound webhook error:", err);
    return new NextResponse("<Response/>", {
      status: 500,
      headers: { "Content-Type": "text/xml" },
    });
  }
}
