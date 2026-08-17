import { auth } from "@clerk/nextjs/server";

/**
 * Enforces admin authentication for Server Actions.
 *
 * When Clerk keys are not configured (e.g. local dev without credentials) this
 * function is a no-op so the application remains usable without a Clerk account.
 * In production, missing keys mean the check is skipped — ensure Clerk is
 * configured before deploying admin features publicly.
 */
export async function requireAdminAuth(): Promise<string | undefined> {
  if (
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
    !process.env.CLERK_SECRET_KEY
  ) {
    return undefined;
  }

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return userId;
}
