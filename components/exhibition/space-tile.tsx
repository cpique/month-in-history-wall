import Link from "next/link";
import type { ExhibitionSpace } from "@/lib/exhibition-data";

const statusLabel: Record<ExhibitionSpace["status"], string> = {
  available: "Candidate",
  featured: "Featured",
  occupied: "Published",
  review: "In review",
};

function SpaceContent({
  actionLabel,
  hasMedia,
  space,
}: {
  actionLabel: string;
  hasMedia: boolean;
  space: ExhibitionSpace;
}) {
  const isTiny = space.size === "tiny";
  const isReview = space.status === "review";
  const title = isReview ? "In review" : space.title;
  const creator = isReview ? "Pending review" : space.creator;
  const medium = isReview ? "Editorial draft" : space.medium;

  return (
    <div
      className={`relative z-10 flex h-full flex-col justify-between ${hasMedia ? "text-[#f8f1df]" : ""}`}
    >
      <div
        className={`flex items-start justify-between gap-2 uppercase ${isTiny ? "text-[10px] leading-3" : "text-xs"} tracking-wide`}
      >
        <span>{space.id}</span>
        <span className="text-right">{statusLabel[space.status]}</span>
      </div>
      <div className="min-w-0">
        <p
          className={`break-words font-semibold leading-tight ${isTiny ? "text-sm" : "text-lg"}`}
        >
          {title}
        </p>
        <p
          className={`mt-1 truncate opacity-75 ${isTiny ? "text-xs" : "text-sm"}`}
        >
          {creator}
        </p>
      </div>
      <div
        className={`flex items-end justify-between gap-3 uppercase tracking-wide opacity-75 transition-opacity group-hover:opacity-100 ${isTiny ? "mt-2 text-[10px] leading-3" : "mt-4 text-xs"}`}
      >
        <span className="min-w-0 truncate">{medium}</span>
        <span aria-hidden="true" className="text-right">
          {isTiny ? "Open" : actionLabel} &rarr;
        </span>
      </div>
    </div>
  );
}

export function SpaceTile({
  space,
  availableHref,
  publishedHref,
  statusHref,
}: {
  space: ExhibitionSpace;
  availableHref?: string | null;
  publishedHref?: string | null;
  statusHref?: string | null;
}) {
  const isReview = space.status === "review";
  const hasMedia = Boolean(space.mediaPreview?.mediaUrl) && !isReview;
  const baseClass = `${space.className} group relative flex min-h-0 flex-col justify-between overflow-hidden border border-current/45 transition-transform duration-200 hover:-translate-y-1 ${space.size === "tiny" ? "p-2" : "p-3"}`;
  const isPublished = space.status === "occupied" || space.status === "featured";
  const actionLabel =
    isPublished && publishedHref
      ? "Open event"
      : space.status === "available" && availableHref
        ? "View candidate"
        : space.status === "review" && statusHref
          ? "View status"
          : "Locked snapshot";
  const content = (
    <>
      {hasMedia ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            aria-hidden="true"
            className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
            src={space.mediaPreview?.mediaUrl}
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.62),rgba(0,0,0,0.22)_42%,rgba(0,0,0,0.72))]"
          />
        </>
      ) : null}
      <SpaceContent actionLabel={actionLabel} hasMedia={hasMedia} space={space} />
    </>
  );

  if (isPublished && publishedHref) {
    return (
      <Link
        aria-label={`Open event ${space.title}`}
        className={baseClass}
        href={publishedHref}
      >
        {content}
      </Link>
    );
  }

  if (space.status === "available" && availableHref) {
    return (
      <Link
        aria-label={`View candidate event ${space.title}`}
        className={baseClass}
        href={availableHref}
      >
        {content}
      </Link>
    );
  }
  if (space.status === "review" && statusHref) {
    return (
      <Link
        aria-label={`View status for space ${space.id}`}
        className={baseClass}
        href={statusHref}
      >
        {content}
      </Link>
    );
  }

  return (
    <article
      aria-label={`${space.title}: ${actionLabel}`}
      className={baseClass}
    >
      {content}
    </article>
  );
}
