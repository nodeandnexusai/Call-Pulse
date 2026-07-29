import { NextResponse } from "next/server";
import { requireBusiness } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { business } = await requireBusiness();
    const { searchParams } = new URL(req.url);
    const channel = searchParams.get("channel");

    const templates = await prisma.messageTemplate.findMany({
      where: {
        businessId: business.id,
        isActive: true,
        ...(channel ? { channel: channel as "sms" | "whatsapp" } : {}),
      },
      orderBy: [{ channel: "asc" }, { sequenceStep: "asc" }],
    });

    return NextResponse.json({ templates });
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { business } = await requireBusiness();
    const body = await req.json();
    const { id, name, channel, templateBody, sequenceStep, delayMinutes, isActive } = body;

    if (!name || !channel || !templateBody) {
      return NextResponse.json(
        { error: "name, channel, and templateBody are required" },
        { status: 400 }
      );
    }

    let template;
    if (id) {
      template = await prisma.messageTemplate.update({
        where: { id },
        data: {
          name,
          channel,
          body: templateBody,
          sequenceStep: sequenceStep ?? 1,
          delayMinutes: delayMinutes ?? 0,
          isActive: isActive ?? true,
        },
      });
    } else {
      template = await prisma.messageTemplate.create({
        data: {
          businessId: business.id,
          name,
          channel,
          body: templateBody,
          sequenceStep: sequenceStep ?? 1,
          delayMinutes: delayMinutes ?? 0,
          isActive: isActive ?? true,
        },
      });
    }

    return NextResponse.json({ template });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("Template error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
