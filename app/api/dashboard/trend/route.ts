import { NextResponse } from "next/server";
import { requireBusiness } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { subDays, startOfDay, format } from "date-fns";

export async function GET(req: Request) {
  try {
    const { business } = await requireBusiness();
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") ?? "7d";

    const days = range === "30d" ? 30 : 7;
    const since = startOfDay(subDays(new Date(), days - 1));

    const metrics = await prisma.dailyMetric.findMany({
      where: {
        businessId: business.id,
        date: { gte: since },
      },
      orderBy: { date: "asc" },
    });

    // Build a complete array for all days in range (fill gaps with zeros)
    const result = [];
    for (let i = 0; i < days; i++) {
      const day = startOfDay(subDays(new Date(), days - 1 - i));
      const dateStr = format(day, "yyyy-MM-dd");

      const existing = metrics.find(
        (m) => format(new Date(m.date), "yyyy-MM-dd") === dateStr
      );

      const missedCalls = existing?.missedCalls ?? 0;
      const repliesReceived = existing?.repliesReceived ?? 0;

      result.push({
        date: dateStr,
        missedCalls,
        autoRepliesSent: existing?.autoRepliesSent ?? 0,
        repliesReceived,
        leadsQualified: existing?.leadsQualified ?? 0,
        recoveryRate:
          missedCalls > 0
            ? Math.round((repliesReceived / missedCalls) * 100)
            : 0,
      });
    }

    return NextResponse.json({ range, data: result });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("Dashboard trend error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
