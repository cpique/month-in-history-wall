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
- [ ] Archive page.
- [ ] Admin review placeholder or protected admin page.
- [ ] No reservation or payment flow in the primary experience.
- [x] Batch import path for month/event data.

## Decisions

| Date | Decision | Notes |
|---|---|---|
| 2026-08-13 | Repurpose incrementally. | Keep stable components working while replacing copied product behavior slice by slice. |
| 2026-08-13 | Use June 1984 as the first sample month. | Matches the README recommendation and gives a broad mix of politics, culture, sport, technology, and conflict. |
| 2026-08-13 | Keep some inherited internals temporarily. | `ExhibitionSpace` and repository names remain inherited; the public event detail route is now `/events/[eventId]`. |
| 2026-08-13 | Derive tile footprint from importance. | Editors set `importanceLevel`; code maps that to the public grid footprint. |
| 2026-08-13 | Use batch imports for month data. | Month/event data comes from JSON files and a seeder script rather than public forms. |

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
