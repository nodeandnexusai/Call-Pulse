import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { triggerAutomation } from "@/lib/automation";
import { CallStatus } from "@prisma/client";
import { checkRateLimit, getClientIp, validateTwilioWebhook } from "@/lib/webhook-guards";

const MISSED_STATUSES = new Set(["no-answer", "busy", "failed", "canceled"]);

export async function POST(req: Request) {
  const ip = getClientIp(req);
  if (!checkRateLimit(`twilio-voice:${ip}`, { limit: 30, windowMs: 60_000 })) {
    return new NextResponse("Too Many Requests", { status: 429 });
  }

  const text = await req.text();
  if (!validateTwilioWebhook(req, text)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const params = new URLSearchParams(text);

  const callStatus = params.get("CallStatus") ?? "";
  const to = params.get("To") ?? "";       // Your Twilio number (the business line)
  const from = params.get("From") ?? "";   // Caller's number
  const callSid = params.get("CallSid") ?? "";

  if (!MISSED_STATUSES.has(callStatus)) {
    // Not a missed call — acknowledge without action
    return new NextResponse("<Response/>", {
      headers: { "Content-Type": "text/xml" },
    });
  }

  try {
    // Find which business line this belongs to
    const line = await prisma.businessLine.findFirst({
      where: { phoneNumber: to, isActive: true },
    });

    const resolvedBusinessId = line?.businessId;

    if (!resolvedBusinessId) {
      console.error("No business found for incoming call to:", to);
      return new NextResponse("<Response/>", {
        headers: { "Content-Type": "text/xml" },
      });
    }

    // Log the call
    const call = await prisma.call.create({
      data: {
        businessId: resolvedBusinessId,
        lineId: line?.id,
        callerNumber: from,
        callStatus: CallStatus.missed,
        twilioCallSid: callSid,
        receivedAt: new Date(),
      },
    });

    // Fire automation (non-blocking — respond to Twilio immediately)
    triggerAutomation(call.id).catch((err) =>
      console.error("Automation error:", err)
    );

    return new NextResponse("<Response/>", {
      headers: { "Content-Type": "text/xml" },
    });
  } catch (err) {
    console.error("Voice status webhook error:", err);
    return new NextResponse("<Response/>", {
      status: 500,
      headers: { "Content-Type": "text/xml" },
    });
  }
}
