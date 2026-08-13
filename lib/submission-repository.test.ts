import { describe, expect, it } from "vitest";
import { isMediaKind } from "./media-storage";
import { buildSubmissionDraft } from "./submission-repository";

const validInput = {
  reservationId: "reservation-01",
  creatorName: "Mira Vale",
  workTitle: "Signal Room",
  description: "A study in quiet signals.",
  externalUrl: "https://example.com/work",
  media: {
    kind: "image" as const,
    originalFilename: "signal-room.png",
    altText: "Vertical signal bars on a dark field.",
  },
  policyAcknowledged: true,
};

describe("submission draft repository contract", () => {
  it("builds a policy-aware submission draft", () => {
    const draft = buildSubmissionDraft(validInput, {
      id: "submission-01",
      now: "2026-08-05T00:00:00.000Z",
    });

    expect(draft).toMatchObject({
      _id: "submission-01",
      reservationId: "reservation-01",
      reviewStatus: "draft",
      policyAcknowledgedAt: "2026-08-05T00:00:00.000Z",
      media: { kind: "image", altText: "Vertical signal bars on a dark field." },
    });
  });

  it("allows text without alt text but requires it for visual media", () => {
    expect(
      buildSubmissionDraft({
        ...validInput,
        media: { kind: "text" },
      }).media.altText,
    ).toBeUndefined();
    expect(() =>
      buildSubmissionDraft({ ...validInput, media: { kind: "gif" } }),
    ).toThrow("Alt text");
  });

  it("requires policy acknowledgement and safe external links", () => {
    expect(() =>
      buildSubmissionDraft({ ...validInput, policyAcknowledged: false }),
    ).toThrow("acknowledgement");
    expect(() =>
      buildSubmissionDraft({ ...validInput, externalUrl: "javascript:alert(1)" }),
    ).toThrow("http or https");
  });

  it("rejects oversized submission text", () => {
    expect(() =>
      buildSubmissionDraft({
        ...validInput,
        description: "x".repeat(5001),
      }),
    ).toThrow("5000 characters");
  });

  it("recognizes only supported media kinds", () => {
    expect(isMediaKind("image")).toBe(true);
    expect(isMediaKind("gif")).toBe(true);
    expect(isMediaKind("text")).toBe(true);
    expect(isMediaKind("video_preview")).toBe(true);
    expect(isMediaKind("audio")).toBe(false);
  });
});
