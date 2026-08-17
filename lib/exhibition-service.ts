import { cache } from "react";
import {
  currentExhibition,
  type EventImportanceLevel,
  type Exhibition,
  type ExhibitionSpace,
  type SpaceSize,
} from "./exhibition-data";
import type { HistoricalEventDocument, MonthDocument } from "./domain-types";
import { getMongoDb } from "./mongodb";

const monthNameFormatter = new Intl.DateTimeFormat("en", {
  month: "long",
  timeZone: "UTC",
});

const categoryVisualClasses = [
  "bg-[#171411] text-[#f8f1df]",
  "bg-[#d8d1bd] text-[#171411]",
  "bg-[#c9d7f1] text-[#171411]",
  "bg-[#bcc9cb] text-[#171411]",
  "bg-[#aec6b4] text-[#171411]",
  "bg-[#e8b9a7] text-[#171411]",
  "bg-[#ead6e8] text-[#171411]",
  "bg-[#d6e7dc] text-[#171411]",
  "bg-[#f5e0bd] text-[#171411]",
  "bg-[#f2d0c0] text-[#171411]",
  "bg-[#ece8dd] text-[#171411]",
  "bg-[#f4f1ea] text-[#171411]",
];

export function monthLabel(month: MonthDocument) {
  const date = new Date(Date.UTC(month.year, month.month - 1, 1));
  return `${monthNameFormatter.format(date)} ${month.year}`;
}

function categoryClass(category: string) {
  let hash = 0;

  for (const character of category) {
    hash = (hash + character.charCodeAt(0)) % categoryVisualClasses.length;
  }

  return categoryVisualClasses[hash];
}

function eventMedium(event: HistoricalEventDocument) {
  if (event.dateRange) {
    return `${event.dateRange.start} - ${event.dateRange.end}`;
  }

  return event.date ?? "Date unknown";
}

function eventMediaPreview(event: HistoricalEventDocument): ExhibitionSpace["mediaPreview"] {
  if (!event.media) {
    return {
      alt: `${event.category} visual marker for ${event.title}.`,
      caption: event.title,
      shape: "square",
      pattern: "blocks",
      background: "#f4f1ea",
      foreground: "#171411",
      marks: ["0.45", "0.86", "0.62", "0.74"],
    };
  }

  return {
    alt: event.media.alt,
    caption: event.media.caption ?? event.title,
    shape: event.media.kind === "video" ? "cinematic" : "square",
    pattern: "frames",
    background: "#f4f1ea",
    foreground: "#171411",
    marks: ["0%", "18%", "8%"],
    mediaUrl: event.media.url,
    mediaAlt: event.media.alt,
  };
}

function statusForImportance(importanceLevel: EventImportanceLevel) {
  return importanceLevel === "featured" ? "featured" : "occupied";
}

function eventToSpace(event: HistoricalEventDocument): ExhibitionSpace {
  return {
    id: event._id,
    eventDetailHref: `/events/${event._id}`,
    title: event.title,
    creator: event.location || event.countries.join(", ") || event.monthSlug,
    status: statusForImportance(event.importanceLevel),
    size: event.tileSize as SpaceSize,
    className: categoryClass(event.category),
    category: event.category,
    medium: eventMedium(event),
    description: event.summary,
    externalUrl: event.sources[0]?.url,
    mediaPreview: eventMediaPreview(event),
    date: event.date,
    dateRange: event.dateRange,
    location: event.location,
    countries: event.countries,
    importanceLevel: event.importanceLevel,
    context: event.context,
    whyItMatters: event.whyItMatters,
    detailMarkdown: event.detailMarkdown,
    sources: event.sources.map((source) => ({
      title: source.title,
      url: source.url,
      publisher: source.publisher,
      sourceType: source.sourceType,
    })),
  };
}

export function monthEventsToExhibition(
  month: MonthDocument,
  events: HistoricalEventDocument[],
): Exhibition {
  const publishedEvents = events
    .filter((event) => event.status === "published" || event.status === "archived")
    .sort((a, b) => a.layout.order - b.layout.order);
  const countries = new Set(publishedEvents.flatMap((event) => event.countries));
  const categories = new Set(publishedEvents.map((event) => event.category));

  return {
    slug: month.slug,
    title: month.title || "Month in History Wall",
    monthLabel: monthLabel(month),
    templateLabel: `Seeded wall ${month.slug}`,
    reviewNote: "Published editorial snapshot / sources attached",
    tagline: month.title || monthLabel(month),
    description: month.description,
    stats: [
      { value: String(publishedEvents.length), label: "events" },
      { value: String(categories.size), label: "categories" },
      { value: String(countries.size), label: "countries" },
      { value: "1", label: "monthly wall" },
    ],
    spaces: publishedEvents.map(eventToSpace),
    status: month.status === "locked" ? "archived" : "current",
    theme: month.description ? "Seeded history wall" : undefined,
  };
}

export type PublishedEventDetail = {
  exhibition: Exhibition;
  event: ExhibitionSpace;
  publishedEvents: ExhibitionSpace[];
  currentIndex: number;
};

export function monthEventsToPublishedEventDetail(
  month: MonthDocument,
  events: HistoricalEventDocument[],
  eventId: string,
): PublishedEventDetail | null {
  const exhibition = monthEventsToExhibition(month, events);
  const publishedEvents = getPublishedSpaces(exhibition);
  const currentIndex = publishedEvents.findIndex((event) => event.id === eventId);

  if (currentIndex < 0) {
    return null;
  }

  return {
    exhibition,
    event: publishedEvents[currentIndex],
    publishedEvents,
    currentIndex,
  };
}

export async function getCurrentExhibition(): Promise<Exhibition> {
  if (!process.env.MONGODB_URI) {
    return currentExhibition;
  }

  const db = await getMongoDb();
  const month = await db
    .collection<MonthDocument>("months")
    .find({ status: "published" })
    .sort({ year: -1, month: -1 })
    .limit(1)
    .next();

  if (!month) {
    return currentExhibition;
  }

  const events = await db
    .collection<HistoricalEventDocument>("events")
    .find({ monthId: month._id, status: "published" })
    .sort({ "layout.order": 1 })
    .toArray();

  if (events.length === 0) {
    return currentExhibition;
  }

  return monthEventsToExhibition(month, events);
}

export const getPublishedEventDetailById = cache(async function getPublishedEventDetailById(
  eventId: string,
): Promise<PublishedEventDetail | null> {
  if (process.env.MONGODB_URI) {
    const db = await getMongoDb();
    const event = await db.collection<HistoricalEventDocument>("events").findOne({
      _id: eventId,
      status: { $in: ["published", "archived"] },
    });

    if (event) {
      const month = await db.collection<MonthDocument>("months").findOne({
        _id: event.monthId,
        status: { $in: ["published", "locked"] },
      });

      if (month) {
        const events = await db
          .collection<HistoricalEventDocument>("events")
          .find({
            monthId: month._id,
            status: { $in: ["published", "archived"] },
          })
          .sort({ "layout.order": 1 })
          .toArray();

        const detail = monthEventsToPublishedEventDetail(month, events, eventId);

        if (detail) {
          return detail;
        }
      }
    }
  }

  return getStaticEventDetail(eventId);
});

function getStaticEventDetail(eventId: string): PublishedEventDetail | null {
  const publishedEvents = getPublishedSpaces(currentExhibition);
  const currentIndex = publishedEvents.findIndex((event) => event.id === eventId);

  if (currentIndex < 0) {
    return null;
  }

  return {
    exhibition: currentExhibition,
    event: publishedEvents[currentIndex],
    publishedEvents,
    currentIndex,
  };
}

export function getPublishedSpaces(exhibition: Exhibition) {
  return exhibition.spaces.filter(
    (space) => space.status === "occupied" || space.status === "featured",
  );
}

export function getSpaceById(exhibition: Exhibition, spaceId: string) {
  return exhibition.spaces.find((space) => space.id === spaceId);
}
