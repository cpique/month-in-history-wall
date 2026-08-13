import type { ParticipantEventType } from "./domain-types";
import {
  getConversionRates,
  getPageViewCount,
  getRecentEvents,
  getReservationFunnel,
  getTopSpacesByViews,
} from "./analytics-repository";
import { currentExhibition } from "./exhibition-data";

export type AnalyticsSummary = {
  pageViews: number;
  funnel: { step: string; count: number }[];
  conversionRates: {
    reservationToSubmission: number;
    submissionToPayment: number;
    paymentToApproval: number;
    overallApprovalRate: number;
  };
  topSpaces: { spaceId: string; count: number }[];
  recentEvents: Array<{
    id: string;
    type: ParticipantEventType;
    participantEmail?: string;
    spaceId?: string;
    reservationId?: string;
    submissionId?: string;
    createdAt: string;
  }>;
};

const eventLabels: Record<ParticipantEventType, string> = {
  page_view: "Page view",
  space_selected: "Space selected",
  reservation_started: "Reservation started",
  reservation_submitted: "Reservation submitted",
  payment_authorized: "Payment authorized",
  payment_completed: "Payment completed",
  submission_approved: "Submission approved",
  submission_rejected: "Submission rejected",
};

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  if (!process.env.MONGODB_URI) {
    return getSampleAnalyticsSummary();
  }

  const [pageViews, funnel, conversionRates, topSpaces, recentEvents] =
    await Promise.all([
      getPageViewCount(currentExhibition.slug),
      getReservationFunnel(),
      getConversionRates(),
      getTopSpacesByViews(5),
      getRecentEvents(20),
    ]);

  return {
    pageViews,
    funnel,
    conversionRates,
    topSpaces: topSpaces.map((s) => ({
      spaceId: s.spaceId,
      count: s.count,
    })),
    recentEvents: recentEvents.map((e) => ({
      id: e._id,
      type: e.type,
      participantEmail: e.participantEmail,
      spaceId: e.spaceId,
      reservationId: e.reservationId,
      submissionId: e.submissionId,
      createdAt: e.createdAt,
    })),
  };
}

export function getEventLabel(type: ParticipantEventType): string {
  return eventLabels[type] ?? type;
}

function getSampleAnalyticsSummary(): AnalyticsSummary {
  return {
    pageViews: 0,
    funnel: [
      { step: "reservation_started", count: 0 },
      { step: "reservation_submitted", count: 0 },
      { step: "payment_authorized", count: 0 },
      { step: "payment_completed", count: 0 },
      { step: "submission_approved", count: 0 },
    ],
    conversionRates: {
      reservationToSubmission: 0,
      submissionToPayment: 0,
      paymentToApproval: 0,
      overallApprovalRate: 0,
    },
    topSpaces: [],
    recentEvents: [],
  };
}
