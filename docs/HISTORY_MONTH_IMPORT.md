# History Month Import

Use batch imports for editorial month data. Public forms do not fit the workflow: a month should be researched, sourced, reviewed, and inserted as a complete editorial artifact.

## Input File

Create a JSON file matching `schemas/history-month.schema.json`.

Minimum shape:

```json
{
  "month": 6,
  "year": 1984,
  "title": "June 1984",
  "description": "A curated historical wall.",
  "status": "draft",
  "events": [
    {
      "title": "Event title",
      "summary": "Short factual summary.",
      "category": "Politics",
      "date": "1984-06-06",
      "location": "City, Country",
      "countries": ["Country"],
      "relevanceScore": 85,
      "media": {
        "kind": "image",
        "url": "https://example.com/image.jpg",
        "alt": "Accessible image description."
      },
      "detailMarkdown": "Longer markdown body for the detail page.",
      "sources": [
        {
          "title": "Source title",
          "url": "https://example.com/source",
          "publisher": "Source publisher",
          "sourceType": "official"
        }
      ]
    }
  ]
}
```

## Relevance And Tile Size

Editors provide `relevanceScore` from `0` to `100` relative to the other events in that month.

The seeder ranks events within the month:

- Highest-ranked event: `featured`
- Next top group: `major`
- Middle group: `notable`
- Remaining group: `signal`

Tile size is then fixed from that importance level. Layout order is randomized deterministically from `layoutSeed`, so rerunning the same import keeps the same wall arrangement.

## Commands

Validate and preview without writing:

```bash
npm run seed:month -- data/imports/1984-06.sample.json --dry-run
```

Upsert a month into MongoDB:

```bash
npm run seed:month -- data/imports/1984-06.sample.json
```

Replace all existing events for that month before inserting:

```bash
npm run seed:month -- data/imports/1984-06.sample.json --replace
```

`MONGODB_URI` is required unless `--dry-run` is used. `MONGODB_DB` defaults to `month-in-history-wall`.
