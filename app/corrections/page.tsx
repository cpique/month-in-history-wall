import Link from "next/link";
import { getCorrectionRequestCounts } from "@/lib/correction-repository";
import type { CorrectionRequestStatus } from "@/lib/domain-types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Corrections | Month in History Wall",
  description:
    "How Month in History Wall handles factual corrections, source updates, and reader-reported issues.",
};

const statusOrder: CorrectionRequestStatus[] = [
  "open",
  "reviewing",
  "accepted",
  "rejected",
  "closed",
];

function statusLabel(status: CorrectionRequestStatus) {
  return status.replaceAll("_", " ");
}

const processSteps = [
  {
    title: "Find the event",
    description:
      "Open the event detail page for the record you want to correct. Every published tile links to its detail page.",
  },
  {
    title: "Submit a correction",
    description:
      "Use the form at the bottom of the event page to describe the issue and, if possible, provide a supporting source URL.",
  },
  {
    title: "Editorial review",
    description:
      "Editors review each request, verify claims against sources, and move the request through open, reviewing, accepted, rejected, or closed states.",
  },
  {
    title: "Record update",
    description:
      "Accepted corrections are applied back to the event record and, when appropriate, to the original import file.",
  },
];

export default async function CorrectionsPage() {
  const mongoConfigured = Boolean(process.env.MONGODB_URI);
  const counts = mongoConfigured
    ? await getCorrectionRequestCounts()
    : {
        open: 0,
        reviewing: 0,
        accepted: 0,
        rejected: 0,
        closed: 0,
      };

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] px-5 py-5 text-[var(--text-primary)] lg:px-8">
      <section className="border border-[var(--border-primary)] bg-[var(--bg-card)] p-5 sm:p-7">
        <nav className="flex items-center justify-between gap-4 text-sm uppercase tracking-wide">
          <Link href="/">Month in History Wall</Link>
          <div className="flex gap-4">
            <Link href="/archive">Archive</Link>
            <Link href="/search">Search</Link>
          </div>
        </nav>

        <div className="mt-20 grid gap-6 lg:grid-cols-[minmax(280px,0.7fr)_minmax(520px,1.3fr)]">
          <div>
            <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
              Corrections
            </p>
            <h1 className="mt-3 max-w-3xl text-5xl font-semibold leading-none sm:text-7xl">
              Fix the record.
            </h1>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">
            Historical accuracy matters. If you spot an error, a missing source,
            or a misleading summary, tell us. Every published event has a
            correction form on its detail page.
          </p>
        </div>
      </section>

      <section className="grid gap-5 border-x border-b border-[var(--border-primary)] p-5 lg:grid-cols-2 lg:p-8">
        {processSteps.map((step) => (
          <article
            className="border border-[var(--border-primary)] bg-[var(--bg-card)] p-5"
            key={step.title}
          >
            <h2 className="text-2xl font-semibold">{step.title}</h2>
            <p className="mt-4 leading-7 text-[var(--text-secondary)]">
              {step.description}
            </p>
          </article>
        ))}
      </section>

      <section className="border-x border-b border-[var(--border-primary)] p-5 lg:p-8">
        <div className="grid gap-4 lg:grid-cols-[1fr_0.6fr]">
          <div className="border border-[var(--border-primary)] bg-[var(--bg-card)] p-5">
            <h2 className="text-2xl font-semibold">What to correct</h2>
            <ul className="mt-5 space-y-4 leading-7 text-[var(--text-secondary)]">
              {[
                "Factual errors in dates, locations, names, or outcomes.",
                "Missing, broken, or unreliable source citations.",
                "Incorrect categories, importance levels, or context.",
                "Media with wrong attribution, alt text, or licensing.",
              ].map((item) => (
                <li className="border-t border-[var(--border-tertiary)] pt-4" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid content-start gap-4">
            <div className="border border-[var(--border-primary)] bg-[var(--bg-card)] p-5">
              <h2 className="text-2xl font-semibold">Request counts</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                Aggregate status of public correction requests.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {statusOrder.map((status) => (
                  <div
                    className="border border-[var(--border-primary)] p-3"
                    key={status}
                  >
                    <p className="text-2xl font-semibold">{counts[status]}</p>
                    <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
                      {statusLabel(status)}
                    </p>
                  </div>
                ))}
              </div>
              {!mongoConfigured ? (
                <p className="mt-4 text-sm text-[var(--text-muted)]">
                  MongoDB is not configured locally. Counts will appear when the
                  database is connected.
                </p>
              ) : null}
            </div>

            <div className="border border-[var(--border-primary)] bg-[var(--bg-card)] p-5">
              <h2 className="text-2xl font-semibold">Related</h2>
              <ul className="mt-4 space-y-3 text-sm uppercase tracking-wide">
                <li>
                  <Link className="underline underline-offset-4" href="/policy">
                    Content policy
                  </Link>
                </li>
                <li>
                  <Link className="underline underline-offset-4" href="/search">
                    Search events
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
