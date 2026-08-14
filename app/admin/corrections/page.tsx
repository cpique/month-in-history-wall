import { SignInButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import {
  getCorrectionRequestCounts,
  getRecentCorrectionRequests,
} from "@/lib/correction-repository";
import type { CorrectionRequestStatus } from "@/lib/domain-types";
import { updateCorrectionStatus } from "./actions";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Corrections | Month in History Wall",
  description: "Review public correction requests for Month in History Wall.",
  robots: {
    index: false,
    follow: false,
  },
};

const statusOptions: CorrectionRequestStatus[] = [
  "open",
  "reviewing",
  "accepted",
  "rejected",
  "closed",
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function statusLabel(status: string) {
  return status.replaceAll("_", " ");
}

export default async function AdminCorrectionsPage() {
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
              Correction review
            </p>
            <h1 className="mt-3 text-5xl font-semibold leading-none sm:text-7xl">
              Sign in required.
            </h1>
            <p className="mt-5 text-lg leading-8 text-[var(--text-secondary)]">
              Admin access is protected by Clerk. Sign in to review public
              correction requests.
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
  const [counts, requests] = mongoConfigured
    ? await Promise.all([
        getCorrectionRequestCounts(),
        getRecentCorrectionRequests(50),
      ])
    : [
        {
          open: 0,
          reviewing: 0,
          accepted: 0,
          rejected: 0,
          closed: 0,
        },
        [],
      ];

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] px-5 py-5 text-[var(--text-primary)] lg:px-8">
      <section className="border border-[var(--border-primary)] bg-[var(--bg-card)] p-5 sm:p-7">
        <nav className="flex items-center justify-between gap-4 text-sm uppercase tracking-wide">
          <Link href="/">Month in History Wall</Link>
          <div className="flex gap-4">
            <Link href="/admin">Review</Link>
            <Link href="/admin/analytics">Analytics</Link>
            <Link href="/archive">Archive</Link>
          </div>
          {clerkEnabled ? <UserButton /> : null}
        </nav>
        <div className="mt-16 grid gap-6 lg:grid-cols-[minmax(280px,0.7fr)_minmax(520px,1.3fr)]">
          <div>
            <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
              Correction review
            </p>
            <h1 className="mt-3 text-5xl font-semibold leading-none sm:text-7xl">
              Public trust queue.
            </h1>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">
            Review factual corrections, source suggestions, and reader-reported
            issues before updating published event records.
          </p>
        </div>
      </section>

      {!mongoConfigured ? (
        <div className="border-x border-b border-[var(--border-primary)] bg-[var(--bg-warning)] p-4 text-sm leading-6 text-[var(--text-secondary)]">
          <p className="font-semibold">MongoDB is not configured</p>
          <p className="mt-1">
            Correction requests are stored in MongoDB. Set MONGODB_URI and
            MONGODB_DB=month-history-museum to review submitted requests.
          </p>
        </div>
      ) : null}

      <section className="grid gap-4 border-x border-b border-[var(--border-primary)] p-5 sm:grid-cols-5 lg:p-8">
        {statusOptions.map((status) => (
          <div
            className="border border-[var(--border-primary)] bg-[var(--bg-card)] p-4"
            key={status}
          >
            <p className="text-3xl font-semibold">{counts[status]}</p>
            <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
              {statusLabel(status)}
            </p>
          </div>
        ))}
      </section>

      <section className="border-x border-b border-[var(--border-primary)] p-5 lg:p-8">
        {requests.length === 0 ? (
          <p className="text-[var(--text-secondary)]">
            No correction requests are waiting.
          </p>
        ) : (
          <div className="grid gap-4">
            {requests.map((request) => (
              <article
                className="border border-[var(--border-primary)] bg-[var(--bg-card)] p-5"
                key={request._id}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
                      {request.monthSlug} / {statusLabel(request.status)}
                    </p>
                    <Link
                      className="mt-2 inline-block text-2xl font-semibold underline-offset-4 hover:underline"
                      href={`/events/${request.eventId}`}
                    >
                      {request.eventId}
                    </Link>
                  </div>
                  <p className="text-sm text-[var(--text-muted)]">
                    {formatDate(request.createdAt)}
                  </p>
                </div>

                <p className="mt-5 whitespace-pre-wrap leading-7 text-[var(--text-secondary)]">
                  {request.message}
                </p>

                <div className="mt-5 grid gap-2 text-sm text-[var(--text-muted)]">
                  {request.sourceUrl ? (
                    <a
                      className="underline underline-offset-4"
                      href={request.sourceUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {request.sourceUrl}
                    </a>
                  ) : null}
                  {request.contactEmail ? <p>{request.contactEmail}</p> : null}
                </div>

                <form
                  action={updateCorrectionStatus}
                  className="mt-5 flex flex-wrap gap-3"
                >
                  <input name="id" type="hidden" value={request._id} />
                  {statusOptions.map((status) => (
                    <button
                      className={`border px-3 py-2 text-xs uppercase tracking-wide ${
                        request.status === status
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
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
