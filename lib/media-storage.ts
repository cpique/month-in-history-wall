import { randomBytes } from "crypto";
import { existsSync } from "fs";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import type { MediaKind } from "./domain-types";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const ALLOWED_VIDEO_TYPES = new Set(["video/mp4", "video/webm"]);

const ALLOWED_MEDIA_KINDS = new Set<MediaKind>([
  "image",
  "gif",
  "text",
  "video_preview",
]);

export type SavedMediaFile = {
  assetKey: string;
  originalFilename: string;
  url: string;
  contentType: string;
};

export function getMediaUrl(assetKey: string): string {
  return `/uploads/${assetKey}`;
}

export function getAssetKeyFromUrl(url: string): string | undefined {
  const prefix = "/uploads/";

  if (!url.startsWith(prefix)) {
    return undefined;
  }

  return url.slice(prefix.length);
}

function getFileExtension(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  return ext.replace(/[^a-z0-9.]/g, "");
}

export function isMediaKind(value: string): value is MediaKind {
  return ALLOWED_MEDIA_KINDS.has(value as MediaKind);
}

function validateMediaFile(file: File, mediaKind: MediaKind) {
  if (file.size === 0) {
    throw new Error("Media file is empty.");
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(`Media file must be smaller than ${MAX_FILE_SIZE_MB}MB.`);
  }

  if (mediaKind === "text") {
    throw new Error("Text submissions do not accept a media file.");
  }

  const isImage = ALLOWED_IMAGE_TYPES.has(file.type);
  const isVideo = ALLOWED_VIDEO_TYPES.has(file.type);

  if (mediaKind === "image" || mediaKind === "gif") {
    if (!isImage) {
      throw new Error("Only JPG, PNG, WebP, or GIF files are accepted for this media type.");
    }
  }

  if (mediaKind === "video_preview") {
    if (!isVideo) {
      throw new Error("Only MP4 or WebM video files are accepted for video previews.");
    }
  }

  if (!isImage && !isVideo) {
    throw new Error("Unsupported media file type.");
  }
}

export async function saveMediaFile(
  file: File,
  mediaKind: MediaKind,
): Promise<SavedMediaFile> {
  validateMediaFile(file, mediaKind);

  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }

  const extension = getFileExtension(file.name) || ".bin";
  const assetKey = `${randomBytes(16).toString("hex")}${extension}`;
  const filePath = path.join(UPLOAD_DIR, assetKey);
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(filePath, buffer);

  return {
    assetKey,
    originalFilename: file.name,
    url: getMediaUrl(assetKey),
    contentType: file.type,
  };
}
