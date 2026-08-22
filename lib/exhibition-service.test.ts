import { describe, expect, it } from "vitest";
import {
  monthEventsToExhibition,
  monthEventsToPublishedEventDetail,
} from "./exhibition-service";
import type { HistoricalEventDocument, MonthDocument } from "./domain-types";

const month: MonthDocument = {
  _id: "1984-06",
  slug: "1984-06",
  month: 6,
  year: 1984,
  title: "June 1984",
  description: "Seeded history wall.",
  status: "published",
  layoutSeed: "june-1984-v1",
  createdAt: "2026-08-13T00:00:00.000Z",
  updatedAt: "2026-08-13T00:00:00.000Z",
};

const events: HistoricalEventDocument[] = [
  {
    _id: "1984-06:later",
    monthId: "1984-06",
    monthSlug: "1984-06",
    slug: "later",
    title: "Later event",
    summary: "A later layout event.",
    context: "Context",
    whyItMatters: "Why",
    category: "Technology",
    date: "1984-06-02",
    location: "Moscow, Soviet Union",
    countries: ["Soviet Union"],
    relevanceScore: 70,
    importanceLevel: "major",
    tileSize: "large",
    status: "published",
    detailMarkdown: "Detail",
    sources: [
      {
        title: "Source",
        url: "https://example.com/source",
        publisher: "Example",
        sourceType: "official",
      },
    ],
    layout: { order: 2 },
    createdAt: "2026-08-13T00:00:00.000Z",
    updatedAt: "2026-08-13T00:00:00.000Z",
  },
  {
    _id: "1984-06:first",
    monthId: "1984-06",
    monthSlug: "1984-06",
    slug: "first",
    title: "First event",
    summary: "A first layout event.",
    context: "",
    whyItMatters: "",
    category: "Conflict",
    dateRange: {
      start: "1984-06-01",
      end: "1984-06-08",
    },
    location: "Amritsar, India",
    countries: ["India"],
    relevanceScore: 100,
    importanceLevel: "featured",
    tileSize: "featured",
    status: "published",
    media: {
      kind: "image",
      url: "https://example.com/image.jpg",
      alt: "Image alt text.",
    },
    detailMarkdown: "",
    sources: [
      {
        title: "Source",
        url: "https://example.com/first",
        sourceType: "encyclopedia",
      },
    ],
    layout: { order: 1 },
    createdAt: "2026-08-13T00:00:00.000Z",
    updatedAt: "2026-08-13T00:00:00.000Z",
  },
];

describe("month event exhibition mapping", () => {
  it("turns seeded MongoDB month events into the public wall model", () => {
    const exhibition = monthEventsToExhibition(month, events);

    expect(exhibition.slug).toBe("1984-06");
    expect(exhibition.monthLabel).toBe("June 1984");
    expect(exhibition.spaces.map((space) => space.id)).toEqual([
      "1984-06:first",
      "1984-06:later",
    ]);
    expect(exhibition.spaces[0]?.status).toBe("featured");
    expect(exhibition.spaces[1]?.status).toBe("occupied");
    expect(exhibition.spaces[1]?.context).toBe("Context");
    expect(exhibition.stats).toContainEqual({ value: "2", label: "events" });
  });

  it("builds event detail context from any published month event", () => {
    const detail = monthEventsToPublishedEventDetail(
      month,
      events,
      "1984-06:later",
    );

    expect(detail?.event.title).toBe("Later event");
    expect(detail?.exhibition.slug).toBe("1984-06");
    expect(detail?.currentIndex).toBe(1);
    expect(detail?.publishedEvents.map((event) => event.id)).toEqual([
      "1984-06:first",
      "1984-06:later",
    ]);
  });

  it("does not expose draft events in public event detail context", () => {
    const detail = monthEventsToPublishedEventDetail(
      month,
      [
        ...events,
        {
          ...events[0],
          _id: "1984-06:draft",
          slug: "draft",
          title: "Draft event",
          status: "draft",
          layout: { order: 0 },
        },
      ],
      "1984-06:draft",
    );

    expect(detail).toBeNull();
  });

  it("excludes current, previous, and next events from related events", () => {
    const thirdEvent: HistoricalEventDocument = {
      ...events[0],
      _id: "1984-06:third",
      slug: "third",
      title: "Third event",
      category: "Culture",
      importanceLevel: "notable",
      tileSize: "medium",
      layout: { order: 3 },
    };

    const detail = monthEventsToPublishedEventDetail(
      month,
      [...events, thirdEvent],
      "1984-06:first",
    );

    expect(detail?.relatedEvents.map((event) => event.id)).toEqual([
      "1984-06:third",
    ]);
  });

  it("prefers same-category events when selecting related events", () => {
    const relatedEvents: HistoricalEventDocument[] = [
      {
        ...events[0],
        _id: "1984-06:same-category",
        slug: "same-category",
        title: "Same category event",
        category: "Conflict",
        importanceLevel: "notable",
        tileSize: "medium",
        layout: { order: 3 },
      },
      {
        ...events[0],
        _id: "1984-06:other-category",
        slug: "other-category",
        title: "Other category event",
        category: "Technology",
        importanceLevel: "featured",
        tileSize: "featured",
        layout: { order: 4 },
      },
    ];

    const detail = monthEventsToPublishedEventDetail(
      month,
      [...events, ...relatedEvents],
      "1984-06:first",
    );

    const relatedIds = detail?.relatedEvents.map((event) => event.id);
    expect(relatedIds?.[0]).toBe("1984-06:same-category");
    expect(relatedIds).toContain("1984-06:other-category");
  });
});
