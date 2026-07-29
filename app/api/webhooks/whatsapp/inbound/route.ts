import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { scoreLead } from "@/lib/scoring";
import { checkRateLimit, getClientIp, validateMetaWebhook } from "@/lib/webhook-guards";
import {
  LeadStatus,
  MessageDirection,
  MessageChannel,
  MessageStatus,
} from "@prisma/client";

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN ?? "callpulse_verify";

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

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }
  return new NextResponse("Forbidden", { status: 403 });
}

/**
 * POST — Inbound WhatsApp message from Meta Cloud API
 */
export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    if (!checkRateLimit(`meta-wa-post:${ip}`, { limit: 60, windowMs: 60_000 })) {
      return NextResponse.json({ received: true }, { status: 429 });
    }

    const bodyText = await req.text();
    if (!validateMetaWebhook(req, bodyText)) {
      return NextResponse.json({ received: true }, { status: 401 });
    }

    const body = JSON.parse(bodyText);

    const entry = body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    // Only process incoming messages
    if (value?.statuses) {
      return NextResponse.json({ received: true });
    }

    const messages = value?.messages;
    if (!messages?.length) {
      return NextResponse.json({ received: true });
    }

    const msg = messages[0];
    const from = msg.from; // Caller's WhatsApp number
    const msgBody = msg.text?.body ?? msg.button?.text ?? "";
    const toPhoneNumberId = value?.metadata?.phone_number_id;

    if (!from || !msgBody) {
      return NextResponse.json({ received: true });
    }

    // Match to a business line by phone_number_id
    const credential = await prisma.integrationCredential.findFirst({
      where: { phoneNumberId: toPhoneNumberId, provider: "meta_whatsapp" },
    });

    const businessId = credential?.businessId;

    if (!businessId) {
      return NextResponse.json({ received: true });
    }

    // Normalize phone number (WhatsApp sends without +)
    const callerNumber = from.startsWith("+") ? from : `+${from}`;

    // Match to an existing lead
    const lead = await prisma.lead.findFirst({
      where: {
        businessId,
        phoneNumber: { contains: from.slice(-9) }, // match last 9 digits
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
