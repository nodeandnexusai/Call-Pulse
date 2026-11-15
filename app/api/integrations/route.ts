import { NextResponse } from "next/server";
import { requireBusiness } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { maskSecret, decrypt } from "@/lib/encryption";

export async function GET() {
  try {
    const { business } = await requireBusiness();

    const credentials = await prisma.integrationCredential.findMany({
      where: { businessId: business.id },
      orderBy: { createdAt: "asc" },
    });

    // Return masked credentials — never expose raw tokens
    const masked = credentials.map((cred) => ({
      id: cred.id,
      provider: cred.provider,
      status: cred.status,
      lastVerifiedAt: cred.lastVerifiedAt,
      createdAt: cred.createdAt,
      phoneNumberId: cred.phoneNumberId,
      wabaId: cred.wabaId,
      verifyToken: cred.verifyToken,
      accessTokenMasked: cred.accessTokenEncrypted
        ? maskSecret(tryDecrypt(cred.accessTokenEncrypted))
        : null,
    }));

    return NextResponse.json({ integrations: masked });
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function tryDecrypt(encrypted: string): string {
  try {
    return decrypt(encrypted);
  } catch {
    return "••••••";
  }
}