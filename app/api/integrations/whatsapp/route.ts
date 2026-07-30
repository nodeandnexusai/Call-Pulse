import { NextResponse } from "next/server";
import { requireBusiness } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { encrypt } from "@/lib/encryption";

async function verifyWhatsAppConnection(
  accessToken: string,
  phoneNumberId: string
): Promise<boolean> {
  try {
    const res = await fetch(
      `https://graph.facebook.com/v19.0/${phoneNumberId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return res.ok;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  try {
    const { business } = await requireBusiness();
    const body = await req.json();
    const { phoneNumberId, wabaId, accessToken } = body;

    if (!phoneNumberId || !accessToken) {
      return NextResponse.json(
        { error: "phoneNumberId and accessToken are required" },
        { status: 400 }
      );
    }

    const isValid = await verifyWhatsAppConnection(accessToken, phoneNumberId);

    const cred = await prisma.integrationCredential.upsert({
      where: {
        businessId_provider: { businessId: business.id, provider: "meta_whatsapp" },
      },
      update: {
        phoneNumberId,
        wabaId: wabaId ?? null,
        accessTokenEncrypted: encrypt(accessToken),
        status: isValid ? "active" : "failed",
        lastVerifiedAt: isValid ? new Date() : null,
      },
      create: {
        businessId: business.id,
        provider: "meta_whatsapp",
        phoneNumberId,
        wabaId: wabaId ?? null,
        accessTokenEncrypted: encrypt(accessToken),
        status: isValid ? "active" : "failed",
        lastVerifiedAt: isValid ? new Date() : null,
      },
    });

    // Also upsert a business line for WhatsApp
    if (isValid) {
      const existingLine = await prisma.businessLine.findFirst({
        where: {
          businessId: business.id,
          phoneNumber: phoneNumberId,
        },
        select: { id: true },
      });

      if (existingLine) {
        await prisma.businessLine.update({
          where: { id: existingLine.id },
          data: { isActive: true },
        });
      } else {
        await prisma.businessLine.create({
          data: {
            businessId: business.id,
            label: "WhatsApp Business Line",
            phoneNumber: phoneNumberId,
            isActive: true,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      verified: isValid,
      credentialId: cred.id,
      status: cred.status,
    });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("WhatsApp integration error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
