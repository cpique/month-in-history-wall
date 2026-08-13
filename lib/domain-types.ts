import type { SpaceSize, SpaceStatus } from "./exhibition-data";

export type ExhibitionStatus = "draft" | "open" | "closed" | "archived";

export type ReviewStatus =
  | "draft"
  | "submitted"
  | "in_review"
  | "changes_requested"
  | "approved"
  | "rejected"
  | "removed";

export type PaymentStatus =
  | "not_started"
  | "authorization_required"
  | "authorized"
  | "captured"
  | "cancelled"
  | "refunded"
  | "failed";

export type MediaKind = "image" | "gif" | "text" | "video_preview";

export type MongoId = string;

export type ReservationSalesUnit = "size_and_visibility_category";

export type ExhibitionDocument = {
  _id: MongoId;
  slug: string;
  title: string;
  theme?: string;
  status: ExhibitionStatus;
  opensAt: string;
  closesAt: string;
  layoutTemplateId: string;
  createdAt: string;
  updatedAt: string;
};

export type SpaceDocument = {
  _id: MongoId;
  exhibitionId: MongoId;
  slotId: string;
  size: SpaceSize;
  status: SpaceStatus;
  priceCents: number;
  currency: "USD";
  visibilityTier: "standard" | "featured";
  reservationId?: MongoId;
  layout: {
    colSpan: number;
    rowSpan: number;
    order: number;
  };
  createdAt: string;
  updatedAt: string;
};

export type ReservationDocument = {
  _id: MongoId;
  status: "draft" | "held" | "submitted" | "approved" | "cancelled" | "expired";
  primaryContactEmail: string;
  months: string[];
  requestedSize: SpaceSize;
  salesUnit: ReservationSalesUnit;
  preferredSpaceId?: MongoId;
  assignedSpaceIds: MongoId[];
  totalAmountCents: number;
  currency: "USD";
  paymentStatus: PaymentStatus;
  stripePaymentIntentId?: string;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
};

export type SubmissionDocument = {
  _id: MongoId;
  reservationId: MongoId;
  creatorName: string;
  workTitle: string;
  description: string;
  externalUrl?: string;
  media: {
    kind: MediaKind;
    assetKey?: string;
    originalFilename?: string;
    altText?: string;
  };
  policyAcknowledgedAt?: string;
  reviewStatus: ReviewStatus;
  reviewerNotes?: string;
  createdAt: string;
  updatedAt: string;
};

export type ArchiveSnapshotDocument = {
  _id: MongoId;
  exhibitionId: MongoId;
  slug: string;
  lockedAt: string;
  title: string;
  theme?: string;
  description: string;
  monthLabel: string;
  spaces: Array<{
    slotId: string;
    size: SpaceSize;
    status: SpaceStatus;
    creatorName: string;
    workTitle: string;
    description: string;
    mediaKind: MediaKind;
    externalUrl?: string;
    className: string;
    mediaAssetKey?: string;
    altText?: string;
  }>;
};

export type ParticipantEventType =
  | "page_view"
  | "space_selected"
  | "reservation_started"
  | "reservation_submitted"
  | "payment_authorized"
  | "payment_completed"
  | "submission_approved"
  | "submission_rejected";

export type ParticipantEventDocument = {
  _id: MongoId;
  type: ParticipantEventType;
  participantEmail?: string;
  spaceId?: string;
  reservationId?: MongoId;
  submissionId?: MongoId;
  exhibitionSlug?: string;
  metadata?: Record<string, string | number | boolean>;
  createdAt: string;
};
