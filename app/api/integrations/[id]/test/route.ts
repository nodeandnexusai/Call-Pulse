import { NextResponse } from "next/server";
import { requireBusiness } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/encryption";
import twilio from "twilio";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { business } = await requireBusiness();
    const { id } = await params;

    const cred = await prisma.integrationCredential.findFirst({
      where: { id, businessId: business.id },
    });

    if (!cred) {
      return NextResponse.json({ error: "Credential not found" }, { status: 404 });
    }

    let isValid = false;

    if (cred.provider === "twilio") {
      try {
        const accountSid = decrypt(cred.accountSidEncrypted!);
        const authToken = decrypt(cred.authTokenEncrypted!);
        const client = twilio(accountSid, authToken);
        await client.api.accounts(accountSid).fetch();
        isValid = true;
      } catch {
        isValid = false;
      }
    } else if (cred.provider === "meta_whatsapp") {
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
      where: { id: cred.id },
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
