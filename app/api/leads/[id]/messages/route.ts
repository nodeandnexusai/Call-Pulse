import { NextResponse } from "next/server";
import { requireBusiness } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendMessage } from "@/lib/sender";
import {
  MessageDirection,
  MessageStatus,
} from "@prisma/client";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { business } = await requireBusiness();
    const { id } = await params;

    const lead = await prisma.lead.findFirst({
      where: { id, businessId: business.id },
      include: {
        messages: { orderBy: { createdAt: "asc" } },
        call: true,
        sourceLine: true,
        assignedAgent: { select: { fullName: true, email: true } },
      },
    });

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json(lead);
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { business, user } = await requireBusiness();
    const { id } = await params;
    const body = await req.json();
    const { message, channel = "whatsapp" } = body;

    if (!message) {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }

    const lead = await prisma.lead.findFirst({
      where: { id, businessId: business.id },
    });

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const result = await sendMessage(business.id, lead.phoneNumber, message, channel);

    const msg = await prisma.message.create({
      data: {
        businessId: business.id,
        leadId: lead.id,
        direction: MessageDirection.outbound,
        channel,
        body: message,
        status: result.success ? MessageStatus.sent : MessageStatus.failed,
        providerMessageId: result.providerMessageId,
        sentAt: result.success ? new Date() : null,
      },
    });

    // Assign agent if not already
    if (!lead.assignedAgentId) {
      await prisma.lead.update({
        where: { id: lead.id, businessId: business.id },
        data: { assignedAgentId: user.id, automationPaused: true },
      });
    }

    return NextResponse.json({ message: msg, sent: result.success });
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
