import type { ReservationDocument } from "./domain-types";

export type ReservationStatus = ReservationDocument["status"];

const allowedTransitions = {
  draft: ["held", "cancelled"],
  held: ["submitted", "cancelled", "expired"],
  submitted: ["approved", "cancelled"],
  approved: ["cancelled"],
  cancelled: [],
  expired: [],
} as const satisfies Record<ReservationStatus, readonly ReservationStatus[]>;

export function getAllowedReservationTransitions(
  status: ReservationStatus,
): readonly ReservationStatus[] {
  return allowedTransitions[status];
}

export function canTransitionReservation(
  from: ReservationStatus,
  to: ReservationStatus,
): boolean {
  return getAllowedReservationTransitions(from).includes(to);
}
