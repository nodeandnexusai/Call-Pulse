import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const publicPaths = [
  "/sign-in",
  "/sign-up",
  "/privacy",
  "/terms",
  "/support",
  "/api/auth",
  "/api/webhooks",
];

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isPublic = publicPaths.some((p) => nextUrl.pathname.startsWith(p) || nextUrl.pathname === "/");

  // Not authenticated on protected route → redirect to sign-in
  if (!isPublic && !session) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Authenticated user on protected route with no business associated → redirect to onboarding
  if (
    session &&
    !session.user.businessId &&
    !nextUrl.pathname.startsWith("/onboarding") &&
    !isPublic
  ) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};