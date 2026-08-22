import { SignInButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { getEditorialOverview } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Months | Month in History Wall",
  description: "Editorial overview of imported historical months.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminMonthsPage() {
  const clerkEnabled = Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
      process.env.CLERK_SECRET_KEY,
  );
  const { userId } = clerkEnabled ? await auth() : { userId: null };

  if (clerkEnabled && !userId) {
    return (
      <main className="min-h-screen bg-[var(--bg-primary)] px-5 py-5 text-[var(--text-primary)] lg:px-8">
        <section className="border border-[var(--border-primary)] bg-[var(--bg-card)] p-5 sm:p-7">
          <nav className="flex items-center justify-between gap-4 text-sm uppercase tracking-wide">
            <Link href="/">Month in History Wall</Link>
            <Link href="/archive">Archive</Link>
          </nav>
          <div className="mt-16 max-w-xl">
            <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
              Editorial admin
            </p>
            <h1 className="mt-3 text-5xl font-semibold leading-none sm:text-7xl">
              Sign in required.
            </h1>
            <p className="mt-5 text-lg leading-8 text-[var(--text-secondary)]">
              Admin access is protected by Clerk. Sign in to review imported
              historical months.
            </p>
            <div className="mt-8">
              <SignInButton>
                <button
                  className="border border-[var(--border-primary)] bg-[var(--text-primary)] px-4 py-3 text-sm uppercase tracking-wide text-[var(--bg-primary)]"
                  type="button"
                >
                  Sign in
                </button>
              </SignInButton>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const overview = await getEditorialOverview();

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] px-5 py-5 text-[var(--text-primary)] lg:px-8">
      <section className="border border-[var(--border-primary)] bg-[var(--bg-card)] p-5 sm:p-7">
        <nav className="flex items-center justify-between gap-4 text-sm uppercase tracking-wide">
          <Link href="/">Month in History Wall</Link>
          <div className="flex gap-4">
            <Link href="/admin">Overview</Link>
            <Link href="/admin/sources">Sources</Link>
            <Link href="/admin/corrections">Corrections</Link>
            <Link href="/admin/analytics">Analytics</Link>
            <Link href="/archive">Archive</Link>
          </div>
          {clerkEnabled ? <UserButton /> : null}
        </nav>
        <div className="mt-16 grid gap-6 lg:grid-cols-[minmax(280px,0.7fr)_minmax(520px,1.3fr)]">
          <div>
            <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
              Editorial admin
            </p>
            <h1 className="mt-3 text-5xl font-semibold leading-none sm:text-7xl">
              Imported months.
            </h1>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">
            Review every imported month wall, its editorial status, and the
            number of events, sources, and items still needing review before
            publication or locking.
          </p>
        </div>
      </section>

      {!overview.mongoConfigured ? (
        <div className="border-x border-b border-[var(--border-primary)] bg-[var(--bg-warning)] p-4 text-sm leading-6 text-[var(--text-secondary)]">
          <p className="font-semibold">MongoDB is not configured</p>
          <p className="mt-1">
            The dashboard is showing the static June 1984 fallback. Set
            MONGODB_URI and MONGODB_DB=month-history-museum, then seed a month
            with npm run seed:month.
          </p>
        </div>
      ) : null}

      <section className="grid gap-4 border-x border-b border-[var(--border-primary)] p-5 lg:p-8">
        {overview.months.map((month) => (
          <article
            className="grid gap-4 border border-[var(--border-primary)] bg-[var(--bg-card)] p-5 lg:grid-cols-[1fr_auto]"
            key={month.slug}
          >
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3 text-sm uppercase tracking-wide text-[var(--text-muted)]">
                <span>{month.slug}</span>
                <span>{month.status}</span>
              </div>
              <h2 className="text-2xl font-semibold">{month.title}</h2>
              <p className="leading-7 text-[var(--text-secondary)]">
                {month.description}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[var(--text-muted)]">
                <span>{month.eventCount} events</span>
                <span>{month.sourceCount} sources</span>
                <span>{month.needsReviewCount} needs review</span>
              </div>
            </div>
            <div className="flex flex-wrap items-start gap-3 lg:flex-col">
              <Link
                className="border border-[var(--border-primary)] px-3 py-2 text-sm uppercase tracking-wide"
                href={`/admin/months/${month.slug}`}
              >
                Review month
              </Link>
              <Link
                className="border border-[var(--border-secondary)] px-3 py-2 text-sm uppercase tracking-wide text-[var(--text-muted)]"
                href={`/archive/${month.slug}`}
              >
                Archive wall
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
