import Link from "next/link";
import type { Exhibition } from "@/lib/exhibition-data";

export function ExhibitionIntro({ exhibition }: { exhibition: Exhibition }) {
  return (
    <aside className="flex flex-col justify-between gap-10 border border-[var(--border-primary)] bg-[var(--bg-card)] p-5 sm:p-7">
      <div className="space-y-8">
        <nav className="flex items-center justify-between gap-4 text-sm uppercase tracking-wide">
          <span>{exhibition.title}</span>
            <div className="flex items-center gap-4 underline underline-offset-4">
              <Link href="/archive">Archive</Link>
            </div>
        </nav>

        <div className="space-y-5">
          <p className="max-w-sm text-sm uppercase tracking-wide text-[var(--text-secondary)]">
            Current exhibition: {exhibition.monthLabel}
          </p>
          <h1 className="max-w-2xl text-5xl font-semibold leading-none sm:text-6xl lg:text-7xl">
            {exhibition.tagline}
          </h1>
          <p className="max-w-xl text-lg leading-8 text-[var(--text-secondary)]">
            {exhibition.description}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 border border-[var(--border-primary)]">
        {exhibition.stats.map((stat) => (
          <div
            className="border-[var(--border-primary)] p-4 odd:border-r first:border-b [&:nth-child(2)]:border-b"
            key={stat.label}
          >
            <p className="text-3xl font-semibold">{stat.value}</p>
            <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </aside>
  );
}
