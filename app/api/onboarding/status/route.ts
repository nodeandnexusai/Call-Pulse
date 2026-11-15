import { NextResponse } from "next/server";
import { getBusinessForUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/onboarding/status
 * Returns whether the current business has completed onboarding
 * (i.e. has an active WhatsApp integration credential).
 */
export async function GET() {
  try {
    const result = await getBusinessForUser();
    if (!result) {
      return NextResponse.json({ completed: false });
    }

    const credential = await prisma.integrationCredential.findFirst({
      where: { businessId: result.business.id, status: "active" },
      select: { id: true },
    });

    return NextResponse.json({ completed: !!credential });
  } catch {
    return NextResponse.json({ completed: false });
  }
}
