import { prisma } from "./prisma";
import { decrypt } from "./encryption";

export type SendResult = {
  success: boolean;
  providerMessageId?: string;
  error?: string;
};

/**
 * Direct WhatsApp Cloud API HTTP request helper (Part B2 requirement).
 */
export async function sendWhatsAppMessage({
  to,
  body,
  phoneNumberId,
  accessToken,
}: {
  to: string;
  body: string;
  phoneNumberId: string;
  accessToken: string;
}) {
  const response = await fetch(
    `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`WhatsApp send failed: ${JSON.stringify(error)}`);
  }

  return response.json();
}

/**
 * Fetches decrypted WhatsApp credentials for a business.
 */
async function getDecryptedCreds(businessId: string) {
  const cred = await prisma.integrationCredential.findUnique({
    where: { businessId_provider: { businessId, provider: "meta_whatsapp" } },
  });
  if (!cred || cred.status !== "active") {
    throw new Error(`No active Meta WhatsApp credentials for business ${businessId}`);
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
    const cred = await getDecryptedCreds(businessId);
    const accessToken = decrypt(cred.accessTokenEncrypted!);
    const phoneNumberId = cred.phoneNumberId!;

    const toFormatted = to.replace(/[^0-9]/g, "");
    const data = await sendWhatsAppMessage({
      to: toFormatted,
      body,
      phoneNumberId,
      accessToken,
    });

    const msgId = data?.messages?.[0]?.id;
    return { success: true, providerMessageId: msgId };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * Unified send dispatcher (WhatsApp only).
 */
export async function sendMessage(
  businessId: string,
  to: string,
  body: string
): Promise<SendResult> {
  return sendWhatsApp(businessId, to, body);
}
