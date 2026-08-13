import type { ReviewStatus } from "./domain-types";
import { currentExhibition } from "./exhibition-data";
import { getMongoDb } from "./mongodb";
import { findReservationsByIds } from "./reservation-repository";
import { findSubmissionsForReview } from "./submission-repository";

export type AdminReviewSubmission = {
  id: string;
  submissionId: string;
  reservationId: string;
  isSample?: boolean;
  creatorName: string;
  workTitle: string;
  description: string;
  medium: string;
  reviewStatus: ReviewStatus;
  size?: string;
  months?: string[];
  email?: string;
  assetKey?: string;
  originalFilename?: string;
};

export function getSampleAdminSubmissions(): AdminReviewSubmission[] {
  return currentExhibition.spaces
    .filter(
      (space) =>
        space.status === "occupied" ||
        space.status === "featured" ||
        space.status === "review",
    )
    .map((space) => ({
      id: `sample-submission-${space.id}`,
      submissionId: `sample-submission-${space.id}`,
      reservationId: `sample-reservation-${space.id}`,
      isSample: true,
      creatorName: space.creator,
      workTitle: space.title,
      description: space.description,
      medium: space.medium,
      reviewStatus:
        space.status === "review" ? ("in_review" as ReviewStatus) : "approved",
      size: space.size,
      assetKey: undefined,
      originalFilename: undefined,
    }));
}

export async function getReviewSubmissions(): Promise<AdminReviewSubmission[]> {
  if (!process.env.MONGODB_URI) {
    return getSampleAdminSubmissions();
  }

  const db = await getMongoDb();
  const submissions = await findSubmissionsForReview(db);

  if (submissions.length === 0) {
    return getSampleAdminSubmissions();
  }

  const reservationIds = [...new Set(submissions.map((submission) => submission.reservationId))];
  const reservations = await findReservationsByIds(reservationIds, db);
  const reservationById = new Map(
    reservations.map((reservation) => [reservation._id, reservation]),
  );

  return submissions.map((submission) => {
    const reservation = reservationById.get(submission.reservationId);

    return {
      id: submission._id,
      submissionId: submission._id,
      reservationId: submission.reservationId,
      creatorName: submission.creatorName,
      workTitle: submission.workTitle,
      description: submission.description,
      medium: submission.media.kind,
      reviewStatus: submission.reviewStatus,
      size: reservation?.requestedSize,
      months: reservation?.months,
      email: reservation?.primaryContactEmail,
      assetKey: submission.media.assetKey,
      originalFilename: submission.media.originalFilename,
    };
  });
}
