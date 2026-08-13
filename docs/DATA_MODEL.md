# Data Model

This document defines the target persistence contract for Month in History Wall. The current TypeScript files still carry inherited `exhibition`, `space`, `submission`, and `reservation` names; migrate those contracts gradually as feature slices are repurposed.

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
- `importanceLevel`: `featured`, `major`, `notable`, or `signal`
- `importanceScore`
- `tileSize`
- `status`: `draft`, `needs_review`, `published`, `needs_correction`, or `archived`
- `sources`
- `media`
- `createdAt` and `updatedAt`

Useful indexes:

- Compound index on `monthId`, `status`, and `importanceScore`
- Text index on `title`, `summary`, `location`, `countries`, and `category`

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
- Do not add Redis until there is a measured cache need.
- Clerk protects admin/editorial workflows.
- Stripe reservation/payment data is inherited and should not drive the historical wall model.
