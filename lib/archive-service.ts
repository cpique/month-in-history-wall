import { cache } from "react";
import {
  getArchiveSummaries as getStaticArchiveSummaries,
  getArchivedExhibitionBySlug as getStaticArchivedExhibitionBySlug,
  type Exhibition,
  type ExhibitionSpace,
} from "./exhibition-data";
import {
  findArchiveSnapshotBySlug,
  findArchiveSnapshotSummaries,
  type ArchiveSnapshotSummaryRecord,
} from "./archive-repository";
import { getMediaUrl } from "./media-storage";
import { getMongoDb } from "./mongodb";
import type { ArchiveSnapshotDocument } from "./domain-types";

export type ArchiveSummary = {
  slug: string;
  monthLabel: string;
  theme?: string;
  description: string;
  stats: { value: string; label: string }[];
  publishedCount: number;
};

const DEFAULT_TOTAL_SPACES = "48";

function snapshotToExhibition(snapshot: ArchiveSnapshotDocument): Exhibition {
  const publishedCount = snapshot.spaces.filter(
    (space) => space.status === "occupied" || space.status === "featured",
  ).length;
  const totalSpaces = snapshot.spaces.length || Number(DEFAULT_TOTAL_SPACES);

  return {
    slug: snapshot.slug,
    title: snapshot.title,
    monthLabel: snapshot.monthLabel,
    templateLabel: `Archived wall ${snapshot.slug}`,
    reviewNote: "Locked archive snapshot",
    tagline: snapshot.theme ?? snapshot.monthLabel,
    description: snapshot.description,
    status: "archived",
    theme: snapshot.theme,
    stats: [
      { value: String(totalSpaces), label: "spaces" },
      { value: String(publishedCount), label: "published" },
      { value: "0", label: "invited" },
      { value: "1", label: "snapshot" },
    ],
    spaces: snapshot.spaces.map(snapshotSpaceToExhibitionSpace),
  };
}

function snapshotSpaceToExhibitionSpace(
  snapshotSpace: ArchiveSnapshotDocument["spaces"][number],
): ExhibitionSpace {
  return {
    id: snapshotSpace.slotId,
    title: snapshotSpace.workTitle,
    creator: snapshotSpace.creatorName,
    status: snapshotSpace.status,
    size: snapshotSpace.size,
    className: snapshotSpace.className,
    category:
      snapshotSpace.status === "featured" ? "Featured work" : "Published work",
    medium: snapshotSpace.mediaKind,
    description: snapshotSpace.description,
    externalUrl: snapshotSpace.externalUrl,
    mediaPreview: snapshotSpace.mediaAssetKey
      ? {
          alt: snapshotSpace.altText ?? snapshotSpace.workTitle,
          caption: snapshotSpace.workTitle,
          shape: "square",
          pattern: "frames",
          background: "#f4f1ea",
          foreground: "#171411",
          marks: ["0%"],
          mediaUrl: getMediaUrl(snapshotSpace.mediaAssetKey),
          mediaAlt: snapshotSpace.altText ?? snapshotSpace.workTitle,
        }
      : undefined,
  };
}

function snapshotToSummary(snapshot: ArchiveSnapshotSummaryRecord): ArchiveSummary {
  const publishedCount = snapshot.spaces.filter(
    (space) => space.status === "occupied" || space.status === "featured",
  ).length;

  return {
    slug: snapshot.slug,
    monthLabel: snapshot.monthLabel,
    theme: snapshot.theme,
    description: snapshot.description,
    stats: [
      { value: String(snapshot.spaces.length || DEFAULT_TOTAL_SPACES), label: "spaces" },
    ],
    publishedCount,
  };
}

export const getArchiveSummaries = cache(async (): Promise<ArchiveSummary[]> => {
  const staticSummaries = getStaticArchiveSummaries();

  if (!process.env.MONGODB_URI) {
    return staticSummaries;
  }

  const db = await getMongoDb();
  const snapshots = await findArchiveSnapshotSummaries(db);
  const snapshotSummaries = snapshots.map(snapshotToSummary);
  const bySlug = new Map<string, ArchiveSummary>();

  for (const summary of staticSummaries) {
    bySlug.set(summary.slug, summary);
  }

  for (const summary of snapshotSummaries) {
    bySlug.set(summary.slug, summary);
  }

  return [...bySlug.values()].sort((a, b) => b.slug.localeCompare(a.slug));
});

export const getArchivedExhibitionBySlug = cache(async function getArchivedExhibitionBySlug(
  slug: string,
): Promise<Exhibition | null> {
  if (process.env.MONGODB_URI) {
    const db = await getMongoDb();
    const snapshot = await findArchiveSnapshotBySlug(slug, db);

    if (snapshot) {
      return snapshotToExhibition(snapshot);
    }
  }

  return getStaticArchivedExhibitionBySlug(slug) ?? null;
});
