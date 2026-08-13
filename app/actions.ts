"use server";

import { getReservableSpaceById } from "@/lib/exhibition-data";
import { getMongoDb } from "@/lib/mongodb";
import type { ReservableSpaceSize } from "@/lib/inventory-policy";
import {
  findReservationById,
  insertReservationDraft,
} from "@/lib/reservation-repository";
import { insertSubmissionDraft } from "@/lib/submission-repository";
import { createReservationCheckoutSession } from "@/lib/payment-service";
import { isMediaKind, saveMediaFile } from "@/lib/media-storage";
import { insertParticipantEvent } from "@/lib/analytics-repository";

const mongoSetupMessage =
  "Reservations need MongoDB before drafts can be saved. For local Docker, add MONGODB_URI=mongodb://localhost:27017 and MONGODB_DB=one-month-museum to .env.local, then restart the dev server.";

export type CreateReservationResult =
  | { success: true; reservationId: string; submissionId: string }
  | { success: false; error: string };

export async function createReservationDraft(
  formData: FormData,
): Promise<CreateReservationResult> {
  try {
    const spaceId = String(formData.get("spaceId") ?? "");
    const space = getReservableSpaceById(spaceId);

    if (!space?.reservation || space.size === "featured") {
      throw new Error("The selected space is not available.");
    }

    const email = String(formData.get("email") ?? "").trim();
    const creatorName = String(formData.get("creator") ?? "").trim();
    const workTitle = String(formData.get("workTitle") ?? "").trim();
    const mediaKind = String(formData.get("mediaKind") ?? "");
    const description = String(formData.get("description") ?? "").trim();
    const externalUrl = String(formData.get("externalUrl") ?? "").trim() || undefined;
    const altText = String(formData.get("altText") ?? "").trim() || undefined;
    const policyAcknowledged = formData.get("policyAcknowledgement") === "on";
    const startMonth = String(formData.get("startMonth") ?? "");
    const duration = Number(formData.get("duration"));
    const mediaFile = formData.get("mediaFile");

    let mediaAsset:
      | { assetKey: string; originalFilename: string; url: string }
      | undefined;

    if (!isMediaKind(mediaKind)) {
      throw new Error("Unsupported media type.");
    }

    if (!process.env.MONGODB_URI) {
      throw new Error(mongoSetupMessage);
    }

    const db = await getMongoDb();

    if (mediaKind !== "text") {
      if (!(mediaFile instanceof File) || mediaFile.size === 0) {
        throw new Error("A media file is required for this media type.");
      }

      mediaAsset = await saveMediaFile(mediaFile, mediaKind);
    }

    if (duration !== 1 && duration !== 3) {
      throw new Error("Duration must be one or three months.");
    }

    const availableMonths = space.reservation.availableMonths;
    const startIndex = availableMonths.indexOf(startMonth);

    if (startIndex < 0) {
      throw new Error("Start month is not available.");
    }

    const months = availableMonths.slice(startIndex, startIndex + duration);

    if (months.length !== duration) {
      throw new Error("Not enough consecutive months available.");
    }

    const reservation = await insertReservationDraft(
      {
        primaryContactEmail: email,
        months,
        availableMonths,
        requestedSize: space.size as ReservableSpaceSize,
        preferredSpaceId: spaceId,
        totalAmountCents: space.reservation.priceCents * duration,
      },
      db,
      { status: "submitted" },
    );

    const submission = await insertSubmissionDraft(
      {
        reservationId: reservation._id,
        creatorName,
        workTitle,
        description,
        externalUrl,
        media: {
          kind: mediaKind,
          assetKey: mediaAsset?.assetKey,
          originalFilename: mediaAsset?.originalFilename,
          altText,
        },
        policyAcknowledged,
      },
      db,
      { reviewStatus: "submitted" },
    );

    await insertParticipantEvent(
      {
        type: "reservation_submitted",
        participantEmail: email,
        spaceId,
        reservationId: reservation._id,
        submissionId: submission._id,
        createdAt: new Date().toISOString(),
      },
      db,
    );

    return {
      success: true,
      reservationId: reservation._id,
      submissionId: submission._id,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Something went wrong. Please try again.";

    return { success: false, error: errorMessage };
  }
}

export type CheckoutSessionResult =
  | { success: true; url: string }
  | { success: false; error: string };

export async function createCheckoutSession(
  reservationId: string,
): Promise<CheckoutSessionResult> {
  try {
    const db = await getMongoDb();
    const reservation = await findReservationById(reservationId, db);

    if (!reservation) {
      throw new Error("Reservation not found.");
    }

    if (reservation.status !== "submitted") {
      throw new Error("This reservation is not open for payment.");
    }

    const url = await createReservationCheckoutSession(reservation);

    return { success: true, url };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Something went wrong. Please try again.";

    return { success: false, error: errorMessage };
  }
}
