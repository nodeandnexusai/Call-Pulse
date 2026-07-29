import { NextResponse } from "next/server";
import { requireBusiness } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { business } = await requireBusiness();
    return NextResponse.json({
      id: business.id,
      name: business.name,
      timezone: business.timezone,
      createdAt: business.createdAt,
    });
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { business } = await requireBusiness();
    const body = await req.json();
    const { name, timezone } = body;

    const updated = await prisma.business.update({
      where: { id: business.id },
      data: {
        ...(name ? { name } : {}),
        ...(timezone ? { timezone } : {}),
      },
    });

    return NextResponse.json({
      id: updated.id,
      name: updated.name,
      timezone: updated.timezone,
    });
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
