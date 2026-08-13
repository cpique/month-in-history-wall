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
- `app/works/[spaceId]/page.tsx`: inherited detail route currently used as event detail pages for published tiles.
- `app/archive/page.tsx` and `app/archive/[month]/page.tsx`: archive index and locked month snapshot routes.
- `app/admin/page.tsx`: inherited admin review dashboard; target role is editorial review.
- `proxy.ts`: protects `/admin` routes with Clerk middleware when Clerk keys are configured.
- `components/exhibition/`: shared wall, tile, media, and wall-only viewing components. Naming is still inherited and should be gradually repurposed.
- `lib/exhibition-data.ts`: current seeded historical wall data for June 1984, including event dates, locations, importance levels, and source records.
- `lib/exhibition-service.ts`: inherited overlay service. It still reads approved reservation/submission data and should become a month/event service.
- `lib/domain-types.ts`: inherited persistence contracts. These should be migrated from exhibitions/spaces/submissions/reservations toward months/events/sources/archive snapshots.

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
- Event detail pages should explain what happened, why it mattered, and which sources support it.

## Integration Timing

- MongoDB remains the primary persistence target.
- Clerk remains the admin/editorial auth target.
- Redis is deferred.
- Stripe and reservation flows should not be visible in the primary public experience.
