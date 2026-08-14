import { SignInButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { getEditorialOverview } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Editorial Admin | Month in History Wall",
  description: "Editorial operations dashboard for historical month imports.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
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
              months, inspect source coverage, and prepare archive locks.
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
              Review imported history.
            </h1>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">
            Month data is imported by JSON batch files and reviewed as an
            editorial set. Use this dashboard to check month coverage, source
            counts, and draft/correction queues before publishing or locking.
          </p>
        </div>
      </section>

      <section className="grid gap-4 border-x border-b border-[var(--border-primary)] p-5 sm:grid-cols-4 lg:p-8">
        <div className="border border-[var(--border-primary)] bg-[var(--bg-card)] p-4">
          <p className="text-3xl font-semibold">{overview.totals.months}</p>
          <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
            months
          </p>
        </div>
        <div className="border border-[var(--border-primary)] bg-[var(--bg-card)] p-4">
          <p className="text-3xl font-semibold">{overview.totals.events}</p>
          <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
            events
          </p>
        </div>
        <div className="border border-[var(--border-primary)] bg-[var(--bg-success)] p-4">
          <p className="text-3xl font-semibold">{overview.totals.sources}</p>
          <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
            sources
          </p>
        </div>
        <div className="border border-[var(--border-primary)] bg-[var(--bg-highlight)] p-4">
          <p className="text-3xl font-semibold">{overview.totals.needsReview}</p>
          <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
            needs review
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

      {!clerkEnabled ? (
        <div className="border-x border-b border-[var(--border-primary)] bg-[var(--bg-info)] p-4 text-sm leading-6 text-[var(--text-secondary)]">
          <p className="font-semibold">Admin authentication is not fully configured</p>
          <p className="mt-1">
            Set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY in
            .env.local before sharing this route outside local development.
          </p>
        </div>
      ) : null}

      <section className="grid gap-4 border-x border-b border-[var(--border-primary)] p-5 lg:p-8">
        <div className="border border-[var(--border-primary)] bg-[var(--bg-card)] p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
                Import workflow
              </p>
              <h2 className="mt-2 text-3xl font-semibold">
                Batch files are the editorial input.
              </h2>
            </div>
            <code className="border border-[var(--border-secondary)] px-3 py-2 text-sm">
              npm run seed:month -- data/imports/month.json --dry-run
            </code>
          </div>
          <p className="mt-4 max-w-3xl leading-7 text-[var(--text-secondary)]">
            Prepare a JSON file with month, year, event summaries, relevance
            scores, media, detail markdown, and source citations. Dry-run first,
            then seed into MongoDB when the month is ready for editorial review.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {overview.months.map((month) => (
            <article
              className="border border-[var(--border-primary)] bg-[var(--bg-card)] p-5"
              key={month.slug}
            >
              <div className="flex items-start justify-between gap-4 text-sm uppercase tracking-wide text-[var(--text-muted)]">
                <span>{month.slug}</span>
                <span>{month.status}</span>
              </div>
              <div className="mt-8 space-y-3">
                <h2 className="text-3xl font-semibold">{month.title}</h2>
                <p className="leading-7 text-[var(--text-secondary)]">
                  {month.description}
                </p>
              </div>
              <div className="mt-8 grid grid-cols-3 border border-[var(--border-primary)]">
                <div className="border-r border-[var(--border-primary)] p-3">
                  <p className="text-2xl font-semibold">{month.eventCount}</p>
                  <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
                    events
                  </p>
                </div>
                <div className="border-r border-[var(--border-primary)] p-3">
                  <p className="text-2xl font-semibold">{month.sourceCount}</p>
                  <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
                    sources
                  </p>
                </div>
                <div className="p-3">
                  <p className="text-2xl font-semibold">{month.needsReviewCount}</p>
                  <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
                    review
                  </p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-3 text-sm uppercase tracking-wide">
                <Link
                  className="border border-[var(--border-primary)] px-3 py-2"
                  href={`/archive/${month.slug}`}
                >
                  Open archive wall
                </Link>
                <Link
                  className="border border-[var(--border-secondary)] px-3 py-2 text-[var(--text-muted)]"
                  href="/"
                >
                  Current wall
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
