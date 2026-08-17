import { describe, expect, it } from "vitest";
import { getMonthLockBlocker } from "./month-lock";

describe("month lock readiness", () => {
  it("allows a fully published month with events to lock", () => {
    expect(
      getMonthLockBlocker({
        status: "published",
        eventCount: 3,
        publishedCount: 3,
        needsReviewCount: 0,
      }),
    ).toBeNull();
  });

  it("blocks a month with unresolved editorial events", () => {
    expect(
      getMonthLockBlocker({
        status: "published",
        eventCount: 3,
        publishedCount: 2,
        needsReviewCount: 1,
      }),
    ).toMatch(/Resolve all/);
  });
});
