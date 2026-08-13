import Link from "next/link";
import type { ArchiveSummary } from "@/lib/archive-service";

export function ArchiveMonthCard({ month }: { month: ArchiveSummary }) {
  return (
    <Link
      className="grid min-h-[280px] border border-[var(--border-primary)] bg-[var(--bg-card)] p-5 transition-transform duration-200 hover:-translate-y-1"
      href={`/archive/${month.slug}`}
    >
      <div className="flex items-start justify-between gap-4 text-sm uppercase tracking-wide text-[var(--text-muted)]">
        <span>{month.monthLabel}</span>
        <span>{month.slug}</span>
      </div>

      <div className="mt-12 space-y-4 self-end">
        <p className="text-4xl font-semibold leading-none">
          {month.theme ?? month.monthLabel}
        </p>
        <p className="max-w-xl leading-7 text-[var(--text-secondary)]">{month.description}</p>
      </div>

      <div className="mt-8 grid grid-cols-2 border border-[var(--border-primary)]">
        <div className="border-r border-[var(--border-primary)] p-3">
          <p className="text-2xl font-semibold">{month.publishedCount}</p>
          <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
            events
          </p>
        </div>
        <div className="p-3">
          <p className="text-2xl font-semibold">
            {month.stats.find((stat) => stat.label === "sources")?.value ?? month.stats[0]?.value}
          </p>
          <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
            {month.stats.find((stat) => stat.label === "sources") ? "sources" : "events"}
          </p>
        </div>
      </div>
    </Link>
  );
}
