import { describe, expect, it } from "vitest";
import {
  monthEventsToArchivedExhibition,
  monthEventsToArchiveSummary,
} from "./archive-service";
import type { HistoricalEventDocument, MonthDocument } from "./domain-types";

const month: MonthDocument = {
  _id: "1984-06",
  slug: "1984-06",
  month: 6,
  year: 1984,
  title: "June 1984",
  description: "A seeded historical archive month.",
  status: "published",
  layoutSeed: "june-1984-v1",
  createdAt: "2026-08-13T00:00:00.000Z",
  updatedAt: "2026-08-13T00:00:00.000Z",
};

const events: HistoricalEventDocument[] = [
  {
    _id: "1984-06:operation-blue-star",
    monthId: "1984-06",
    monthSlug: "1984-06",
    slug: "operation-blue-star",
    title: "Operation Blue Star",
    summary: "A defining June 1984 event.",
    context: "",
    whyItMatters: "",
    category: "Conflict",
    location: "Amritsar, India",
    countries: ["India"],
    relevanceScore: 100,
    importanceLevel: "featured",
    tileSize: "featured",
    status: "published",
    detailMarkdown: "",
    sources: [
      {
        title: "Source A",
        url: "https://example.com/a",
        sourceType: "encyclopedia",
      },
      {
        title: "Source B",
        url: "https://example.com/b",
        sourceType: "archive",
      },
    ],
    layout: { order: 0 },
    createdAt: "2026-08-13T00:00:00.000Z",
    updatedAt: "2026-08-13T00:00:00.000Z",
  },
];

describe("seeded month archive mapping", () => {
  it("summarizes seeded month events for archive cards", () => {
    const summary = monthEventsToArchiveSummary(month, events);

    expect(summary.slug).toBe("1984-06");
    expect(summary.monthLabel).toBe("June 1984");
    expect(summary.publishedCount).toBe(1);
    expect(summary.stats).toContainEqual({ value: "2", label: "sources" });
  });

  it("renders seeded month events as archived wall snapshots", () => {
    const exhibition = monthEventsToArchivedExhibition(month, events);

    expect(exhibition.status).toBe("archived");
    expect(exhibition.reviewNote).toBe("Published historical month");
    expect(exhibition.spaces).toHaveLength(1);
    expect(exhibition.spaces[0]?.title).toBe("Operation Blue Star");
  });
});
