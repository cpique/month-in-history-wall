import { describe, expect, it } from "vitest";
import {
  buildCorrectionRequest,
  updateCorrectionRequestStatus,
} from "./correction-repository";
import type { CorrectionRequestDocument } from "./domain-types";

describe("correction request repository contract", () => {
  it("builds a normalized open correction request", () => {
    const correction = buildCorrectionRequest(
      {
        eventId: "1984-06:tetris-created",
        monthSlug: "1984-06",
        message: "The source date needs a second citation.",
        sourceUrl: " https://example.com/source ",
        contactEmail: " editor@example.com ",
      },
      {
        id: "correction-01",
        now: "2026-08-14T00:00:00.000Z",
      },
    );

    expect(correction).toEqual({
      _id: "correction-01",
      eventId: "1984-06:tetris-created",
      monthSlug: "1984-06",
      message: "The source date needs a second citation.",
      sourceUrl: "https://example.com/source",
      contactEmail: "editor@example.com",
      status: "open",
      createdAt: "2026-08-14T00:00:00.000Z",
      updatedAt: "2026-08-14T00:00:00.000Z",
    });
  });

  it("rejects weak correction requests", () => {
    expect(() =>
      buildCorrectionRequest({
        eventId: "1984-06:tetris-created",
        monthSlug: "1984-06",
        message: "Too short",
      }),
    ).toThrow("at least 10 characters");

    expect(() =>
      buildCorrectionRequest({
        eventId: "1984-06:tetris-created",
        monthSlug: "1984-06",
        message: "This correction has a bad URL.",
        sourceUrl: "javascript:alert(1)",
      }),
    ).toThrow("http or https");
  });

  it("updates correction request status", async () => {
    const stored: CorrectionRequestDocument = buildCorrectionRequest(
      {
        eventId: "1984-06:tetris-created",
        monthSlug: "1984-06",
        message: "Please review this source.",
      },
      {
        id: "correction-01",
        now: "2026-08-14T00:00:00.000Z",
      },
    );
    const db = {
      collection: () => ({
        updateOne: async (
          _filter: unknown,
          update: { $set: Partial<CorrectionRequestDocument> },
        ) => {
          Object.assign(stored, update.$set);
        },
        findOne: async () => stored,
      }),
    };

    const updated = await updateCorrectionRequestStatus(
      "correction-01",
      "reviewing",
      db as never,
    );

    expect(updated?.status).toBe("reviewing");
    expect(updated?.updatedAt).not.toBe("2026-08-14T00:00:00.000Z");
  });
});
