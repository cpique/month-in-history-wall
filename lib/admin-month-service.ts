import { cache } from "react";
import {
  archivedExhibitions,
  currentExhibition,
  type ExhibitionSpace,
} from "./exhibition-data";
import { monthLabel } from "./exhibition-service";
import { getMongoDb } from "./mongodb";
import type {
  EventStatus,
  HistoricalEventDocument,
  MonthDocument,
} from "./domain-types";

export type AdminMonthEvent = {
  id: string;
  title: string;
  summary: string;
  category: string;
  status: EventStatus;
  importanceLevel: string;
  date?: string;
  sourceCount: number;
};

export type AdminMonthDetail = {
  slug: string;
  title: string;
  description: string;
  status: MonthDocument["status"];
  monthLabel: string;
  eventCount: number;
  publishedCount: number;
  needsReviewCount: number;
  sourceCount: number;
  events: AdminMonthEvent[];
};

const needsReviewStatuses = new Set<EventStatus>([
  "draft",
  "needs_review",
  "needs_correction",
]);

function eventToAdminEvent(event: HistoricalEventDocument): AdminMonthEvent {
  return {
    id: event._id,
    title: event.title,
    summary: event.summary,
    category: event.category,
    status: event.status,
    importanceLevel: event.importanceLevel,
    date: event.date,
    sourceCount: event.sources.length,
  };
}

async function getMongoMonthDetail(slug: string): Promise<AdminMonthDetail | null> {
  const db = await getMongoDb();
  const month = await db.collection<MonthDocument>("months").findOne({ slug });

  if (!month) {
    return null;
  }

  const events = await db
    .collection<HistoricalEventDocument>("events")
    .find({ monthId: month._id })
    .sort({ "layout.order": 1 })
    .toArray();

  const publishedCount = events.filter(
    (event) => event.status === "published" || event.status === "archived",
  ).length;
  const needsReviewCount = events.filter((event) =>
    needsReviewStatuses.has(event.status),
  ).length;
  const sourceCount = events.reduce(
    (total, event) => total + event.sources.length,
    0,
  );

  return {
    slug: month.slug,
    title: month.title,
    description: month.description,
    status: month.status,
    monthLabel: monthLabel(month),
    eventCount: events.length,
    publishedCount,
    needsReviewCount,
    sourceCount,
    events: events.map(eventToAdminEvent),
  };
}

function spaceToAdminEvent(space: ExhibitionSpace): AdminMonthEvent {
  return {
    id: space.id,
    title: space.title,
    summary: space.description,
    category: space.category,
    status:
      space.status === "featured" || space.status === "occupied"
        ? "published"
        : "draft",
    importanceLevel: space.importanceLevel ?? space.size,
    date: space.date,
    sourceCount: space.sources?.length ?? 0,
  };
}

function getStaticMonthDetail(slug: string): AdminMonthDetail | null {
  const exhibition =
    slug === currentExhibition.slug
      ? currentExhibition
      : archivedExhibitions.find((item) => item.slug === slug);

  if (!exhibition) {
    return null;
  }

  const events = exhibition.spaces.map(spaceToAdminEvent);
  const publishedCount = events.filter(
    (event) => event.status === "published",
  ).length;
  const sourceCount = events.reduce(
    (total, event) => total + event.sourceCount,
    0,
  );

  return {
    slug: exhibition.slug,
    title: exhibition.title,
    description: exhibition.description,
    status: exhibition.status === "archived" ? "locked" : "published",
    monthLabel: exhibition.monthLabel,
    eventCount: events.length,
    publishedCount,
    needsReviewCount: 0,
    sourceCount,
    events,
  };
}

export const getAdminMonthDetail = cache(async function getAdminMonthDetail(
  slug: string,
): Promise<AdminMonthDetail | null> {
  if (!process.env.MONGODB_URI) {
    return getStaticMonthDetail(slug);
  }

  try {
    const detail = await getMongoMonthDetail(slug);

    if (detail) {
      return detail;
    }
  } catch {
    return getStaticMonthDetail(slug);
  }

  return getStaticMonthDetail(slug);
});
