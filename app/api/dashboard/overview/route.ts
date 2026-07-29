import { NextResponse } from "next/server";
import { requireBusiness } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { business } = await requireBusiness();

    const [
      totalMissedCalls,
      activeLines,
      totalLeadsRecovered,
      totalReplies,
      twilioCredential,
      whatsappCredential,
    ] = await Promise.all([
      prisma.call.count({
        where: { businessId: business.id, callStatus: "missed" },
      }),
      prisma.businessLine.count({
        where: { businessId: business.id, isActive: true },
      }),
      prisma.lead.count({
        where: {
          businessId: business.id,
          status: { in: ["replied", "qualified"] },
        },
      }),
      prisma.message.count({
        where: { businessId: business.id, direction: "inbound" },
      }),
      prisma.integrationCredential.findUnique({
        where: {
          businessId_provider: { businessId: business.id, provider: "twilio" },
        },
        select: { status: true, lastVerifiedAt: true },
      }),
      prisma.integrationCredential.findUnique({
        where: {
          businessId_provider: {
            businessId: business.id,
            provider: "meta_whatsapp",
          },
        },
        select: { status: true, lastVerifiedAt: true },
      }),
    ]);

    // Determine system status
    const hasActiveCreds =
      twilioCredential?.status === "active" ||
      whatsappCredential?.status === "active";

    const systemStatus = hasActiveCreds
      ? "active"
      : twilioCredential || whatsappCredential
      ? "degraded"
      : "offline";

    const recoveryRate =
      totalMissedCalls > 0
        ? Math.round((totalReplies / totalMissedCalls) * 100)
        : 0;

    // Average response time from daily_metrics
    const avgResponse = await prisma.dailyMetric.aggregate({
      where: { businessId: business.id },
      _avg: { avgResponseTimeSeconds: true },
    });

    return NextResponse.json({
      systemStatus,
      activeLines,
      totalMissedCalls,
      totalLeadsRecovered,
      totalReplies,
      recoveryRate,
      avgResponseTimeSeconds: Math.round(
        avgResponse._avg.avgResponseTimeSeconds ?? 0
      ),
      integrations: {
        twilio: twilioCredential?.status ?? "not_configured",
        whatsapp: whatsappCredential?.status ?? "not_configured",
      },
    });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("Dashboard overview error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
