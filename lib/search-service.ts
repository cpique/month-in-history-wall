import { cache } from "react";
import {
  archivedExhibitions,
  currentExhibition,
  type ExhibitionSpace,
} from "./exhibition-data";
import { monthLabel } from "./exhibition-service";
import { getMongoDb } from "./mongodb";
import type { HistoricalEventDocument, MonthDocument } from "./domain-types";

export type SearchResultEvent = {
  id: string;
  title: string;
  summary: string;
  category: string;
  date?: string;
  location: string;
  countries: string[];
  monthSlug: string;
  monthLabel: string;
  importanceLevel?: string;
};

function normalizeQuery(query: string) {
  return query.trim().toLowerCase();
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function spaceToSearchResult(
  space: ExhibitionSpace,
  monthSlug: string,
  monthLabelValue: string,
): SearchResultEvent {
  return {
    id: space.id,
    title: space.title,
    summary: space.description,
    category: space.category,
    date: space.date,
    location: space.creator,
    countries: space.countries ?? [],
    monthSlug,
    monthLabel: monthLabelValue,
    importanceLevel: space.importanceLevel,
  };
}

function searchStaticEvents(normalized: string): SearchResultEvent[] {
  const exhibitions = [currentExhibition, ...archivedExhibitions];
  const results: SearchResultEvent[] = [];

  for (const exhibition of exhibitions) {
    for (const space of exhibition.spaces) {
      if (space.status !== "occupied" && space.status !== "featured") {
        continue;
      }

      const haystack = [
        space.title,
        space.description,
        space.context,
        space.whyItMatters,
        space.category,
        space.medium,
        space.location,
        ...(space.countries ?? []),
      ]
        .filter((value) => typeof value === "string" && value.length > 0)
        .join(" ")
        .toLowerCase();

      if (haystack.includes(normalized)) {
        results.push(spaceToSearchResult(space, exhibition.slug, exhibition.monthLabel));
      }
    }
  }

  return results;
}

async function searchMongoEvents(normalized: string): Promise<SearchResultEvent[]> {
  const db = await getMongoDb();
  const regex = new RegExp(escapeRegex(normalized), "i");
  const events = await db
    .collection<HistoricalEventDocument>("events")
    .find({
      status: { $in: ["published", "archived"] },
      $or: [
        { title: regex },
        { summary: regex },
        { context: regex },
        { whyItMatters: regex },
        { category: regex },
        { location: regex },
        { countries: regex },
        { date: regex },
      ],
    })
    .sort({ monthSlug: -1, "layout.order": 1 })
    .toArray();

  if (events.length === 0) {
    return [];
  }

  const monthIds = [...new Set(events.map((event) => event.monthId))];
  const months = await db
    .collection<MonthDocument>("months")
    .find({ _id: { $in: monthIds } })
    .toArray();
  const monthById = new Map(months.map((month) => [month._id, month]));

  return events.map((event) => {
    const month = monthById.get(event.monthId);

    return {
      id: event._id,
      title: event.title,
      summary: event.summary,
      category: event.category,
      date: event.date,
      location: event.location,
      countries: event.countries,
      monthSlug: event.monthSlug,
      monthLabel: month ? monthLabel(month) : event.monthSlug,
      importanceLevel: event.importanceLevel,
    };
  });
}

export const searchPublishedEvents = cache(async function searchPublishedEvents(
  query: string,
): Promise<SearchResultEvent[]> {
  const normalized = normalizeQuery(query);

  if (normalized.length === 0) {
    return [];
  }

  if (!process.env.MONGODB_URI) {
    return searchStaticEvents(normalized);
  }

  try {
    return await searchMongoEvents(normalized);
  } catch {
    return searchStaticEvents(normalized);
  }
});
