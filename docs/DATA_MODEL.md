# Data Model

This document defines the persistence contract for One Month Museum. It mirrors the lightweight TypeScript contract in `lib/domain-types.ts`; the lazy connection boundary lives in `lib/mongodb.ts`.

## Goals

- Keep the public exhibition, reservation, review, payment, and archive concepts separate.
- Store reservations as temporary claims, not ownership of permanent positions.
- Preserve approved work in immutable archive snapshots after a month closes.
- Support Stripe, uploads, and admin review through the persistence layer.

## Collections

### `exhibitions`

One document per monthly exhibition.

Core fields:

- `_id`
- `slug`, such as `2026-08`
- `title`
- `theme`
- `status`: `draft`, `open`, `closed`, or `archived`
- `opensAt` and `closesAt`
- `layoutTemplateId`
- `createdAt` and `updatedAt`

Useful indexes:

- Unique index on `slug`
- Compound index on `status` and `opensAt`

### `spaces`

One document per reservable slot in an exhibition layout.

Core fields:

- `_id`
- `exhibitionId`
- `slotId`, such as `01`
- `size`: `tiny`, `small`, `medium`, `large`, or `featured`
- `status`: `available`, `review`, `occupied`, or `featured`
- `priceCents` and `currency`
- `visibilityTier`
- `reservationId`
- `layout`: `colSpan`, `rowSpan`, and `order`
- `createdAt` and `updatedAt`

Useful indexes:

- Unique compound index on `exhibitionId` and `slotId`
- Compound index on `exhibitionId`, `status`, and `size`

### `reservations`

One document per attempted or completed space reservation.

Core fields:

- `_id`
- `status`: `draft`, `held`, `submitted`, `approved`, `cancelled`, or `expired`
- `primaryContactEmail`
- `months`
- `requestedSize`
- `assignedSpaceIds`
- `totalAmountCents` and `currency`
- `paymentStatus`
- `stripePaymentIntentId`
- `createdAt`, `updatedAt`, and optional `expiresAt`

Useful indexes:

- Index on `primaryContactEmail`
- Compound index on `status` and `expiresAt`
- Index on `stripePaymentIntentId`

The repository boundary is `lib/reservation-repository.ts`. It validates one- or three-month draft input, applies draft/payment defaults, inserts drafts, reads by id, and exposes the documented indexes. It does not hold spaces or authorize payment directly.

### `submissions`

One document per creator work attached to a reservation.

Core fields:

- `_id`
- `reservationId`
- `creatorName`
- `workTitle`
- `description`
- `externalUrl`
- `media.kind`
- `media.assetKey`
- `media.originalFilename`
- `media.altText`
- `policyAcknowledgedAt`
- `reviewStatus`
- `reviewerNotes`
- `createdAt` and `updatedAt`

Useful indexes:

- Index on `reservationId`
- Compound index on `reviewStatus` and `updatedAt`

The submission boundary is `lib/submission-repository.ts`. It validates required creator/work fields, media-aware alt text, policy acknowledgement, and safe external URLs before building or persisting a draft. It does not transition a submission into review directly.

### `archiveSnapshots`

Immutable public snapshot created when an exhibition is locked.

Core fields:

- `_id`
- `exhibitionId`
- `slug`
- `lockedAt`
- `title`
- `theme`
- `description`
- `monthLabel`
- `spaces` (slotId, size, status, creatorName, workTitle, description, mediaKind, externalUrl, className, mediaAssetKey, altText)

Useful indexes:

- Unique index on `slug`
- Index on `lockedAt`

The snapshot stores enough layout and media metadata to render the archived wall without depending on the original template or upload session.

### `participantEvents`

Append-only event log for participant and admin interactions.

Core fields:

- `_id`
- `type`: `page_view`, `space_selected`, `reservation_started`, `reservation_submitted`, `payment_authorized`, `payment_completed`, `submission_approved`, or `submission_rejected`
- `participantEmail`
- `spaceId`
- `reservationId`
- `submissionId`
- `exhibitionSlug`
- `metadata` (flexible key-value for future extension)
- `createdAt`

Useful indexes:

- Compound index on `type` and `createdAt`
- Compound index on `exhibitionSlug` and `type`
- Compound index on `spaceId` and `type`
- Index on `reservationId`
- Index on `submissionId`

Events are emitted from server actions and API routes: `app/actions.ts` emits `reservation_submitted`, the Stripe webhook emits `payment_authorized`, and admin actions emit `submission_approved` or `submission_rejected`. The repository boundary is `lib/analytics-repository.ts` and the service layer is `lib/analytics-service.ts`.

## Reservation State Flow

1. `draft`: the participant has started choosing a space.
2. `held`: a space is temporarily held while submission and payment authorization are prepared.
3. `submitted`: the participant has provided required submission fields and acknowledged policy.
4. `approved`: the submission has passed manual review and can be published.
5. `cancelled`: the reservation was cancelled by the participant, admin, or payment outcome.
6. `expired`: a temporary hold passed its deadline.

Payment state remains separate because publication depends on manual approval. A reservation can be submitted with an authorized payment and still become rejected, cancelled, or refunded later.

The allowed status transitions are mirrored in `lib/reservation-state.ts`. Persistence code validates a transition through that contract rather than changing reservation status directly.

## Constraints

- MongoDB is the primary database for dynamic data.
- Keep MongoDB connection creation lazy so the static public app can build and run without database credentials.
- Read `MONGODB_URI` and optional `MONGODB_DB` from the environment; never hard-code credentials or commit local environment files.
- For a local Docker MongoDB container, copy `.env.example` to `.env.local`, set `MONGODB_URI=mongodb://localhost:27017`, keep `MONGODB_DB=one-month-museum`, and restart the Next.js dev server.
- Do not add Redis for these core reads until there is a measured cache need.
- Clerk is integrated for admin authentication; participant account flows remain deferred.
- Stripe is integrated for reservation payment authorization and capture.
