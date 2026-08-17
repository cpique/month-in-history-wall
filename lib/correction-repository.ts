import { ObjectId, type Db } from "mongodb";
import type {
  CorrectionRequestDocument,
  CorrectionRequestStatus,
} from "./domain-types";
import { getMongoDb } from "./mongodb";

const COLLECTION = "correctionRequests";
const MAX_MESSAGE_LENGTH = 2000;
export const VALID_CORRECTION_STATUSES = new Set<CorrectionRequestStatus>([
  "open",
  "reviewing",
  "accepted",
  "rejected",
  "closed",
]);

export type CorrectionRequestInput = {
  eventId: string;
  monthSlug: string;
  message: string;
  sourceUrl?: string;
  contactEmail?: string;
};

function normalizeOptional(value?: string) {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function assertHttpUrl(value: string, label: string) {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error(`${label} must be a valid URL.`);
  }

  assert(url.protocol === "http:" || url.protocol === "https:", `${label} must use http or https.`);
}

export function buildCorrectionRequest(
  input: CorrectionRequestInput,
  options: { id?: string; now?: string } = {},
): CorrectionRequestDocument {
  const eventId = input.eventId.trim();
  const monthSlug = input.monthSlug.trim();
  const message = input.message.trim();
  const sourceUrl = normalizeOptional(input.sourceUrl);
  const contactEmail = normalizeOptional(input.contactEmail);
  const now = options.now ?? new Date().toISOString();

  assert(eventId.length > 0 && eventId.length <= 200, "Event id is required.");
  assert(/^\d{4}-\d{2}$/.test(monthSlug), "Month slug must use YYYY-MM format.");
  assert(message.length >= 10, "Correction message must be at least 10 characters.");
  assert(
    message.length <= MAX_MESSAGE_LENGTH,
    `Correction message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`,
  );

  if (sourceUrl) {
    assertHttpUrl(sourceUrl, "Source URL");
  }

  if (contactEmail) {
    assert(contactEmail.length <= 320, "Contact email is too long.");
    assert(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail), "Contact email must be valid.");
  }

  return {
    _id: options.id ?? new ObjectId().toHexString(),
    eventId,
    monthSlug,
    message,
    sourceUrl,
    contactEmail,
    status: "open",
    createdAt: now,
    updatedAt: now,
  };
}

export async function ensureCorrectionRequestIndexes(db: Db) {
  const collection = db.collection<CorrectionRequestDocument>(COLLECTION);

  await Promise.all([
    collection.createIndex({ status: 1, createdAt: -1 }),
    collection.createIndex({ eventId: 1, createdAt: -1 }),
    collection.createIndex({ monthSlug: 1, status: 1 }),
  ]);
}

export async function insertCorrectionRequest(
  input: CorrectionRequestInput,
  db?: Db,
): Promise<CorrectionRequestDocument> {
  const database = db ?? (await getMongoDb());
  const correction = buildCorrectionRequest(input);

  await ensureCorrectionRequestIndexes(database);
  await database.collection<CorrectionRequestDocument>(COLLECTION).insertOne(correction);

  return correction;
}

export async function getCorrectionRequestCounts(
  db?: Db,
): Promise<Record<CorrectionRequestStatus, number>> {
  const database = db ?? (await getMongoDb());
  const results = await database
    .collection<CorrectionRequestDocument>(COLLECTION)
    .aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ])
    .toArray();
  const counts: Record<CorrectionRequestStatus, number> = {
    open: 0,
    reviewing: 0,
    accepted: 0,
    rejected: 0,
    closed: 0,
  };

  for (const result of results) {
    if (VALID_CORRECTION_STATUSES.has(result._id as CorrectionRequestStatus)) {
      counts[result._id as CorrectionRequestStatus] = result.count as number;
    }
  }

  return counts;
}

export async function getRecentCorrectionRequests(
  limit: number = 50,
  db?: Db,
): Promise<CorrectionRequestDocument[]> {
  const database = db ?? (await getMongoDb());

  return database
    .collection<CorrectionRequestDocument>(COLLECTION)
    .find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
}

export async function getCorrectionRequestById(
  id: string,
  db?: Db,
): Promise<CorrectionRequestDocument | null> {
  const database = db ?? (await getMongoDb());

  return database.collection<CorrectionRequestDocument>(COLLECTION).findOne({ _id: id });
}

export async function updateCorrectionRequestStatus(
  id: string,
  status: CorrectionRequestStatus,
  db?: Db,
): Promise<CorrectionRequestDocument | null> {
  if (!VALID_CORRECTION_STATUSES.has(status)) {
    throw new Error("Invalid correction request status.");
  }

  const database = db ?? (await getMongoDb());
  const now = new Date().toISOString();

  await database.collection<CorrectionRequestDocument>(COLLECTION).updateOne(
    { _id: id },
    {
      $set: {
        status,
        updatedAt: now,
      },
    },
  );

  return database.collection<CorrectionRequestDocument>(COLLECTION).findOne({ _id: id });
}
