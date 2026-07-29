import { NextResponse } from "next/server";
import { requireBusiness } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { business } = await requireBusiness();
    const lines = await prisma.businessLine.findMany({
      where: { businessId: business.id },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json({ lines });
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { business } = await requireBusiness();
    const body = await req.json();
    const { label, phoneNumber, provider, businessHours } = body;

    if (!label || !phoneNumber || !provider) {
      return NextResponse.json(
        { error: "label, phoneNumber, and provider are required" },
        { status: 400 }
      );
    }

    const line = await prisma.businessLine.create({
      data: {
        businessId: business.id,
        label,
        phoneNumber,
        provider,
        businessHours: businessHours ?? null,
        isActive: true,
      },
    });

    return NextResponse.json({ line });
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
