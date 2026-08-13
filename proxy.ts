import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isAdminAuthRoute = createRouteMatcher([
  "/admin/sign-in(.*)",
  "/admin/sign-up(.*)",
]);

const clerkEnabled = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY,
);

const clerk = clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req) && !isAdminAuthRoute(req)) {
    await auth.protect();
  }
});

export function proxy(req: NextRequest) {
  if (!clerkEnabled) {
    return NextResponse.next();
  }

  return clerk(req, {} as never);
}

export const config = {
  matcher: [
    "/admin((?!.+\\.[\\w]+$|_next).*)",
    "/admin",
    "/admin/(api|trpc)(.*)",
  ],
};
