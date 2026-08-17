import { describe, expect, it } from "vitest";
import { getAdminMonthDetail } from "./admin-month-service";

describe("admin month detail", () => {
  it("returns null for an unknown month slug", async () => {
    const detail = await getAdminMonthDetail("0000-00");

    expect(detail).toBeNull();
  });

  it("returns the static June 1984 month detail with published events", async () => {
    const detail = await getAdminMonthDetail("1984-06");

    expect(detail).not.toBeNull();
    expect(detail?.slug).toBe("1984-06");
    expect(detail?.monthLabel).toBe("June 1984");
    expect(detail?.status).toBe("published");
    expect(detail?.eventCount).toBeGreaterThan(0);
    expect(detail?.publishedCount).toBe(detail?.eventCount);
    expect(detail?.needsReviewCount).toBe(0);
    expect(detail?.events[0]?.title).toBeTruthy();
    expect(detail?.events[0]?.status).toBe("published");
  });

  it("includes source counts per event", async () => {
    const detail = await getAdminMonthDetail("1984-06");
    const totalSources = detail?.events.reduce(
      (sum, event) => sum + event.sourceCount,
      0,
    );

    expect(totalSources).toBe(detail?.sourceCount);
  });
});
