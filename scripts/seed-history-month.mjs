import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import process from "node:process";
import { MongoClient } from "mongodb";

const VALID_MONTH_STATUSES = new Set(["draft", "published"]);
const VALID_MEDIA_KINDS = new Set(["image", "gif", "video"]);
const VALID_SOURCE_TYPES = new Set([
  "encyclopedia",
  "archive",
  "official",
  "news",
  "academic",
  "reference",
  "other",
]);

function usage() {
  return [
    "Usage: node scripts/seed-history-month.mjs <path-to-month.json> [--dry-run] [--replace]",
    "",
    "Environment:",
    "  MONGODB_URI is required unless --dry-run is used.",
    "  MONGODB_DB defaults to month-history-museum.",
  ].join("\n");
}

export function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function monthSlug(year, month) {
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}`;
}

function stableSortKey(seed, value) {
  return createHash("sha256").update(`${seed}:${value}`).digest("hex");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

export function validateImport(input) {
  assert(input && typeof input === "object" && !Array.isArray(input), "Import must be an object.");
  assert(Number.isInteger(input.month) && input.month >= 1 && input.month <= 12, "month must be an integer from 1 to 12.");
  assert(Number.isInteger(input.year), "year must be an integer.");
  assert(!input.status || VALID_MONTH_STATUSES.has(input.status), "status must be draft or published.");
  assert(Array.isArray(input.events), "events must be an array.");

  const seenSlugs = new Set();

  input.events.forEach((event, index) => {
    const label = `events[${index}]`;
    assert(event && typeof event === "object" && !Array.isArray(event), `${label} must be an object.`);
    assert(typeof event.title === "string" && event.title.trim(), `${label}.title is required.`);
    assert(typeof event.summary === "string" && event.summary.trim(), `${label}.summary is required.`);
    assert(typeof event.category === "string" && event.category.trim(), `${label}.category is required.`);
    assert(typeof event.relevanceScore === "number" && event.relevanceScore >= 0 && event.relevanceScore <= 100, `${label}.relevanceScore must be 0-100.`);
    assert(Array.isArray(event.sources) && event.sources.length > 0, `${label}.sources must contain at least one source.`);

    const eventSlug = event.slug ?? slugify(event.title);
    assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(eventSlug), `${label}.slug must be URL-safe lowercase words.`);
    assert(!seenSlugs.has(eventSlug), `${label}.slug is duplicated: ${eventSlug}`);
    seenSlugs.add(eventSlug);

    if (event.media) {
      assert(VALID_MEDIA_KINDS.has(event.media.kind), `${label}.media.kind must be image, gif, or video.`);
      assert(typeof event.media.url === "string" && event.media.url.trim(), `${label}.media.url is required.`);
      assert(typeof event.media.alt === "string" && event.media.alt.trim(), `${label}.media.alt is required.`);
    }

    event.sources.forEach((source, sourceIndex) => {
      const sourceLabel = `${label}.sources[${sourceIndex}]`;
      assert(source && typeof source === "object" && !Array.isArray(source), `${sourceLabel} must be an object.`);
      assert(typeof source.title === "string" && source.title.trim(), `${sourceLabel}.title is required.`);
      assert(typeof source.url === "string" && source.url.trim(), `${sourceLabel}.url is required.`);
      assert(!source.sourceType || VALID_SOURCE_TYPES.has(source.sourceType), `${sourceLabel}.sourceType is invalid.`);
    });
  });
}

function importanceForRank(rank, total) {
  if (rank === 0) {
    return "featured";
  }

  if (rank < Math.max(2, Math.ceil(total * 0.25))) {
    return "major";
  }

  if (rank < Math.max(4, Math.ceil(total * 0.7))) {
    return "notable";
  }

  return "signal";
}

const tileSizeByImportance = {
  featured: "featured",
  major: "large",
  notable: "medium",
  signal: "small",
};

export function prepareDocuments(input) {
  validateImport(input);

  const slug = monthSlug(input.year, input.month);
  const now = new Date().toISOString();
  const status = input.status ?? "draft";
  const layoutSeed = input.layoutSeed ?? slug;
  const ranked = [...input.events].sort((a, b) => b.relevanceScore - a.relevanceScore);
  const rankBySlug = new Map(
    ranked.map((event, rank) => [event.slug ?? slugify(event.title), rank]),
  );
  const positioned = [...input.events].sort((a, b) =>
    stableSortKey(layoutSeed, a.slug ?? a.title).localeCompare(
      stableSortKey(layoutSeed, b.slug ?? b.title),
    ),
  );
  const orderBySlug = new Map(
    positioned.map((event, order) => [event.slug ?? slugify(event.title), order]),
  );

  const month = {
    _id: slug,
    slug,
    month: input.month,
    year: input.year,
    title: input.title ?? slug,
    description: input.description ?? "",
    status,
    layoutSeed,
    createdAt: now,
    updatedAt: now,
  };

  const events = input.events.map((event) => {
    const eventSlug = event.slug ?? slugify(event.title);
    const rank = rankBySlug.get(eventSlug) ?? 0;
    const importanceLevel = importanceForRank(rank, input.events.length);

    return {
      _id: `${slug}:${eventSlug}`,
      monthId: slug,
      monthSlug: slug,
      slug: eventSlug,
      title: event.title,
      summary: event.summary,
      context: event.context ?? "",
      whyItMatters: event.whyItMatters ?? "",
      category: event.category,
      date: event.date,
      dateRange: event.dateRange,
      location: event.location ?? "",
      countries: event.countries ?? [],
      relevanceScore: event.relevanceScore,
      importanceLevel,
      tileSize: tileSizeByImportance[importanceLevel],
      status,
      media: event.media,
      detailMarkdown: event.detailMarkdown ?? "",
      sources: event.sources.map((source) => ({
        title: source.title,
        url: source.url,
        publisher: source.publisher ?? "",
        author: source.author,
        publishedAt: source.publishedAt,
        accessedAt: source.accessedAt,
        sourceType: source.sourceType ?? "other",
        notes: source.notes,
      })),
      layout: {
        order: orderBySlug.get(eventSlug) ?? 0,
      },
      createdAt: now,
      updatedAt: now,
    };
  });

  return { month, events };
}

function withoutCreatedAt(document) {
  const copy = { ...document };
  delete copy.createdAt;
  return copy;
}

export async function seedPreparedDocuments({ month, events }, { replace = false, db } = {}) {
  await db.collection("months").createIndex({ slug: 1 }, { unique: true });
  await db.collection("months").createIndex({ status: 1, year: 1, month: 1 });
  await db.collection("events").createIndex({ monthId: 1, status: 1, relevanceScore: -1 });
  await db.collection("events").createIndex({ monthSlug: 1, slug: 1 }, { unique: true });
  await db.collection("events").createIndex({
    title: "text",
    summary: "text",
    location: "text",
    countries: "text",
    category: "text",
  });

  if (replace) {
    await db.collection("events").deleteMany({ monthId: month._id });
  }

  await db.collection("months").updateOne(
    { _id: month._id },
    {
      $set: withoutCreatedAt(month),
      $setOnInsert: { createdAt: month.createdAt },
    },
    { upsert: true },
  );

  const operations = events.map((event) => ({
    updateOne: {
      filter: { _id: event._id },
      update: {
        $set: withoutCreatedAt(event),
        $setOnInsert: { createdAt: event.createdAt },
      },
      upsert: true,
    },
  }));

  if (operations.length > 0) {
    await db.collection("events").bulkWrite(operations, { ordered: true });
  }
}

async function main() {
  const args = process.argv.slice(2);
  const filePath = args.find((arg) => !arg.startsWith("--"));
  const dryRun = args.includes("--dry-run");
  const replace = args.includes("--replace");

  if (!filePath || args.includes("--help") || args.includes("-h")) {
    console.log(usage());
    process.exit(filePath ? 0 : 1);
  }

  const input = JSON.parse(await readFile(filePath, "utf8"));
  const { month, events } = prepareDocuments(input);

  if (dryRun) {
    console.log(
      JSON.stringify(
        {
          ok: true,
          dryRun: true,
          month,
          events: events.map((event) => ({
            id: event._id,
            title: event.title,
            relevanceScore: event.relevanceScore,
            importanceLevel: event.importanceLevel,
            tileSize: event.tileSize,
            layout: event.layout,
          })),
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
    await seedPreparedDocuments({ month, events }, { replace, db });

    console.log(
      `Seeded ${events.length} events for ${month.slug} into ${db.databaseName}.${replace ? " Replaced existing month events." : ""}`,
    );
  } finally {
    await client.close();
  }
}

const isCli = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (isCli) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
