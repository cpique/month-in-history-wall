import { SignUp } from "@clerk/nextjs";

export default function AdminSignUpPage() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return (
      <main className="min-h-screen bg-[var(--bg-primary)] px-5 py-5 text-[var(--text-primary)]">
        <section className="border border-[var(--border-primary)] bg-[var(--bg-warning)] p-5">
          <h1 className="text-3xl font-semibold">Clerk is not configured</h1>
          <p className="mt-3 text-[var(--text-secondary)]">
            Set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY to enable
            admin authentication.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)] px-5 py-5 text-[var(--text-primary)]">
      <SignUp
        path="/admin/sign-up"
        routing="path"
        signInUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? "/admin/sign-in"}
      />
    </main>
  );
}
