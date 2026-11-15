import { NextResponse } from "next/server";
import { requireBusiness } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { decrypt, maskSecret } from "@/lib/encryption";
import { checkRateLimit, getClientIp } from "@/lib/webhook-guards";

/**
 * POST /api/integrations/reveal
 * Reveals the last 4 characters of the decrypted access token.
 * Rate-limited to 3 requests per hour, logs access in CredentialAccessLog.
 */
export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    if (!checkRateLimit(`reveal-token:${ip}`, { limit: 3, windowMs: 3_600_000 })) {
      return NextResponse.json(
        { error: "Rate limit exceeded. You can reveal your token at most 3 times per hour." },
        { status: 429 }
      );
    }

    const { business, user } = await requireBusiness();

    const credential = await prisma.integrationCredential.findFirst({
      where: { businessId: business.id, provider: "meta_whatsapp" },
    });

    if (!credential || !credential.accessTokenEncrypted) {
      return NextResponse.json(
        { error: "No credentials found" },
        { status: 404 }
      );
    }

    // Decrypt in-memory, mask immediately
    const decrypted = decrypt(credential.accessTokenEncrypted);
    const masked = maskSecret(decrypted, 4);

    // Log the access for audit
    await prisma.credentialAccessLog.create({
      data: {
        businessId: business.id,
        credentialId: credential.id,
        userId: user.id,
        action: "reveal_token",
      },
    });

    return NextResponse.json({ accessTokenMasked: masked });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("Reveal token error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
