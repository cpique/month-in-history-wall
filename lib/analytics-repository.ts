import { ObjectId, type Db } from "mongodb";
import type { ParticipantEventDocument, ParticipantEventType } from "./domain-types";
import { getMongoDb } from "./mongodb";

const COLLECTION = "participantEvents";

function validateEventInput(
  type: ParticipantEventType,
  createdAt?: string,
) {
  const validTypes: ParticipantEventType[] = [
    "page_view",
    "space_selected",
    "reservation_started",
    "reservation_submitted",
    "payment_authorized",
    "payment_completed",
    "submission_approved",
    "submission_rejected",
  ];

  if (!validTypes.includes(type)) {
    throw new Error(`Invalid participant event type: ${type}`);
  }

  if (createdAt) {
    const date = new Date(createdAt);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid createdAt timestamp.");
    }
  }
}

export async function ensureAnalyticsIndexes(db: Db) {
  const collection = db.collection<ParticipantEventDocument>(COLLECTION);

  await Promise.all([
    collection.createIndex({ type: 1, createdAt: -1 }),
    collection.createIndex({ exhibitionSlug: 1, type: 1 }),
    collection.createIndex({ spaceId: 1, type: 1 }),
    collection.createIndex({ reservationId: 1 }),
    collection.createIndex({ submissionId: 1 }),
  ]);
}

export async function insertParticipantEvent(
  event: Omit<ParticipantEventDocument, "_id">,
  db?: Db,
): Promise<ParticipantEventDocument> {
  validateEventInput(event.type, event.createdAt);

  const database = db ?? (await getMongoDb());
  const doc: ParticipantEventDocument = {
    _id: new ObjectId().toHexString(),
    ...event,
  };

  await database.collection<ParticipantEventDocument>(COLLECTION).insertOne(doc);
  return doc;
}

export async function getEventCountsByType(
  exhibitionSlug?: string,
  db?: Db,
): Promise<{ type: ParticipantEventType; count: number }[]> {
  const database = db ?? (await getMongoDb());
  const match: Record<string, unknown> = {};

  if (exhibitionSlug) {
    match.exhibitionSlug = exhibitionSlug;
  }

  const results = await database
    .collection<ParticipantEventDocument>(COLLECTION)
    .aggregate([
      { $match: match },
      { $group: { _id: "$type", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ])
    .toArray();

  return results.map((r) => ({
    type: r._id as ParticipantEventType,
    count: r.count as number,
  }));
}

export async function getReservationFunnel(
  db?: Db,
): Promise<{ step: string; count: number }[]> {
  const database = db ?? (await getMongoDb());

  const funnelSteps: { step: string; type: ParticipantEventType }[] = [
    { step: "reservation_started", type: "reservation_started" },
    { step: "reservation_submitted", type: "reservation_submitted" },
    { step: "payment_authorized", type: "payment_authorized" },
    { step: "payment_completed", type: "payment_completed" },
    { step: "submission_approved", type: "submission_approved" },
  ];

  const results = await database
    .collection<ParticipantEventDocument>(COLLECTION)
    .aggregate([
      { $match: { type: { $in: funnelSteps.map((s) => s.type) } } },
      { $group: { _id: "$type", count: { $sum: 1 } } },
    ])
    .toArray();

  const countByType = new Map(
    results.map((r) => [r._id, r.count] as [string, number]),
  );

  return funnelSteps.map((step) => ({
    step: step.step,
    count: countByType.get(step.type) ?? 0,
  }));
}

export async function getTopSpacesByViews(
  limit: number = 10,
  db?: Db,
): Promise<{ spaceId: string; count: number }[]> {
  const database = db ?? (await getMongoDb());

  const results = await database
    .collection<ParticipantEventDocument>(COLLECTION)
    .aggregate([
      { $match: { type: "space_selected" } },
      { $group: { _id: "$spaceId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
    ])
    .toArray();

  return results.map((r) => ({
    spaceId: r._id as string,
    count: r.count as number,
  }));
}

export async function getRecentEvents(
  limit: number = 50,
  db?: Db,
): Promise<ParticipantEventDocument[]> {
  const database = db ?? (await getMongoDb());

  return database
    .collection<ParticipantEventDocument>(COLLECTION)
    .find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
}

export async function getPageViewCount(
  exhibitionSlug?: string,
  db?: Db,
): Promise<number> {
  const database = db ?? (await getMongoDb());
  const match: Record<string, unknown> = { type: "page_view" };

  if (exhibitionSlug) {
    match.exhibitionSlug = exhibitionSlug;
  }

  return database
    .collection<ParticipantEventDocument>(COLLECTION)
    .countDocuments(match);
}

export async function getConversionRates(
  db?: Db,
): Promise<{
  reservationToSubmission: number;
  submissionToPayment: number;
  paymentToApproval: number;
  overallApprovalRate: number;
}> {
  const funnel = await getReservationFunnel(db);
  const funnelMap = new Map(funnel.map((f) => [f.step, f.count]));

  const started = funnelMap.get("reservation_started") ?? 0;
  const submitted = funnelMap.get("reservation_submitted") ?? 0;
  const authorized = funnelMap.get("payment_authorized") ?? 0;
  const approved = funnelMap.get("submission_approved") ?? 0;

  return {
    reservationToSubmission: started > 0 ? submitted / started : 0,
    submissionToPayment: submitted > 0 ? authorized / submitted : 0,
    paymentToApproval: authorized > 0 ? approved / authorized : 0,
    overallApprovalRate: started > 0 ? approved / started : 0,
  };
}
