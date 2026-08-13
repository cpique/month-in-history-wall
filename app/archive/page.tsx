import Link from "next/link";
import { ArchiveMonthCard } from "@/components/archive/archive-month-card";
import { getArchiveSummaries } from "@/lib/archive-service";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Archive | Month in History Wall",
  description: "Browse completed monthly historical wall snapshots.",
};

export default async function ArchivePage() {
  const months = await getArchiveSummaries();

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] px-5 py-5 text-[var(--text-primary)] lg:px-8">
      <section className="border border-[var(--border-primary)] bg-[var(--bg-card)] p-5 sm:p-7">
        <nav className="flex items-center justify-between gap-4 text-sm uppercase tracking-wide">
          <Link href="/">Month in History Wall</Link>
          <span>Permanent archive</span>
        </nav>

        <div className="mt-20 grid gap-6 lg:grid-cols-[minmax(280px,0.7fr)_minmax(520px,1.3fr)]">
          <div>
            <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
              Completed exhibitions
            </p>
            <h1 className="mt-3 max-w-3xl text-5xl font-semibold leading-none sm:text-7xl">
              Every month leaves a trace.
            </h1>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">
            Archive pages are locked monthly snapshots. Browse completed walls
            exactly as they were preserved, with each month keeping its own
            events, sources, and arrangement.
          </p>
        </div>
      </section>

      <section className="grid gap-5 border-x border-b border-[var(--border-primary)] p-5 lg:grid-cols-2 lg:p-8">
        {months.map((month) => (
          <ArchiveMonthCard key={month.slug} month={month} />
        ))}
      </section>
    </main>
  );
}
