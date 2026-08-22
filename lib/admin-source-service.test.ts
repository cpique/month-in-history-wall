import { describe, expect, it } from "vitest";
import { getAdminSourceReview } from "./admin-source-service";

describe("admin source review", () => {
  it("returns a summary with totals for static data", async () => {
    const review = await getAdminSourceReview();

    expect(review.summary.totalSourceCount).toBeGreaterThan(0);
    expect(review.summary.eventsWithSources).toBeGreaterThan(0);
    expect(review.sources.length).toBe(review.summary.totalSourceCount);
  });

  it("counts sources by type", async () => {
    const review = await getAdminSourceReview();
    const totalByType = Object.values(review.summary.byType).reduce(
      (sum, count) => sum + count,
      0,
    );

    expect(totalByType).toBe(review.summary.totalSourceCount);
  });

  it("includes event and month metadata on each source item", async () => {
    const review = await getAdminSourceReview();
    const first = review.sources[0];

    expect(first.eventId).toBeTruthy();
    expect(first.eventTitle).toBeTruthy();
    expect(first.monthSlug).toBeTruthy();
    expect(first.monthLabel).toBeTruthy();
    expect(first.source.title).toBeTruthy();
    expect(first.source.url).toBeTruthy();
    expect(first.source.sourceType).toBeTruthy();
  });

  it("lists events without sources separately", async () => {
    const review = await getAdminSourceReview();
    const totalEvents =
      review.summary.eventsWithSources + review.summary.eventsWithoutSources;

    expect(totalEvents).toBeGreaterThan(0);
    expect(review.eventsWithoutSources.length).toBe(
      review.summary.eventsWithoutSources,
    );
  });
});
