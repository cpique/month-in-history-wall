import Link from "next/link";
import { searchPublishedEvents } from "@/lib/search-service";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Search | Month in History Wall",
  description: "Search historical events by month, year, category, place, country, or topic.",
};

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

function SearchResultCard({
  event,
}: {
  event: Awaited<ReturnType<typeof searchPublishedEvents>>[number];
}) {
  return (
    <article className="grid gap-4 border border-[var(--border-primary)] bg-[var(--bg-card)] p-5">
      <div className="flex flex-wrap items-start justify-between gap-3 text-sm uppercase tracking-wide text-[var(--text-muted)]">
        <span>{event.monthLabel}</span>
        <span>{event.category}</span>
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold leading-tight">
          <Link className="underline underline-offset-4" href={`/events/${event.id}`}>
            {event.title}
          </Link>
        </h2>
        <p className="leading-7 text-[var(--text-secondary)]">{event.summary}</p>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[var(--text-muted)]">
        {event.date ? <span>{event.date}</span> : null}
        {event.location ? <span>{event.location}</span> : null}
        {event.importanceLevel ? (
          <span className="uppercase tracking-wide">{event.importanceLevel}</span>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-3 text-sm uppercase tracking-wide">
        <Link
          className="border border-[var(--border-primary)] px-3 py-2"
          href={`/events/${event.id}`}
        >
          Open event
        </Link>
        <Link
          className="border border-[var(--border-secondary)] px-3 py-2 text-[var(--text-muted)]"
          href={`/archive/${event.monthSlug}`}
        >
          View month
        </Link>
      </div>
    </article>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q : "";
  const normalizedQuery = query.trim();
  const results = normalizedQuery ? await searchPublishedEvents(normalizedQuery) : [];

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] px-5 py-5 text-[var(--text-primary)] lg:px-8">
      <section className="border border-[var(--border-primary)] bg-[var(--bg-card)] p-5 sm:p-7">
        <nav className="flex items-center justify-between gap-4 text-sm uppercase tracking-wide">
          <Link href="/">Month in History Wall</Link>
          <Link href="/archive">Archive</Link>
        </nav>

        <div className="mt-16 grid gap-6 lg:grid-cols-[minmax(280px,0.7fr)_minmax(520px,1.3fr)]">
          <div>
            <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
              Search the archive
            </p>
            <h1 className="mt-3 text-5xl font-semibold leading-none sm:text-7xl">
              Find a moment in time.
            </h1>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">
            Search by month, year, category, place, country, person, or topic.
            Only published events are shown.
          </p>
        </div>
      </section>

      <section className="border-x border-b border-[var(--border-primary)] p-5 lg:p-8">
        <form action="/search" className="flex gap-2" method="get">
          <label className="sr-only" htmlFor="search-query">
            Search historical events
          </label>
          <input
            className="min-w-0 flex-1 border border-[var(--border-primary)] bg-[var(--bg-primary)] px-4 py-3 text-[var(--text-primary)] outline-none focus:border-[var(--text-primary)]"
            defaultValue={query}
            id="search-query"
            name="q"
            placeholder="Try &quot;Tetris&quot;, &quot;France&quot;, &quot;June 1984&quot;, or &quot;Music&quot;"
            type="search"
          />
          <button
            className="border border-[var(--border-primary)] bg-[var(--text-primary)] px-5 py-3 text-sm uppercase tracking-wide text-[var(--bg-primary)]"
            type="submit"
          >
            Search
          </button>
        </form>

        {normalizedQuery ? (
          <p className="mt-4 text-sm text-[var(--text-muted)]">
            {results.length} result{results.length === 1 ? "" : "s"} for &quot;{normalizedQuery}
            &quot;
          </p>
        ) : null}
      </section>

      <section className="border-x border-b border-[var(--border-primary)] p-5 lg:p-8">
        {results.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {results.map((event) => (
              <SearchResultCard event={event} key={event.id} />
            ))}
          </div>
        ) : normalizedQuery ? (
          <div className="border border-dashed border-[var(--border-secondary)] p-8 text-center text-sm uppercase tracking-wide text-[var(--text-muted)]">
            No published events match &quot;{normalizedQuery}&quot;.
          </div>
        ) : (
          <div className="border border-dashed border-[var(--border-secondary)] p-8 text-center text-sm uppercase tracking-wide text-[var(--text-muted)]">
            Enter a word or phrase above to search published events.
          </div>
        )}
      </section>
    </main>
  );
}
