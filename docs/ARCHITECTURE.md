# Architecture Notes

Month in History Wall is a Next.js App Router application for browsing curated historical month walls.

## Stack

- Framework: Next.js 16.3 App Router with React 19.
- Styling: Tailwind CSS 4 through `@tailwindcss/postcss`.
- Persistence: MongoDB for dynamic editorial data.
- Cache: Redis is deferred until month reads, source lookups, or archive rollups show a real need.
- Auth: Clerk remains the intended admin/editorial authentication layer.
- Component kit: keep the current Tailwind wall language; add shadcn/ui only if admin/editorial controls become repetitive.
- Payments: inherited Stripe reservation code is not part of the primary historical wall experience and should be removed or isolated before launch.
- Theme: dark/light mode uses CSS custom properties mapped to `data-theme` on `<html>`.

## Current Code Shape

- `app/page.tsx`: public June 1984 historical wall route, using seeded event data.
- `app/events/[eventId]/page.tsx`: public event detail route with historical metadata and source citations.
- `app/works/[spaceId]/page.tsx`: inherited compatibility redirect to `/events/[eventId]`.
- `app/archive/page.tsx` and `app/archive/[month]/page.tsx`: archive index and month wall routes backed by seeded `months`/`events` plus legacy locked snapshots.
- `app/admin/page.tsx`: protected editorial operations overview for imported months, event counts, source coverage, and review queues.
- `proxy.ts`: protects `/admin` routes with Clerk middleware when Clerk keys are configured.
- Public reservation and status routes from the copied app have been removed from the App Router.
- `components/exhibition/`: shared wall, tile, media, and wall-only viewing components. Naming is still inherited and should be gradually repurposed.
- `lib/exhibition-data.ts`: current seeded historical wall data for June 1984, including event dates, locations, importance levels, source records, and the importance-to-tile-footprint mapping.
- `lib/exhibition-service.ts`: public wall service. It reads the latest published MongoDB month/events from the batch seeder when configured, with the static June 1984 wall as fallback.
- `lib/domain-types.ts`: inherited persistence contracts. These should be migrated from exhibitions/spaces/submissions/reservations toward months/events/sources/archive snapshots.
- `scripts/seed-history-month.mjs`: batch importer for JSON month files into MongoDB `months` and `events` collections.
- `schemas/history-month.schema.json`: import schema for month/event/source/media data.

## Target Data Model

See `docs/DATA_MODEL.md` for field-level notes. The product model should center on:

- `months`: one document per month wall.
- `events`: reviewed historical event records attached to months.
- `sources`: source citations attached to events.
- `archiveSnapshots`: immutable locked month snapshots.
- `correctionRequests`: visitor or editor correction reports.
- `editorialEvents`: internal audit trail for generation, review, publish, correction, and lock actions.

## Rendering Approach

- Keep pages and layouts as Server Components unless interactivity requires a Client Component.
- Public walls should only render published or locked event content.
- Draft, generated, in-review, and correction-needed content belongs behind admin/editorial routes.
- Locked archive pages should render immutable snapshots rather than querying mutable draft records.
- Event detail pages explain what happened and show source citations. Context and why-it-matters fields are next-detail-model work.
- Public tile footprint is derived from editorial importance, while color/media presentation can remain event-specific.

## Integration Timing

- MongoDB remains the primary persistence target.
- Public month/event reads use the `months` and `events` collections written by `scripts/seed-history-month.mjs`.
- Archive reads merge seeded published/locked months with legacy `archiveSnapshots`, so imported months appear in archive navigation before snapshot locking is fully repurposed.
- Clerk remains the admin/editorial auth target.
- Redis is deferred.
- Stripe and reservation flows should not be visible in the primary public experience.
