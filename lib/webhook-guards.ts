import { createHmac, timingSafeEqual } from "crypto";

type RateLimitConfig = {
  limit: number;
  windowMs: number;
};

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? "unknown";
  }

  return realIp ?? "unknown";
}

export function checkRateLimit(key: string, config: RateLimitConfig): boolean {
  const now = Date.now();

  for (const [bucketKey, bucket] of buckets.entries()) {
    if (bucket.resetAt <= now) {
      buckets.delete(bucketKey);
    }
  }

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + config.windowMs });
    return true;
  }

  if (existing.count >= config.limit) {
    return false;
  }

  existing.count += 1;
  buckets.set(key, existing);
  return true;
}

/** Reconstruct the public webhook URL if needed. */
export function getWebhookUrl(req: Request): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (appUrl) {
    const path = new URL(req.url).pathname;
    return `${appUrl.replace(/\/$/, "")}${path}`;
  }
  return req.url;
}

function getMetaAppSecret(): string | undefined {
  return (
    process.env.WHATSAPP_APP_SECRET ??
    process.env.META_APP_SECRET ??
    process.env.FACEBOOK_APP_SECRET
  );
}

/**
 * Validates Meta WhatsApp inbound webhook signature (X-Hub-Signature-256 header).
 */
export function validateMetaWebhook(req: Request, bodyText: string): boolean {
  const secret = getMetaAppSecret();
  const signature = req.headers.get("x-hub-signature-256") ?? "";

  if (!secret || !signature.startsWith("sha256=")) {
    return false;
  }

  const expected = Buffer.from(
    `sha256=${createHmac("sha256", secret).update(bodyText).digest("hex")}`
  );
  const actual = Buffer.from(signature);

  if (expected.length !== actual.length) {
    return false;
  }

  return timingSafeEqual(actual, expected);
}
