import { MongoClient, type Db } from "mongodb";

type MongoGlobal = typeof globalThis & {
  __monthInHistoryWallMongo?: {
    clientPromise: Promise<MongoClient>;
  };
};

const globalForMongo = globalThis as MongoGlobal;
const uri = process.env.MONGODB_URI;
let clientPromise = globalForMongo.__monthInHistoryWallMongo?.clientPromise;

export function getMongoClient(): Promise<MongoClient> {
  if (!uri) {
    throw new Error("MONGODB_URI is required before using the MongoDB connection.");
  }

  if (!clientPromise) {
    clientPromise = new MongoClient(uri).connect();

    if (process.env.NODE_ENV !== "production") {
      globalForMongo.__monthInHistoryWallMongo = { clientPromise };
    }
  }

  return clientPromise;
}

export async function getMongoDb(): Promise<Db> {
  const client = await getMongoClient();
  return client.db(process.env.MONGODB_DB ?? "month-in-history-wall");
}
