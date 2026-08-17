import { ObjectId, type Db } from "mongodb";
import type { EditorialEventDocument } from "./domain-types";
import { getMongoDb } from "./mongodb";

const COLLECTION = "editorialEvents";

export async function recordEditorialEvent(
  event: Omit<EditorialEventDocument, "_id" | "createdAt">,
  db?: Db,
): Promise<EditorialEventDocument> {
  const database = db ?? (await getMongoDb());
  const record: EditorialEventDocument = {
    ...event,
    _id: new ObjectId().toHexString(),
    createdAt: new Date().toISOString(),
  };

  await database.collection<EditorialEventDocument>(COLLECTION).insertOne(record);
  return record;
}
