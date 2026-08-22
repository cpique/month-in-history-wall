import { SignInButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { getAdminSourceReview } from "@/lib/admin-source-service";
import type { EventSourceDocument, EventStatus } from "@/lib/domain-types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sources | Month in History Wall",
  description: "Review source citations across historical events.",
  robots: {
    index: false,
    follow: false,
  },
};

const sourceTypeOrder: EventSourceDocument["sourceType"][] = [
  "encyclopedia",
  "archive",
  "official",
  "news",
  "academic",
  "reference",
  "other",
];

function statusBadgeClass(status: EventStatus) {
  switch (status) {
    case "published":
    case "archived":
      return "bg-[var(--bg-success)]";
    case "needs_review":
    case "needs_correction":
      return "bg-[var(--bg-warning)]";
    case "draft":
      return "bg-[var(--bg-info)]";
    default:
      return "bg-[var(--bg-card)]";
  }
}

function statusLabel(status: string) {
  return status.replaceAll("_", " ");
}

export default async function AdminSourcesPage() {
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
              Admin access is protected by Clerk. Sign in to review source
              citations.
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

  const mongoConfigured = Boolean(process.env.MONGODB_URI);
  const review = await getAdminSourceReview();
  const { summary } = review;

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] px-5 py-5 text-[var(--text-primary)] lg:px-8">
      <section className="border border-[var(--border-primary)] bg-[var(--bg-card)] p-5 sm:p-7">
        <nav className="flex items-center justify-between gap-4 text-sm uppercase tracking-wide">
          <Link href="/">Month in History Wall</Link>
          <div className="flex gap-4">
            <Link href="/admin">Overview</Link>
            <Link href="/admin/months">Months</Link>
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
              Source review.
            </h1>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">
            Every published historical claim needs a source. Review citation
            coverage, identify events without sources, and spot-check source
            quality before locking a month.
          </p>
        </div>
      </section>

      {!mongoConfigured ? (
        <div className="border-x border-b border-[var(--border-primary)] bg-[var(--bg-warning)] p-4 text-sm leading-6 text-[var(--text-secondary)]">
          <p className="font-semibold">MongoDB is not configured</p>
          <p className="mt-1">
            The source review is showing the static June 1984 fallback. Set
            MONGODB_URI and MONGODB_DB=month-history-museum to review imported
            sources.
          </p>
        </div>
      ) : null}

      <section className="grid gap-4 border-x border-b border-[var(--border-primary)] p-5 sm:grid-cols-4 lg:p-8">
        <div className="border border-[var(--border-primary)] bg-[var(--bg-card)] p-4">
          <p className="text-3xl font-semibold">{summary.totalSourceCount}</p>
          <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
            total sources
          </p>
        </div>
        <div className="border border-[var(--border-primary)] bg-[var(--bg-success)] p-4">
          <p className="text-3xl font-semibold">{summary.eventsWithSources}</p>
          <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
            events with sources
          </p>
        </div>
        <div
          className={`border border-[var(--border-primary)] p-4 ${summary.eventsWithoutSources > 0 ? "bg-[var(--bg-warning)]" : "bg-[var(--bg-card)]"}`}
        >
          <p className="text-3xl font-semibold">
            {summary.eventsWithoutSources}
          </p>
          <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
            events without sources
          </p>
        </div>
        <div className="border border-[var(--border-primary)] bg-[var(--bg-highlight)] p-4">
          <p className="text-3xl font-semibold">
            {sourceTypeOrder.filter((type) => summary.byType[type] > 0).length}
          </p>
          <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
            source types used
          </p>
        </div>
      </section>

      <section className="grid gap-4 border-x border-b border-[var(--border-primary)] p-5 sm:grid-cols-2 lg:grid-cols-4 lg:p-8">
        {sourceTypeOrder.map((type) => (
          <div
            className="border border-[var(--border-primary)] bg-[var(--bg-card)] p-4"
            key={type}
          >
            <p className="text-2xl font-semibold">{summary.byType[type] ?? 0}</p>
            <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
              {type}
            </p>
          </div>
        ))}
      </section>

      {review.eventsWithoutSources.length > 0 ? (
        <section className="border-x border-b border-[var(--border-primary)] p-5 lg:p-8">
          <h2 className="mb-5 text-2xl font-semibold">Events without sources</h2>
          <div className="grid gap-4">
            {review.eventsWithoutSources.map((event) => (
              <article
                className="grid gap-4 border border-[var(--border-primary)] bg-[var(--bg-card)] p-5 lg:grid-cols-[1fr_auto]"
                key={event.id}
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3 text-sm uppercase tracking-wide text-[var(--text-muted)]">
                    <span>{event.monthSlug}</span>
                    <span
                      className={`${statusBadgeClass(event.status)} px-2 py-1`}
                    >
                      {statusLabel(event.status)}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold">{event.title}</h3>
                </div>
                <div className="flex flex-wrap items-start gap-3 lg:flex-col">
                  <Link
                    className="border border-[var(--border-primary)] px-3 py-2 text-sm uppercase tracking-wide"
                    href={`/admin/events/${event.id}`}
                  >
                    Review event
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="border-x border-b border-[var(--border-primary)] p-5 lg:p-8">
        <h2 className="mb-5 text-2xl font-semibold">
          All sources ({review.sources.length})
        </h2>
        {review.sources.length === 0 ? (
          <p className="text-[var(--text-secondary)]">
            No sources have been attached to any events yet.
          </p>
        ) : (
          <div className="grid gap-4">
            {review.sources.map((item, index) => (
              <article
                className="grid gap-4 border border-[var(--border-primary)] bg-[var(--bg-card)] p-5 lg:grid-cols-[1fr_auto]"
                key={`${item.eventId}-${item.source.url}-${index}`}
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3 text-sm uppercase tracking-wide text-[var(--text-muted)]">
                    <span>{item.monthSlug}</span>
                    <span>{item.source.sourceType}</span>
                    <span
                      className={`${statusBadgeClass(item.eventStatus)} px-2 py-1`}
                    >
                      {statusLabel(item.eventStatus)}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold">
                    <a
                      className="underline underline-offset-4"
                      href={item.source.url}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {item.source.title}
                    </a>
                  </h3>
                  <p className="text-sm leading-6 text-[var(--text-secondary)]">
                    {item.eventTitle}
                    {item.source.publisher ? ` / ${item.source.publisher}` : null}
                  </p>
                </div>
                <div className="flex flex-wrap items-start gap-3 lg:flex-col">
                  <Link
                    className="border border-[var(--border-primary)] px-3 py-2 text-sm uppercase tracking-wide"
                    href={`/admin/events/${item.eventId}`}
                  >
                    Review event
                  </Link>
                  <Link
                    className="border border-[var(--border-secondary)] px-3 py-2 text-sm uppercase tracking-wide text-[var(--text-muted)]"
                    href={`/events/${item.eventId}`}
                  >
                    View public
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
