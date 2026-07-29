import { NextResponse } from "next/server";
import { requireBusiness } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { subDays, startOfDay, format, endOfDay } from "date-fns";

export async function GET(req: Request) {
  try {
    const { business } = await requireBusiness();
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") ?? "7d";
    const days = range === "30d" ? 30 : 7;
    const since = startOfDay(subDays(new Date(), days - 1));

    const metrics = await prisma.dailyMetric.findMany({
      where: { businessId: business.id, date: { gte: since } },
      orderBy: { date: "asc" },
    });

    // Fill gaps with zeros
    const data = [];
    let totalMissed = 0, totalReplies = 0, totalQualified = 0, totalSent = 0;
    let weightedResponseTime = 0, responseCount = 0;

    for (let i = 0; i < days; i++) {
      const day = startOfDay(subDays(new Date(), days - 1 - i));
      const dateStr = format(day, "yyyy-MM-dd");
      const existing = metrics.find(
        (m) => format(new Date(m.date), "yyyy-MM-dd") === dateStr
      );

      const missed = existing?.missedCalls ?? 0;
      const replies = existing?.repliesReceived ?? 0;
      const qualified = existing?.leadsQualified ?? 0;
      const sent = existing?.autoRepliesSent ?? 0;
      const rt = existing?.avgResponseTimeSeconds ?? null;

      totalMissed += missed;
      totalReplies += replies;
      totalQualified += qualified;
      totalSent += sent;
      if (rt !== null) { weightedResponseTime += rt; responseCount++; }

      data.push({
        date: dateStr,
        missedCalls: missed,
        autoRepliesSent: sent,
        repliesReceived: replies,
        leadsQualified: qualified,
        recoveryRate: missed > 0 ? Math.round((replies / missed) * 100) : 0,
        avgResponseTimeSeconds: rt,
      });
    }

    return NextResponse.json({
      range,
      summary: {
        totalMissedCalls: totalMissed,
        totalAutoRepliesSent: totalSent,
        totalRepliesReceived: totalReplies,
        totalLeadsQualified: totalQualified,
        overallRecoveryRate: totalMissed > 0 ? Math.round((totalReplies / totalMissed) * 100) : 0,
        avgResponseTimeSeconds: responseCount > 0 ? Math.round(weightedResponseTime / responseCount) : null,
      },
      data,
    });
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
