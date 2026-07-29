import { prisma } from "./prisma";
import { decrypt } from "./encryption";
import { MessageChannel } from "@prisma/client";

export type SendResult = {
  success: boolean;
  providerMessageId?: string;
  error?: string;
};

/**
 * Fetches decrypted credentials for a business's provider.
 */
async function getDecryptedCreds(businessId: string, provider: "twilio" | "meta_whatsapp") {
  const cred = await prisma.integrationCredential.findUnique({
    where: { businessId_provider: { businessId, provider } },
  });
  if (!cred || cred.status !== "active") {
    throw new Error(`No active ${provider} credentials for business ${businessId}`);
  }
  return cred;
}

/**
 * Sends a WhatsApp message via Meta Cloud API.
 */
export async function sendWhatsApp(
  businessId: string,
  to: string,
  body: string
): Promise<SendResult> {
  try {
    const cred = await getDecryptedCreds(businessId, "meta_whatsapp");
    const accessToken = decrypt(cred.accessTokenEncrypted!);
    const phoneNumberId = cred.phoneNumberId!;

    const toFormatted = to.replace(/[^0-9]/g, "");

    const res = await fetch(
      `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: toFormatted,
          type: "text",
          text: { body },
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      return { success: false, error: JSON.stringify(err) };
    }

    const data = await res.json();
    const msgId = data?.messages?.[0]?.id;
    return { success: true, providerMessageId: msgId };
  } catch (err: unknown) {
    return { success: false, error: String(err) };
  }
}

/**
 * Sends an SMS via Twilio REST API.
 */
export async function sendSMS(
  businessId: string,
  to: string,
  body: string
): Promise<SendResult> {
  try {
    const cred = await getDecryptedCreds(businessId, "twilio");
    const accountSid = decrypt(cred.accountSidEncrypted!);
    const authToken = decrypt(cred.authTokenEncrypted!);
    const from = cred.phoneNumber!;

    const params = new URLSearchParams({
      To: to,
      From: from,
      Body: body,
    });

    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: "Basic " + Buffer.from(`${accountSid}:${authToken}`).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      return { success: false, error: err?.message ?? "Twilio error" };
    }

    const data = await res.json();
    return { success: true, providerMessageId: data.sid };
  } catch (err: unknown) {
    return { success: false, error: String(err) };
  }
}

/**
 * Unified send dispatcher.
 */
export async function sendMessage(
  businessId: string,
  to: string,
  body: string,
  channel: MessageChannel
): Promise<SendResult> {
  if (channel === MessageChannel.whatsapp) {
    return sendWhatsApp(businessId, to, body);
  }
  return sendSMS(businessId, to, body);
}
