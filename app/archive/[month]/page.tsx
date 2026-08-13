import Link from "next/link";
import { notFound } from "next/navigation";
import { ExhibitionWall } from "@/components/exhibition/exhibition-wall";
import {
  getArchivedExhibitionBySlug,
  getArchiveSummaries,
} from "@/lib/archive-service";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/archive/[month]">) {
  const { month } = await params;
  const exhibition = await getArchivedExhibitionBySlug(month);

  if (!exhibition) {
    return {
      title: "Archive month not found | One Month Museum",
    };
  }

  return {
    title: `${exhibition.monthLabel} Archive | One Month Museum`,
    description: exhibition.description,
  };
}

export default async function ArchiveMonthPage({
  params,
}: PageProps<"/archive/[month]">) {
  const { month } = await params;
  const [exhibition, summaries] = await Promise.all([
    getArchivedExhibitionBySlug(month),
    getArchiveSummaries(),
  ]);

  if (!exhibition) {
    notFound();
  }

  const archiveIndex = summaries.findIndex(
    (summary) => summary.slug === exhibition.slug,
  );
  const newerExhibition = summaries[archiveIndex - 1];
  const olderExhibition = summaries[archiveIndex + 1];

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] px-5 py-5 text-[var(--text-primary)] lg:px-8">
      <section className="grid gap-8 lg:grid-cols-[minmax(300px,0.58fr)_minmax(620px,1.42fr)]">
        <aside className="flex min-h-[720px] flex-col justify-between border border-[var(--border-primary)] bg-[var(--bg-card)] p-5 sm:p-7">
          <div className="space-y-8">
            <nav className="flex items-center justify-between gap-4 text-sm uppercase tracking-wide">
              <Link href="/archive">Archive</Link>
              <Link href="/">Current wall</Link>
            </nav>

            <div className="space-y-5">
              <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
                Locked snapshot: {exhibition.slug}
              </p>
              <h1 className="text-5xl font-semibold leading-none sm:text-6xl">
                {exhibition.monthLabel}
              </h1>
              <p className="text-2xl text-[var(--text-secondary)]">{exhibition.theme}</p>
              <p className="text-lg leading-8 text-[var(--text-secondary)]">
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

          <nav aria-label="Browse archive months" className="mt-8 grid grid-cols-2 gap-2">
            {newerExhibition ? (
              <Link
                className="border border-[var(--border-primary)] px-3 py-3 text-sm leading-5"
                href={`/archive/${newerExhibition.slug}`}
              >
                <span className="block text-xs uppercase tracking-wide text-[var(--text-muted)]">
                  Newer month
                </span>
                {newerExhibition.monthLabel}
              </Link>
            ) : (
              <Link
                className="border border-[var(--border-secondary)] px-3 py-3 text-sm text-[var(--text-muted)]"
                href="/"
              >
                Current wall
              </Link>
            )}
            {olderExhibition ? (
              <Link
                className="border border-[var(--border-primary)] px-3 py-3 text-right text-sm leading-5"
                href={`/archive/${olderExhibition.slug}`}
              >
                <span className="block text-xs uppercase tracking-wide text-[var(--text-muted)]">
                  Older month
                </span>
                {olderExhibition.monthLabel}
              </Link>
            ) : (
              <span className="border border-[var(--border-secondary)] px-3 py-3 text-right text-sm text-[var(--text-muted)]">
                Oldest snapshot
              </span>
            )}
          </nav>
        </aside>

        <ExhibitionWall
          exhibition={exhibition}
          getPublishedHref={() => null}
          getStatusHref={() => null}
          filterable={false}
        />
      </section>
    </main>
  );
}
