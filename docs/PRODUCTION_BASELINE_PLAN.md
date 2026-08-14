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
- Moved event detail routes to read individual published/archived seeded events directly from MongoDB.
- Kept `/works/[spaceId]` as a compatibility redirect to event detail pages.
- Made wall tile footprint derive from editorial `importanceLevel`.
- Wired the public wall service to read seeded MongoDB `months` and `events` when available.
- Wired `/archive` and `/archive/[month]` to include seeded MongoDB months and event walls.
- Converted `/admin` into an editorial operations overview for imported historical months.
- Repurposed `/admin/analytics` into an editorial coverage dashboard.
- Removed inherited public reservation, checkout return, and space-status pages from the App Router.
- Removed inherited Stripe webhook/actions/payment modules and the Stripe dependency.
- Removed inherited reservation/submission repositories, tests, and domain types.
- Removed reservation links from the primary homepage and footer.

### Next Product Work

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
