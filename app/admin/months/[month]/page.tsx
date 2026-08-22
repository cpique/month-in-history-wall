import { SignInButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { lockMonth } from "@/app/admin/actions";
import { getMonthLockBlocker } from "@/lib/month-lock";
import { getAdminMonthDetail } from "@/lib/admin-month-service";
import type { AdminMonthEvent } from "@/lib/admin-month-service";

export const dynamic = "force-dynamic";

type AdminMonthDetailPageProps = {
  params: Promise<{ month: string }>;
};

export async function generateMetadata({
  params,
}: AdminMonthDetailPageProps) {
  const { month } = await params;
  const detail = await getAdminMonthDetail(month);

  return {
    title: detail
      ? `${detail.monthLabel} | Month in History Wall`
      : "Month not found | Month in History Wall",
    robots: {
      index: false,
      follow: false,
    },
  };
}

function statusBadgeClass(status: AdminMonthEvent["status"]) {
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

function statusLabel(status: AdminMonthEvent["status"]) {
  return status.replaceAll("_", " ");
}

export default async function AdminMonthDetailPage({
  params,
}: AdminMonthDetailPageProps) {
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
              Admin access is protected by Clerk. Sign in to review this month
              and its events.
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

  const { month } = await params;
  const detail = await getAdminMonthDetail(month);

  if (!detail) {
    notFound();
  }
  const lockBlocker = getMonthLockBlocker({
    status: detail.status,
    eventCount: detail.eventCount,
    publishedCount: detail.publishedCount,
    needsReviewCount: detail.needsReviewCount,
  });

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] px-5 py-5 text-[var(--text-primary)] lg:px-8">
      <section className="border border-[var(--border-primary)] bg-[var(--bg-card)] p-5 sm:p-7">
        <nav className="flex items-center justify-between gap-4 text-sm uppercase tracking-wide">
          <Link href="/">Month in History Wall</Link>
          <div className="flex gap-4">
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
              {detail.status}
            </p>
            <h1 className="mt-3 text-5xl font-semibold leading-none sm:text-7xl">
              {detail.monthLabel}
            </h1>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">
            {detail.description}
          </p>
        </div>
      </section>

      <section className="grid gap-4 border-x border-b border-[var(--border-primary)] p-5 sm:grid-cols-4 lg:p-8">
        <div className="border border-[var(--border-primary)] bg-[var(--bg-card)] p-4">
          <p className="text-3xl font-semibold">{detail.eventCount}</p>
          <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
            events
          </p>
        </div>
        <div className="border border-[var(--border-primary)] bg-[var(--bg-card)] p-4">
          <p className="text-3xl font-semibold">{detail.publishedCount}</p>
          <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
            published
          </p>
        </div>
        <div className="border border-[var(--border-primary)] bg-[var(--bg-success)] p-4">
          <p className="text-3xl font-semibold">{detail.sourceCount}</p>
          <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
            sources
          </p>
        </div>
        <div className="border border-[var(--border-primary)] bg-[var(--bg-highlight)] p-4">
          <p className="text-3xl font-semibold">{detail.needsReviewCount}</p>
          <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
            needs review
          </p>
        </div>
      </section>

      <section className="border-x border-b border-[var(--border-primary)] p-5 lg:p-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold">Events</h2>
          <Link
            className="border border-[var(--border-primary)] px-3 py-2 text-sm uppercase tracking-wide"
            href={`/archive/${detail.slug}`}
          >
            Open archive wall
          </Link>
          {detail.status === "published" ? (
            <form action={lockMonth}>
              <input name="monthSlug" type="hidden" value={detail.slug} />
              <button
                className="border border-[var(--border-primary)] bg-[var(--text-primary)] px-3 py-2 text-sm uppercase tracking-wide text-[var(--bg-primary)] disabled:cursor-not-allowed disabled:opacity-40"
                disabled={Boolean(lockBlocker)}
                title={lockBlocker ?? "Lock this reviewed month into the permanent archive"}
                type="submit"
              >
                Lock month
              </button>
            </form>
          ) : null}
        </div>
        {lockBlocker ? <p className="mb-5 text-sm text-[var(--text-muted)]">{lockBlocker}</p> : null}

        {detail.events.length === 0 ? (
          <p className="text-[var(--text-secondary)]">
            No events have been imported for this month.
          </p>
        ) : (
          <div className="grid gap-4">
            {detail.events.map((event) => (
              <article
                className="grid gap-4 border border-[var(--border-primary)] bg-[var(--bg-card)] p-5 lg:grid-cols-[1fr_auto]"
                key={event.id}
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3 text-sm uppercase tracking-wide text-[var(--text-muted)]">
                    <span className={`${statusBadgeClass(event.status)} px-2 py-1`}>
                      {statusLabel(event.status)}
                    </span>
                    <span>{event.category}</span>
                    <span>{event.importanceLevel}</span>
                    {event.date ? <span>{event.date}</span> : null}
                  </div>
                  <h3 className="text-xl font-semibold">{event.title}</h3>
                  <p className="leading-7 text-[var(--text-secondary)]">
                    {event.summary}
                  </p>
                </div>
                <div className="flex flex-wrap items-start gap-3 lg:flex-col">
                  <Link
                    className="border border-[var(--border-primary)] px-3 py-2 text-sm uppercase tracking-wide"
                    href={`/admin/events/${event.id}`}
                  >
                    Review event
                  </Link>
                  <Link
                    className="border border-[var(--border-secondary)] px-3 py-2 text-sm uppercase tracking-wide text-[var(--text-muted)]"
                    href={`/events/${event.id}`}
                  >
                    View public
                  </Link>
                  <span className="px-3 py-2 text-sm text-[var(--text-muted)]">
                    {event.sourceCount} source{event.sourceCount === 1 ? "" : "s"}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
