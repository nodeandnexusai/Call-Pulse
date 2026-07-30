import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { scoreLead } from "@/lib/scoring";
import { triggerAutomation } from "@/lib/automation";
import { checkRateLimit, getClientIp, validateMetaWebhook } from "@/lib/webhook-guards";
import {
  CallStatus,
  LeadStatus,
  MessageDirection,
  MessageChannel,
  MessageStatus,
} from "@prisma/client";

/**
 * GET — Meta webhook challenge verification
 */
export async function GET(req: Request) {
  const ip = getClientIp(req);
  if (!checkRateLimit(`meta-wa-challenge:${ip}`, { limit: 60, windowMs: 60_000 })) {
    return new NextResponse("Too Many Requests", { status: 429 });
  }

  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const expectedToken = process.env.WHATSAPP_VERIFY_TOKEN ?? "callpulse_verify";

  if (mode === "subscribe" && token === expectedToken) {
    return new Response(challenge ?? "", { status: 200 });
  }
  return new Response("Forbidden", { status: 403 });
}

/**
 * POST — Inbound WhatsApp webhook (missed call events + inbound message replies)
 */
export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    if (!checkRateLimit(`meta-wa-post:${ip}`, { limit: 60, windowMs: 60_000 })) {
      return NextResponse.json({ received: true }, { status: 429 });
    }

    const bodyText = await req.text();

    // Webhook signature verification (D5 requirement)
    if (!validateMetaWebhook(req, bodyText)) {
      return new Response("Forbidden", { status: 403 });
    }

    const body = JSON.parse(bodyText);

    const entry = body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    // Ignore message status updates (sent/delivered/read)
    if (value?.statuses) {
      return NextResponse.json({ received: true });
    }

    const messages = value?.messages;
    if (!messages?.length) {
      return NextResponse.json({ received: true });
    }

    const msg = messages[0];
    const from = msg.from; // Caller / Sender WhatsApp number
    const toPhoneNumberId = value?.metadata?.phone_number_id;

    if (!from) {
      return NextResponse.json({ received: true });
    }

    // Match business credential by phoneNumberId
    const credential = await prisma.integrationCredential.findFirst({
      where: { phoneNumberId: toPhoneNumberId, provider: "meta_whatsapp" },
    });

    const businessId = credential?.businessId;
    if (!businessId) {
      return NextResponse.json({ received: true });
    }

    // Normalize phone number with '+' prefix
    const callerNumber = from.startsWith("+") ? from : `+${from}`;

    // Handle Missed Call Notification from Meta WhatsApp Business (Part B1)
    if (msg.type === "call" && msg.call?.call_status === "missed") {
      const call = await prisma.call.create({
        data: {
          businessId,
          callerNumber,
          callStatus: CallStatus.missed,
        },
      });

      await triggerAutomation(call.id);
      return NextResponse.json({ received: true });
    }

    // Handle Inbound Customer Message / Reply (Part B1)
    const msgBody =
      msg.text?.body ??
      msg.button?.text ??
      msg.interactive?.button_reply?.title ??
      "";

    if (!msgBody) {
      return NextResponse.json({ received: true });
    }

    // Match existing lead
    const lead = await prisma.lead.findFirst({
      where: {
        businessId,
        phoneNumber: { contains: from.slice(-9) },
        status: { notIn: [LeadStatus.lost] },
      },
      orderBy: { createdAt: "desc" },
    });

    const score = scoreLead(msgBody);

    if (!lead) {
      const newLead = await prisma.lead.create({
        data: {
          businessId,
          phoneNumber: callerNumber,
          status: LeadStatus.replied,
          score,
        },
      });

      await prisma.message.create({
        data: {
          businessId,
          leadId: newLead.id,
          direction: MessageDirection.inbound,
          channel: MessageChannel.whatsapp,
          body: msgBody,
          status: MessageStatus.replied,
          sentAt: new Date(),
        },
      });

      return NextResponse.json({ received: true });
    }

    await prisma.lead.update({
      where: { id: lead.id, businessId },
      data: {
        status: score === "hot" ? LeadStatus.qualified : LeadStatus.replied,
        score,
        automationPaused: true,
        nextFollowUpAt: null,
        updatedAt: new Date(),
      },
    });

    await prisma.message.create({
      data: {
        businessId,
        leadId: lead.id,
        direction: MessageDirection.inbound,
        channel: MessageChannel.whatsapp,
        body: msgBody,
        status: MessageStatus.replied,
        sentAt: new Date(),
      },
    });

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("WhatsApp inbound webhook error:", err);
    return NextResponse.json({ received: true });
  }
}
