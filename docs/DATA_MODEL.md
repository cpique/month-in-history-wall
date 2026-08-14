# Data Model

This document defines the target persistence contract for Month in History Wall. Some rendering components still carry inherited `exhibition` and `space` names; migrate those contracts gradually as feature slices are repurposed.

## Goals

- Store each month as a curated historical wall.
- Keep editorial status separate from public visibility.
- Require source citations for published event content.
- Preserve locked months as immutable archive snapshots.
- Keep sponsorship or future paid placement separate from editorial importance.

## Collections

### `months`

One document per month wall.

- `_id`
- `slug`, such as `1984-06`
- `month`
- `year`
- `title`
- `description`
- `status`: `draft`, `published`, or `locked`
- `layoutSeed`
- `createdAt`, `updatedAt`, and optional `lockedAt`

Useful indexes:

- Unique index on `slug`
- Compound index on `status`, `year`, and `month`

### `events`

One document per historical event.

- `_id`
- `monthId`
- `slug`
- `title`
- `summary`
- `context`
- `whyItMatters`
- `date` or `dateRange`
- `location`
- `countries`
- `category`
- `relevanceScore`: `0` to `100`, relative to other events in the month
- `importanceLevel`: `featured`, `major`, `notable`, or `signal`
- `tileSize`
- `status`: `draft`, `needs_review`, `published`, `needs_correction`, or `archived`
- `sources`
- `media`
- `detailMarkdown`
- `layout.order`
- `createdAt` and `updatedAt`

Useful indexes:

- Compound index on `monthId`, `status`, and `relevanceScore`
- Unique compound index on `monthSlug` and `slug`
- Text index on `title`, `summary`, `location`, `countries`, and `category`

## Batch Import

Month data should be imported as a batch file, not entered through a public form.

- JSON Schema: `schemas/history-month.schema.json`
- Seeder: `scripts/seed-history-month.mjs`
- Sample import: `data/imports/1984-06.sample.json`
- Usage guide: `docs/HISTORY_MONTH_IMPORT.md`

The seeder validates required month/event fields, requires at least one source per event, ranks `relevanceScore` values within the month, assigns `importanceLevel` and `tileSize`, and stores deterministic randomized layout order from `layoutSeed`.

The public wall service reads the latest `published` month from `months`, loads its `published` events from `events`, sorts by `layout.order`, and maps them into the current wall component model. If MongoDB is not configured, or no published month/events exist, the app falls back to static June 1984 seed data.

The archive service also reads `published` and `locked` month records from `months`, counts their published/archived events and sources, and serves `/archive/[month]` from the same event data. Legacy `archiveSnapshots` remain supported during the transition.

### `sources`

Source records attached to events.

- `title`
- `url`
- `publisher`
- `author`
- `publishedAt`
- `accessedAt`
- `sourceType`
- `notes`

Sources may be embedded on events for the first implementation, then normalized if citation reuse and verification workflows justify it.

### `archiveSnapshots`

Immutable locked monthly wall.

- `_id`
- `slug`
- `lockedAt`
- `title`
- `description`
- `events`
- `layout`
- `sources`

Useful indexes:

- Unique index on `slug`
- Index on `lockedAt`

### `correctionRequests`

Visitor or editor correction reports.

- `_id`
- `eventId`
- `monthSlug`
- `message`
- `sourceUrl`
- `contactEmail`
- `status`: `open`, `reviewing`, `accepted`, `rejected`, or `closed`
- `createdAt` and `updatedAt`

Useful indexes:

- Compound index on `status` and `createdAt`
- Compound index on `eventId` and `createdAt`
- Compound index on `monthSlug` and `status`

Public event detail pages post to `/api/corrections`, which validates the event is public, stores an `open` request when MongoDB is configured, and redirects back to the event page with a submission status.

### `editorialEvents`

Append-only audit trail for admin/editorial actions.

- `_id`
- `type`: `event_created`, `event_updated`, `source_verified`, `event_published`, `event_unpublished`, `month_locked`, or `correction_reviewed`
- `actorId`
- `monthSlug`
- `eventId`
- `metadata`
- `createdAt`

## Constraints

- MongoDB is the primary database for dynamic data.
- Keep MongoDB connection creation lazy so the public app can build and run without database credentials.
- Read `MONGODB_URI` and optional `MONGODB_DB` from the environment.
- Default `MONGODB_DB` to `month-history-museum`; the copied source repo database name should not be reused.
- Do not add Redis until there is a measured cache need.
- Clerk protects admin/editorial workflows.
- Reservation/payment/submission repository remnants have been removed from the runtime data model.
