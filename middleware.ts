import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/activity-logs(.*)",
  "/conversations(.*)",
  "/reports(.*)",
  "/integrations(.*)",
  "/automation(.*)",
  "/settings(.*)",
  "/api/dashboard(.*)",
  "/api/leads(.*)",
  "/api/reports(.*)",
  "/api/integrations(.*)",
  "/api/automation-rules(.*)",
  "/api/templates(.*)",
  "/api/settings(.*)",
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};