import { SignInButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EventDetailMarkdown } from "@/components/events/event-detail-markdown";
import { getAdminEventDetail } from "@/lib/admin-event-service";
import type { EventStatus } from "@/lib/domain-types";
import { updateEventStatus } from "../actions";

export const dynamic = "force-dynamic";

type AdminEventDetailPageProps = {
  params: Promise<{ eventId: string }>;
};

const eventStatusOptions: EventStatus[] = [
  "draft",
  "needs_review",
  "published",
  "needs_correction",
  "archived",
];

export async function generateMetadata({
  params,
}: AdminEventDetailPageProps) {
  const { eventId } = await params;
  const detail = await getAdminEventDetail(eventId);

  return {
    title: detail
      ? `${detail.title} | Editorial review | Month in History Wall`
      : "Event not found | Month in History Wall",
    robots: {
      index: false,
      follow: false,
    },
  };
}

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

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function AdminEventDetailPage({
  params,
}: AdminEventDetailPageProps) {
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
              Admin access is protected by Clerk. Sign in to review this event.
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

  const { eventId } = await params;
  const event = await getAdminEventDetail(eventId);

  if (!event) {
    notFound();
  }

  const dateDisplay = event.dateRange
    ? `${event.dateRange.start} - ${event.dateRange.end}`
    : event.date ?? "Date unknown";

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] px-5 py-5 text-[var(--text-primary)] lg:px-8">
      <section className="border border-[var(--border-primary)] bg-[var(--bg-card)] p-5 sm:p-7">
        <nav className="flex items-center justify-between gap-4 text-sm uppercase tracking-wide">
          <Link href="/">Month in History Wall</Link>
          <div className="flex gap-4">
            <Link href="/admin">Overview</Link>
            <Link href="/admin/months">Months</Link>
            <Link href="/admin/corrections">Corrections</Link>
            <Link href="/admin/analytics">Analytics</Link>
            <Link href="/archive">Archive</Link>
          </div>
          {clerkEnabled ? <UserButton /> : null}
        </nav>

        <div className="mt-16 grid gap-6 lg:grid-cols-[minmax(280px,0.7fr)_minmax(520px,1.3fr)]">
          <div>
            <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
              {event.monthLabel} / {event.category}
            </p>
            <h1 className="mt-3 text-5xl font-semibold leading-none sm:text-7xl">
              {event.title}
            </h1>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">
            {event.summary}
          </p>
        </div>
      </section>

      <section className="grid gap-4 border-x border-b border-[var(--border-primary)] p-5 sm:grid-cols-4 lg:p-8">
        <div className="border border-[var(--border-primary)] bg-[var(--bg-card)] p-4">
          <p className="text-3xl font-semibold">{statusLabel(event.status)}</p>
          <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
            status
          </p>
        </div>
        <div className="border border-[var(--border-primary)] bg-[var(--bg-card)] p-4">
          <p className="text-3xl font-semibold">{event.importanceLevel}</p>
          <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
            importance
          </p>
        </div>
        <div className="border border-[var(--border-primary)] bg-[var(--bg-card)] p-4">
          <p className="text-3xl font-semibold">{event.tileSize}</p>
          <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
            tile size
          </p>
        </div>
        <div className="border border-[var(--border-primary)] bg-[var(--bg-card)] p-4">
          <p className="text-3xl font-semibold">{event.sources.length}</p>
          <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
            sources
          </p>
        </div>
      </section>

      <section className="grid gap-4 border-x border-b border-[var(--border-primary)] p-5 lg:grid-cols-[minmax(280px,0.7fr)_minmax(520px,1.3fr)] lg:p-8">
        <div className="space-y-5">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              Editorial status
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`${statusBadgeClass(event.status)} px-2 py-1 text-sm uppercase tracking-wide`}
              >
                {statusLabel(event.status)}
              </span>
            </div>
            <form
              action={updateEventStatus}
              className="mt-4 flex flex-wrap gap-3"
            >
              <input name="eventId" type="hidden" value={event.id} />
              {eventStatusOptions.map((status) => (
                <button
                  className={`border px-3 py-2 text-xs uppercase tracking-wide ${
                    event.status === status
                      ? "border-[var(--text-primary)] bg-[var(--text-primary)] text-[var(--bg-primary)]"
                      : "border-[var(--border-secondary)]"
                  }`}
                  key={status}
                  name="status"
                  type="submit"
                  value={status}
                >
                  {statusLabel(status)}
                </button>
              ))}
            </form>
          </div>

          <div className="space-y-3">
            <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              Metadata
            </p>
            <dl className="grid gap-2 text-sm text-[var(--text-secondary)]">
              <div className="flex justify-between border-b border-[var(--border-tertiary)] py-2">
                <dt>Date</dt>
                <dd className="text-[var(--text-primary)]">{dateDisplay}</dd>
              </div>
              {event.location ? (
                <div className="flex justify-between border-b border-[var(--border-tertiary)] py-2">
                  <dt>Location</dt>
                  <dd className="text-[var(--text-primary)]">{event.location}</dd>
                </div>
              ) : null}
              {event.countries.length > 0 ? (
                <div className="flex justify-between border-b border-[var(--border-tertiary)] py-2">
                  <dt>Countries</dt>
                  <dd className="text-[var(--text-primary)]">
                    {event.countries.join(", ")}
                  </dd>
                </div>
              ) : null}
              <div className="flex justify-between border-b border-[var(--border-tertiary)] py-2">
                <dt>Layout order</dt>
                <dd className="text-[var(--text-primary)]">{event.layoutOrder}</dd>
              </div>
            </dl>
          </div>

          <div className="space-y-3">
            <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              Actions
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                className="border border-[var(--border-primary)] px-3 py-2 text-sm uppercase tracking-wide"
                href={`/events/${event.id}`}
              >
                View public
              </Link>
              <Link
                className="border border-[var(--border-secondary)] px-3 py-2 text-sm uppercase tracking-wide text-[var(--text-muted)]"
                href={`/admin/months/${event.monthSlug}`}
              >
                Back to month
              </Link>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              What happened
            </p>
            <p className="text-lg leading-8 text-[var(--text-secondary)]">
              {event.summary}
            </p>
          </div>

          {event.context ? (
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
                Context
              </p>
              <p className="text-base leading-7 text-[var(--text-secondary)]">
                {event.context}
              </p>
            </div>
          ) : null}

          {event.whyItMatters ? (
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
                Why it matters
              </p>
              <p className="text-base leading-7 text-[var(--text-secondary)]">
                {event.whyItMatters}
              </p>
            </div>
          ) : null}

          {event.detailMarkdown ? (
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
                Detail
              </p>
              <EventDetailMarkdown>{event.detailMarkdown}</EventDetailMarkdown>
            </div>
          ) : null}

          <div className="space-y-3">
            <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              Sources
            </p>
            {event.sources.length > 0 ? (
              <ol className="grid gap-3">
                {event.sources.map((source, index) => (
                  <li
                    className="border border-[var(--border-secondary)] p-3"
                    key={`${source.url}-${index}`}
                  >
                    <a
                      className="font-semibold underline underline-offset-4"
                      href={source.url}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {source.title}
                    </a>
                    <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                      {source.publisher ?? "Source"} / {source.sourceType}
                      {source.publishedAt ? ` / ${source.publishedAt}` : null}
                    </p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm leading-6 text-[var(--text-muted)]">
                No sources have been attached to this event.
              </p>
            )}
          </div>

          <div className="space-y-3 border-t border-[var(--border-tertiary)] pt-5">
            <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              Correction requests
            </p>
            {event.correctionRequests.length > 0 ? (
              <div className="grid gap-4">
                {event.correctionRequests.map((request) => (
                  <article
                    className="border border-[var(--border-secondary)] p-4"
                    key={request._id}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-[var(--text-muted)]">
                      <span
                        className={`${statusBadgeClass(request.status as EventStatus)} px-2 py-1 text-xs uppercase tracking-wide`}
                      >
                        {statusLabel(request.status)}
                      </span>
                      <span>{formatDate(request.createdAt)}</span>
                    </div>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[var(--text-secondary)]">
                      {request.message}
                    </p>
                    {request.sourceUrl ? (
                      <a
                        className="mt-3 inline-block text-sm underline underline-offset-4"
                        href={request.sourceUrl}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {request.sourceUrl}
                      </a>
                    ) : null}
                    {request.contactEmail ? (
                      <p className="mt-2 text-sm text-[var(--text-muted)]">
                        {request.contactEmail}
                      </p>
                    ) : null}
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-sm leading-6 text-[var(--text-muted)]">
                No correction requests have been submitted for this event.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
