"use server";

import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { insertParticipantEvent } from "@/lib/analytics-repository";
import { insertArchiveSnapshot } from "@/lib/archive-repository";
import type { MediaKind } from "@/lib/domain-types";
import { getCurrentExhibition } from "@/lib/exhibition-service";
import { getMongoDb } from "@/lib/mongodb";
import { getAssetKeyFromUrl } from "@/lib/media-storage";
import {
  capturePaymentIntent,
  cancelPaymentIntent,
} from "@/lib/payment-service";
import {
  findReservationById,
  updateReservationPaymentStatus,
  updateReservationStatus,
} from "@/lib/reservation-repository";
import {
  findSubmissionById,
  updateSubmissionReviewStatus,
} from "@/lib/submission-repository";

async function requireAdminAuth() {
  if (
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
    !process.env.CLERK_SECRET_KEY
  ) {
    return;
  }

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }
}

function inferMediaKind(medium: string): MediaKind {
  const normalized = medium.toLowerCase();

  if (normalized.includes("video")) return "video_preview";
  if (normalized.includes("gif")) return "gif";
  if (normalized.includes("text")) return "text";
  return "image";
}

async function loadSubmissionAndReservation(formData: FormData) {
  if (!process.env.MONGODB_URI) {
    throw new Error("Admin review actions require a MongoDB connection.");
  }

  const submissionId = String(formData.get("submissionId") ?? "").trim();

  if (!submissionId) {
    throw new Error("Submission id is required.");
  }

  const db = await getMongoDb();
  const submission = await findSubmissionById(submissionId, db);

  if (!submission) {
    throw new Error("Submission not found.");
  }

  const reservation = await findReservationById(submission.reservationId, db);

  if (!reservation) {
    throw new Error("Reservation not found.");
  }

  const reviewerNotes = String(formData.get("reviewerNotes") ?? "").trim();

  return { submission, reservation, reviewerNotes, db };
}

export async function approveSubmission(formData: FormData) {
  await requireAdminAuth();
  const { submission, reservation, db } = await loadSubmissionAndReservation(formData);

  if (!reservation.stripePaymentIntentId) {
    throw new Error("Payment authorization is required before approval.");
  }

  await capturePaymentIntent(reservation.stripePaymentIntentId);
  await updateReservationPaymentStatus(
    reservation._id,
    { paymentStatus: "captured" },
    db,
  );
  await updateReservationStatus(reservation._id, "approved", db);
  await updateSubmissionReviewStatus(submission._id, "approved", { db });

  await insertParticipantEvent({
    type: "submission_approved",
    participantEmail: reservation.primaryContactEmail,
    reservationId: reservation._id,
    submissionId: submission._id,
    createdAt: new Date().toISOString(),
  }, db);

  redirect("/admin");
}

export async function rejectSubmission(formData: FormData) {
  await requireAdminAuth();
  const { submission, reservation, reviewerNotes, db } = await loadSubmissionAndReservation(formData);

  if (reservation.stripePaymentIntentId) {
    await cancelPaymentIntent(reservation.stripePaymentIntentId);
  }

  await updateReservationPaymentStatus(
    reservation._id,
    { paymentStatus: "cancelled" },
    db,
  );
  await updateReservationStatus(reservation._id, "cancelled", db);
  await updateSubmissionReviewStatus(submission._id, "rejected", {
    reviewerNotes,
    db,
  });

  await insertParticipantEvent({
    type: "submission_rejected",
    participantEmail: reservation.primaryContactEmail,
    reservationId: reservation._id,
    submissionId: submission._id,
    createdAt: new Date().toISOString(),
  }, db);

  redirect("/admin");
}

export async function requestChanges(formData: FormData) {
  await requireAdminAuth();
  const { submission, reviewerNotes, db } = await loadSubmissionAndReservation(formData);

  if (!reviewerNotes) {
    throw new Error("Reviewer notes are required to request changes.");
  }

  await updateSubmissionReviewStatus(submission._id, "changes_requested", {
    reviewerNotes,
    db,
  });

  redirect("/admin");
}

export async function lockCurrentExhibition() {
  await requireAdminAuth();

  if (!process.env.MONGODB_URI) {
    throw new Error("Archive locking requires a MongoDB connection.");
  }

  const db = await getMongoDb();
  const exhibition = await getCurrentExhibition();
  const now = new Date().toISOString();

  const snapshotSpaces = exhibition.spaces.map((space) => ({
    slotId: space.id,
    size: space.size,
    status: space.status,
    creatorName: space.creator,
    workTitle: space.title,
    description: space.description,
    mediaKind: inferMediaKind(space.medium),
    externalUrl: space.externalUrl,
    className: space.className,
    mediaAssetKey: space.mediaPreview?.mediaUrl
      ? getAssetKeyFromUrl(space.mediaPreview.mediaUrl)
      : undefined,
    altText: space.mediaPreview?.mediaAlt,
  }));

  await insertArchiveSnapshot(
    {
      exhibitionId: new ObjectId().toHexString(),
      slug: exhibition.slug,
      lockedAt: now,
      title: exhibition.title,
      theme: exhibition.theme,
      description: exhibition.description,
      monthLabel: exhibition.monthLabel,
      spaces: snapshotSpaces,
    },
    db,
  );

  redirect(`/archive/${exhibition.slug}`);
}
