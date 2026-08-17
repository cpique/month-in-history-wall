import type { MonthStatus } from "./domain-types";

export type MonthLockReadiness = {
  status: MonthStatus;
  eventCount: number;
  publishedCount: number;
  needsReviewCount: number;
};

export function getMonthLockBlocker(readiness: MonthLockReadiness): string | null {
  if (readiness.status !== "published") {
    return "Only published months can be locked.";
  }

  if (readiness.eventCount === 0) {
    return "A month needs at least one published event before it can be locked.";
  }

  if (readiness.needsReviewCount > 0) {
    return "Resolve all draft, review, and correction-needed events before locking.";
  }

  if (readiness.publishedCount !== readiness.eventCount) {
    return "Every event must be published before the month can be locked.";
  }

  return null;
}
