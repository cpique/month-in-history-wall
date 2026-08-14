# Project Tracker

This is the living status file for Month in History Wall.

## Current Status

The repo has been copied from One Month Museum and is being repurposed feature by feature. The README defines the new product direction. The first implementation loop has begun with seeded historical event data for June 1984.

The public homepage now presents a historical month wall instead of a reservation-first creator wall. Some inherited routes, type names, and repositories still use `exhibition`, `space`, `work`, `reservation`, and `submission`; those are implementation debt to migrate in later loops.

## Done

- [x] Reframed the docs around Month in History Wall.
- [x] Added seeded June 1984 historical event data with dates, locations, importance levels, media previews, and source records.
- [x] Removed the reservation link from the primary homepage navigation.
- [x] Updated wall and tile copy from creator-space language toward historical event language.
- [x] Added public event detail pages at `/events/[eventId]` with event metadata and source citations.
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

## Open Questions

- What should the permanent public event detail route be: `/events/[eventId]` or `/archive/[month]/[eventSlug]` plus redirects?
- Should the first admin view manage events directly or start as a read-only editorial review placeholder?
- Which source quality rules are strict enough for publication in the first launch month?

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
