import Link from "next/link";
import { getAnalyticsSummary, getEventLabel } from "@/lib/analytics-service";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Analytics | One Month Museum",
  description: "Participant analytics for One Month Museum.",
  robots: {
    index: false,
    follow: false,
  },
};

const stepLabels: Record<string, string> = {
  reservation_started: "Started",
  reservation_submitted: "Submitted",
  payment_authorized: "Authorized",
  payment_completed: "Completed",
  submission_approved: "Approved",
};

export default async function AnalyticsPage() {
  const summary = await getAnalyticsSummary();

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] px-5 py-5 text-[var(--text-primary)] lg:px-8">
      <section className="border border-[var(--border-primary)] bg-[var(--bg-card)] p-5 sm:p-7">
        <nav className="flex items-center justify-between gap-4 text-sm uppercase tracking-wide">
          <Link href="/">One Month Museum</Link>
          <div className="flex gap-4">
            <Link href="/admin">Review</Link>
            <Link href="/archive">Archive</Link>
          </div>
        </nav>
        <div className="mt-16 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
              Analytics
            </p>
            <h1 className="mt-3 text-5xl font-semibold leading-none sm:text-7xl">
              Participant activity.
            </h1>
          </div>
          <p className="max-w-xl text-lg leading-8 text-[var(--text-secondary)]">
            Funnel metrics, conversion rates, and recent participant events across
            the current exhibition.
          </p>
        </div>
      </section>

      <section className="mt-4 grid gap-4 border-x border-b border-[var(--border-primary)] p-5 sm:grid-cols-3 lg:p-8">
        <div className="border border-[var(--border-primary)] bg-[var(--bg-card)] p-4">
          <p className="text-3xl font-semibold">{summary.pageViews}</p>
          <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
            page views
          </p>
        </div>
        <div className="border border-[var(--border-primary)] bg-[var(--bg-success)] p-4">
          <p className="text-3xl font-semibold">
            {summary.funnel.find((f) => f.step === "reservation_started")?.count ?? 0}
          </p>
          <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
            reservations started
          </p>
        </div>
        <div className="border border-[var(--border-primary)] bg-[var(--bg-highlight)] p-4">
          <p className="text-3xl font-semibold">
            {summary.funnel.find((f) => f.step === "submission_approved")?.count ?? 0}
          </p>
          <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
            approved
          </p>
        </div>
      </section>

      <section className="mt-4 border-x border-b border-[var(--border-primary)] p-5 lg:p-8">
        <h2 className="text-xl font-semibold uppercase tracking-wide text-[var(--text-muted)]">
          Reservation funnel
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-5">
          {summary.funnel.map((step) => (
            <div
              className="border border-[var(--border-primary)] bg-[var(--bg-card)] p-3"
              key={step.step}
            >
              <p className="text-2xl font-semibold">{step.count}</p>
              <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
                {stepLabels[step.step] ?? step.step}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          <div className="border border-[var(--border-primary)] bg-[var(--bg-warning)] p-3">
            <p className="text-lg font-semibold">
              {(summary.conversionRates.reservationToSubmission * 100).toFixed(1)}%
            </p>
            <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              start → submit
            </p>
          </div>
          <div className="border border-[var(--border-primary)] bg-[var(--bg-warning)] p-3">
            <p className="text-lg font-semibold">
              {(summary.conversionRates.submissionToPayment * 100).toFixed(1)}%
            </p>
            <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              submit → authorize
            </p>
          </div>
          <div className="border border-[var(--border-primary)] bg-[var(--bg-warning)] p-3">
            <p className="text-lg font-semibold">
              {(summary.conversionRates.paymentToApproval * 100).toFixed(1)}%
            </p>
            <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              authorize → approve
            </p>
          </div>
          <div className="border border-[var(--border-primary)] bg-[var(--bg-warning)] p-3">
            <p className="text-lg font-semibold">
              {(summary.conversionRates.overallApprovalRate * 100).toFixed(1)}%
            </p>
            <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              overall approval
            </p>
          </div>
        </div>
      </section>

      {summary.topSpaces.length > 0 && (
        <section className="mt-4 border-x border-b border-[var(--border-primary)] p-5 lg:p-8">
          <h2 className="text-xl font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            Most selected spaces
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-5">
            {summary.topSpaces.map((space) => (
              <div
                className="border border-[var(--border-primary)] bg-[var(--bg-card)] p-3"
                key={space.spaceId}
              >
                <p className="text-2xl font-semibold">{space.count}</p>
                <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
                  {space.spaceId}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-4 border-x border-b border-[var(--border-primary)] p-5 lg:p-8">
        <h2 className="text-xl font-semibold uppercase tracking-wide text-[var(--text-muted)]">
          Recent activity
        </h2>
        {summary.recentEvents.length === 0 ? (
          <p className="mt-4 text-[var(--text-secondary)]">
            No participant events recorded yet. Events will appear here once
            participants interact with the reservation flow or admins review
            submissions.
          </p>
        ) : (
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {summary.recentEvents.map((event) => (
              <div
                className="border border-[var(--border-primary)] bg-[var(--bg-card)] p-3 text-sm"
                key={event.id}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{getEventLabel(event.type)}</span>
                  <span className="text-[var(--text-muted)]">
                    {new Date(event.createdAt).toLocaleString()}
                  </span>
                </div>
                {event.participantEmail && (
                  <p className="mt-1 text-[var(--text-secondary)]">{event.participantEmail}</p>
                )}
                {event.spaceId && (
                  <p className="mt-1 text-xs uppercase tracking-wide text-[var(--text-muted)]">
                    space: {event.spaceId}
                  </p>
                )}
                {event.reservationId && (
                  <p className="mt-1 text-xs text-[var(--text-muted)]">
                    reservation: {event.reservationId}
                  </p>
                )}
                {event.submissionId && (
                  <p className="mt-1 text-xs text-[var(--text-muted)]">
                    submission: {event.submissionId}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
