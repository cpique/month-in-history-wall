import { cache } from "react";
import {
  archivedExhibitions,
  currentExhibition,
  type ExhibitionSpace,
} from "./exhibition-data";
import { getMongoDb } from "./mongodb";
import type {
  CorrectionRequestDocument,
  EventStatus,
  HistoricalEventDocument,
  MonthDocument,
} from "./domain-types";

export type AdminEventDetail = {
  id: string;
  monthSlug: string;
  monthLabel: string;
  title: string;
  summary: string;
  context: string;
  whyItMatters: string;
  detailMarkdown: string;
  category: string;
  status: EventStatus;
  importanceLevel: string;
  tileSize: string;
  date?: string;
  dateRange?: { start: string; end: string };
  location: string;
  countries: string[];
  sources: HistoricalEventDocument["sources"];
  media?: HistoricalEventDocument["media"];
  layoutOrder: number;
  correctionRequests: CorrectionRequestDocument[];
};

function eventToAdminEventDetail(
  event: HistoricalEventDocument,
  month: MonthDocument,
  correctionRequests: CorrectionRequestDocument[],
): AdminEventDetail {
  return {
    id: event._id,
    monthSlug: month.slug,
    monthLabel: `${new Intl.DateTimeFormat("en", { month: "long", timeZone: "UTC" }).format(new Date(Date.UTC(month.year, month.month - 1, 1)))} ${month.year}`,
    title: event.title,
    summary: event.summary,
    context: event.context,
    whyItMatters: event.whyItMatters,
    detailMarkdown: event.detailMarkdown,
    category: event.category,
    status: event.status,
    importanceLevel: event.importanceLevel,
    tileSize: event.tileSize,
    date: event.date,
    dateRange: event.dateRange,
    location: event.location,
    countries: event.countries,
    sources: event.sources,
    media: event.media,
    layoutOrder: event.layout.order,
    correctionRequests,
  };
}

async function getMongoEventDetail(
  eventId: string,
): Promise<AdminEventDetail | null> {
  const db = await getMongoDb();
  const event = await db
    .collection<HistoricalEventDocument>("events")
    .findOne({ _id: eventId });

  if (!event) {
    return null;
  }

  const month = await db
    .collection<MonthDocument>("months")
    .findOne({ _id: event.monthId });

  if (!month) {
    return null;
  }

  const correctionRequests = await db
    .collection<CorrectionRequestDocument>("correctionRequests")
    .find({ eventId })
    .sort({ createdAt: -1 })
    .toArray();

  return eventToAdminEventDetail(event, month, correctionRequests);
}

function spaceToAdminEventDetail(
  space: ExhibitionSpace,
  exhibition: (typeof currentExhibition) | (typeof archivedExhibitions)[number],
): AdminEventDetail {
  return {
    id: space.id,
    monthSlug: exhibition.slug,
    monthLabel: exhibition.monthLabel,
    title: space.title,
    summary: space.description,
    context: space.context ?? "",
    whyItMatters: space.whyItMatters ?? "",
    detailMarkdown: space.detailMarkdown ?? "",
    category: space.category,
    status:
      space.status === "featured" || space.status === "occupied"
        ? "published"
        : "draft",
    importanceLevel: space.importanceLevel ?? space.size,
    tileSize: space.size,
    date: space.date,
    dateRange: space.dateRange,
    location: space.location ?? "",
    countries: space.countries ?? [],
    sources:
      space.sources?.map((source) => ({
        title: source.title,
        url: source.url,
        publisher: source.publisher,
        sourceType: source.sourceType,
      })) ?? [],
    media: undefined,
    layoutOrder: 0,
    correctionRequests: [],
  };
}

function getStaticEventDetail(eventId: string): AdminEventDetail | null {
  const exhibitions = [currentExhibition, ...archivedExhibitions];

  for (const exhibition of exhibitions) {
    const space = exhibition.spaces.find((item) => item.id === eventId);

    if (space) {
      return spaceToAdminEventDetail(space, exhibition);
    }
  }

  return null;
}

export const getAdminEventDetail = cache(async function getAdminEventDetail(
  eventId: string,
): Promise<AdminEventDetail | null> {
  if (!process.env.MONGODB_URI) {
    return getStaticEventDetail(eventId);
  }

  try {
    const detail = await getMongoEventDetail(eventId);

    if (detail) {
      return detail;
    }
  } catch {
    return getStaticEventDetail(eventId);
  }

  return getStaticEventDetail(eventId);
});
