import { NextResponse } from "next/server";
import { requireCronSecret } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startOfDay, subDays, endOfDay } from "date-fns";

export async function POST(req: Request) {
  if (!requireCronSecret(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const yesterday = subDays(new Date(), 1);
    const dayStart = startOfDay(yesterday);
    const dayEnd = endOfDay(yesterday);

    const businesses = await prisma.business.findMany({ select: { id: true } });

    let processed = 0;

    for (const business of businesses) {
      const [missedCalls, autoRepliesSent, repliesReceived, leadsQualified] =
        await Promise.all([
          prisma.call.count({
            where: {
              businessId: business.id,
              callStatus: "missed",
              receivedAt: { gte: dayStart, lte: dayEnd },
            },
          }),
          prisma.message.count({
            where: {
              businessId: business.id,
              direction: "outbound",
              sentAt: { gte: dayStart, lte: dayEnd },
            },
          }),
          prisma.message.count({
            where: {
              businessId: business.id,
              direction: "inbound",
              sentAt: { gte: dayStart, lte: dayEnd },
            },
          }),
          prisma.lead.count({
            where: {
              businessId: business.id,
              status: "qualified",
              updatedAt: { gte: dayStart, lte: dayEnd },
            },
          }),
        ]);

      // Calculate average response time:
      // time between call.receivedAt and first outbound message sentAt
      const callsWithResponse = await prisma.call.findMany({
        where: {
          businessId: business.id,
          callStatus: "missed",
          receivedAt: { gte: dayStart, lte: dayEnd },
          lead: {
            messages: {
              some: { direction: "outbound" },
            },
          },
        },
        include: {
          lead: {
            include: {
              messages: {
                where: { direction: "outbound" },
                orderBy: { sentAt: "asc" },
                take: 1,
              },
            },
          },
        },
      });

      let avgResponseTimeSeconds: number | null = null;
      if (callsWithResponse.length > 0) {
        const totalSeconds = callsWithResponse.reduce<number>((sum, call) => {
          const firstMsg = call.lead?.messages[0];
          if (!firstMsg?.sentAt) return sum;
          return (
            sum +
            Math.floor(
              (firstMsg.sentAt.getTime() - call.receivedAt.getTime()) / 1000
            )
          );
        }, 0);
        avgResponseTimeSeconds = Math.floor(
          totalSeconds / callsWithResponse.length
        );
      }

      await prisma.dailyMetric.upsert({
        where: {
          businessId_date: { businessId: business.id, date: dayStart },
        },
        update: {
          missedCalls,
          autoRepliesSent,
          repliesReceived,
          leadsQualified,
          avgResponseTimeSeconds,
        },
        create: {
          businessId: business.id,
          date: dayStart,
          missedCalls,
          autoRepliesSent,
          repliesReceived,
          leadsQualified,
          avgResponseTimeSeconds,
        },
      });

      processed++;
    }

    return NextResponse.json({
      success: true,
      message: `Rolled up metrics for ${processed} business(es) for ${yesterday.toDateString()}`,
    });
  } catch (err) {
    console.error("Metrics rollup error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
