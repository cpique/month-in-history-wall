# Production Baseline Plan

## Product Standard

User-facing features should work end-to-end with persisted data, server-side validation, and authorization where needed. Avoid mock or fake functionality in the app UI. If a feature is not usable yet, keep it in roadmap docs instead of presenting it as interactive product surface.

## Core Product

### Phase 1: Exhibition Surface

- Replace the starter page with a credible current-month exhibition wall.
- Define reusable space data and size categories.
- Add occupied and available visual states.
- Add work detail affordances.
- Make the wall responsive without requiring mobile users to pan across a huge canvas.
- Add archive browsing and locked monthly snapshot pages.

### Phase 1 Progress

- Current wall route exists at `/`.
- The `/` route is the current museum landing experience: a compact header plus the full exhibition wall, without implementation/provider details in public copy.
- Current work detail pages exist at `/works/[spaceId]` for published spaces.
- Published current work detail pages render typed media previews.
- Archive index exists at `/archive`.
- Archive month snapshots exist at `/archive/[month]`.
- Reservation chooser exists at `/reserve`.
- Reservation detail pages exist at `/reserve/[spaceId]` for available spaces.
- Non-published space status pages exist at `/spaces/[spaceId]` for available and review spaces.
- The static wall template is typed in `lib/exhibition-data.ts` and overlaid with real submissions when MongoDB is configured.

### Phase 2: Reservation And Submission

- Model spaces, statuses, prices, and month availability.
- Create a reserve-space flow.
- Add submission fields and content policy acknowledgement.
- Store reservation and submission drafts in MongoDB.

### Phase 2 Progress

- Available spaces include reservation metadata: price label, price in cents, available months, and media rules.
- Available wall tiles link to reservation detail pages.
- The reservation form submits to a server action that validates the request and creates a reservation draft and matching submission draft in MongoDB when a database is configured.
- Repository boundaries remain separate from the UI and are invoked through public server actions.
- Content policy route exists at `/policy` and is linked from reservation acknowledgement copy.
- MongoDB document contracts are outlined in `docs/DATA_MODEL.md` and `lib/domain-types.ts`.
- Core product inventory is set at 48 spaces in `docs/CORE_PRODUCT_INVENTORY.md` and `lib/inventory-policy.ts`.
- Reservations sell size and visibility categories, with selected slots treated as current-month preferences or hold targets.

### Phase 3: Review And Publishing

- Add admin review states: pending, changes requested, approved, rejected.
- Add media validation rules for images, GIFs, text, and video previews.
- Publish approved work into the current exhibition.
- Lock completed exhibitions into archive snapshots.
- Add an authenticated admin dashboard for manual review, change requests, approval, rejection, assignment, and publishing.

### Phase 3 Progress

- The `/admin` route is the approval management page. It is dynamic and lists real submissions from MongoDB when `MONGODB_URI` is configured; otherwise it falls back to sample data.
- Server actions exist for `approveSubmission`, `rejectSubmission`, and `requestChanges`.
- `rejectSubmission` cancels the linked reservation; `approveSubmission` marks it approved.
- `requestChanges` keeps the reservation in place and records reviewer notes on the submission.
- Review state transitions are enforced by the submission repository and reservation status transitions are validated by the reservation state contract.
- Media files are uploaded through the reservation form, validated by type and size, saved to `public/uploads/`, and previewed on the admin review dashboard.
- Approved submissions are published onto the current exhibition wall through `lib/exhibition-service.ts`, which overlays real work onto the static template when MongoDB is configured.
- Work detail pages (`/works/[spaceId]`) are dynamic and read from the overlay service, displaying real uploaded media via the `WorkMedia` component.
- The archive index and archive month pages are dynamic, read locked snapshots from MongoDB, and fall back to static examples.
- The `lockCurrentExhibition` admin action creates an immutable `archiveSnapshots` record from the current exhibition overlay, preserving layout and media metadata.
- The admin dashboard is protected by Clerk when both Clerk keys are configured; `/admin/sign-in` and `/admin/sign-up` remain reachable for authentication.

### Future Archive Lock Automation

- Keep the current month editable through the last day of the month.
- Automatically lock the completed month shortly after the next month starts, with a target of day 1 at `00:15 UTC`.
- Add a fallback/latest automatic lock by day 3 at `00:15 UTC` so a missed scheduler run does not leave old walls mutable.
- Keep the admin `Lock current month` button as a manual override for early or emergency locking.
- Implement automation as a secured route, such as `/api/jobs/lock-archive`, called daily by Vercel Cron, GitHub Actions, or another scheduler.
- The job must be idempotent: check whether the previous month already has an `archiveSnapshots` record, create one only if missing, and otherwise return a no-op result.
- Protect the job with a secret header/token stored in environment configuration, not a public route anyone can trigger.

### Phase 4: Payments

- Add payment authorization before review.
- Capture payment on approval.
- Cancel authorization or refund on rejection.
- Track payment state on reservations and submissions.
- Add Stripe customer and payment setup after the reservation state machine is persisted.
- Evaluate subscriptions or recurring plans separately from one- and three-month reservations; do not force a subscription model onto the first reservation purchase flow.

### Phase 4 Progress

- Added the `stripe` package and a lazy Stripe client in `lib/stripe.ts`.
- Added `lib/payment-service.ts` to create manual-capture Checkout sessions, retrieve authorized payment intents, capture payment intents, and cancel payment intents.
- The reservation form shows a "Proceed to payment" button after saving the draft.
- The `createCheckoutSession` server action creates a Stripe Checkout session with `capture_method: "manual"` and redirects the creator to Stripe.
- Added `/reserve/success` to confirm authorization and record `stripePaymentIntentId` on the reservation.
- Added `/reserve/cancel` for abandoned checkouts.
- Added `/api/webhooks/stripe` to handle `checkout.session.completed` and record payment authorization.
- Admin `approveSubmission` captures the payment intent before marking the reservation approved.
- Admin `rejectSubmission` cancels the payment intent before marking the reservation cancelled.
- Subscription and recurring billing remain deferred until one- and three-month reservations are proven.

### Phase 5: Accounts And Analytics

- Add Clerk if participant history, admin roles, or protected dashboards need it.
- Add basic participant analytics.
- Add Redis only if repeated reads or rollups need caching.

### Phase 5 Progress

- Clerk is integrated for admin authentication with sign-in and sign-up flows under `/admin/sign-in` and `/admin/sign-up`.
- Admin server actions check `auth().userId` through `requireAdminAuth()` before executing approval, rejection, change-request, and archive-lock mutations.
- Participant accounts remain deferred until participant history or self-service dashboards are added.
- A `/admin/analytics` dashboard tracks reservation funnels, conversion rates, and recent participant events.
- Redis remains deferred until a measured cache need appears.

### Phase 6: Platform Quality And Legal Readiness

- Add unit tests for typed policies, inventory counts, state transitions, and selectors.
- Add component and route tests for public browsing, reservation validation, and legal links.
- Add end-to-end tests for reservation, review, payment, and archive locking.
- Review and publish the privacy policy and cookie policy for the launch jurisdiction.
- Add dark/light theme support after the visual system is stable; use CSS variables and a theme provider rather than adding a component kit to the wall prematurely.
- Introduce shadcn/ui when admin or form-heavy controls become repetitive, not as a replacement for the museum wall's custom visual language.

### Phase 6 Progress

- Added Vitest unit tests for inventory totals, wall-state partitioning, reservation transitions, and repository validation.
- Added working privacy policy at `/privacy`, cookie policy at `/cookies`, and content policy at `/policy`.
- Added dark/light theme support using CSS custom properties mapped to `data-theme` on `<html>`, with system-preference detection and a footer toggle.
- shadcn/ui remains deferred until repeated admin or form controls justify it.
- Component, route, and end-to-end tests remain on the roadmap.

## Product Roadmap

### Next Product Work

- Component and route tests for public browsing, reservation validation, and legal links.
- End-to-end tests for the full reservation, review, payment, and archive-locking workflow.
- Complete legal review of privacy, cookie, content, terms, refund, and takedown policies before launch.
- Evaluate Stripe subscriptions or recurring monetization after one- and three-month reservations are proven.

### Later Product Work

- Participant accounts and self-service dashboards for submission history and renewal.
- Redis caching for expensive monthly layout queries, analytics rollups, or high-traffic archive reads once a concrete need is measured.
- shadcn/ui for repeated admin or form-heavy controls if it improves consistency without replacing the wall's custom visual language.
- Advanced discovery features such as categories, search, guided tours, and creator pages.
- Public reactions, bookmarks, or visitor notes.
- Opening-night events, live guided tours, or featured creator interviews.
- Physical exhibitions, collectible editions, annual exhibitions, or institutional white-label deployments.

## Product Decisions

- Treat space purchase as a reservation, not ownership.
- Sell size categories and visibility tiers, not exact permanent coordinates.
- Limit early multi-month reservations to one or three months.
- Keep manual approval mandatory before publication.
