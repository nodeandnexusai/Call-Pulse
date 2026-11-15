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
    const { name, timezone, businessHours, activeDays } = body;

    const updated = await prisma.business.update({
      where: { id: business.id },
      data: {
        ...(name ? { name } : {}),
        ...(timezone ? { timezone } : {}),
      },
    });

    // If business hours / active days were provided (e.g. from onboarding),
    // save them to all existing business lines for this business
    if (businessHours || activeDays) {
      const hoursJson = buildBusinessHoursJson(businessHours, activeDays);

      const lines = await prisma.businessLine.findMany({
        where: { businessId: business.id },
        select: { id: true },
      });

      for (const line of lines) {
        await prisma.businessLine.update({
          where: { id: line.id },
          data: { businessHours: hoursJson },
        });
      }
    }

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

/**
 * Builds a JSON business hours object from open/close times and active day list.
 * Format: { mon: [9, 18], tue: [9, 18], ..., sun: null }
 */
function buildBusinessHoursJson(
  hours?: { open: number; close: number },
  activeDays?: string[]
) {
  const allDays = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  const open = hours?.open ?? 9;
  const close = hours?.close ?? 18;
  const active = activeDays ?? ["mon", "tue", "wed", "thu", "fri"];

  const result: Record<string, [number, number] | null> = {};
  for (const day of allDays) {
    result[day] = active.includes(day) ? [open, close] : null;
  }
  return result;
}
