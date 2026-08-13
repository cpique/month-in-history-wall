import Link from "next/link";
import type { Exhibition, ExhibitionSpace } from "@/lib/exhibition-data";
import { SpaceTile } from "./space-tile";

export type ExhibitionWallFilter = "all" | "published" | "available" | "review";

const statusKey = [
  ["Featured", "Defining event"],
  ["Published", "Reviewed event"],
  ["In review", "Editorial draft"],
] as const;

const filterOptions: Array<{ value: ExhibitionWallFilter; label: string }> = [
  { value: "all", label: "All events" },
  { value: "published", label: "Published" },
  { value: "available", label: "Candidates" },
  { value: "review", label: "In review" },
];

function matchesFilter(space: ExhibitionSpace, filter: ExhibitionWallFilter) {
  if (filter === "published") {
    return space.status === "occupied" || space.status === "featured";
  }

  return filter === "all" || space.status === filter;
}

function matchesSearch(space: ExhibitionSpace, query: string) {
  if (!query) {
    return true;
  }

  const searchableText =
    space.status === "review"
      ? ["in review", "pending approval", "held space", space.id]
      : [
          space.title,
          space.creator,
          space.category,
          space.medium,
          space.description,
        ];

  return searchableText
    .join(" ")
    .toLowerCase()
    .includes(query);
}

export function ExhibitionWall({
  exhibition,
  getAvailableHref = (space) => `/reserve/${space.id}`,
  getStatusHref = (space) => `/spaces/${space.id}`,
  getPublishedHref = (space) => `/works/${space.id}`,
  filter = "all",
  filterable = true,
  wallOnly = false,
  query = "",
}: {
  exhibition: Exhibition;
  getAvailableHref?: (space: ExhibitionSpace) => string | null;
  getStatusHref?: (space: ExhibitionSpace) => string | null;
  getPublishedHref?: (space: ExhibitionSpace) => string | null;
  filter?: ExhibitionWallFilter;
  filterable?: boolean;
  wallOnly?: boolean;
  query?: string;
}) {
  const normalizedQuery = query.trim().toLowerCase();
  const filterCounts: Record<ExhibitionWallFilter, number> = {
    all: exhibition.spaces.length,
    published: exhibition.spaces.filter((space) => matchesFilter(space, "published")).length,
    available: exhibition.spaces.filter((space) => matchesFilter(space, "available")).length,
    review: exhibition.spaces.filter((space) => matchesFilter(space, "review")).length,
  };
  const visibleSpaces = exhibition.spaces.filter(
    (space) => matchesFilter(space, filter) && matchesSearch(space, normalizedQuery),
  );
  const getFilterHref = (value: ExhibitionWallFilter) => {
    const params = new URLSearchParams();

    if (value !== "all") {
      params.set("view", value);
    }
    if (normalizedQuery) {
      params.set("q", normalizedQuery);
    }

    const search = params.toString();
    return search ? `/?${search}` : "/";
  };

  return (
    <div className="flex min-h-[720px] flex-1 flex-col border border-[var(--border-primary)] bg-[var(--bg-wall)] p-3 text-[var(--text-primary)]">
      {!wallOnly ? (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3 px-1 text-sm text-[var(--text-on-wall)]">
          <p>
            {exhibition.templateLabel} / {visibleSpaces.length} of {exhibition.spaces.length} spaces
          </p>
          <p>{exhibition.reviewNote}</p>
        </div>
      ) : null}

      {filterable && !wallOnly ? (
        <div className="mb-3 grid gap-2 border border-[var(--border-wall)] p-2 sm:grid-cols-[minmax(220px,0.8fr)_minmax(0,1.2fr)]">
          <form action="/" className="flex gap-2" method="get">
            {filter !== "all" ? <input name="view" type="hidden" value={filter} /> : null}
            <label className="sr-only" htmlFor="wall-search">
              Search historical events
            </label>
            <input
              className="min-w-0 flex-1 border border-[var(--border-wall)] bg-[var(--bg-wall-panel)] px-3 py-2 text-sm text-[var(--text-on-wall)] placeholder:text-[var(--border-placeholder)]"
              defaultValue={query}
              id="wall-search"
              name="q"
              placeholder="Search title, place, category, or date"
            />
            <button
              className="border border-[var(--border-placeholder)] px-3 py-2 text-xs uppercase tracking-wide text-[var(--text-on-wall)]"
              type="submit"
            >
              Search
            </button>
          </form>
          <nav aria-label="Filter exhibition spaces" className="flex flex-wrap gap-2 text-xs uppercase tracking-wide">
            {filterOptions.map((option) => (
              <Link
                aria-current={filter === option.value ? "page" : undefined}
                className={`px-2 py-2 ${filter === option.value ? "bg-[var(--text-on-wall)] text-[var(--bg-wall)]" : "text-[var(--text-on-wall-muted)] hover:bg-[var(--bg-wall-hover)]"}`}
                href={getFilterHref(option.value)}
                key={option.value}
              >
                {option.label} ({filterCounts[option.value]})
              </Link>
            ))}
          </nav>
        </div>
      ) : null}

      {!wallOnly ? (
        <div className="mb-3 grid gap-2 border border-[var(--border-wall)] px-3 py-2 text-xs uppercase tracking-wide text-[var(--text-on-wall-muted)]">
          {statusKey.map(([label, description]) => (
            <div className="flex gap-2" key={label}>
              <span className="text-[var(--text-on-wall)]">{label}</span>
              <span className="text-[var(--border-placeholder)]">/ {description}</span>
            </div>
          ))}
        </div>
      ) : null}

      {filterable && !wallOnly ? (
        <p className="mb-3 px-1 text-xs leading-5 text-[var(--border-placeholder)]">
          This wall shows {exhibition.spaces.length} historical event tiles.
          Tile size reflects editorial importance; drafts stay out of the public wall.
        </p>
      ) : null}

      {visibleSpaces.length > 0 ? (
        <div className="grid flex-1 auto-rows-[72px] grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-9">
          {visibleSpaces.map((space) => (
            <SpaceTile
              availableHref={getAvailableHref(space)}
              key={space.id}
              publishedHref={getPublishedHref(space)}
              statusHref={getStatusHref(space)}
              space={space}
            />
          ))}
        </div>
      ) : (
        <div className="flex min-h-80 items-center justify-center border border-dashed border-[var(--border-placeholder)] px-6 text-center text-sm uppercase tracking-wide text-[var(--text-on-wall-muted)]">
          No events match this search.
        </div>
      )}
    </div>
  );
}
