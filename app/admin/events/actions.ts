"use server";

import { revalidatePath } from "next/cache";
import { requireAdminAuth } from "@/lib/admin-auth";
import type { EventStatus, HistoricalEventDocument } from "@/lib/domain-types";
import { getMongoDb } from "@/lib/mongodb";
import { recordEditorialEvent } from "@/lib/editorial-event-repository";

const VALID_EVENT_STATUSES = new Set<EventStatus>([
  "draft",
  "needs_review",
  "published",
  "needs_correction",
  "archived",
]);

export async function updateEventStatus(formData: FormData) {
  const actorId = await requireAdminAuth();

  if (!process.env.MONGODB_URI) {
    throw new Error("Event status updates require a MongoDB connection.");
  }

  const eventId = String(formData.get("eventId") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim() as EventStatus;

  if (!eventId || !VALID_EVENT_STATUSES.has(status)) {
    throw new Error("Invalid event status update.");
  }

  const db = await getMongoDb();
  const now = new Date().toISOString();

  const event = await db
    .collection<HistoricalEventDocument>("events")
    .findOne({ _id: eventId });

  if (!event) {
    throw new Error("Event not found.");
  }

  const previousStatus = event.status;

  await db.collection<HistoricalEventDocument>("events").updateOne(
    { _id: eventId },
    {
      $set: {
        status,
        updatedAt: now,
      },
    },
  );

  await recordEditorialEvent(
    {
      type: "event_status_updated",
      actorId,
      monthSlug: event.monthSlug,
      eventId,
      metadata: {
        action: "event_status_updated",
        fromStatus: previousStatus,
        toStatus: status,
      },
    },
    db,
  );

  revalidatePath(`/admin/events/${eventId}`);
  revalidatePath(`/admin/months/${event.monthSlug}`);
  revalidatePath(`/events/${eventId}`);
  revalidatePath(`/archive/${event.monthSlug}`);
  revalidatePath("/");
}
