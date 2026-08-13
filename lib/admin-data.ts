import { currentExhibition } from "./exhibition-data";
import { getMongoDb } from "./mongodb";
import type { EventStatus, HistoricalEventDocument, MonthDocument } from "./domain-types";

export type EditorialMonthSummary = {
  slug: string;
  title: string;
  description: string;
  status: MonthDocument["status"];
  eventCount: number;
  sourceCount: number;
  needsReviewCount: number;
  updatedAt: string;
};

export type EditorialOverview = {
  mongoConfigured: boolean;
  months: EditorialMonthSummary[];
  totals: {
    months: number;
    events: number;
    sources: number;
    needsReview: number;
  };
};

function staticOverview(): EditorialOverview {
  const sourceCount = currentExhibition.spaces.reduce(
    (total, event) => total + (event.sources?.length ?? 0),
    0,
  );

  return {
    mongoConfigured: false,
    months: [
      {
        slug: currentExhibition.slug,
        title: currentExhibition.monthLabel,
        description: currentExhibition.description,
        status: "published",
        eventCount: currentExhibition.spaces.length,
        sourceCount,
        needsReviewCount: 0,
        updatedAt: new Date().toISOString(),
      },
    ],
    totals: {
      months: 1,
      events: currentExhibition.spaces.length,
      sources: sourceCount,
      needsReview: 0,
    },
  };
}

export async function getEditorialOverview(): Promise<EditorialOverview> {
  if (!process.env.MONGODB_URI) {
    return staticOverview();
  }

  const db = await getMongoDb();
  const months = await db
    .collection<MonthDocument>("months")
    .find({})
    .sort({ year: -1, month: -1 })
    .toArray();

  if (months.length === 0) {
    return { ...staticOverview(), mongoConfigured: true };
  }

  const events = await db
    .collection<HistoricalEventDocument>("events")
    .find({ monthId: { $in: months.map((month) => month._id) } })
    .toArray();
  const eventsByMonth = new Map<string, HistoricalEventDocument[]>();

  for (const event of events) {
    const monthEvents = eventsByMonth.get(event.monthId) ?? [];
    monthEvents.push(event);
    eventsByMonth.set(event.monthId, monthEvents);
  }

  const needsReviewStatuses = new Set<EventStatus>([
    "draft",
    "needs_review",
    "needs_correction",
  ]);
  const summaries = months.map((month) => {
    const monthEvents = eventsByMonth.get(month._id) ?? [];
    const sourceCount = monthEvents.reduce(
      (total, event) => total + event.sources.length,
      0,
    );
    const needsReviewCount = monthEvents.filter((event) =>
      needsReviewStatuses.has(event.status),
    ).length;

    return {
      slug: month.slug,
      title: month.title,
      description: month.description,
      status: month.status,
      eventCount: monthEvents.length,
      sourceCount,
      needsReviewCount,
      updatedAt: month.updatedAt,
    };
  });

  return {
    mongoConfigured: true,
    months: summaries,
    totals: {
      months: summaries.length,
      events: events.length,
      sources: summaries.reduce((total, month) => total + month.sourceCount, 0),
      needsReview: summaries.reduce(
        (total, month) => total + month.needsReviewCount,
        0,
      ),
    },
  };
}
