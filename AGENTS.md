Use this for the new history-wall repo:

```md
<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Direction

- Product: Month in History Wall, a visual archive of the world one month at a time.
- Core concept: each monthly wall is a curated historical snapshot made of event tiles. Larger tiles represent higher editorial importance; smaller tiles represent notable or contextual signals.
- Current implementation target: repurpose the copied One Month Museum codebase into a working historical month wall with event detail pages, source citations, archive navigation, admin/editorial review, and locked month snapshots.
- Primary database: MongoDB for dynamic data.
- Cache: Redis only when there is a measured or obvious caching need; do not add it speculatively.
- Auth: Clerk for admin/editorial authentication. Public visitor accounts are deferred.
- UI system: keep the current Tailwind setup and wall visual language. Introduce shadcn/ui only when repeated admin/editorial controls justify it.
- Payments: remove reservation/payment flows from the primary experience. Monetization may return later as clearly labeled sponsorships, personalized walls, education licenses, posters, or API/data access.
- Editorial trust: public event content must be sourced. AI-generated summaries are drafts until reviewed; citations and editorial review matter more than volume.

# Development Notes

- Keep pages and layouts as Server Components unless interactivity or browser APIs require a Client Component.
- Prefer structured product docs in `docs/` over expanding the README endlessly.
- Do not commit or push unless the user explicitly asks.
- Do not expose draft or in-review event content on public pages.
- Public wall tiles should link to event detail pages that explain what happened, why it mattered, and which sources support it.
- Separate editorial importance from sponsorship. Paid placement must be clearly labeled and must not secretly influence historical importance.
- Remove or repurpose creator-submission, reservation, and Stripe checkout code as the product is converted.
```