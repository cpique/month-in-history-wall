import { ObjectId, type Db } from "mongodb";
import type { PaymentStatus, ReservationDocument } from "./domain-types";
import { getMongoDb } from "./mongodb";
import type { ReservableSpaceSize } from "./inventory-policy";
import { canTransitionReservation } from "./reservation-state";

export type ReservationDraftInput = {
  primaryContactEmail: string;
  months: string[];
  availableMonths: string[];
  requestedSize: ReservableSpaceSize;
  preferredSpaceId?: string;
  totalAmountCents: number;
};

function validateDraftInput(input: ReservationDraftInput) {
  const email = input.primaryContactEmail.trim();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 320) {
    throw new Error("A valid primary contact email is required.");
  }

  if (input.months.length !== 1 && input.months.length !== 3) {
    throw new Error("A reservation must contain one or three months.");
  }

  if (new Set(input.months).size !== input.months.length || input.months.some((month) => !month)) {
    throw new Error("Reservation months must be unique and non-empty.");
  }

  const startIndex = input.availableMonths.indexOf(input.months[0]);
  const expectedMonths = input.availableMonths.slice(startIndex, startIndex + input.months.length);

  if (
    startIndex < 0 ||
    expectedMonths.length !== input.months.length ||
    expectedMonths.some((month, index) => month !== input.months[index])
  ) {
    throw new Error("Reservation months must be available and consecutive.");
  }

  if (!Number.isInteger(input.totalAmountCents) || input.totalAmountCents < 0) {
    throw new Error("Reservation amount must be a non-negative integer in cents.");
  }
}

export function buildReservationDraft(
  input: ReservationDraftInput,
  options: { id?: string; now?: string; status?: ReservationDocument["status"] } = {},
): ReservationDocument {
  validateDraftInput(input);

  const now = options.now ?? new Date().toISOString();

  return {
    _id: options.id ?? new ObjectId().toHexString(),
    status: options.status ?? "draft",
    primaryContactEmail: input.primaryContactEmail.trim(),
    months: input.months,
    requestedSize: input.requestedSize,
    salesUnit: "size_and_visibility_category",
    preferredSpaceId: input.preferredSpaceId,
    assignedSpaceIds: [],
    totalAmountCents: input.totalAmountCents,
    currency: "USD",
    paymentStatus: "not_started",
    createdAt: now,
    updatedAt: now,
  };
}

export async function ensureReservationIndexes(db: Db) {
  const reservations = db.collection<ReservationDocument>("reservations");

  await Promise.all([
    reservations.createIndex({ primaryContactEmail: 1 }),
    reservations.createIndex({ status: 1, expiresAt: 1 }),
    reservations.createIndex({ stripePaymentIntentId: 1 }, { sparse: true }),
  ]);
}

export async function insertReservationDraft(
  input: ReservationDraftInput,
  db?: Db,
  options?: { id?: string; now?: string; status?: ReservationDocument["status"] },
): Promise<ReservationDocument> {
  const draft = buildReservationDraft(input, options);
  const database = db ?? (await getMongoDb());

  await database.collection<ReservationDocument>("reservations").insertOne(draft);
  return draft;
}

export async function findReservationById(
  id: string,
  db?: Db,
): Promise<ReservationDocument | null> {
  const database = db ?? (await getMongoDb());

  return database
    .collection<ReservationDocument>("reservations")
    .findOne({ _id: id });
}

export async function findReservationsByIds(
  ids: string[],
  db?: Db,
): Promise<ReservationDocument[]> {
  if (ids.length === 0) return [];
  const database = db ?? (await getMongoDb());

  return database
    .collection<ReservationDocument>("reservations")
    .find({ _id: { $in: ids } })
    .toArray();
}

export async function updateReservationStatus(
  id: string,
  status: ReservationDocument["status"],
  db?: Db,
): Promise<ReservationDocument | null> {
  const database = db ?? (await getMongoDb());
  const reservations = database.collection<ReservationDocument>("reservations");
  const current = await reservations.findOne({ _id: id });

  if (!current) {
    return null;
  }

  if (!canTransitionReservation(current.status, status)) {
    throw new Error(
      `Invalid reservation status transition from ${current.status} to ${status}.`,
    );
  }

  const now = new Date().toISOString();
  await reservations.updateOne(
    { _id: id },
    { $set: { status, updatedAt: now } },
  );

  return { ...current, status, updatedAt: now };
}

export async function updateReservationPaymentStatus(
  id: string,
  update: {
    paymentStatus?: PaymentStatus;
    stripePaymentIntentId?: string | null;
  },
  db?: Db,
): Promise<ReservationDocument | null> {
  const database = db ?? (await getMongoDb());
  const reservations = database.collection<ReservationDocument>("reservations");
  const current = await reservations.findOne({ _id: id });

  if (!current) {
    return null;
  }

  const now = new Date().toISOString();
  const $set: Partial<ReservationDocument> = { updatedAt: now };
  const $unset: Partial<Record<keyof ReservationDocument, "">> = {};

  if (update.paymentStatus !== undefined) {
    $set.paymentStatus = update.paymentStatus;
  }

  if (update.stripePaymentIntentId !== undefined) {
    if (update.stripePaymentIntentId === null) {
      $unset.stripePaymentIntentId = "";
    } else {
      $set.stripePaymentIntentId = update.stripePaymentIntentId;
    }
  }

  const mongoUpdate =
    Object.keys($unset).length > 0 ? { $set, $unset } : { $set };

  await reservations.updateOne({ _id: id }, mongoUpdate);

  const updated = { ...current, ...$set };

  if ($unset.stripePaymentIntentId !== undefined) {
    delete updated.stripePaymentIntentId;
  }

  return updated;
}
