# Project Tracker

This is the living status file for Month in History Wall.

## Current Status

The repo has been copied from One Month Museum and is being repurposed feature by feature. The README defines the new product direction. The first implementation loops have produced a working historical wall baseline with seeded data, MongoDB imports, archive browsing, admin review surfaces, and correction handling.

The public homepage now presents a historical month wall instead of a reservation-first creator wall. Some rendering components still use inherited `exhibition`, `space`, and `work` naming; the old reservation, submission, payment, and participant analytics runtime paths have been removed.

## Done

- [x] Reframed the docs around Month in History Wall.
- [x] Added seeded June 1984 historical event data with dates, locations, importance levels, media previews, and source records.
- [x] Removed the reservation link from the primary homepage navigation.
- [x] Updated wall and tile copy from creator-space language toward historical event language.
- [x] Added public event detail pages at `/events/[eventId]` with event metadata and source citations.
- [x] Made event detail pages read individual published/archived MongoDB events instead of only the current wall.
- [x] Added public correction request intake from event detail pages.
- [x] Added an admin correction review queue with status triage.
- [x] Redirected inherited `/works/[spaceId]` detail URLs to the new event detail route.
- [x] Made public wall tile footprint derive from editorial importance.
- [x] Added a JSON Schema, sample import file, and MongoDB seeder for batch month/event imports.
- [x] Added an LLM prompt template for generating month import JSON drafts.
- [x] Added 2026 draft month imports with starter sourced events through August and a full database seed command.
- [x] Wired the public wall service to read seeded MongoDB `months` and `events` when available.
- [x] Wired archive browsing to include seeded MongoDB months and event walls.
- [x] Converted `/admin` into an editorial operations overview for imported historical months.
- [x] Repurposed `/admin/analytics` into an editorial coverage dashboard for month/event health.
- [x] Removed inherited public reservation, checkout return, and space-status routes from the primary app surface.
- [x] Removed inherited Stripe runtime code, webhook route, checkout actions, reservation form components, and dependency.
- [x] Removed inherited reservation/submission repositories, tests, and domain types.
- [x] Completed a repository quality pass for stale docs, dead helpers, dependency patches, and source-control risk.
- [x] Added a public `/search` page for cross-month event lookup by title, category, place, country, or topic.
- [x] Added a public `/about` page explaining the product, editorial approach, sources, and corrections.
- [x] Added a public `/corrections` page explaining the correction process and showing aggregate request counts.
- [x] Added protected `/admin/months` and `/admin/months/[month]` pages for editorial month review.
- [x] Performed a second repository quality pass: wired Clerk middleware, consolidated duplicate auth and status helpers, deduplicated `EventImportanceLevel`, added React `cache()` to event detail lookup, fixed source list React key, and added `--reset` warning to the database seeder.
- [x] Linked archived MongoDB-backed event tiles to their public event detail pages while preserving non-clickable legacy snapshot tiles that have no event record.
- [x] Added a public share button on event detail pages that uses the Web Share API when available and falls back to copying the event link to the clipboard.
- [x] Rendered event `detailMarkdown` as real Markdown using `react-markdown` with a restricted element set and Tailwind-styled components.
- [x] Added a GitHub Actions CI workflow that runs lint, type check, tests, and build on push and pull requests.

## In Progress

- [ ] Repurpose the copied codebase one feature at a time from the README first milestone.

## Next Feature Loop

1. Confirm the next README milestone feature.
2. Check whether the current code supports it.
3. Repurpose only the necessary code.
4. Run lint/tests/build as appropriate.
5. Update this tracker and suggest a commit message.

## First Milestone Checklist

- [x] Static or seeded event data.
- [x] One monthly wall.
- [x] Tile sizes based on importance.
- [x] Event detail pages.
- [x] Source citation display.
- [x] Archive page.
- [x] Admin review placeholder or protected admin page.
- [x] No reservation or payment flow in the primary experience.
- [x] Batch import path for month/event data.
- [x] Public wall reads seeded MongoDB month/event data.

## Decisions

| Date | Decision | Notes |
|---|---|---|
| 2026-08-13 | Repurpose incrementally. | Keep stable components working while replacing copied product behavior slice by slice. |
| 2026-08-13 | Use June 1984 as the first sample month. | Matches the README recommendation and gives a broad mix of politics, culture, sport, technology, and conflict. |
| 2026-08-13 | Keep some inherited internals temporarily. | `ExhibitionSpace` and repository names remain inherited; the public event detail route is now `/events/[eventId]`. |
| 2026-08-14 | Resolve event detail pages by event id. | Public detail pages can now load any published/archived seeded event, while draft events remain hidden. |
| 2026-08-14 | Accept public correction requests. | Public event pages can submit correction reports into MongoDB. |
| 2026-08-14 | Triage correction requests in admin. | Admins can review submitted corrections and move them through open, reviewing, accepted, rejected, or closed states. |
| 2026-08-13 | Derive tile footprint from importance. | Editors set `importanceLevel`; code maps that to the public grid footprint. |
| 2026-08-13 | Use batch imports for month data. | Month/event data comes from JSON files and a seeder script rather than public forms. |
| 2026-08-14 | Draft imports with a reusable LLM prompt. | Prompt requires valid JSON, real source URLs, uneven relevance scores, and media placeholders unless images are verified. |
| 2026-08-14 | Keep media as portable URLs. | Import files can use local `/media/...` URLs now and CDN URLs later without changing the event schema. |
| 2026-08-14 | Rebuild dynamic history data from imports. | `npm run seed:db -- --reset` recreates `months` and `events` from JSON files under `data/imports`. |
| 2026-08-13 | Read seeded data before static fallback. | Public wall uses the latest published MongoDB month/events when available, then falls back to static June 1984 data. |
| 2026-08-13 | Use `month-history-museum` as the MongoDB database name. | Avoid reusing the copied source repo database name. |
| 2026-08-13 | Archive seeded months before snapshot locking. | `/archive` can list published/locked `months` records from the batch importer while legacy snapshots remain supported. |
| 2026-08-13 | Make `/admin` editorial-first. | Admin landing page tracks imported months, events, sources, and review queues instead of reservation submissions. |
| 2026-08-14 | Make `/admin/analytics` editorial-first. | Analytics now tracks coverage health, category spread, sources, media coverage, and event review queues. |
| 2026-08-13 | Remove reservation routes from public app. | Keep deeper inherited payment/action modules for a later cleanup pass, but remove public pages from the primary route table. |
| 2026-08-14 | Remove Stripe runtime path. | Public routes no longer depend on checkout, so Stripe code and dependency were removed before deeper reservation repository cleanup. |
| 2026-08-14 | Remove reservation/submission repositories. | No active historical workflow imports them, so the runtime model now centers on months, events, sources, and legacy snapshots. |
| 2026-08-14 | Keep legal docs aligned with the history product. | Privacy and cookie copy now describe correction requests, admin Clerk auth, sourced event records, and no public tracking/payment cookies. |
| 2026-08-18 | Render event detail text as Markdown. | Added `react-markdown` with a restricted element set so detail pages can use links, emphasis, and lists without raw HTML or scripts. |
| 2026-08-18 | Add GitHub Actions CI. | Workflow runs lint, type check, tests, and build on every push/PR to `main` using Node 20 and `npm ci`. |

## Open Questions

- What should the permanent public event detail route be: `/events/[eventId]` or `/archive/[month]/[eventSlug]` plus redirects?
- Should the first admin view manage events directly or start as a read-only editorial review placeholder?
- Which source quality rules are strict enough for publication in the first launch month?
- **Archive wall tiles are not linked to event detail pages.** `/archive/[month]` passes `getPublishedHref={() => null}`, so locked-month tiles have no link. The product direction says tiles should link to event pages — decide whether archived events should be readable via `/events/[eventId]` even after a month is locked.
- **`requireAdminAuth` silently bypasses auth when Clerk keys are absent.** This is intentional for local dev, but there is no log warning when keys are missing in a deployed context. Consider adding a `console.warn` so the bypass is visible in production logs if keys are ever accidentally unset.
- **`seed:db` with `replace: true` always drops events for every seeded month**, even without `--reset`. This is fine for full rebuilds but makes incremental event updates (e.g. adding one event to an existing month) more destructive than necessary.

## Verification Log

| Date | Check | Result | Notes |
|---|---|---|---|
| 2026-08-13 | Historical seed accuracy spot-check | Passed with correction | Replaced an incorrect Sally Ride June 1984 tile with Tetris after verifying NASA/Tetris references. |
| 2026-08-13 | `npm run lint` | Passed | Event detail route, citation display, docs, and compatibility redirect passed ESLint. |
| 2026-08-13 | `npm run test` | Passed | Existing Vitest suite plus citation guard passes: 5 files, 17 tests. |
| 2026-08-13 | `npm run build` | Passed | Production build passed outside the sandbox after the recurring `spawn EPERM` sandbox failure. |
| 2026-08-13 | `npm run lint` | Passed | Importance-derived tile sizing and docs passed ESLint. |
| 2026-08-13 | `npm run test` | Passed | Existing Vitest suite plus importance sizing checks passes: 5 files, 19 tests. |
| 2026-08-13 | `npm run build` | Passed | Production build passed outside the sandbox after the recurring `spawn EPERM` sandbox failure. |
| 2026-08-13 | `npm run seed:month -- data/imports/1984-06.sample.json --dry-run` | Passed | Import validation, ranking, tile-size assignment, and deterministic layout preview completed without MongoDB. |
| 2026-08-13 | `npm run lint` | Passed | Batch import schema, seeder, docs, and persistence types passed ESLint. |
| 2026-08-13 | `npm run test` | Passed | Existing Vitest suite remains green: 5 files, 19 tests. |
| 2026-08-13 | `npm run build` | Passed | Production build passed outside the sandbox after the recurring `spawn EPERM` sandbox failure. |
| 2026-08-13 | `npm run lint` | Passed | Seeded MongoDB month/event read service, event detail additions, and docs passed ESLint. |
| 2026-08-13 | `npm run test` | Passed | Existing suite plus month/event mapper test passes: 6 files, 20 tests. |
| 2026-08-13 | `npm run seed:month -- data/imports/1984-06.sample.json --dry-run` | Passed | Import dry-run remains green after wiring public reads. |
| 2026-08-13 | `npm run build` | Passed | Production build passed outside the sandbox after the recurring `spawn EPERM` sandbox failure. |
| 2026-08-13 | `npm run lint` | Passed | Seeded archive summaries/month walls, archive card copy, and docs passed ESLint. |
| 2026-08-13 | `npm run test` | Passed | Existing suite plus seeded archive mapping tests passes: 7 files, 22 tests. |
| 2026-08-13 | `npm run seed:month -- data/imports/1984-06.sample.json --dry-run` | Passed | Import dry-run remains green after archive service changes. |
| 2026-08-13 | `npm run build` | Passed | Production build passed outside the sandbox after the recurring `spawn EPERM` sandbox failure. |
| 2026-08-13 | `npm run lint` | Passed | Editorial admin overview and docs passed ESLint. |
| 2026-08-13 | `npm run test` | Passed | Existing suite remains green: 7 files, 22 tests. |
| 2026-08-13 | `npm run seed:month -- data/imports/1984-06.sample.json --dry-run` | Passed | Import dry-run remains green after admin overview changes. |
| 2026-08-13 | `npm run build` | Passed | Production build passed outside the sandbox after the recurring `spawn EPERM` sandbox failure. |
| 2026-08-13 | `npm run lint` | Passed | Public reservation route removal, dead-link cleanup, and policy copy passed ESLint. |
| 2026-08-13 | `npm run test` | Passed | Existing suite remains green: 7 files, 22 tests. |
| 2026-08-13 | `npm run seed:month -- data/imports/1984-06.sample.json --dry-run` | Passed | Import dry-run remains green after public route removal. |
| 2026-08-13 | `npm run build` | Passed | Production route table no longer includes `/reserve`, checkout return pages, or `/spaces/[spaceId]`; build passed outside the sandbox after recurring `spawn EPERM`. |
| 2026-08-14 | `npm run lint` | Passed | Stripe runtime removal, admin action cleanup, package update, and docs passed ESLint. |
| 2026-08-14 | `npm run test` | Passed | Existing suite remains green: 7 files, 22 tests. |
| 2026-08-14 | `npm run seed:month -- data/imports/1984-06.sample.json --dry-run` | Passed | Import dry-run remains green after Stripe runtime removal. |
| 2026-08-14 | `npm run build` | Passed | Production route table no longer includes the Stripe webhook route; build passed outside the sandbox after recurring `spawn EPERM`. |
| 2026-08-14 | `npm run lint` | Passed | Editorial analytics dashboard and stale participant analytics cleanup passed ESLint. |
| 2026-08-14 | `npm run test` | Passed | Existing suite plus editorial analytics summary test passes: 8 files, 23 tests. |
| 2026-08-14 | `npm run seed:month -- data/imports/1984-06.sample.json --dry-run` | Passed | Import dry-run remains green after analytics repurpose. |
| 2026-08-14 | `npm run build` | Passed | Production route table includes `/admin/analytics`; build passed outside the sandbox after recurring `spawn EPERM`. |
| 2026-08-14 | `npm run seed:month -- data/imports/2026-01.json --dry-run` | Passed | Draft month import with starter sourced events validates and previews without MongoDB. |
| 2026-08-14 | `npm run seed:db -- --dry-run` | Passed | Full import rebuild preview found 13 month files and 13 seeded events. |
| 2026-08-14 | `npm run lint` | Passed | Full database seeder, 2026 import scaffolds, docs, and local media placeholder passed ESLint. |
| 2026-08-14 | `npm run test` | Passed | Existing suite remains green: 8 files, 23 tests. |
| 2026-08-14 | `npm run seed:month -- data/imports/1984-06.sample.json --dry-run` | Passed | Populated month import still validates after allowing empty draft months. |
| 2026-08-14 | `npm run build` | Passed | Production build passed outside the sandbox after recurring `spawn EPERM`. |
| 2026-08-14 | `npm run lint` | Passed | Event detail route now resolves individual seeded events and passed ESLint. |
| 2026-08-14 | `npm run test` | Passed | Existing suite plus public event detail lookup tests passes: 8 files, 25 tests. |
| 2026-08-14 | `npm run seed:db -- --dry-run` | Passed | Full import preview remains green after event detail lookup changes. |
| 2026-08-14 | `npm run build` | Passed | Production build passed outside the sandbox after recurring `spawn EPERM`. |
| 2026-08-14 | `npm run lint` | Passed | Reservation/submission repository cleanup and docs passed ESLint. |
| 2026-08-14 | `npm run test` | Passed | Suite now reflects active historical code: 4 files, 11 tests. |
| 2026-08-14 | `npm run seed:db -- --dry-run` | Passed | Full import preview remains green after removing copied repository code. |
| 2026-08-14 | `npm run build` | Passed | Production build passed outside the sandbox after recurring `spawn EPERM`. |
| 2026-08-14 | `npm run lint` | Passed | Public correction request form, API route, repository, and docs passed ESLint. |
| 2026-08-14 | `npm run test` | Passed | Existing suite plus correction request validation tests passes: 5 files, 13 tests. |
| 2026-08-14 | `npm run seed:db -- --dry-run` | Passed | Full import preview remains green after correction request intake. |
| 2026-08-14 | `npm run build` | Passed | Production route table now includes `/api/corrections`; build passed outside the sandbox after recurring `spawn EPERM`. |
| 2026-08-14 | `npm run lint` | Passed | Admin correction review queue, status action, repository helpers, and docs passed ESLint. |
| 2026-08-14 | `npm run test` | Passed | Existing suite plus correction status update test passes: 5 files, 14 tests. |
| 2026-08-14 | `npm run seed:db -- --dry-run` | Passed | Full import preview remains green after admin correction review changes. |
| 2026-08-14 | `npm run build` | Passed | Production route table now includes `/admin/corrections`; build passed outside the sandbox after recurring `spawn EPERM`. |
| 2026-08-14 | Repository sensitive-file scan | Passed | No tracked env/private/generated/large artifact files found; `.env.local`, `.next`, `node_modules`, generated typings, and uploads are ignored. |
| 2026-08-14 | `npm outdated --json` | Reviewed | Applied safe patch updates for Clerk, Next, React, React DOM, and eslint-config-next; left major tooling upgrades for a dedicated pass. |
| 2026-08-14 | `npm run lint` | Passed | Quality pass cleanup, legal docs, and dependency patch updates passed ESLint. |
| 2026-08-14 | `npm run test` | Passed | Active suite remains green: 5 files, 14 tests. |
| 2026-08-14 | `npm run seed:db -- --dry-run` | Passed | Full import preview remains green after quality pass changes. |
| 2026-08-14 | `npm run build` | Passed | Production build passed on Next 16.3.1 outside the sandbox after recurring `spawn EPERM`. |
| 2026-08-17 | `npm run lint` | Passed | Public search page, search service, footer link, and docs passed ESLint. |
| 2026-08-17 | `npm run test` | Passed | Existing suite plus search service tests passes: 6 files, 20 tests. |
| 2026-08-17 | `npm run seed:db -- --dry-run` | Passed | Full import preview remains green after adding cross-month search. |
| 2026-08-17 | `npm run build` | Passed | Production route table now includes `/search`; build passed outside the sandbox. |
| 2026-08-17 | `npm run lint` | Passed | Public about page, footer link, and docs passed ESLint. |
| 2026-08-17 | `npm run test` | Passed | Existing suite remains green: 6 files, 20 tests. |
| 2026-08-17 | `npm run seed:db -- --dry-run` | Passed | Full import preview remains green after adding the about page. |
| 2026-08-17 | `npm run build` | Passed | Production route table now includes `/about`; build passed outside the sandbox. |
| 2026-08-17 | `npm run lint` | Passed | Public corrections page, footer link, and docs passed ESLint. |
| 2026-08-17 | `npm run test` | Passed | Existing suite remains green: 6 files, 20 tests. |
| 2026-08-17 | `npm run seed:db -- --dry-run` | Passed | Full import preview remains green after adding the corrections page. |
| 2026-08-17 | `npm run build` | Passed | Production route table now includes `/corrections`; build passed outside the sandbox. |
| 2026-08-17 | `npm run lint` | Passed | Admin month list/detail pages, service, tests, and docs passed ESLint. |
| 2026-08-17 | `npm run test` | Passed | Existing suite plus admin month detail service tests passes: 7 files, 23 tests. |
| 2026-08-17 | `npm run seed:db -- --dry-run` | Passed | Full import preview remains green after adding admin month review pages. |
| 2026-08-17 | `npm run build` | Passed | Production route table now includes `/admin/months` and `/admin/months/[month]`; build passed outside the sandbox. |
| 2026-08-17 | `npm run test` (quality pass) | Passed | 7 files, 23 tests — all green after Clerk middleware wiring, auth consolidation, duplicate-type cleanup, `cache()` on event detail lookup, React key fix, and seeder warning. |
| 2026-08-17 | `npx tsc --noEmit` (quality pass) | Passed | Zero TypeScript errors after all quality pass changes. |
| 2026-08-18 | `npm run lint` | Passed | Event share button, server-side share URL construction, and updated event detail page passed ESLint. |
| 2026-08-18 | `npm run test` | Passed | Existing suite remains green after adding the share feature. |
| 2026-08-18 | `npm run seed:db -- --dry-run` | Passed | Full import preview remains green after share feature changes. |
| 2026-08-18 | `npm run build` | Passed | Production route table unchanged; build passed outside the sandbox. |
| 2026-08-18 | `npm install react-markdown` | Added | New dependency for rendering Markdown detail text on event pages. |
| 2026-08-18 | `npm run lint` | Passed | Markdown renderer component, updated event detail page, and docs passed ESLint. |
| 2026-08-18 | `npm run test` | Passed | Existing suite remains green after adding Markdown rendering. |
| 2026-08-18 | `npm run seed:db -- --dry-run` | Passed | Full import preview remains green after Markdown rendering changes. |
| 2026-08-18 | `npm run build` | Passed | Production build passed with `react-markdown` bundled. |
| 2026-08-18 | `npm run lint` | Passed | New GitHub Actions CI workflow passed ESLint and was validated locally. |
| 2026-08-18 | `npx tsc --noEmit` | Passed | Zero TypeScript errors before adding the CI workflow. |
| 2026-08-18 | `npm run test` | Passed | Existing suite remains green before adding the CI workflow. |
| 2026-08-18 | `npm run build` | Passed | Production build passed before adding the CI workflow. |
