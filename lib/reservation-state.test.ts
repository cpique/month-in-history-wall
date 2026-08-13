import { describe, expect, it } from "vitest";
import {
  canTransitionReservation,
  getAllowedReservationTransitions,
} from "./reservation-state";

describe("reservation state transitions", () => {
  it("allows the documented happy path", () => {
    expect(canTransitionReservation("draft", "held")).toBe(true);
    expect(canTransitionReservation("held", "submitted")).toBe(true);
    expect(canTransitionReservation("submitted", "approved")).toBe(true);
  });

  it("allows cancellation and hold expiry at the correct stages", () => {
    expect(canTransitionReservation("draft", "cancelled")).toBe(true);
    expect(canTransitionReservation("held", "expired")).toBe(true);
    expect(canTransitionReservation("submitted", "expired")).toBe(false);
  });

  it("keeps terminal statuses terminal", () => {
    expect(getAllowedReservationTransitions("cancelled")).toEqual([]);
    expect(getAllowedReservationTransitions("expired")).toEqual([]);
    expect(canTransitionReservation("approved", "draft")).toBe(false);
  });
});
