"use server";

import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import { insertArchiveSnapshot } from "@/lib/archive-repository";
import { requireAdminAuth } from "@/lib/admin-auth";
import type { MediaKind } from "@/lib/domain-types";
import { getCurrentExhibition } from "@/lib/exhibition-service";
import { getMongoDb } from "@/lib/mongodb";
import { getAssetKeyFromUrl } from "@/lib/media-storage";

function inferMediaKind(medium: string): MediaKind {
  const normalized = medium.toLowerCase();

  if (normalized.includes("video")) return "video_preview";
  if (normalized.includes("gif")) return "gif";
  if (normalized.includes("text")) return "text";
  return "image";
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
