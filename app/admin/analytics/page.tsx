import Link from "next/link";
import { getAnalyticsSummary } from "@/lib/analytics-service";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Editorial Analytics | Month in History Wall",
  description: "Editorial coverage analytics for Month in History Wall.",
  robots: {
    index: false,
    follow: false,
  },
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function statusLabel(status: string) {
  return status.replaceAll("_", " ");
}

export default async function AnalyticsPage() {
  const summary = await getAnalyticsSummary();

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] px-5 py-5 text-[var(--text-primary)] lg:px-8">
      <section className="border border-[var(--border-primary)] bg-[var(--bg-card)] p-5 sm:p-7">
        <nav className="flex items-center justify-between gap-4 text-sm uppercase tracking-wide">
          <Link href="/">Month in History Wall</Link>
          <div className="flex gap-4">
            <Link href="/admin">Review</Link>
            <Link href="/archive">Archive</Link>
          </div>
        </nav>
        <div className="mt-16 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
              Editorial analytics
            </p>
            <h1 className="mt-3 text-5xl font-semibold leading-none sm:text-7xl">
              Coverage health.
            </h1>
          </div>
          <p className="max-w-xl text-lg leading-8 text-[var(--text-secondary)]">
            Review month completeness, category spread, citation density, and draft
            events before a wall is published or locked.
          </p>
        </div>
      </section>

      {!summary.mongoConfigured && (
        <section className="mt-4 border-x border-b border-[var(--border-primary)] bg-[var(--bg-warning)] p-5 text-sm leading-6 text-[var(--text-secondary)] lg:p-8">
          MongoDB is not configured, so this dashboard is using the static sample
          month. Set MONGODB_URI and MONGODB_DB to inspect imported month data.
        </section>
      )}

      <section className="mt-4 grid gap-4 border-x border-b border-[var(--border-primary)] p-5 sm:grid-cols-2 lg:grid-cols-4 lg:p-8">
        <div className="border border-[var(--border-primary)] bg-[var(--bg-card)] p-4">
          <p className="text-3xl font-semibold">{summary.totals.months}</p>
          <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
            months
          </p>
        </div>
        <div className="border border-[var(--border-primary)] bg-[var(--bg-success)] p-4">
          <p className="text-3xl font-semibold">{summary.totals.publishedEvents}</p>
          <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
            published events
          </p>
        </div>
        <div className="border border-[var(--border-primary)] bg-[var(--bg-highlight)] p-4">
          <p className="text-3xl font-semibold">{summary.totals.sources}</p>
          <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
            source citations
          </p>
        </div>
        <div className="border border-[var(--border-primary)] bg-[var(--bg-warning)] p-4">
          <p className="text-3xl font-semibold">{summary.totals.needsReview}</p>
          <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
            need review
          </p>
        </div>
      </section>

      <section className="mt-4 grid gap-4 border-x border-b border-[var(--border-primary)] p-5 sm:grid-cols-3 lg:p-8">
        <div className="border border-[var(--border-primary)] bg-[var(--bg-card)] p-4">
          <p className="text-2xl font-semibold">{summary.totals.events}</p>
          <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
            total events
          </p>
        </div>
        <div className="border border-[var(--border-primary)] bg-[var(--bg-card)] p-4">
          <p className="text-2xl font-semibold">
            {summary.totals.averageSourcesPerEvent}
          </p>
          <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
            sources per event
          </p>
        </div>
        <div className="border border-[var(--border-primary)] bg-[var(--bg-card)] p-4">
          <p className="text-2xl font-semibold">{summary.totals.media}</p>
          <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
            media-backed events
          </p>
        </div>
      </section>

      <section className="mt-4 border-x border-b border-[var(--border-primary)] p-5 lg:p-8">
        <h2 className="text-xl font-semibold uppercase tracking-wide text-[var(--text-muted)]">
          Category spread
        </h2>
        {summary.categories.length === 0 ? (
          <p className="mt-4 text-[var(--text-secondary)]">
            No imported events are available yet.
          </p>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {summary.categories.map((category) => (
              <div
                className="border border-[var(--border-primary)] bg-[var(--bg-card)] p-3"
                key={category.category}
              >
                <p className="text-2xl font-semibold">{category.count}</p>
                <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
                  {category.category}
                </p>
                <p className="mt-2 text-xs text-[var(--text-secondary)]">
                  {category.publishedCount} published
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-4 border-x border-b border-[var(--border-primary)] p-5 lg:p-8">
        <h2 className="text-xl font-semibold uppercase tracking-wide text-[var(--text-muted)]">
          Month coverage
        </h2>
        {summary.monthCoverage.length === 0 ? (
          <p className="mt-4 text-[var(--text-secondary)]">
            Seed a month to start tracking editorial coverage.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
                <tr>
                  <th className="border-b border-[var(--border-primary)] py-3 pr-4">
                    Month
                  </th>
                  <th className="border-b border-[var(--border-primary)] py-3 pr-4">
                    Status
                  </th>
                  <th className="border-b border-[var(--border-primary)] py-3 pr-4">
                    Events
                  </th>
                  <th className="border-b border-[var(--border-primary)] py-3 pr-4">
                    Sources
                  </th>
                  <th className="border-b border-[var(--border-primary)] py-3 pr-4">
                    Media
                  </th>
                  <th className="border-b border-[var(--border-primary)] py-3">
                    Updated
                  </th>
                </tr>
              </thead>
              <tbody>
                {summary.monthCoverage.map((month) => (
                  <tr key={month.slug}>
                    <td className="border-b border-[var(--border-primary)] py-3 pr-4">
                      <Link className="font-medium underline-offset-4 hover:underline" href={`/archive/${month.slug}`}>
                        {month.title}
                      </Link>
                      {month.needsReviewCount > 0 && (
                        <p className="mt-1 text-xs text-[var(--text-secondary)]">
                          {month.needsReviewCount} need review
                        </p>
                      )}
                    </td>
                    <td className="border-b border-[var(--border-primary)] py-3 pr-4 capitalize">
                      {statusLabel(month.status)}
                    </td>
                    <td className="border-b border-[var(--border-primary)] py-3 pr-4">
                      {month.publishedCount} / {month.eventCount}
                    </td>
                    <td className="border-b border-[var(--border-primary)] py-3 pr-4">
                      {month.sourceCount}
                    </td>
                    <td className="border-b border-[var(--border-primary)] py-3 pr-4">
                      {month.mediaCount}
                    </td>
                    <td className="border-b border-[var(--border-primary)] py-3 text-[var(--text-secondary)]">
                      {formatDate(month.updatedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-4 border-x border-b border-[var(--border-primary)] p-5 lg:p-8">
        <h2 className="text-xl font-semibold uppercase tracking-wide text-[var(--text-muted)]">
          Review queue
        </h2>
        {summary.reviewQueue.length === 0 ? (
          <p className="mt-4 text-[var(--text-secondary)]">
            No draft, review, or correction-needed events are waiting.
          </p>
        ) : (
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {summary.reviewQueue.map((event) => (
              <div
                className="border border-[var(--border-primary)] bg-[var(--bg-card)] p-3 text-sm"
                key={event.id}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="mt-1 text-xs uppercase tracking-wide text-[var(--text-muted)]">
                      {event.monthSlug} / {statusLabel(event.status)}
                    </p>
                  </div>
                  <p className="text-right text-xs uppercase tracking-wide text-[var(--text-muted)]">
                    {event.relevanceScore}
                  </p>
                </div>
                <p className="mt-3 text-xs text-[var(--text-secondary)]">
                  {event.sourceCount} sources / updated {formatDate(event.updatedAt)}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
