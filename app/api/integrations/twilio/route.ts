import { NextResponse } from "next/server";
import { requireBusiness } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { encrypt } from "@/lib/encryption";
import twilio from "twilio";

async function verifyTwilioConnection(
  accountSid: string,
  authToken: string,
  phoneNumber: string
): Promise<boolean> {
  try {
    const client = twilio(accountSid, authToken);
    await client.api.accounts(accountSid).fetch();
    return true;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  try {
    const { business } = await requireBusiness();
    const body = await req.json();
    const { accountSid, authToken, phoneNumber } = body;

    if (!accountSid || !authToken || !phoneNumber) {
      return NextResponse.json(
        { error: "accountSid, authToken, and phoneNumber are required" },
        { status: 400 }
      );
    }

    // Verify connection before saving
    const isValid = await verifyTwilioConnection(accountSid, authToken, phoneNumber);

    const cred = await prisma.integrationCredential.upsert({
      where: {
        businessId_provider: { businessId: business.id, provider: "twilio" },
      },
      update: {
        accountSidEncrypted: encrypt(accountSid),
        authTokenEncrypted: encrypt(authToken),
        phoneNumber,
        status: isValid ? "active" : "failed",
        lastVerifiedAt: isValid ? new Date() : null,
      },
      create: {
        businessId: business.id,
        provider: "twilio",
        accountSidEncrypted: encrypt(accountSid),
        authTokenEncrypted: encrypt(authToken),
        phoneNumber,
        status: isValid ? "active" : "failed",
        lastVerifiedAt: isValid ? new Date() : null,
      },
    });

    // Also upsert a business line for the Twilio number
    if (isValid) {
      await prisma.businessLine.upsert({
        where: {
          id: (
            await prisma.businessLine.findFirst({
              where: { businessId: business.id, phoneNumber, provider: "twilio" },
              select: { id: true },
            })
          )?.id ?? "new",
        },
        update: { isActive: true },
        create: {
          businessId: business.id,
          label: "Twilio Line",
          phoneNumber,
          provider: "twilio",
          isActive: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      verified: isValid,
      credentialId: cred.id,
      status: cred.status,
    });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("Twilio integration error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
