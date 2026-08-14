import type { HistoricalEventDocument, MonthDocument } from "./domain-types";
import { currentExhibition } from "./exhibition-data";
import { getMongoDb } from "./mongodb";

export type EditorialAnalyticsSummary = {
  mongoConfigured: boolean;
  totals: {
    months: number;
    events: number;
    publishedEvents: number;
    needsReview: number;
    lockedMonths: number;
    sources: number;
    media: number;
    averageSourcesPerEvent: number;
  };
  categories: { category: string; count: number; publishedCount: number }[];
  monthCoverage: Array<{
    slug: string;
    title: string;
    status: MonthDocument["status"];
    eventCount: number;
    publishedCount: number;
    sourceCount: number;
    needsReviewCount: number;
    mediaCount: number;
    updatedAt: string;
  }>;
  reviewQueue: Array<{
    id: string;
    monthSlug: string;
    title: string;
    status: HistoricalEventDocument["status"];
    sourceCount: number;
    relevanceScore: number;
    updatedAt: string;
  }>;
};

const needsReviewStatuses = new Set<HistoricalEventDocument["status"]>([
  "draft",
  "needs_review",
  "needs_correction",
]);
const staticUpdatedAt = "2026-08-13T00:00:00.000Z";
const fallbackRelevanceByImportance = {
  featured: 100,
  major: 75,
  notable: 50,
  signal: 25,
} as const;

function roundToOneDecimal(value: number) {
  return Math.round(value * 10) / 10;
}

function staticAnalyticsSummary(): EditorialAnalyticsSummary {
  const events = currentExhibition.spaces.map((space) => ({
    id: space.id,
    monthSlug: currentExhibition.slug,
    title: space.title,
    status:
      space.status === "featured" || space.status === "occupied"
        ? ("published" as const)
        : ("draft" as const),
    category: space.category,
    sourceCount: space.sources?.length ?? 0,
    hasMedia: Boolean(space.mediaPreview?.mediaUrl),
    relevanceScore: space.importanceLevel
      ? fallbackRelevanceByImportance[space.importanceLevel]
      : 0,
    updatedAt: staticUpdatedAt,
  }));
  const sourceCount = events.reduce((total, event) => total + event.sourceCount, 0);
  const publishedCount = events.filter((event) => event.status === "published").length;
  const needsReviewCount = events.filter((event) =>
    needsReviewStatuses.has(event.status),
  ).length;

  return {
    mongoConfigured: false,
    totals: {
      months: 1,
      events: events.length,
      publishedEvents: publishedCount,
      needsReview: needsReviewCount,
      lockedMonths: currentExhibition.status === "archived" ? 1 : 0,
      sources: sourceCount,
      media: events.filter((event) => event.hasMedia).length,
      averageSourcesPerEvent:
        events.length > 0 ? roundToOneDecimal(sourceCount / events.length) : 0,
    },
    categories: summarizeCategories(
      events.map((event) => ({
        category: event.category,
        status: event.status,
      })),
    ),
    monthCoverage: [
      {
        slug: currentExhibition.slug,
        title: currentExhibition.monthLabel,
        status: "published",
        eventCount: events.length,
        publishedCount,
        sourceCount,
        needsReviewCount,
        mediaCount: events.filter((event) => event.hasMedia).length,
        updatedAt: staticUpdatedAt,
      },
    ],
    reviewQueue: events
      .filter((event) => needsReviewStatuses.has(event.status))
      .map((event) => ({
        id: event.id,
        monthSlug: event.monthSlug,
        title: event.title,
        status: event.status,
        sourceCount: event.sourceCount,
        relevanceScore: event.relevanceScore,
        updatedAt: event.updatedAt,
      })),
  };
}

function summarizeCategories(
  events: Array<Pick<HistoricalEventDocument, "category" | "status">>,
) {
  const counts = new Map<string, { category: string; count: number; publishedCount: number }>();

  for (const event of events) {
    const category = event.category || "Uncategorized";
    const current = counts.get(category) ?? {
      category,
      count: 0,
      publishedCount: 0,
    };

    current.count += 1;
    if (event.status === "published" || event.status === "archived") {
      current.publishedCount += 1;
    }
    counts.set(category, current);
  }

  return [...counts.values()].sort((a, b) => b.count - a.count || a.category.localeCompare(b.category));
}

export function buildEditorialAnalyticsSummary(
  months: MonthDocument[],
  events: HistoricalEventDocument[],
  mongoConfigured: boolean,
): EditorialAnalyticsSummary {
  const eventsByMonth = new Map<string, HistoricalEventDocument[]>();

  for (const event of events) {
    const monthEvents = eventsByMonth.get(event.monthId) ?? [];
    monthEvents.push(event);
    eventsByMonth.set(event.monthId, monthEvents);
  }

  const sourceCount = events.reduce((total, event) => total + event.sources.length, 0);
  const publishedCount = events.filter(
    (event) => event.status === "published" || event.status === "archived",
  ).length;
  const needsReviewCount = events.filter((event) =>
    needsReviewStatuses.has(event.status),
  ).length;

  return {
    mongoConfigured,
    totals: {
      months: months.length,
      events: events.length,
      publishedEvents: publishedCount,
      needsReview: needsReviewCount,
      lockedMonths: months.filter((month) => month.status === "locked").length,
      sources: sourceCount,
      media: events.filter((event) => Boolean(event.media?.url)).length,
      averageSourcesPerEvent:
        events.length > 0 ? roundToOneDecimal(sourceCount / events.length) : 0,
    },
    categories: summarizeCategories(events),
    monthCoverage: months.map((month) => {
      const monthEvents = eventsByMonth.get(month._id) ?? [];
      const monthSourceCount = monthEvents.reduce(
        (total, event) => total + event.sources.length,
        0,
      );

      return {
        slug: month.slug,
        title: month.title,
        status: month.status,
        eventCount: monthEvents.length,
        publishedCount: monthEvents.filter(
          (event) => event.status === "published" || event.status === "archived",
        ).length,
        sourceCount: monthSourceCount,
        needsReviewCount: monthEvents.filter((event) =>
          needsReviewStatuses.has(event.status),
        ).length,
        mediaCount: monthEvents.filter((event) => Boolean(event.media?.url)).length,
        updatedAt: month.updatedAt,
      };
    }),
    reviewQueue: events
      .filter((event) => needsReviewStatuses.has(event.status))
      .sort((a, b) => b.relevanceScore - a.relevanceScore || a.updatedAt.localeCompare(b.updatedAt))
      .slice(0, 20)
      .map((event) => ({
        id: event._id,
        monthSlug: event.monthSlug,
        title: event.title,
        status: event.status,
        sourceCount: event.sources.length,
        relevanceScore: event.relevanceScore,
        updatedAt: event.updatedAt,
      })),
  };
}

export async function getAnalyticsSummary(): Promise<EditorialAnalyticsSummary> {
  if (!process.env.MONGODB_URI) {
    return staticAnalyticsSummary();
  }

  const db = await getMongoDb();
  const months = await db
    .collection<MonthDocument>("months")
    .find({})
    .sort({ year: -1, month: -1 })
    .toArray();

  if (months.length === 0) {
    return buildEditorialAnalyticsSummary([], [], true);
  }

  const events = await db
    .collection<HistoricalEventDocument>("events")
    .find({ monthId: { $in: months.map((month) => month._id) } })
    .sort({ relevanceScore: -1, updatedAt: -1 })
    .toArray();

  return buildEditorialAnalyticsSummary(months, events, true);
}
