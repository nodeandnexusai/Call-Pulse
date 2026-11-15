import { NextResponse } from "next/server";
import { requireBusiness } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/encryption";
import { checkRateLimit, getClientIp } from "@/lib/webhook-guards";

/**
 * POST /api/integrations/test
 * Tests the current business's WhatsApp credentials by calling the Meta Graph API.
 * Decrypts the access token in-memory only — never logged or returned.
 */
export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    if (!checkRateLimit(`integration-test:${ip}`, { limit: 10, windowMs: 60_000 })) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const { business } = await requireBusiness();

    const credential = await prisma.integrationCredential.findFirst({
      where: { businessId: business.id, provider: "meta_whatsapp" },
    });

    if (!credential || !credential.accessTokenEncrypted) {
      return NextResponse.json(
        { success: false, error: "No credentials found. Please save your WhatsApp credentials first." },
        { status: 404 }
      );
    }

    // Decrypt in-memory only — never logged or returned
    const accessToken = decrypt(credential.accessTokenEncrypted);

    try {
      const res = await fetch(
        `https://graph.facebook.com/v18.0/${credential.phoneNumberId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const data = await res.json();

      if (!res.ok || data.error) {
        // Update status to failed
        await prisma.integrationCredential.update({
          where: { id: credential.id, businessId: business.id },
          data: { status: "failed", updatedAt: new Date() },
        });
        return NextResponse.json({
          success: false,
          error: data.error?.message || "Connection failed — check your credentials",
        });
      }

      // Update status to active + set lastVerifiedAt
      await prisma.integrationCredential.update({
        where: { id: credential.id, businessId: business.id },
        data: {
          status: "active",
          lastVerifiedAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Also ensure a BusinessLine exists for this phone number
      const existingLine = await prisma.businessLine.findFirst({
        where: { businessId: business.id, phoneNumber: credential.phoneNumberId! },
        select: { id: true },
      });

      if (!existingLine) {
        await prisma.businessLine.create({
          data: {
            businessId: business.id,
            label: data.verified_name || "WhatsApp Business Line",
            phoneNumber: credential.phoneNumberId!,
            isActive: true,
          },
        });
      } else {
        await prisma.businessLine.update({
          where: { id: existingLine.id },
          data: { isActive: true },
        });
      }

      return NextResponse.json({
        success: true,
        phoneNumber: data.display_phone_number,
        verifiedName: data.verified_name,
      });
    } catch {
      return NextResponse.json(
        { success: false, error: "Network error — please try again" },
        { status: 500 }
      );
    }
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("Integration test error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
