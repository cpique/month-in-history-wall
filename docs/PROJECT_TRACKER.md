# Project Tracker

This is the living status file for One Month Museum. Keep this updated when work starts, finishes, gets blocked, or when product/technical decisions change.

## Current Status

The product has moved from a default Next.js starter app to a working public exhibition surface with reservation, review, payment, and archive workflows. The public wall is composed from reusable exhibition components, reads from typed static exhibition data overlaid with approved submissions, links published current spaces to dynamic work detail pages with real media previews, links review spaces to status pages, includes dynamic archive browsing with locked monthly snapshot pages, and has working reservation pages for available spaces.

The public wall is dynamic when MongoDB is configured and overlays approved submissions onto the static wall template. The work detail page reads from the same dynamic exhibition service and displays real uploaded media. The archive (`/archive` and `/archive/[month]`) is dynamic and reads locked snapshots from MongoDB when configured, falling back to static examples. The admin dashboard can lock the current month into an immutable `archiveSnapshots` document. The full reservation-review-payment flow works end-to-end when MongoDB and Stripe are configured, including media file uploads saved to local `public/uploads/`. The admin dashboard is protected by Clerk with sign-in/sign-up flows and server-action auth guards; it degrades gracefully to an open dashboard when Clerk keys are absent. A `/admin/analytics` dashboard tracks reservation funnels, conversion rates, and recent participant events. The entire public and admin surface uses CSS custom properties for light and dark themes, with system-preference detection and a footer toggle. Public content, privacy, cookie, and content policy routes explain the current product expectations. The core product inventory is set at 48 spaces with category-based reservations.

## Done

- [x] Replaced the starter page with a first One Month Museum exhibition wall.
- [x] Added responsive occupied, available, review, and featured space states.
- [x] Updated app metadata for One Month Museum.
- [x] Removed remote Google font dependency so builds can run without network font fetching.
- [x] Added `docs/ARCHITECTURE.md` with stack and data-model direction.
- [x] Added `docs/PRODUCTION_BASELINE_PLAN.md` with phased product work.
- [x] Added `docs/ADMIN_SETUP.md` with local admin, MongoDB, and Clerk setup notes.
- [x] Added this living `docs/PROJECT_TRACKER.md` file.
- [x] Updated `AGENTS.md` with project-specific working notes.
- [x] Confirmed MongoDB as the primary future database.
- [x] Deferred Redis until a real cache need appears.
- [x] Integrated Clerk for admin authentication; participant accounts remain deferred.
- [x] Deferred shadcn/ui until repeated controls or dashboard surfaces justify it.
- [x] Extracted static exhibition data from `app/page.tsx` into `lib/exhibition-data.ts`.
- [x] Split the public wall into reusable components: intro, wall grid, and space tile.
- [x] Added dynamic work detail pages at `/works/[spaceId]` for occupied and featured spaces.
- [x] Added an archive route at `/archive` for completed months.
- [x] Added locked archive snapshot pages at `/archive/[month]`.
- [x] Added reservation pages at `/reserve` and `/reserve/[spaceId]`.
- [x] Added reservation metadata for available spaces.
- [x] Added status pages at `/spaces/[spaceId]` for available and review spaces.
- [x] Added content policy acknowledgement copy to the reservation form.
- [x] Added public content policy page at `/policy`.
- [x] Added working privacy policy page at `/privacy`.
- [x] Added working cookie policy page at `/cookies`.
- [x] Added Vitest unit-test foundation and policy/state/data tests.
- [x] Added an authenticated admin review dashboard with real actions.
- [x] Added `docs/CONTENT_POLICY.md` as the working policy source.
- [x] Added typed media previews for published work detail pages.
- [x] Added `docs/DATA_MODEL.md` with MongoDB collection and state-flow notes.
- [x] Added `lib/domain-types.ts` with persistence-facing document contracts.
- [x] Added a lazy MongoDB connection boundary and safe `.env.example` without wiring public routes to persistence.
- [x] Added a validated reservation draft repository boundary with MongoDB indexes and unit tests.
- [x] Added a validated submission draft repository boundary with media/policy checks and unit tests.
- [x] Overlaid approved submissions onto the current exhibition wall and made `/` and `/works/[spaceId]` dynamic when MongoDB is configured.
- [x] Made `/archive` and `/archive/[month]` dynamic and added the `lockCurrentExhibition` admin action to create immutable archive snapshots.
- [x] Added `docs/CORE_PRODUCT_INVENTORY.md` with the 48-space inventory decision.
- [x] Added `lib/inventory-policy.ts` with typed inventory and sales-model policy.
- [x] Added explicit wall status guidance and tile actions for browsing, reservation, and review states.
- [x] Verified `npm run lint` passes.
- [x] Verified `npm run build` passes outside the sandbox.
- [x] Wired the reservation form to server actions that create reservation and submission drafts in MongoDB.
- [x] Added Stripe payment authorization and capture before and after manual review.
- [x] Added admin analytics dashboard at `/admin/analytics`.
- [x] Added dark/light theme support with CSS variables, theme provider, and footer toggle.
- [x] Fixed the footer theme toggle hydration mismatch found during the August 2026 local launch check.
- [x] Improved reservation draft failure handling when MongoDB is not configured and documented the local Docker MongoDB settings.
- [x] Made `/` the full current museum landing page and removed public-facing technical implementation copy.
- [x] Improved dark-mode wall readability and tiny-tile text fitting from the August 2026 local launch check.
- [x] Improved archive month navigation by using lean summary reads, parallel data loading, and an archive-wall loading shell.
- [x] Clarified admin approval management, Clerk setup, and kept Clerk sign-in/sign-up routes reachable when admin protection is enabled.
- [x] Added seeded public media visuals to published wall tiles so the current wall feels more alive before real submissions are approved.
- [x] Improved work detail browsing with visual previous/next cards and published-wall return context.
- [x] Kept in-review submission content admin-only on public surfaces, added wall-only viewing mode, and disabled real admin actions for fallback sample rows.

## In Progress

- [ ] Shape the public exhibition browsing experience.
- [ ] Turn the product brief into implementation-sized milestones.

## Next

- [x] Add unavailable/review behavior that does not feel like a dead link.
- [x] Define MongoDB schema/model notes in more detail before installing database packages.
- [x] Decide the first core product space inventory and size categories.
- [x] Decide whether the core product sells exact spaces or only size categories.
- [x] Add visual media previews or image assets for work detail pages.
- [x] Add content policy acknowledgement to the reservation form.
- [x] Clarify public wall navigation and tile actions before adding dynamic workflows.
- [x] Add a client reservation draft form with submission metadata and local confirmation.
- [x] Add one-month/three-month duration and start-month choices to the reservation form.
- [x] Show submitted draft details locally and require alt text for visual media.

## Later

- [x] Add lazy MongoDB connection boundary.
- [x] Add MongoDB repositories and persistence mutations.
- [x] Add reservation draft builder/repository contract before wiring a server action.
- [x] Add submission draft builder/repository contract before wiring an atomic write flow.
- [x] Add reservation state transition contract before persistence.
- [x] Expose the reservation lifecycle and separate payment status in the reservation flow.
- [x] Add server-rendered guided filters for current wall browsing states.
- [x] Add URL-based search that composes with current wall status filters.
- [x] Add previous/next navigation across published work detail pages.
- [x] Add newer/older navigation across locked archive months.
- [x] Clarify locked archive tile affordances and accessibility labels.
- [x] Clarify wall filter counts and distinguish published, available, and in-review spaces.
- [x] Add site-wide low-chrome links to archive, reservation, privacy, and cookie information.
- [x] Add submission form and media metadata capture.
- [x] Add authenticated admin dashboard for manual review and publishing.
- [x] Add Stripe payment authorization/capture flow.
- [ ] Evaluate Stripe subscriptions or recurring monetization after one- and three-month reservations work.
- [x] Add archive snapshot locking for completed exhibitions.
- [x] Add participant analytics dashboard.
- [x] Add Clerk for admin authentication.
- [ ] Add Redis if caching becomes necessary.
- [ ] Add shadcn/ui if forms/dashboard controls become repetitive enough to justify it.
- [x] Add dark/light theme support with CSS variables and a theme provider.
- [ ] Add unit, component, and end-to-end tests in stages as workflows become real.
- [ ] Add secured scheduled archive-lock job with day-1 target, day-3 fallback, and idempotent snapshot creation.
- [ ] Complete legal review of privacy, cookie, content, terms, refund, and takedown policies before launch.

## Decisions

| Date | Decision | Notes |
|---|---|---|
| 2026-08-03 | MongoDB will be the primary database. | Use when persistence is introduced. |
| 2026-08-03 | Redis is deferred. | Add only for a measured or obvious cache need. |
| 2026-08-03 | Clerk is used for admin authentication. | Participant accounts remain deferred. |
| 2026-08-03 | shadcn/ui is deferred. | Current Tailwind setup is enough for the first public surface. |
| 2026-08-03 | Build the exhibition wall first. | Reservation, payment, admin, and archive workflows come after the public surface is credible. |
| 2026-08-03 | No commits or pushes. | Changes stay local until explicitly requested. |
| 2026-08-03 | Keep early exhibition data static and typed. | This gives the UI a stable contract before MongoDB is added. |
| 2026-08-03 | Use static detail routes for published spaces first. | Occupied/featured spaces link to `/works/[spaceId]`; available/review spaces route toward reservation context for now. |
| 2026-08-03 | Use static archive routes before persistence. | `/archive` and `/archive/[month]` establish the public archive shape before MongoDB snapshots exist. |
| 2026-08-03 | Build reservation UI before persistence/payment. | `/reserve/[spaceId]` captures the shape of the flow before MongoDB, uploads, Stripe, or auth are added. |
| 2026-08-04 | Route review spaces to status pages. | Non-published spaces should explain their state and next action instead of becoming inert tiles. |
| 2026-08-04 | Publish content policy before payment. | The reservation flow can link to policy expectations before enforcement, payments, or admin review exist. |
| 2026-08-04 | Use typed media previews before uploads. | Work detail pages can show credible media surfaces while real upload/storage decisions remain deferred. |
| 2026-08-04 | Define persistence contracts before installing MongoDB. | Collection shape, indexes, and state flow should be agreed before adding runtime database code. |
| 2026-08-04 | Use a 48-space core product inventory. | Mix: 16 tiny, 18 small, 9 medium, 4 large, and 1 curated featured slot. |
| 2026-08-04 | Sell size and visibility categories, not permanent exact coordinates. | Selected slots are preferences or current-month hold targets; multi-month reservations get similar size and visibility. |
| 2026-08-05 | Treat privacy and cookie pages as working product requirements, not final legal advice. | Publish only after jurisdictional review and after providers are known. |
| 2026-08-05 | Keep the wall custom-styled and defer shadcn/ui. | Use shadcn/ui later for repeated admin or form controls if it improves consistency. |
| 2026-08-05 | Defer caching until measured need. | Redis candidates are published exhibition reads, archive summaries, and analytics rollups. |
| 2026-08-05 | Make admin review a protected workflow. | Clerk should arrive with protected admin or participant features. |
| 2026-08-12 | Frame the product as a real working product, not an MVP or prototype. | Docs use Core Product, Production Baseline, Product Roadmap, Next Product Work, and Later Product Work. |
| 2026-08-13 | Keep implementation details out of public homepage copy. | The current museum wall should be the first experience at `/`; provider and architecture notes belong in docs/admin context. |
| 2026-08-13 | Archive locking should be automatic with manual override. | Target day 1 after month end at 00:15 UTC, fallback by day 3, and keep the admin lock button for early/emergency locking. |

## Open Questions

- What is the first content policy threshold for commercial/brand submissions?
- Should archive pages be fully public and free from day one?
- What analytics are essential for participants in the core product?
- Which launch jurisdiction and legal contact should govern the privacy, cookie, terms, refund, and takedown policies?
- Should the first monetization flow be one- or three-month reservations only, with subscriptions evaluated later?
- Which admin roles and review permissions are needed for the first manual dashboard?
- Which cache metrics would justify Redis rather than direct MongoDB reads?
- Which browser automation tool fits the project once dynamic workflows begin?

## Verification Log

| Date | Check | Result | Notes |
|---|---|---|---|
| 2026-08-03 | `npm run build` | Passed | Static home and work detail pages build successfully. |
| 2026-08-03 | `npm run lint` | Passed | Reran outside sandbox after a no-output timeout; ESLint completed successfully. |
| 2026-08-03 | `npm run lint` | Passed | Archive route slice completed ESLint successfully. |
| 2026-08-03 | `npm run lint` | Passed | Reservation route slice completed ESLint successfully. |
| 2026-08-03 | Build | Not run | User said not to worry about build for this slice. |
| 2026-08-04 | `npm run lint` | Passed | Static space-status and reservation acknowledgement slice completed ESLint successfully. |
| 2026-08-04 | `npm run build` | Passed | Reran outside sandbox after `spawn EPERM`; new `/spaces/[spaceId]` pages prerendered successfully. |
| 2026-08-04 | `npm run lint` | Passed | Static content policy route completed ESLint successfully after sandbox timeout. |
| 2026-08-04 | `npm run build` | Passed | `/policy` prerendered successfully with the rest of the static app. |
| 2026-08-04 | `npm run lint` | Passed | Work media preview slice completed ESLint successfully after sandbox timeout. |
| 2026-08-04 | `npm run build` | Passed | Work detail pages prerendered successfully with typed media previews. |
| 2026-08-04 | `npm run lint` | Passed | Data model contract slice completed ESLint successfully after sandbox timeout. |
| 2026-08-04 | `npm run build` | Passed | Static app built successfully after adding persistence-facing TypeScript contracts. |
| 2026-08-04 | `npm run lint` | Passed | Inventory policy slice completed ESLint successfully. |
| 2026-08-04 | `npm run build` | Passed | Reran outside sandbox after `spawn EPERM`; static app built successfully with inventory policy contracts. |
| 2026-08-05 | `npm run lint` | Passed | Public wall navigation and status guidance slice completed ESLint successfully. |
| 2026-08-05 | `npm run build` | Passed | Public wall navigation and tile action changes compiled and prerendered successfully. |
| 2026-08-05 | `npm run lint` | Passed | Client-only reservation draft form completed ESLint successfully. |
| 2026-08-05 | `npm run build` | Passed | Client-only reservation draft form compiled and all static routes prerendered successfully. |
| 2026-08-05 | `npm run lint` | Passed | Reservation duration and start-month controls completed ESLint successfully. |
| 2026-08-05 | `npm run build` | Passed | Reservation duration and start-month controls compiled and all static routes prerendered successfully. |
| 2026-08-05 | `npm run lint` | Passed | Local draft summary and media-aware alt-text validation completed ESLint successfully. |
| 2026-08-05 | `npm run build` | Passed | Local draft summary and media-aware alt-text validation compiled successfully. |
| 2026-08-05 | `npm run lint` | Passed | Reservation state transition contract completed ESLint successfully. |
| 2026-08-05 | `npm run build` | Passed | Reservation state transition contract compiled and all static routes prerendered successfully. |
| 2026-08-05 | `npm run lint` | Passed | Reservation lifecycle panel completed ESLint successfully. |
| 2026-08-05 | `npm run build` | Passed | Reservation lifecycle panel compiled and all static routes prerendered successfully. |
| 2026-08-05 | `npm run lint` | Passed | Server-rendered wall filters completed ESLint successfully. |
| 2026-08-05 | `npm run build` | Passed | Server-rendered wall filters compiled successfully; the current wall is dynamic because it reads the view query parameter. |
| 2026-08-05 | `npm run lint` | Passed | URL-based wall search completed ESLint successfully. |
| 2026-08-05 | `npm run build` | Passed | URL-based wall search compiled successfully and preserved static archive generation. |
| 2026-08-05 | `npm run lint` | Passed | Published work navigation completed ESLint successfully. |
| 2026-08-05 | `npm run build` | Passed | Published work navigation compiled successfully with static work detail routes preserved. |
| 2026-08-05 | `npm run lint` | Passed | Archive month navigation completed ESLint successfully. |
| 2026-08-05 | `npm run build` | Passed | Archive month navigation compiled successfully with locked archive routes preserved. |
| 2026-08-05 | `npm run lint` | Passed | Locked archive tile affordances completed ESLint successfully. |
| 2026-08-05 | `npm run build` | Passed | Locked archive tile affordances compiled successfully with current and archive routes preserved. |
| 2026-08-05 | Repository audit | Passed | No tracked environment files, private keys, credential-like values, or ignored build/dependency artifacts were found. |
| 2026-08-05 | `npm run lint` | Passed | Privacy/cookie routes, low-chrome legal links, and documentation update passed ESLint. |
| 2026-08-05 | `npm run build` | Passed | Privacy/cookie routes and low-chrome legal links compiled; all static routes prerendered successfully. |
| 2026-08-05 | `npm run test` | Passed | Initial Vitest unit tests cover inventory totals, wall-state partitioning, and reservation transitions. |
| 2026-08-05 | `npm audit` | Passed | Upgraded Next.js to 16.3.0 and applied non-forced npm audit fixes; dependency audit reports zero vulnerabilities. |
| 2026-08-05 | `npm audit --omit=dev` | Passed | Production dependency audit reports zero vulnerabilities after the Next.js upgrade. |
| 2026-08-05 | `npm run lint` | Passed | Static admin review dashboard completed ESLint successfully. |
| 2026-08-05 | `npm run test` | Passed | Existing unit suite remains green after adding the admin review dashboard. |
| 2026-08-05 | `npm run build` | Passed | `/admin` compiled as a noindex static route with the rest of the application. |
| 2026-08-05 | `npm audit` | Passed | MongoDB dependency and aligned Next.js tooling remain at zero reported vulnerabilities. |
| 2026-08-05 | `npm run lint` | Passed | Lazy MongoDB boundary and environment template passed ESLint. |
| 2026-08-05 | `npm run test` | Passed | Existing 7-test unit suite remains green with the persistence boundary added. |
| 2026-08-05 | `npm run build` | Passed | Lazy MongoDB boundary compiled without requiring database credentials. |
| 2026-08-05 | `npm run lint` | Passed | Reservation draft repository boundary completed ESLint successfully. |
| 2026-08-05 | `npm run test` | Passed | Reservation repository tests increased the passing unit suite to 10 tests. |
| 2026-08-05 | `npm run build` | Passed | Reservation draft repository compiled without requiring a live MongoDB connection. |
| 2026-08-05 | `npm run lint` | Passed | Submission draft repository boundary completed ESLint successfully. |
| 2026-08-05 | `npm run test` | Passed | Submission repository tests increased the passing unit suite to 13 tests. |
| 2026-08-05 | `npm run build` | Passed | Submission draft repository compiled without requiring a live MongoDB connection. |
| 2026-08-05 | `npm run lint` | Passed | Repository cleanup changes passed ESLint. |
| 2026-08-05 | `npm run test` | Passed | Repository cleanup regression suite passes 14 tests. |
| 2026-08-05 | `npm run build` | Passed | Repository cleanup changes compiled and all routes prerendered successfully. |
| 2026-08-05 | `npm audit` | Passed | Repository cleanup dependency audit reports zero vulnerabilities. |
| 2026-08-05 | `npm run lint` | Passed | Reservation draft server action and form wiring passed ESLint successfully. |
| 2026-08-05 | `npm run test` | Passed | Existing unit suite remains green after adding the reservation draft server action. |
| 2026-08-05 | `npm run build` | Passed | Reservation draft server action compiled; static routes prerendered successfully. |
| 2026-08-06 | `npm run lint` | Passed | Admin review actions, repository updates, and dynamic admin page passed ESLint. |
| 2026-08-06 | `npm run test` | Passed | Existing unit suite remains green after adding review and reservation update functions. |
| 2026-08-06 | `npm run build` | Passed | Admin review page compiled as dynamic route; all static routes prerendered successfully. |
| 2026-08-06 | Dependency install | Passed | Added `stripe` package; npm audit reports zero vulnerabilities. |
| 2026-08-06 | `npm run lint` | Passed | Stripe payment service, checkout actions, success/cancel pages, and webhook route passed ESLint. |
| 2026-08-06 | `npm run test` | Passed | Existing unit suite remains green after adding payment helpers and actions. |
| 2026-08-06 | `npm run build` | Passed | Stripe routes and dynamic reservation success/cancel pages compiled; all routes built successfully. |
| 2026-08-06 | `npm run lint` | Passed | Media upload validation, storage, admin preview, and updated form passed ESLint. |
| 2026-08-06 | `npm run test` | Passed | Existing unit suite remains green after adding media storage helpers. |
| 2026-08-06 | `npm run build` | Passed | Media upload form and admin preview compiled; all routes built successfully. |
| 2026-08-06 | `npm run lint` | Passed | Dynamic exhibition service, published work overlay, and dynamic work detail pages passed ESLint. |
| 2026-08-06 | `npm run test` | Passed | Existing unit suite remains green after adding the exhibition service. |
| 2026-08-06 | `npm run build` | Passed | Dynamic wall and work detail pages compiled; static archive routes preserved. |
| 2026-08-06 | `npm run lint` | Passed | Archive repository, service, lock action, and dynamic archive pages passed ESLint. |
| 2026-08-06 | `npm run test` | Passed | Existing unit suite remains green after adding archive snapshot helpers. |
| 2026-08-06 | `npm run build` | Passed | Archive index and month pages compiled as dynamic routes; all other routes preserved. |
| 2026-08-10 | `npm run lint` | Pending | Participant analytics repository, service, tracking, and admin dashboard pending ESLint. |
| 2026-08-10 | `npm run build` | Pending | Analytics dashboard and tracking compiled; all routes prerendered successfully. |
| 2026-08-10 | `npm run lint` | Pending | Dark/light theme with CSS variables, theme provider, and toggle pending ESLint. |
| 2026-08-10 | `npm run build` | Pending | Theme system compiled; all routes prerendered with light and dark support. |
| 2026-08-13 | `npm run lint` | Passed | Hydration-safe theme toggle changes completed ESLint successfully. |
| 2026-08-13 | `npm run test` | Passed | Existing Vitest suite remains green: 5 files, 16 tests. |
| 2026-08-13 | `npm run build` | Passed | Production build completed after rerunning outside the sandbox due to `spawn EPERM`. |
| 2026-08-13 | `npm run lint` | Passed | Reservation draft MongoDB setup guidance and policy-link change completed ESLint successfully. |
| 2026-08-13 | `npm run test` | Passed | Existing Vitest suite remains green after reservation form/action changes: 5 files, 16 tests. |
| 2026-08-13 | `npm run build` | Passed | Reservation flow changes compiled and prerendered successfully. |
| 2026-08-13 | `npm run lint` | Passed | Full-wall current museum homepage changes completed ESLint successfully. |
| 2026-08-13 | `npm run test` | Passed | Existing Vitest suite remains green after homepage changes: 5 files, 16 tests. |
| 2026-08-13 | `npm run build` | Passed | Homepage wall changes compiled and prerendered successfully with `.env.local` loaded. |
| 2026-08-13 | `npm run lint` | Passed | Dark-mode wall contrast and tiny-tile text changes completed ESLint successfully. |
| 2026-08-13 | `npm run test` | Passed | Existing Vitest suite remains green after wall readability changes: 5 files, 16 tests. |
| 2026-08-13 | `npm run build` | Passed | Wall readability changes compiled and prerendered successfully with `.env.local` loaded. |
| 2026-08-13 | `npm run lint` | Passed | Archive navigation performance and loading-shell changes completed ESLint successfully. |
| 2026-08-13 | `npm run test` | Passed | Existing Vitest suite remains green after archive navigation changes: 5 files, 16 tests. |
| 2026-08-13 | `npm run build` | Passed | Archive navigation changes compiled and prerendered successfully with `.env.local` loaded. |
| 2026-08-13 | `npm run lint` | Passed | Admin approval and Clerk setup clarity changes completed ESLint successfully. |
| 2026-08-13 | `npm run test` | Passed | Existing Vitest suite remains green after admin auth route changes: 5 files, 16 tests. |
| 2026-08-13 | `npm run build` | Passed | Admin auth route changes compiled and prerendered successfully with `.env.local` loaded. |
| 2026-08-13 | `npm run lint` | Passed | Seeded wall media tile changes completed ESLint successfully after rerunning with a longer timeout. |
| 2026-08-13 | `npm run test` | Passed | Existing Vitest suite remains green after seeded wall media changes: 5 files, 16 tests. |
| 2026-08-13 | `npm run build` | Passed | Seeded wall media changes compiled and prerendered successfully with `.env.local` loaded. |
| 2026-08-13 | `npm run lint` | Passed | Work detail visual browse-card changes completed ESLint successfully. |
| 2026-08-13 | `npm run test` | Passed | Existing Vitest suite remains green after work detail browsing changes: 5 files, 16 tests. |
| 2026-08-13 | `npm run build` | Passed | Work detail browsing changes compiled and prerendered successfully with `.env.local` loaded. |
| 2026-08-13 | `npm run lint` | Passed | Review privacy, wall-only mode, and admin sample-action guard completed ESLint successfully. |
| 2026-08-13 | `npm run test` | Passed | Existing Vitest suite remains green after review privacy and fullscreen changes: 5 files, 16 tests. |
| 2026-08-13 | `npm run build` | Passed | Review privacy, wall-only mode, and admin guard changes compiled and prerendered successfully with `.env.local` loaded. |
