import { NextResponse } from "next/server";
import { requireBusiness } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/integrations/disconnect
 * Disconnects WhatsApp credentials: clears encrypted token and sets status to pending.
 * Requires { confirm: true } in request body to prevent accidental disconnects.
 */
export async function POST(req: Request) {
  try {
    const { business } = await requireBusiness();
    const body = await req.json();

    if (!body.confirm) {
      return NextResponse.json(
        { error: "Confirmation required. Send { confirm: true } to disconnect." },
        { status: 400 }
      );
    }

    const credential = await prisma.integrationCredential.findFirst({
      where: { businessId: business.id, provider: "meta_whatsapp" },
    });

    if (!credential) {
      return NextResponse.json(
        { error: "No WhatsApp credentials found" },
        { status: 404 }
      );
    }

    // Clear sensitive data and deactivate
    await prisma.integrationCredential.update({
      where: { id: credential.id, businessId: business.id },
      data: {
        accessTokenEncrypted: null,
        verifyToken: null,
        status: "pending",
        lastVerifiedAt: null,
        updatedAt: new Date(),
      },
    });

    // Deactivate the associated business line
    await prisma.businessLine.updateMany({
      where: { businessId: business.id, phoneNumber: credential.phoneNumberId ?? "" },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true, message: "WhatsApp disconnected" });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("Disconnect error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
