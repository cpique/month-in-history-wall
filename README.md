# Month in History Wall

A visual archive of the world, one month at a time.

Month in History Wall turns a specific month, such as **June 1984**, into an irregular digital wall of important events, cultural moments, conflicts, discoveries, sports results, political changes, disasters, media releases, and everyday signals from that period.

Each wall is a curated snapshot of what happened in the world during that month.

## Product Concept

The product is not a news feed and not a conventional timeline.

It is a visual historical snapshot.

Each month becomes a single explorable wall. Events are represented as tiles. More important or globally significant events receive larger tiles. Smaller but culturally interesting events receive smaller tiles.

A visitor can open any tile to read a short explanation, see sources, understand context, and browse related events.

The long-term goal is to build a browsable archive of history by month.

## Core Promise

> Pick a month. See the world as it was then.

Examples:

- June 1984
- November 1963
- July 1969
- September 2001
- May 1945
- The month you were born
- The month a company was founded
- The month a country changed

## What A Wall Contains

A monthly wall may include:

- Politics
- Wars and conflicts
- Elections
- Diplomacy
- Science and technology
- Sports
- Culture
- Music
- Film and television
- Books and art
- Business and economics
- Disasters
- Protests and social movements
- Legal milestones
- Space exploration
- Deaths and births of notable people
- Everyday cultural signals, when relevant

The wall should feel broad, international, and historically grounded.

## Tile Size And Importance

Tile size is editorial.

Bigger tiles represent events with higher historical importance, broader impact, or stronger relevance to that month.

Suggested importance levels:

- **Featured**: defining event of the month
- **Major**: globally or historically significant
- **Notable**: important within a region, field, or category
- **Signal**: smaller but revealing cultural or contextual event

Importance must not be sold secretly.

If sponsored content exists, it must be clearly labeled as sponsored and visually distinct from editorial importance.

## Event Detail Pages

Each event tile opens a detail page.

A detail page should include:

- Event title
- Date or date range
- Location
- Category
- Short summary
- Historical context
- Why it matters
- Source citations
- Related events from the same month
- Optional image or media
- Editorial status

Every factual claim should be traceable to sources.

## Sources And Citations

Historical accuracy is central to the product.

Each event should have one or more sources.

Preferred source types:

- Encyclopedias and public archives
- Library or museum collections
- Government records
- Newspaper archives
- Academic sources
- Sports/statistics databases
- Official organization records
- Public-domain or properly licensed media repositories

Avoid relying on unsourced generated text.

AI can help draft summaries, but the final published event should preserve citations and be reviewed before locking.

## Editorial Workflow

The product should support a draft-to-published workflow.

Suggested states:

- **Draft**: generated or manually created, not public
- **Needs review**: ready for editorial review
- **Published**: visible on the public wall
- **Needs correction**: flagged by an admin or visitor
- **Archived/locked**: month is finalized and immutable

Admins should be able to:

- Create or import event candidates
- Edit summaries and categories
- Adjust importance
- Approve or reject events
- Add or verify sources
- Lock a completed month
- Review correction requests

## Public Visitor Experience

Visitors should be able to:

- Browse a monthly wall
- Open event detail pages
- Move between events
- Browse previous and next months
- Search by month, year, category, person, country, or topic
- View a wall-only/fullscreen mode
- Request a correction
- Share a month or event

The public experience should not expose draft editorial content.

## Generated Month Workflow

A future generation workflow may work like this:

1. Select a month and year.
2. Gather candidate events from source databases or curated lists.
3. Classify events by category.
4. Estimate importance.
5. Generate draft summaries.
6. Attach citations.
7. Generate an initial wall layout.
8. Admin reviews, edits, adds, removes, and resizes events.
9. Publish the month.
10. Lock the month into the permanent archive.

Generation should assist editors, not replace editorial judgment.

## Monetization Ideas

The product may be monetized through:

- Sponsored tiles, clearly labeled
- Sponsored months, such as “This month supported by…”
- Personalized birth-month or anniversary-month walls
- Printable posters
- Premium deep dives
- Education licenses
- API or dataset access
- Institutional/white-label historical walls
- Paid expedited correction or curation requests, without guaranteed editorial outcome

Editorial importance must remain separate from paid placement.

## What This Repo Was Copied From

This project was copied from **One Month Museum**, a monthly digital exhibition wall for creator submissions and reservable spaces.

The inherited codebase may contain features from that product, including:

- Reservation pages
- Stripe payment authorization
- Submission forms
- Creator/admin review flows
- Archive snapshots
- Wall tiles
- Work detail pages
- Clerk admin authentication
- MongoDB persistence

This project should be repurposed into a historical monthly snapshot product.

## What To Keep

Keep and adapt:

- The irregular wall layout
- Monthly archive pages
- Month detail routes
- Tile/detail browsing
- Fullscreen wall mode
- Admin review concepts
- MongoDB persistence
- Archive snapshot locking
- Dark/light theme support
- Public legal/info pages if useful
- Clerk admin authentication if admin review remains protected

## What To Remove Or Rework

Remove or heavily rework:

- Paid reservation flow
- Creator submission form
- Stripe checkout as a core flow
- “Available space” sales language
- Participant payment lifecycle
- Creator-focused copy
- Submission approval language where it should become editorial review

Payments may return later for sponsorship, posters, education licenses, or premium products, but they should not drive the first historical wall experience.

## Proposed Data Model

Core collections may include:

### `months`

One document per month wall.

Fields:

- `_id`
- `slug`, such as `1984-06`
- `month`
- `year`
- `title`
- `description`
- `status`: `draft`, `published`, `locked`
- `createdAt`
- `updatedAt`
- `lockedAt`

### `events`

One document per historical event.

Fields:

- `_id`
- `monthId`
- `title`
- `summary`
- `context`
- `whyItMatters`
- `date`
- `dateRange`
- `location`
- `countries`
- `category`
- `importanceLevel`
- `importanceScore`
- `tileSize`
- `status`
- `sources`
- `media`
- `createdAt`
- `updatedAt`

### `sources`

Source records attached to events.

Fields:

- `title`
- `url`
- `publisher`
- `author`
- `publishedAt`
- `accessedAt`
- `sourceType`
- `notes`

### `archiveSnapshots`

Immutable locked monthly wall.

Fields:

- `_id`
- `slug`
- `lockedAt`
- `title`
- `description`
- `events`
- `layout`
- `sources`

## Suggested Routes

Public routes:

- `/`
- `/archive`
- `/archive/[month]`
- `/events/[eventId]`
- `/search`
- `/corrections`
- `/about`

Admin routes:

- `/admin`
- `/admin/months`
- `/admin/months/[month]`
- `/admin/events/[eventId]`
- `/admin/sources`
- `/admin/corrections`

Future API/job routes:

- `/api/jobs/generate-month`
- `/api/jobs/lock-archive`
- `/api/corrections`

Scheduled jobs must be protected by secret tokens.

## Design Direction

The product should feel:

- Archival
- Editorial
- Visual
- Trustworthy
- Curious
- Calm
- Dense but readable
- More like an atlas or museum wall than a news site

Avoid making it feel like:

- A social feed
- A generic timeline
- A clickbait news grid
- A random AI content generator

## First Milestone

Repurpose the copied app into a working historical wall for one sample month.

Suggested first month:

- June 1984

First milestone requirements:

- Static or seeded event data
- One monthly wall
- Tile sizes based on importance
- Event detail pages
- Source citation display
- Archive page
- Admin review placeholder or protected admin page
- No reservation or payment flow in the primary experience

## Product Principle

The wall is not just decoration.

The wall is the argument: history is uneven, crowded, surprising, and interconnected. Each month should feel like a composed snapshot of the world.