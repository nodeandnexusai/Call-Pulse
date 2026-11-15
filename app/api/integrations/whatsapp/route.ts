import { NextResponse } from "next/server";
import { requireBusiness } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { encrypt, decrypt, maskSecret } from "@/lib/encryption";

/**
 * GET /api/integrations/whatsapp
 * Returns the current business's WhatsApp credential info (masked tokens only).
 */
export async function GET() {
  try {
    const { business } = await requireBusiness();

    const credential = await prisma.integrationCredential.findFirst({
      where: { businessId: business.id, provider: "meta_whatsapp" },
    });

    if (!credential) {
      return NextResponse.json({ connected: false });
    }

    // Build masked token — NEVER return accessTokenEncrypted
    let accessTokenMasked: string | null = null;
    if (credential.accessTokenEncrypted) {
      try {
        const decrypted = decrypt(credential.accessTokenEncrypted);
        accessTokenMasked = maskSecret(decrypted, 4);
      } catch {
        accessTokenMasked = "••••••";
      }
    }

    return NextResponse.json({
      connected: true,
      id: credential.id,
      phoneNumberId: credential.phoneNumberId,
      wabaId: credential.wabaId,
      accessTokenMasked,
      verifyToken: credential.verifyToken,
      status: credential.status,
      lastVerifiedAt: credential.lastVerifiedAt,
    });
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/integrations/whatsapp
 * Saves (upserts) WhatsApp credentials. Encrypts the access token server-side.
 * Does NOT auto-verify — use POST /api/integrations/test for that.
 */
export async function POST(req: Request) {
  try {
    const { business } = await requireBusiness();
    const body = await req.json();
    const { phoneNumberId, accessToken, wabaId, verifyToken } = body;

    if (!phoneNumberId || !accessToken || !wabaId) {
      return NextResponse.json(
        { error: "phoneNumberId, accessToken, and wabaId are required" },
        { status: 400 }
      );
    }

    // Encrypt sensitive values — never store plaintext
    const accessTokenEncrypted = encrypt(accessToken);

    const credential = await prisma.integrationCredential.upsert({
      where: {
        businessId_provider: { businessId: business.id, provider: "meta_whatsapp" },
      },
      update: {
        phoneNumberId,
        wabaId: wabaId ?? null,
        accessTokenEncrypted,
        verifyToken: verifyToken ?? null,
        status: "pending", // becomes 'active' after test passes
        updatedAt: new Date(),
      },
      create: {
        businessId: business.id,
        provider: "meta_whatsapp",
        phoneNumberId,
        wabaId: wabaId ?? null,
        accessTokenEncrypted,
        verifyToken: verifyToken ?? null,
        status: "pending",
      },
    });

    // NEVER return the token — return only masked version
    return NextResponse.json({
      success: true,
      id: credential.id,
      phoneNumberId: credential.phoneNumberId,
      accessTokenMasked: "••••••" + accessToken.slice(-4),
      status: credential.status,
    });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("WhatsApp integration error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
