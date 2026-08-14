import { describe, expect, it } from "vitest";
import { buildEditorialAnalyticsSummary } from "./analytics-service";
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

function event(
  id: string,
  overrides: Partial<HistoricalEventDocument> = {},
): HistoricalEventDocument {
  return {
    _id: id,
    monthId: "1984-06",
    monthSlug: "1984-06",
    slug: id,
    title: id,
    summary: "Summary",
    context: "Context",
    whyItMatters: "Why",
    category: "Conflict",
    location: "Global",
    countries: [],
    relevanceScore: 50,
    importanceLevel: "notable",
    tileSize: "medium",
    status: "published",
    detailMarkdown: "Detail",
    sources: [
      {
        title: "Source",
        url: "https://example.com/source",
        sourceType: "reference",
      },
    ],
    layout: { order: 1 },
    createdAt: "2026-08-13T00:00:00.000Z",
    updatedAt: "2026-08-13T00:00:00.000Z",
    ...overrides,
  };
}

describe("editorial analytics summary", () => {
  it("summarizes imported month coverage and review needs", () => {
    const summary = buildEditorialAnalyticsSummary(
      [month],
      [
        event("published-event", {
          category: "Culture",
          media: {
            kind: "image",
            url: "https://example.com/image.jpg",
            alt: "Image.",
          },
          sources: [
            {
              title: "Source A",
              url: "https://example.com/a",
              sourceType: "news",
            },
            {
              title: "Source B",
              url: "https://example.com/b",
              sourceType: "archive",
            },
          ],
        }),
        event("draft-event", {
          category: "Culture",
          relevanceScore: 90,
          status: "needs_review",
        }),
      ],
      true,
    );

    expect(summary.mongoConfigured).toBe(true);
    expect(summary.totals).toMatchObject({
      months: 1,
      events: 2,
      publishedEvents: 1,
      needsReview: 1,
      sources: 3,
      media: 1,
      averageSourcesPerEvent: 1.5,
    });
    expect(summary.categories).toEqual([
      { category: "Culture", count: 2, publishedCount: 1 },
    ]);
    expect(summary.monthCoverage[0]).toMatchObject({
      slug: "1984-06",
      eventCount: 2,
      publishedCount: 1,
      sourceCount: 3,
      needsReviewCount: 1,
      mediaCount: 1,
    });
    expect(summary.reviewQueue[0]).toMatchObject({
      id: "draft-event",
      status: "needs_review",
      relevanceScore: 90,
    });
  });
});
