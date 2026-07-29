import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";
import { Business, User } from "@prisma/client";

export type BusinessWithUser = {
  business: Business;
  user: User;
};

/**
 * Looks up or creates a Business + User row for the authenticated Clerk user.
 * Called on every authenticated API route to ensure tenant isolation.
 */
export async function getBusinessForUser(): Promise<BusinessWithUser | null> {
  const { userId } = await auth();
  if (!userId) return null;

  // Try to find existing user + business
  let user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    include: { business: true },
  });

  if (user) {
    return { business: user.business, user };
  }

  // First-time login: create business + user atomically
  const business = await prisma.business.upsert({
    where: { clerkUserId: userId },
    update: {},
    create: {
      clerkUserId: userId,
      name: "My Business",
      timezone: "Asia/Dubai",
    },
  });

  user = await prisma.user.upsert({
    where: { clerkUserId: userId },
    update: {},
    create: {
      clerkUserId: userId,
      businessId: business.id,
      role: "superuser",
    },
    include: { business: true },
  });

  return { business: user.business, user };
}

/**
 * Auth guard for API routes. Returns the business+user or throws a 401 response.
 * Usage:
 *   const { business, user } = await requireBusiness();
 */
export async function requireBusiness(): Promise<BusinessWithUser> {
  const result = await getBusinessForUser();
  if (!result) {
    throw new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  return result;
}

/**
 * Validates a Cron job request using a shared secret.
 */
export function requireCronSecret(req: Request): boolean {
  const authHeader = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return authHeader === `Bearer ${secret}`;
}
