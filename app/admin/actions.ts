"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { insertArchiveSnapshot } from "@/lib/archive-repository";
import { requireAdminAuth } from "@/lib/admin-auth";
import type { HistoricalEventDocument, MediaKind, MonthDocument } from "@/lib/domain-types";
import { monthEventsToExhibition } from "@/lib/exhibition-service";
import { getMongoDb } from "@/lib/mongodb";
import { getAssetKeyFromUrl } from "@/lib/media-storage";
import { getMonthLockBlocker } from "@/lib/month-lock";

function inferMediaKind(medium: string): MediaKind {
  const normalized = medium.toLowerCase();

  if (normalized.includes("video")) return "video_preview";
  if (normalized.includes("gif")) return "gif";
  if (normalized.includes("text")) return "text";
  return "image";
}

export async function lockMonth(formData: FormData) {
  await requireAdminAuth();

  if (!process.env.MONGODB_URI) {
    throw new Error("Archive locking requires a MongoDB connection.");
  }

  const slug = String(formData.get("monthSlug") ?? "").trim();

  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(slug)) {
    throw new Error("Invalid month to lock.");
  }

  const db = await getMongoDb();
  const month = await db.collection<MonthDocument>("months").findOne({ slug, status: "published" });
  if (!month) throw new Error("This month is unavailable for locking.");
  const events = await db.collection<HistoricalEventDocument>("events").find({ monthId: month._id }).sort({ "layout.order": 1 }).toArray();
  const publishedCount = events.filter((event) => event.status === "published").length;
  const needsReviewCount = events.filter((event) => ["draft", "needs_review", "needs_correction"].includes(event.status)).length;
  const blocker = getMonthLockBlocker({ status: month.status, eventCount: events.length, publishedCount, needsReviewCount });
  if (blocker) throw new Error(blocker);
  const exhibition = monthEventsToExhibition(month, events);
  const now = new Date().toISOString();

  const snapshotSpaces = exhibition.spaces.map((space) => ({
    slotId: space.id,
    eventId: space.id,
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
      exhibitionId: month._id,
      slug: month.slug,
      lockedAt: now,
      title: exhibition.title,
      theme: exhibition.theme,
      description: exhibition.description,
      monthLabel: exhibition.monthLabel,
      spaces: snapshotSpaces,
    },
    db,
  );

  const result = await db.collection<MonthDocument>("months").updateOne(
    { _id: month._id, status: "published" },
    { $set: { status: "locked", lockedAt: now, updatedAt: now } },
  );
  if (result.modifiedCount !== 1) throw new Error("This month changed before it could be locked.");
  await db.collection<HistoricalEventDocument>("events").updateMany(
    { monthId: month._id, status: "published" },
    { $set: { status: "archived", updatedAt: now } },
  );
  revalidatePath("/");
  revalidatePath("/archive");
  revalidatePath(`/archive/${month.slug}`);
  redirect(`/archive/${month.slug}`);
}
