import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "placeholder-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "placeholder-client-secret",
    }),
    Resend({
      apiKey: process.env.RESEND_API_KEY || "placeholder-resend-key",
      from: process.env.EMAIL_FROM || "noreply@yourdomain.com",
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      // Attach businessId to session
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { businessId: true, role: true },
      });
      session.user.id = user.id;
      session.user.businessId = dbUser?.businessId ?? null;
      session.user.role = dbUser?.role ?? "admin";
      return session;
    },
    async signIn({ user }) {
      // Auto-create Business on first sign in
      if (!user.email) return false;
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
        select: { businessId: true },
      });
      if (!existingUser?.businessId) {
        const business = await prisma.business.create({
          data: {
            name: user.name ? `${user.name}'s Business` : "My Business",
            timezone: "Asia/Dubai",
          },
        });
        await prisma.user.update({
          where: { email: user.email },
          data: { businessId: business.id },
        });
      }
      return true;
    },
  },
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: { strategy: "database" },
};
