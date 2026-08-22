import { cache } from "react";
import {
  archivedExhibitions,
  currentExhibition,
} from "./exhibition-data";
import { getMongoDb } from "./mongodb";
import type {
  EventSourceDocument,
  HistoricalEventDocument,
  MonthDocument,
} from "./domain-types";

export type AdminSourceSummary = {
  totalSourceCount: number;
  eventsWithSources: number;
  eventsWithoutSources: number;
  byType: Record<EventSourceDocument["sourceType"], number>;
};

export type AdminSourceItem = {
  eventId: string;
  monthSlug: string;
  monthLabel: string;
  eventTitle: string;
  eventStatus: HistoricalEventDocument["status"];
  source: EventSourceDocument;
};

export type AdminSourceReview = {
  summary: AdminSourceSummary;
  sources: AdminSourceItem[];
  eventsWithoutSources: {
    id: string;
    monthSlug: string;
    monthLabel: string;
    title: string;
    status: HistoricalEventDocument["status"];
  }[];
};

const sourceTypeOrder: EventSourceDocument["sourceType"][] = [
  "encyclopedia",
  "archive",
  "official",
  "news",
  "academic",
  "reference",
  "other",
];

function emptyTypeCounts(): Record<EventSourceDocument["sourceType"], number> {
  return {
    encyclopedia: 0,
    archive: 0,
    official: 0,
    news: 0,
    academic: 0,
    reference: 0,
    other: 0,
  };
}

async function getMongoSourceReview(): Promise<AdminSourceReview> {
  const db = await getMongoDb();
  const [months, events] = await Promise.all([
    db.collection<MonthDocument>("months").find({}).toArray(),
    db
      .collection<HistoricalEventDocument>("events")
      .find({})
      .sort({ "layout.order": 1 })
      .toArray(),
  ]);

  const monthById = new Map(months.map((month) => [month._id, month]));
  const typeCounts = emptyTypeCounts();
  let totalSourceCount = 0;
  const sources: AdminSourceItem[] = [];
  const eventsWithoutSources: AdminSourceReview["eventsWithoutSources"] = [];
  let eventsWithSources = 0;

  for (const event of events) {
    const month = monthById.get(event.monthId);
    const monthLabel = month
      ? `${new Intl.DateTimeFormat("en", { month: "long", timeZone: "UTC" }).format(
          new Date(Date.UTC(month.year, month.month - 1, 1)),
        )} ${month.year}`
      : event.monthSlug;
    const monthSlug = month?.slug ?? event.monthSlug;

    if (event.sources.length === 0) {
      eventsWithoutSources.push({
        id: event._id,
        monthSlug,
        monthLabel,
        title: event.title,
        status: event.status,
      });
    } else {
      eventsWithSources += 1;
    }

    for (const source of event.sources) {
      totalSourceCount += 1;
      typeCounts[source.sourceType] = (typeCounts[source.sourceType] ?? 0) + 1;
      sources.push({
        eventId: event._id,
        monthSlug,
        monthLabel,
        eventTitle: event.title,
        eventStatus: event.status,
        source,
      });
    }
  }

  return {
    summary: {
      totalSourceCount,
      eventsWithSources,
      eventsWithoutSources: eventsWithoutSources.length,
      byType: typeCounts,
    },
    sources: sources.sort(
      (a, b) =>
        sourceTypeOrder.indexOf(a.source.sourceType) -
          sourceTypeOrder.indexOf(b.source.sourceType) ||
        a.eventTitle.localeCompare(b.eventTitle),
    ),
    eventsWithoutSources,
  };
}

function getStaticSourceReview(): AdminSourceReview {
  const exhibitions = [currentExhibition, ...archivedExhibitions];
  const typeCounts = emptyTypeCounts();
  let totalSourceCount = 0;
  const sources: AdminSourceItem[] = [];
  const eventsWithoutSources: AdminSourceReview["eventsWithoutSources"] = [];
  let eventsWithSources = 0;

  for (const exhibition of exhibitions) {
    for (const space of exhibition.spaces) {
      const spaceSources = space.sources ?? [];

      if (spaceSources.length === 0) {
        eventsWithoutSources.push({
          id: space.id,
          monthSlug: exhibition.slug,
          monthLabel: exhibition.monthLabel,
          title: space.title,
          status:
            space.status === "featured" || space.status === "occupied"
              ? "published"
              : "draft",
        });
      } else {
        eventsWithSources += 1;
      }

      for (const source of spaceSources) {
        totalSourceCount += 1;
        const sourceType = source.sourceType ?? "other";
        typeCounts[sourceType] = (typeCounts[sourceType] ?? 0) + 1;
        sources.push({
          eventId: space.id,
          monthSlug: exhibition.slug,
          monthLabel: exhibition.monthLabel,
          eventTitle: space.title,
          eventStatus:
            space.status === "featured" || space.status === "occupied"
              ? "published"
              : "draft",
          source: {
            title: source.title,
            url: source.url,
            sourceType,
            publisher: source.publisher,
          },
        });
      }
    }
  }

  return {
    summary: {
      totalSourceCount,
      eventsWithSources,
      eventsWithoutSources: eventsWithoutSources.length,
      byType: typeCounts,
    },
    sources: sources.sort(
      (a, b) =>
        sourceTypeOrder.indexOf(a.source.sourceType) -
          sourceTypeOrder.indexOf(b.source.sourceType) ||
        a.eventTitle.localeCompare(b.eventTitle),
    ),
    eventsWithoutSources,
  };
}

export const getAdminSourceReview = cache(async function getAdminSourceReview(): Promise<AdminSourceReview> {
  if (!process.env.MONGODB_URI) {
    return getStaticSourceReview();
  }

  try {
    return await getMongoSourceReview();
  } catch {
    return getStaticSourceReview();
  }
});
