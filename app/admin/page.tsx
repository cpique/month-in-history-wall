import { auth } from "@clerk/nextjs/server";
import { SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import {
  approveSubmission,
  lockCurrentExhibition,
  rejectSubmission,
  requestChanges,
} from "./actions";
import { getReviewSubmissions } from "@/lib/admin-data";
import { getMediaUrl } from "@/lib/media-storage";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Review | One Month Museum",
  description: "Manual review dashboard for One Month Museum submissions.",
  robots: {
    index: false,
    follow: false,
  },
};

const statusLabel: Record<string, string> = {
  draft: "Draft",
  submitted: "Submitted",
  in_review: "In review",
  changes_requested: "Changes requested",
  approved: "Approved",
  rejected: "Rejected",
  removed: "Removed",
};

export default async function AdminPage() {
  const submissions = await getReviewSubmissions();
  const reviewCount = submissions.filter(
    (submission) =>
      submission.reviewStatus === "submitted" ||
      submission.reviewStatus === "in_review" ||
      submission.reviewStatus === "changes_requested",
  ).length;
  const approvedCount = submissions.filter(
    (submission) => submission.reviewStatus === "approved",
  ).length;
  const actionsEnabled = Boolean(process.env.MONGODB_URI);
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
            <Link href="/">One Month Museum</Link>
            <Link href="/">Current wall</Link>
          </nav>
          <div className="mt-16 max-w-xl">
            <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
              Admin review
            </p>
            <h1 className="mt-3 text-5xl font-semibold leading-none sm:text-7xl">
              Sign in required.
            </h1>
            <p className="mt-5 text-lg leading-8 text-[var(--text-secondary)]">
              Admin access is protected by Clerk. Sign in to review submissions,
              approve work, and lock archive months.
            </p>
            <div className="mt-8">
              <SignInButton>
                <button className="border border-[var(--border-primary)] bg-[var(--text-primary)] px-4 py-3 text-sm uppercase tracking-wide text-[var(--bg-primary)]" type="button">
                  Sign in
                </button>
              </SignInButton>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] px-5 py-5 text-[var(--text-primary)] lg:px-8">
      <section className="border border-[var(--border-primary)] bg-[var(--bg-card)] p-5 sm:p-7">
        <nav className="flex items-center justify-between gap-4 text-sm uppercase tracking-wide">
          <Link href="/">One Month Museum</Link>
          <div className="flex gap-4">
            <Link href="/admin/analytics">Analytics</Link>
            <Link href="/">Current wall</Link>
          </div>
          {clerkEnabled ? <UserButton /> : null}
        </nav>
        <div className="mt-16 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
              Admin review
            </p>
            <h1 className="mt-3 text-5xl font-semibold leading-none sm:text-7xl">
              Review the wall.
            </h1>
          </div>
          <p className="max-w-xl text-lg leading-8 text-[var(--text-secondary)]">
            Approval management lives at /admin. This noindex dashboard lists
            submissions and lets an admin approve, reject, request changes, or
            lock the current month.{" "}
            {clerkEnabled
              ? "Authentication is enabled through Clerk."
              : "Add both Clerk keys before sharing this route outside local development."}
          </p>
          <form action={lockCurrentExhibition}>
            <button
              className="border border-[var(--border-primary)] bg-[var(--text-primary)] px-4 py-3 text-sm uppercase tracking-wide text-[var(--bg-primary)] disabled:opacity-50"
              disabled={!actionsEnabled}
              type="submit"
            >
              Lock current month
            </button>
          </form>
        </div>
      </section>

      <section className="grid gap-4 border-x border-b border-[var(--border-primary)] p-5 sm:grid-cols-3 lg:p-8">
        <div className="border border-[var(--border-primary)] bg-[var(--bg-card)] p-4">
          <p className="text-3xl font-semibold">{submissions.length}</p>
          <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
            submissions
          </p>
        </div>
        <div className="border border-[var(--border-primary)] bg-[var(--bg-highlight)] p-4">
          <p className="text-3xl font-semibold">{reviewCount}</p>
          <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
            needs review
          </p>
        </div>
        <div className="border border-[var(--border-primary)] bg-[var(--bg-success)] p-4">
          <p className="text-3xl font-semibold">{approvedCount}</p>
          <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
            approved
          </p>
        </div>
      </section>

      {!actionsEnabled ? (
        <div className="border-x border-b border-[var(--border-primary)] bg-[var(--bg-warning)] p-4 text-sm leading-6 text-[var(--text-secondary)]">
          <p className="font-semibold">Review actions are disabled</p>
          <p className="mt-1">
            Set MONGODB_URI in .env.local to enable real submissions and review
            actions. Until then, the dashboard shows static fallback data.
          </p>
        </div>
      ) : null}

      {!clerkEnabled ? (
        <div className="border-x border-b border-[var(--border-primary)] bg-[var(--bg-info)] p-4 text-sm leading-6 text-[var(--text-secondary)]">
          <p className="font-semibold">Admin authentication is not fully configured</p>
          <p className="mt-1">
            Set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY in
            .env.local, then restart the dev server. Clerk sign-in is hosted at
            /admin/sign-in and sign-up is hosted at /admin/sign-up.
          </p>
        </div>
      ) : null}

      <section className="grid gap-4 border-x border-b border-[var(--border-primary)] p-5 lg:grid-cols-2 lg:p-8">
        {submissions.map((submission) => {
          const submissionActionsEnabled = actionsEnabled && !submission.isSample;

          return (
          <article
            className="border border-[var(--border-primary)] bg-[var(--bg-card)] p-5"
            key={submission.id}
          >
            <div className="flex items-start justify-between gap-4 text-sm uppercase tracking-wide text-[var(--text-muted)]">
              <span>{submission.size ? `Space ${submission.size}` : "Sample"}</span>
              <span>{statusLabel[submission.reviewStatus] ?? submission.reviewStatus}</span>
            </div>
            <div className="mt-10 space-y-2">
              <h2 className="text-3xl font-semibold">{submission.workTitle}</h2>
              <p className="text-lg text-[var(--text-secondary)]">{submission.creatorName}</p>
              <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
                {submission.medium}
                {submission.months && submission.months.length > 0
                  ? ` / ${submission.months.join(", ")}`
                  : null}
              </p>
              {submission.email ? (
                <p className="text-sm text-[var(--text-secondary)]">{submission.email}</p>
              ) : null}
              <p className="pt-3 text-[var(--text-secondary)]">{submission.description}</p>
              {submission.assetKey && submission.medium !== "text" ? (
                <div className="mt-4 border border-[var(--border-primary)] bg-[var(--bg-primary)] p-3">
                  <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
                    Preview
                  </p>
                  {submission.medium === "video_preview" ? (
                    <video
                      className="mt-2 max-h-64 w-full object-contain"
                      controls
                      muted
                      src={getMediaUrl(submission.assetKey)}
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      alt={submission.workTitle}
                      className="mt-2 max-h-64 w-full object-contain"
                      src={getMediaUrl(submission.assetKey)}
                    />
                  )}
                </div>
              ) : null}
            </div>

            <form
              action={approveSubmission}
              className="mt-8 space-y-4 border-t border-[var(--border-tertiary)] pt-4"
            >
              <input
                name="submissionId"
                type="hidden"
                value={submission.submissionId}
              />
              <div className="grid gap-2">
                <label
                  className="text-sm uppercase tracking-wide text-[var(--text-muted)]"
                  htmlFor={`reviewer-notes-${submission.id}`}
                >
                  Reviewer notes
                </label>
                <textarea
                  className="min-h-20 border border-[var(--border-primary)] bg-[var(--bg-primary)] px-3 py-3 text-sm"
                  disabled={!submissionActionsEnabled}
                  id={`reviewer-notes-${submission.id}`}
                  name="reviewerNotes"
                  placeholder="Notes for rejection or change requests"
                />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  className="border border-[var(--border-primary)] bg-[var(--text-primary)] px-4 py-2 text-sm uppercase tracking-wide text-[var(--bg-primary)] disabled:opacity-50"
                  disabled={!submissionActionsEnabled}
                  type="submit"
                >
                  Approve
                </button>
                <button
                  className="border border-[var(--border-primary)] px-4 py-2 text-sm uppercase tracking-wide disabled:opacity-50"
                  disabled={!submissionActionsEnabled}
                  formAction={requestChanges}
                  type="submit"
                >
                  Request changes
                </button>
                <button
                  className="border border-[var(--border-secondary)] px-4 py-2 text-sm uppercase tracking-wide text-[var(--text-muted)] disabled:opacity-50"
                  disabled={!submissionActionsEnabled}
                  formAction={rejectSubmission}
                  type="submit"
                >
                  Reject
                </button>
              </div>
              {submission.isSample ? (
                <p className="text-sm leading-6 text-[var(--text-muted)]">
                  Sample fallback row. Create a real reservation/submission draft
                  before using review actions.
                </p>
              ) : null}
            </form>
          </article>
          );
        })}
      </section>
    </main>
  );
}
