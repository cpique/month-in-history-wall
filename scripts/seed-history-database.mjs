import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { MongoClient } from "mongodb";
import { prepareDocuments, seedPreparedDocuments } from "./seed-history-month.mjs";

const DEFAULT_IMPORT_DIR = "data/imports";

function usage() {
  return [
    "Usage: node scripts/seed-history-database.mjs [import-dir] [--dry-run] [--reset]",
    "",
    "Examples:",
    "  npm run seed:db -- --dry-run",
    "  npm run seed:db -- data/imports --reset",
    "",
    "Environment:",
    "  MONGODB_URI is required unless --dry-run is used.",
    "  MONGODB_DB defaults to month-history-museum.",
    "",
    "Options:",
    "  --dry-run  Validate and summarize imports without writing.",
    "  --reset    Delete existing months/events before seeding all imports.",
  ].join("\n");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function findJsonFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return findJsonFiles(entryPath);
      }

      if (entry.isFile() && entry.name.endsWith(".json")) {
        return [entryPath];
      }

      return [];
    }),
  );

  return files.flat().sort();
}

async function loadImport(filePath) {
  const input = JSON.parse(await readFile(filePath, "utf8"));
  const prepared = prepareDocuments(input);

  return {
    filePath,
    ...prepared,
  };
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const reset = args.includes("--reset");
  const importDir = args.find((arg) => !arg.startsWith("--")) ?? DEFAULT_IMPORT_DIR;

  if (args.includes("--help") || args.includes("-h")) {
    console.log(usage());
    return;
  }

  const files = await findJsonFiles(importDir);
  assert(files.length > 0, `No JSON import files found in ${importDir}.`);

  const imports = await Promise.all(files.map(loadImport));
  const monthIds = new Set();
  let eventCount = 0;

  for (const item of imports) {
    assert(!monthIds.has(item.month._id), `Duplicate month import: ${item.month._id}`);
    monthIds.add(item.month._id);
    eventCount += item.events.length;
  }

  if (dryRun) {
    console.log(
      JSON.stringify(
        {
          ok: true,
          dryRun: true,
          reset,
          importDir,
          files: imports.length,
          months: imports.map((item) => ({
            file: item.filePath,
            slug: item.month.slug,
            status: item.month.status,
            events: item.events.length,
          })),
          totals: {
            months: imports.length,
            events: eventCount,
          },
        },
        null,
        2,
      ),
    );
    return;
  }

  const uri = process.env.MONGODB_URI;
  assert(uri, "MONGODB_URI is required unless --dry-run is used.");

  const client = new MongoClient(uri);
  await client.connect();

  try {
    const db = client.db(process.env.MONGODB_DB ?? "month-history-museum");

    if (reset) {
      await db.collection("events").deleteMany({});
      await db.collection("months").deleteMany({});
    }

    for (const item of imports) {
      await seedPreparedDocuments(
        { month: item.month, events: item.events },
        { replace: true, db },
      );
    }

    console.log(
      `Seeded ${imports.length} months and ${eventCount} events into ${db.databaseName}.${reset ? " Reset existing months/events first." : ""}`,
    );
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
