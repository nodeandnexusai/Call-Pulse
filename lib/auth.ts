import NextAuth from "next-auth";
import { authConfig } from "./auth-config";
import { prisma } from "./prisma";
import { Business, User } from "@prisma/client";

export const { auth, signIn, signOut } = NextAuth(authConfig);

export type BusinessWithUser = {
  business: Business;
  user: User;
};

/**
 * Looks up the Business + User row for the authenticated NextAuth user.
 */
export async function getBusinessForUser(): Promise<BusinessWithUser | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { business: true },
  });

  if (!user || !user.business) {
    return null;
  }

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
