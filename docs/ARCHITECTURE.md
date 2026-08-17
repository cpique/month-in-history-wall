# Architecture Notes

Month in History Wall is a Next.js App Router application for browsing curated historical month walls.

## Stack

- Framework: Next.js 16.3 App Router with React 19.
- Styling: Tailwind CSS 4 through `@tailwindcss/postcss`.
- Persistence: MongoDB for dynamic editorial data.
- Cache: Redis is deferred until month reads, source lookups, or archive rollups show a real need.
- Auth: Clerk remains the intended admin/editorial authentication layer.
- Component kit: keep the current Tailwind wall language; add shadcn/ui only if admin/editorial controls become repetitive.
- Payments: Stripe has been removed from runtime dependencies and public routes. Future monetization should return as a deliberately designed sponsorship, poster, education, or data-access feature.
- Theme: dark/light mode uses CSS custom properties mapped to `data-theme` on `<html>`.

## Current Code Shape

- `app/page.tsx`: public June 1984 historical wall route, using seeded event data.
- `app/events/[eventId]/page.tsx`: public event detail route with historical metadata and source citations. It reads an individual published/archived seeded event from MongoDB when configured, then falls back to static sample data.
- `app/api/corrections/route.ts`: public correction request endpoint for published event detail pages.
- `app/works/[spaceId]/page.tsx`: inherited compatibility redirect to `/events/[eventId]`.
- `app/archive/page.tsx` and `app/archive/[month]/page.tsx`: archive index and month wall routes backed by seeded `months`/`events` plus legacy locked snapshots. Tiles backed by event records link to their public detail pages; legacy snapshots without event records remain non-clickable.
- `app/search/page.tsx`: public event search across months by title, category, place, country, or topic.
- `app/about/page.tsx`: public about page explaining the product, editorial approach, sources, and corrections.
- `app/corrections/page.tsx`: public correction policy page with process steps, request counts, and links to event-level correction forms.
- `app/admin/page.tsx`: protected editorial operations overview for imported months, event counts, source coverage, and review queues.
- `app/admin/months/page.tsx`: protected list of imported months with status, counts, and links to month detail.
- `app/admin/months/[month]/page.tsx`: protected month detail page showing all events and their editorial status.
- `app/admin/analytics/page.tsx`: protected editorial analytics dashboard for coverage health, category spread, citation density, media coverage, and review queues.
- `app/admin/corrections/page.tsx`: protected correction review queue for public correction requests.
- `proxy.ts`: protects `/admin` routes with Clerk middleware when Clerk keys are configured.
- Public reservation and status routes from the copied app have been removed from the App Router.
- `components/exhibition/`: shared wall, tile, media, and wall-only viewing components. Naming is still inherited and should be gradually repurposed.
- `lib/exhibition-data.ts`: current seeded historical wall data for June 1984, including event dates, locations, importance levels, source records, and the importance-to-tile-footprint mapping.
- `lib/exhibition-service.ts`: public wall service. It reads the latest published MongoDB month/events from the batch seeder when configured, with the static June 1984 wall as fallback.
- `lib/domain-types.ts`: persistence contracts for months, events, sources, and legacy archive snapshots.
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
- Event detail pages explain what happened, show context and why-it-matters text, and list source citations.
- Public correction requests can be submitted from event detail pages and are stored in MongoDB as `correctionRequests` when configured.
- Admins can triage correction requests by status; applying accepted corrections to event content remains an editorial data update.
- Public tile footprint is derived from editorial importance, while color/media presentation can remain event-specific.

## Integration Timing

- MongoDB remains the primary persistence target.
- Public month/event reads use the `months` and `events` collections written by `scripts/seed-history-month.mjs`.
- Archive reads merge seeded published/locked months with legacy `archiveSnapshots`, so imported months appear in archive navigation before snapshot locking is fully repurposed.
- Clerk remains the admin/editorial auth target.
- Redis is deferred.
- Stripe, reservation, and creator-submission runtime flows have been removed from the primary application.
