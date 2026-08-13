import Link from "next/link";
import { notFound } from "next/navigation";
import { WorkMedia } from "@/components/exhibition/work-media";
import {
  getCurrentExhibition,
  getPublishedSpaces,
  getSpaceById,
} from "@/lib/exhibition-service";
import type { ExhibitionSpace } from "@/lib/exhibition-data";

export const dynamic = "force-dynamic";

function WorkBrowseCard({
  label,
  space,
  align = "left",
}: {
  label: string;
  space?: ExhibitionSpace;
  align?: "left" | "right";
}) {
  if (!space) {
    return (
      <span
        className={`border border-[var(--border-secondary)] px-3 py-3 text-sm text-[var(--text-muted)] ${
          align === "right" ? "text-right" : ""
        }`}
      >
        {label}
      </span>
    );
  }

  const mediaUrl = space.mediaPreview?.mediaUrl;

  return (
    <Link
      aria-label={`${label}: ${space.title}`}
      className={`group grid min-h-36 overflow-hidden border border-[var(--border-primary)] ${
        align === "right" ? "text-right" : ""
      }`}
      href={`/works/${space.id}`}
    >
      <span className="relative flex min-h-24 flex-col justify-end overflow-hidden p-3">
        {mediaUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt=""
              aria-hidden="true"
              className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
              src={mediaUrl}
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.15),rgba(0,0,0,0.78))]"
            />
          </>
        ) : (
          <span
            aria-hidden="true"
            className={`${space.className} absolute inset-0 block`}
          />
        )}
        <span className="relative text-xs uppercase tracking-wide text-[#f8f1df]">
          {label}
        </span>
        <span className="relative mt-1 text-lg font-semibold leading-tight text-[#f8f1df]">
          {space.title}
        </span>
      </span>
      <span className="grid gap-1 bg-[var(--bg-card)] px-3 py-3 text-sm leading-5">
        <span>{space.creator}</span>
        <span className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
          Tile {space.id} / {space.medium}
        </span>
      </span>
    </Link>
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/works/[spaceId]">) {
  const { spaceId } = await params;
  const exhibition = await getCurrentExhibition();
  const space = getSpaceById(exhibition, spaceId);

  if (!space) {
    return {
      title: "Event not found | Month in History Wall",
    };
  }

  return {
    title: `${space.title} | Month in History Wall`,
    description: space.description,
  };
}

export default async function WorkDetailPage({
  params,
}: PageProps<"/works/[spaceId]">) {
  const { spaceId } = await params;
  const exhibition = await getCurrentExhibition();
  const space = getSpaceById(exhibition, spaceId);

  if (!space || (space.status !== "occupied" && space.status !== "featured")) {
    notFound();
  }

  const publishedSpaces = getPublishedSpaces(exhibition);
  const currentIndex = publishedSpaces.findIndex(
    (publishedSpace) => publishedSpace.id === space.id,
  );
  const previousSpace = publishedSpaces[currentIndex - 1];
  const nextSpace = publishedSpaces[currentIndex + 1];
  const currentPosition = currentIndex >= 0 ? currentIndex + 1 : 1;

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] px-5 py-5 text-[var(--text-primary)] lg:px-8">
      <div className="grid min-h-[calc(100vh-40px)] gap-8 lg:grid-cols-[minmax(280px,0.62fr)_minmax(560px,1.38fr)]">
        <aside className="flex flex-col justify-between border border-[var(--border-primary)] bg-[var(--bg-card)] p-5 sm:p-7">
          <div className="space-y-8">
            <nav className="flex items-center justify-between gap-4 text-sm uppercase tracking-wide">
              <Link href="/">Month in History Wall</Link>
              <span>{exhibition.monthLabel}</span>
            </nav>

            <div className="space-y-4">
              <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
                Event {currentPosition} of {publishedSpaces.length} / Tile {space.id}
              </p>
              <h1 className="text-5xl font-semibold leading-none sm:text-6xl">
                {space.title}
              </h1>
              <p className="text-xl text-[var(--text-secondary)]">{space.creator}</p>
            </div>
          </div>

          <div className="mt-10 space-y-3">
            <Link
              className="inline-flex w-fit border border-[var(--border-primary)] px-4 py-3 text-sm uppercase tracking-wide"
              href="/?view=published"
            >
              Back to published wall
            </Link>
            <nav aria-label="Browse published events" className="grid grid-cols-2 gap-2">
              <WorkBrowseCard
                label={previousSpace ? "Previous event" : "First published event"}
                space={previousSpace}
              />
              <WorkBrowseCard
                align="right"
                label={nextSpace ? "Next event" : "Last published event"}
                space={nextSpace}
              />
            </nav>
          </div>
        </aside>

        <section className="grid gap-5 border border-[var(--border-primary)] bg-[var(--bg-card)] p-5 sm:p-7 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid content-center">
            {space.mediaPreview ? (
              <WorkMedia preview={space.mediaPreview} />
            ) : (
              <div
                className={`${space.className} flex min-h-[420px] flex-col justify-between border border-[var(--border-primary)] p-5 sm:p-7`}
              >
                <span className="text-sm uppercase tracking-wide">
                  {space.medium}
                </span>
                <p className="text-3xl font-semibold leading-tight sm:text-5xl">
                  {space.title}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between gap-8 border border-[var(--border-primary)] p-5">
            <div className="space-y-5">
              <div className="flex items-center justify-between text-sm uppercase tracking-wide text-[var(--text-muted)]">
                <span>{space.category}</span>
                <span>{space.medium}</span>
              </div>
              <p className="text-3xl font-semibold leading-tight sm:text-4xl">
                {space.title}
              </p>
              <p className="text-lg leading-8 text-[var(--text-secondary)]">
                {space.description}
              </p>
            </div>
            {space.externalUrl ? (
              <a
                className="inline-flex w-fit border border-[var(--border-primary)] px-4 py-3 text-sm uppercase tracking-wide"
                href={space.externalUrl}
                rel="noreferrer"
                target="_blank"
              >
                Open source
              </a>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
