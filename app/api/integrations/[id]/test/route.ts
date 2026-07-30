import { NextResponse } from "next/server";
import { requireBusiness } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/encryption";
import { checkRateLimit, getClientIp } from "@/lib/webhook-guards";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = getClientIp(req);
    if (!checkRateLimit(`integration-test:${ip}`, { limit: 10, windowMs: 60_000 })) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const { business } = await requireBusiness();
    const { id } = await params;

    const cred = await prisma.integrationCredential.findFirst({
      where: { id, businessId: business.id },
    });

    if (!cred) {
      return NextResponse.json({ error: "Credential not found" }, { status: 404 });
    }

    let isValid = false;

    if (cred.provider === "meta_whatsapp") {
      try {
        const accessToken = decrypt(cred.accessTokenEncrypted!);
        const res = await fetch(
          `https://graph.facebook.com/v19.0/${cred.phoneNumberId}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        isValid = res.ok;
      } catch {
        isValid = false;
      }
    }

    const updated = await prisma.integrationCredential.update({
      where: { id: cred.id, businessId: business.id },
      data: {
        status: isValid ? "active" : "failed",
        lastVerifiedAt: isValid ? new Date() : cred.lastVerifiedAt,
      },
    });

    return NextResponse.json({
      success: true,
      verified: isValid,
      status: updated.status,
      lastVerifiedAt: updated.lastVerifiedAt,
    });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("Integration test error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
