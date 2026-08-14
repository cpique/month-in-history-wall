import { ObjectId, type Db } from "mongodb";
import type { ArchiveSnapshotDocument } from "./domain-types";
import { getMongoDb } from "./mongodb";

export type ArchiveSnapshotSummaryRecord = Pick<
  ArchiveSnapshotDocument,
  "slug" | "lockedAt" | "theme" | "description" | "monthLabel"
> & {
  spaces: Array<Pick<ArchiveSnapshotDocument["spaces"][number], "status">>;
};

export async function ensureArchiveIndexes(db: Db) {
  const archiveSnapshots = db.collection<ArchiveSnapshotDocument>("archiveSnapshots");

  await Promise.all([
    archiveSnapshots.createIndex({ slug: 1 }, { unique: true }),
    archiveSnapshots.createIndex({ lockedAt: -1 }),
  ]);
}

export async function insertArchiveSnapshot(
  snapshot: Omit<ArchiveSnapshotDocument, "_id">,
  db?: Db,
): Promise<ArchiveSnapshotDocument> {
  const database = db ?? (await getMongoDb());
  const doc: ArchiveSnapshotDocument = {
    ...snapshot,
    _id: new ObjectId().toHexString(),
  };

  await ensureArchiveIndexes(database);
  await database.collection<ArchiveSnapshotDocument>("archiveSnapshots").insertOne(doc);
  return doc;
}

export async function findArchiveSnapshots(
  db?: Db,
): Promise<ArchiveSnapshotDocument[]> {
  const database = db ?? (await getMongoDb());

  return database
    .collection<ArchiveSnapshotDocument>("archiveSnapshots")
    .find({})
    .sort({ lockedAt: -1 })
    .toArray();
}

export async function findArchiveSnapshotSummaries(
  db?: Db,
): Promise<ArchiveSnapshotSummaryRecord[]> {
  const database = db ?? (await getMongoDb());

  return database
    .collection<ArchiveSnapshotDocument>("archiveSnapshots")
    .find({})
    .project<ArchiveSnapshotSummaryRecord>({
      _id: 0,
      slug: 1,
      lockedAt: 1,
      theme: 1,
      description: 1,
      monthLabel: 1,
      "spaces.status": 1,
    })
    .sort({ lockedAt: -1 })
    .toArray();
}

export async function findArchiveSnapshotBySlug(
  slug: string,
  db?: Db,
): Promise<ArchiveSnapshotDocument | null> {
  const database = db ?? (await getMongoDb());

  return database
    .collection<ArchiveSnapshotDocument>("archiveSnapshots")
    .findOne({ slug });
}
