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
- [ ] One monthly wall.
- [ ] Tile sizes based on importance.
- [ ] Event detail pages.
- [ ] Source citation display.
- [ ] Archive page.
- [ ] Admin review placeholder or protected admin page.
- [ ] No reservation or payment flow in the primary experience.

## Decisions

| Date | Decision | Notes |
|---|---|---|
| 2026-08-13 | Repurpose incrementally. | Keep stable components working while replacing copied product behavior slice by slice. |
| 2026-08-13 | Use June 1984 as the first sample month. | Matches the README recommendation and gives a broad mix of politics, culture, sport, technology, and conflict. |
| 2026-08-13 | Keep inherited names temporarily. | Routes and types like `/works/[spaceId]` and `ExhibitionSpace` will be renamed when their feature loop is reached. |

## Open Questions

- What should the permanent public event detail route be: `/events/[eventId]` or `/archive/[month]/[eventSlug]` plus redirects?
- Should the first admin view manage events directly or start as a read-only editorial review placeholder?
- Which source quality rules are strict enough for publication in the first launch month?

## Verification Log

| Date | Check | Result | Notes |
|---|---|---|---|
| 2026-08-13 | Historical seed accuracy spot-check | Passed with correction | Replaced an incorrect Sally Ride June 1984 tile with Tetris after verifying NASA/Tetris references. |
