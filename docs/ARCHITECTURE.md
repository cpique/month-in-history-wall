# Architecture Notes

One Month Museum is a Next.js App Router application. The first milestone proved the exhibition browsing experience before adding reservation, review, payment, and archive workflows.

## Stack

- Framework: Next.js 16.3 App Router with React 19.
- Styling: Tailwind CSS 4 through `@tailwindcss/postcss`.
- Persistence: MongoDB for dynamic data.
- Cache: Redis is deferred until runtime data or aggregation work needs it.
- Auth: Clerk is integrated for admin authentication; participant accounts remain deferred.
- Component kit: shadcn/ui is deferred until form-heavy or dashboard-heavy surfaces appear.
- Payments: Stripe handles authorization/capture for reservations; subscriptions are a later monetization option, not an assumption for the first reservation purchase.
- Theme: the wall keeps its custom Tailwind visual language; dark/light theme support uses CSS custom properties mapped to `data-theme` on `<html>`, with system-preference detection, a hydration-safe inline initializer, and a footer toggle.

## Current Code Shape

- `proxy.ts`: Next.js 16 proxy that protects `/admin` routes with Clerk middleware when Clerk keys are configured; degrades gracefully otherwise.
- `app/page.tsx`: public current-exhibition landing route with a compact header, full-width wall, and wall-only viewing mode.
- `app/works/[spaceId]/page.tsx`: dynamic detail route for published occupied/featured spaces, with media display and visual previous/next browsing.
- `app/spaces/[spaceId]/page.tsx`: status route for non-published current spaces; public in-review spaces show placeholders rather than submitted content.
- `app/policy/page.tsx`: public content policy route linked from the reservation acknowledgement.
- `app/privacy/page.tsx`: public privacy policy route.
- `app/cookies/page.tsx`: public cookie policy route.
- `app/admin/page.tsx`: noindex authenticated dynamic admin review dashboard that lists real submissions and invokes approve/reject/request-changes server actions, guarded by Clerk and a lazy-degrade fallback for local development.
- `app/admin/analytics/page.tsx`: authenticated analytics dashboard showing reservation funnel, conversion rates, popular spaces, and recent participant events.
- `app/admin/sign-in/` and `app/admin/sign-up/`: Clerk hosted-auth UI with `routing="path"` so sign-in flows stay within the admin path prefix.
- `app/actions.ts`: public server actions for creating a reservation draft and creating a Stripe Checkout session.
- `app/admin/actions.ts`: authenticated server actions for submission review that capture or cancel Stripe payments, protected by Clerk.
- `app/api/webhooks/stripe/route.ts`: Stripe webhook handler that records payment authorization.
- `app/reserve/success/page.tsx` and `app/reserve/cancel/page.tsx`: Stripe Checkout return pages.
- `app/reserve/page.tsx`: reservation chooser for currently available spaces.
- `app/reserve/[spaceId]/page.tsx`: reservation detail page with fields, rules, and review-first messaging.
- `app/archive/page.tsx`: dynamic archive index that reads snapshots from MongoDB when configured, falling back to static examples.
- `app/archive/[month]/page.tsx`: dynamic locked snapshot route for a completed monthly exhibition, read from MongoDB snapshots when configured, with parallel archive data loading.
- `app/archive/[month]/loading.tsx`: loading shell shown while a locked archive wall is being fetched.
- `components/reservation/reservation-draft-form.tsx`: client reservation draft form with native validation, media upload, and Stripe Checkout handoff.
- `components/reservation/reservation-lifecycle.tsx`: reservation state and separate payment-status guidance.
- `components/exhibition/`: public exhibition UI components shared by current and archived walls, including seeded wall media, work media previews, review placeholders, and wall-only viewing.
- `components/archive/`: archive browsing UI components.
- `lib/payment-service.ts`: Stripe Checkout session creation, payment intent capture, and cancellation.
- `lib/stripe.ts`: lazy Stripe client initialization.
- `lib/media-storage.ts`: local file upload validation, storage in `public/uploads/`, and public URL generation.
- `lib/analytics-repository.ts`: MongoDB `participantEvents` collection, indexes, and insert/query helpers for participant analytics.
- `lib/analytics-service.ts`: aggregates funnel metrics, conversion rates, top-space rankings, and recent activity for the admin analytics dashboard.
- `lib/archive-repository.ts`: MongoDB `archiveSnapshots` collection, indexes, and insert/find helpers.
- `lib/archive-service.ts`: reads archive snapshots and reconstructs `Exhibition` objects with real media URLs.
- `lib/admin-data.ts`: sample review records used as a fallback when MongoDB is not configured.
- `lib/exhibition-service.ts`: dynamic current exhibition service that overlays approved submissions from MongoDB onto the static wall template.
- `lib/exhibition-data.ts`: typed static current/archive exhibition data, media preview metadata, and selectors.
- `lib/content-policy.ts`: typed policy sections reused by the public policy page.
- `lib/domain-types.ts`: persistence-facing TypeScript document contracts for MongoDB work.
- `lib/mongodb.ts`: lazy MongoDB client and database boundary.
- `lib/reservation-repository.ts`: reservation draft builder/repository and reservation indexes.
- `lib/submission-repository.ts`: validated submission draft builder/repository and submission indexes.
- `lib/reservation-state.ts`: pure reservation status transition contract for persistence and payment workflows.
- `lib/inventory-policy.ts`: typed core product inventory mix and reservation sales model.
- `docs/PRODUCTION_BASELINE_PLAN.md`: phased product work and roadmap.
- `docs/ADMIN_SETUP.md`: local admin, MongoDB, and Clerk setup notes.
- `docs/CORE_PRODUCT_INVENTORY.md`: 48-space inventory and category-based sales decision.
- `docs/DATA_MODEL.md`: collection, index, and reservation state notes for the persistence layer.
- `docs/PROJECT_TRACKER.md`: living implementation tracker.
- `docs/PRIVACY_POLICY.md`, `docs/COOKIE_POLICY.md`, and `docs/CONTENT_POLICY.md`: working legal and consent policy sources pending jurisdictional review.

## Current Data Model

The production baseline uses these MongoDB collections. See `docs/DATA_MODEL.md` for field-level notes and useful indexes:

- `exhibitions`: month, title, theme, status, launch/close dates, layout template id.
- `spaces`: exhibition id, slot id, size, coordinates, price, status, reservation id.
- `submissions`: creator/contact fields, media metadata, title, description, alt text, review status, payment status.
- `reservations`: months purchased, size category, assigned spaces, amount, Stripe references.
- `archiveSnapshots`: immutable monthly exhibition summary after close.
- `participantEvents`: append-only event log for reservation, payment, review, and page-view interactions.

## Rendering Approach

- Public exhibition pages default to Server Components.
- Interactive details, filters, pan/zoom, upload previews, and admin actions are isolated as Client Components.
- Completed archive pages become immutable snapshots where possible.
- Current work detail pages are dynamic and read from the overlay service.
- Work detail pages render real uploaded media or typed media previews.
- Archive month pages reuse the wall component, but published archive tiles are rendered as locked snapshot tiles instead of linking to current work detail routes.
- Non-published current spaces resolve to status pages so review/held slots remain explainable in the public wall.
- Reservation pages are wired to server actions and Stripe Checkout for payment authorization.
- Core product reservation model sells size and visibility categories; visible slot selection acts as a current-month preference or hold target.

## Integration Timing

- The lazy MongoDB boundary and reservation draft repository are connected to server actions with request validation and error handling.
- Stripe is integrated after the reservation state machine was defined.
- Clerk is integrated for admin route protection.
- Redis remains deferred until a concrete cache use case appears, such as expensive monthly layout queries, analytics rollups, or high-traffic archive reads.

## Cache Plan

- Do not cache the current exhibition or reservation flow yet.
- Measure repeated reads and response cost before adding Redis.
- Candidate cache boundaries are published monthly exhibition reads, archive summaries, layout aggregations, and analytics rollups.
- Cache keys must include exhibition month and layout/version identifiers, with explicit invalidation when a month is published, changed, or locked.

## Admin Auth

- `proxy.ts` protects `/admin` routes with Clerk middleware when Clerk keys are configured; it degrades gracefully to an open dashboard when they are not.
- `/admin/sign-in` and `/admin/sign-up` remain public even when Clerk is enabled so admins can reach the auth flow.
- `app/admin/layout.tsx` wraps admin routes with `ClerkProvider` conditionally, enabling SignInButton/UserButton and sign-in/sign-up components inside the admin subtree.
- `app/admin/sign-in/` and `app/admin/sign-up/` host Clerk's hosted-auth UI with `routing="path"` so sign-in flows stay within the admin path prefix.
- `app/admin/actions.ts` checks `auth().userId` through `requireAdminAuth()` before executing approval, rejection, change-request, and archive-lock mutations.
- Manual review is a required workflow, not a public wall feature.
- Participant accounts remain deferred; do not add auth to the public wall first.

## Testing Strategy

- Unit test pure contracts and selectors first: inventory totals, wall status partitioning, reservation transitions, and content-policy rules.
- Add component tests for filter/search behavior, reservation validation, legal navigation, and locked archive affordances.
- Add end-to-end coverage when MongoDB, Clerk, Stripe, uploads, and admin review are exercised together.
