import { describe, expect, it } from "vitest";
import {
  buildReservationDraft,
  updateReservationPaymentStatus,
} from "./reservation-repository";
import type { ReservationDocument } from "./domain-types";

const validInput = {
  primaryContactEmail: "creator@example.com",
  months: ["August 2026"],
  availableMonths: ["August 2026", "September 2026", "October 2026"],
  requestedSize: "small" as const,
  preferredSpaceId: "03",
  totalAmountCents: 2000,
};

describe("reservation draft repository contract", () => {
  it("builds a draft with the correct defaults", () => {
    const draft = buildReservationDraft(validInput, {
      id: "reservation-01",
      now: "2026-08-05T00:00:00.000Z",
    });

    expect(draft).toMatchObject({
      _id: "reservation-01",
      status: "draft",
      primaryContactEmail: "creator@example.com",
      paymentStatus: "not_started",
      assignedSpaceIds: [],
      salesUnit: "size_and_visibility_category",
      createdAt: "2026-08-05T00:00:00.000Z",
    });
  });

  it("accepts the documented three-month option", () => {
    const draft = buildReservationDraft({
      ...validInput,
      months: ["August 2026", "September 2026", "October 2026"],
    });

    expect(draft.months).toHaveLength(3);
  });

  it("rejects invalid month counts, email, and amounts", () => {
    expect(() => buildReservationDraft({ ...validInput, months: [] })).toThrow(
      "one or three months",
    );
    expect(() =>
      buildReservationDraft({
        ...validInput,
        months: ["July 2026"],
      }),
    ).toThrow("available and consecutive");
    expect(() =>
      buildReservationDraft({ ...validInput, primaryContactEmail: "invalid" }),
    ).toThrow("email");
    expect(() =>
      buildReservationDraft({ ...validInput, totalAmountCents: -1 }),
    ).toThrow("non-negative");
  });

  it("unsets a cleared Stripe payment intent instead of storing undefined", async () => {
    const reservation: ReservationDocument = {
      ...buildReservationDraft(validInput, {
        id: "reservation-01",
        now: "2026-08-05T00:00:00.000Z",
      }),
      stripePaymentIntentId: "pi_existing",
    };
    const updates: unknown[] = [];
    const db = {
      collection: () => ({
        findOne: async () => reservation,
        updateOne: async (_filter: unknown, update: unknown) => {
          updates.push(update);
          return { acknowledged: true };
        },
      }),
    };

    const updated = await updateReservationPaymentStatus(
      reservation._id,
      { stripePaymentIntentId: null },
      db as never,
    );

    expect(updates[0]).toMatchObject({
      $unset: { stripePaymentIntentId: "" },
    });
    expect(updated?.stripePaymentIntentId).toBeUndefined();
  });
});
