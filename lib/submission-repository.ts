import { ObjectId, type Db } from "mongodb";
import type { MediaKind, SubmissionDocument } from "./domain-types";
import { getMongoDb } from "./mongodb";
import type { ReviewStatus } from "./domain-types";

export type SubmissionDraftInput = {
  reservationId: string;
  creatorName: string;
  workTitle: string;
  description: string;
  externalUrl?: string;
  media: {
    kind: MediaKind;
    assetKey?: string;
    originalFilename?: string;
    altText?: string;
  };
  policyAcknowledged: boolean;
};

function validateSubmissionInput(input: SubmissionDraftInput) {
  if (!input.reservationId.trim() || input.reservationId.length > 100) {
    throw new Error("A reservation id is required.");
  }

  if (!input.creatorName.trim() || !input.workTitle.trim() || !input.description.trim()) {
    throw new Error("Creator name, work title, and description are required.");
  }

  if (input.creatorName.length > 200 || input.workTitle.length > 200) {
    throw new Error("Creator name and work title must be 200 characters or fewer.");
  }

  if (input.description.length > 5000) {
    throw new Error("Description must be 5000 characters or fewer.");
  }

  if (!input.policyAcknowledged) {
    throw new Error("Content policy acknowledgement is required.");
  }

  if (input.media.kind !== "text" && !input.media.altText?.trim()) {
    throw new Error("Alt text is required for visual media.");
  }

  if (input.media.altText && input.media.altText.length > 1000) {
    throw new Error("Alt text must be 1000 characters or fewer.");
  }

  if (input.media.originalFilename && input.media.originalFilename.length > 255) {
    throw new Error("The original filename must be 255 characters or fewer.");
  }

  if (input.externalUrl && input.externalUrl.length > 2048) {
    throw new Error("External links must be 2048 characters or fewer.");
  }

  if (input.externalUrl) {
    let url: URL;

    try {
      url = new URL(input.externalUrl);
    } catch {
      throw new Error("External links must use http or https.");
    }

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error("External links must use http or https.");
    }
  }
}

export function buildSubmissionDraft(
  input: SubmissionDraftInput,
  options: { id?: string; now?: string; reviewStatus?: ReviewStatus } = {},
): SubmissionDocument {
  const normalizedInput: SubmissionDraftInput = {
    ...input,
    creatorName: input.creatorName.trim(),
    workTitle: input.workTitle.trim(),
    description: input.description.trim(),
    externalUrl: input.externalUrl?.trim() || undefined,
    media: {
      ...input.media,
      altText: input.media.altText?.trim() || undefined,
    },
  };

  validateSubmissionInput(normalizedInput);

  const now = options.now ?? new Date().toISOString();

  return {
    _id: options.id ?? new ObjectId().toHexString(),
    reservationId: normalizedInput.reservationId.trim(),
    creatorName: normalizedInput.creatorName,
    workTitle: normalizedInput.workTitle,
    description: normalizedInput.description,
    externalUrl: normalizedInput.externalUrl,
    media: {
      kind: normalizedInput.media.kind,
      assetKey: normalizedInput.media.assetKey,
      originalFilename: normalizedInput.media.originalFilename,
      altText: normalizedInput.media.altText,
    },
    policyAcknowledgedAt: now,
    reviewStatus: options.reviewStatus ?? "draft",
    createdAt: now,
    updatedAt: now,
  };
}

export async function ensureSubmissionIndexes(db: Db) {
  const submissions = db.collection<SubmissionDocument>("submissions");

  await Promise.all([
    submissions.createIndex({ reservationId: 1 }),
    submissions.createIndex({ reviewStatus: 1, updatedAt: -1 }),
  ]);
}

export async function insertSubmissionDraft(
  input: SubmissionDraftInput,
  db?: Db,
  options?: { id?: string; now?: string; reviewStatus?: ReviewStatus },
): Promise<SubmissionDocument> {
  const draft = buildSubmissionDraft(input, options);
  const database = db ?? (await getMongoDb());

  await database.collection<SubmissionDocument>("submissions").insertOne(draft);
  return draft;
}

export async function findSubmissionById(
  id: string,
  db?: Db,
): Promise<SubmissionDocument | null> {
  const database = db ?? (await getMongoDb());

  return database.collection<SubmissionDocument>("submissions").findOne({ _id: id });
}

export async function findSubmissionsForReview(
  db?: Db,
): Promise<SubmissionDocument[]> {
  const database = db ?? (await getMongoDb());

  return database
    .collection<SubmissionDocument>("submissions")
    .find({})
    .sort({ updatedAt: -1 })
    .toArray();
}

export async function updateSubmissionReviewStatus(
  id: string,
  status: ReviewStatus,
  options: { reviewerNotes?: string; db?: Db } = {},
): Promise<SubmissionDocument | null> {
  const database = options.db ?? (await getMongoDb());
  const submissions = database.collection<SubmissionDocument>("submissions");
  const current = await submissions.findOne({ _id: id });

  if (!current) {
    return null;
  }

  const now = new Date().toISOString();
  const update: Partial<SubmissionDocument> = { reviewStatus: status, updatedAt: now };

  if (options.reviewerNotes !== undefined) {
    update.reviewerNotes = options.reviewerNotes;
  }

  await submissions.updateOne({ _id: id }, { $set: update });

  return { ...current, ...update };
}
