import { NextResponse } from "next/server";
import { requireBusiness } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { business, user } = await requireBusiness();
    const { id } = await params;

    const lead = await prisma.lead.findFirst({
      where: { id, businessId: business.id },
    });

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const updated = await prisma.lead.update({
      where: { id: lead.id, businessId: business.id },
      data: {
        assignedAgentId: user.id,
        automationPaused: true,
        nextFollowUpAt: null,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      lead: updated,
      message: `Lead taken over by ${user.fullName ?? user.clerkUserId}`,
    });
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
