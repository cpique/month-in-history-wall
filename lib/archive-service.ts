import { cache } from "react";
import {
  getArchiveSummaries as getStaticArchiveSummaries,
  getArchivedExhibitionBySlug as getStaticArchivedExhibitionBySlug,
  type Exhibition,
  type ExhibitionSpace,
} from "./exhibition-data";
import { monthEventsToExhibition } from "./exhibition-service";
import {
  findArchiveSnapshotBySlug,
  findArchiveSnapshotSummaries,
  type ArchiveSnapshotSummaryRecord,
} from "./archive-repository";
import { getMediaUrl } from "./media-storage";
import { getMongoDb } from "./mongodb";
import type {
  ArchiveSnapshotDocument,
  HistoricalEventDocument,
  MonthDocument,
} from "./domain-types";

export type ArchiveSummary = {
  slug: string;
  monthLabel: string;
  theme?: string;
  description: string;
  stats: { value: string; label: string }[];
  publishedCount: number;
};

const DEFAULT_TOTAL_EVENTS = "0";

function snapshotToExhibition(snapshot: ArchiveSnapshotDocument): Exhibition {
  const publishedCount = snapshot.spaces.filter(
    (space) => space.status === "occupied" || space.status === "featured",
  ).length;
  const totalSpaces = snapshot.spaces.length || Number(DEFAULT_TOTAL_EVENTS);

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
      { value: String(totalSpaces), label: "events" },
      { value: String(publishedCount), label: "published" },
      { value: "0", label: "sources" },
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
    eventDetailHref: snapshotSpace.eventId
      ? `/events/${snapshotSpace.eventId}`
      : undefined,
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
      { value: String(snapshot.spaces.length || DEFAULT_TOTAL_EVENTS), label: "events" },
    ],
    publishedCount,
  };
}

export function monthEventsToArchiveSummary(
  month: MonthDocument,
  events: HistoricalEventDocument[],
): ArchiveSummary {
  const publishedEvents = events.filter(
    (event) => event.status === "published" || event.status === "archived",
  );
  const sourceCount = publishedEvents.reduce(
    (total, event) => total + event.sources.length,
    0,
  );

  return {
    slug: month.slug,
    monthLabel: monthEventsToExhibition(month, publishedEvents).monthLabel,
    theme: month.title,
    description: month.description,
    stats: [
      { value: String(publishedEvents.length), label: "events" },
      { value: String(sourceCount), label: "sources" },
    ],
    publishedCount: publishedEvents.length,
  };
}

export function monthEventsToArchivedExhibition(
  month: MonthDocument,
  events: HistoricalEventDocument[],
): Exhibition {
  const exhibition = monthEventsToExhibition(month, events);

  return {
    ...exhibition,
    status: "archived",
    templateLabel: `Historical wall ${month.slug}`,
    reviewNote:
      month.status === "locked"
        ? "Locked historical snapshot"
        : "Published historical month",
  };
}

export const getArchiveSummaries = cache(async (): Promise<ArchiveSummary[]> => {
  const staticSummaries = getStaticArchiveSummaries();

  if (!process.env.MONGODB_URI) {
    return staticSummaries;
  }

  const db = await getMongoDb();
  const [snapshots, months] = await Promise.all([
    findArchiveSnapshotSummaries(db),
    db
      .collection<MonthDocument>("months")
      .find({ status: { $in: ["published", "locked"] } })
      .sort({ year: -1, month: -1 })
      .toArray(),
  ]);
  const eventGroups = await Promise.all(
    months.map((month) =>
      db
        .collection<HistoricalEventDocument>("events")
        .find({ monthId: month._id, status: { $in: ["published", "archived"] } })
        .sort({ "layout.order": 1 })
        .toArray(),
    ),
  );
  const monthSummaries = months.map((month, index) =>
    monthEventsToArchiveSummary(month, eventGroups[index] ?? []),
  );
  const snapshotSummaries = snapshots.map(snapshotToSummary);
  const bySlug = new Map<string, ArchiveSummary>();

  for (const summary of staticSummaries) {
    bySlug.set(summary.slug, summary);
  }

  for (const summary of snapshotSummaries) {
    bySlug.set(summary.slug, summary);
  }

  for (const summary of monthSummaries) {
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

    const month = await db
      .collection<MonthDocument>("months")
      .findOne({ slug, status: { $in: ["published", "locked"] } });

    if (month) {
      const events = await db
        .collection<HistoricalEventDocument>("events")
        .find({
          monthId: month._id,
          status: { $in: ["published", "archived"] },
        })
        .sort({ "layout.order": 1 })
        .toArray();

      if (events.length > 0) {
        return monthEventsToArchivedExhibition(month, events);
      }
    }
  }

  return getStaticArchivedExhibitionBySlug(slug) ?? null;
});
