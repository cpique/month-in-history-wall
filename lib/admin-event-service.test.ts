import { describe, expect, it } from "vitest";
import { getAdminEventDetail } from "./admin-event-service";

describe("admin event detail", () => {
  it("returns null for an unknown event id", async () => {
    const detail = await getAdminEventDetail("0000-00-00-unknown");

    expect(detail).toBeNull();
  });

  it("returns the static June 1984 event detail", async () => {
    const detail = await getAdminEventDetail("1984-06-06-india");

    expect(detail).not.toBeNull();
    expect(detail?.id).toBe("1984-06-06-india");
    expect(detail?.monthSlug).toBe("1984-06");
    expect(detail?.monthLabel).toBe("June 1984");
    expect(detail?.title).toBeTruthy();
    expect(detail?.summary).toBeTruthy();
    expect(detail?.category).toBeTruthy();
    expect(detail?.status).toBe("published");
  });

  it("includes source records for static events", async () => {
    const detail = await getAdminEventDetail("1984-06-06-india");

    expect(detail?.sources.length).toBeGreaterThan(0);
    expect(detail?.sources[0]?.title).toBeTruthy();
    expect(detail?.sources[0]?.url).toBeTruthy();
  });

  it("returns empty correction requests for static events", async () => {
    const detail = await getAdminEventDetail("1984-06-06-india");

    expect(detail?.correctionRequests).toEqual([]);
  });
});
