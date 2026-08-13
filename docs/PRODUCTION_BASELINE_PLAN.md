# Production Baseline Plan

## Product Standard

Public features should be honest about what is real. Published event content needs sources. Draft, generated, and in-review material belongs in admin/editorial routes until reviewed.

## First Milestone

Repurpose the copied app into a working historical wall for one sample month.

### Done

- Seeded June 1984 as the first public month wall.
- Rendered a responsive irregular wall using the inherited wall components.
- Mapped public tile copy toward historical events instead of creator reservations.
- Added `/events/[eventId]` as the public event detail route.
- Displayed event metadata and source citations on detail pages.
- Kept `/works/[spaceId]` as a compatibility redirect to event detail pages.
- Made wall tile footprint derive from editorial `importanceLevel`.
- Kept `/archive` and `/archive/[month]` available for archive browsing.
- Removed reservation links from the primary homepage and footer.

### Next Product Work

- Add explicit `context` and `whyItMatters` fields to event data and render them on detail pages.
- Repurpose `/archive` copy and archived seed data into historical month archive cards.
- Replace or hide public reservation, Stripe, and creator-submission routes.
- Convert the admin dashboard into an editorial review placeholder or event review surface.
- Rename inherited `exhibition`, `space`, `work`, `submission`, and `reservation` internals when each surface is touched.

## Later Product Work

- MongoDB-backed `months`, `events`, `sources`, `archiveSnapshots`, `correctionRequests`, and `editorialEvents`.
- Event search by month, year, category, person, country, or topic.
- Correction request workflow.
- Locked month snapshot automation.
- Clerk-backed editorial roles.
- Redis only after a measured cache need.
- Sponsorship, posters, education licenses, or API/data access after the editorial product is credible.

## Product Decisions

- Editorial importance controls tile size.
- Sponsorship must never secretly influence historical importance.
- Public walls expose only published or locked event content.
- Source citations are required for published historical events.
