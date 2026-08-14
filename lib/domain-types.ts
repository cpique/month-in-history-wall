import type { SpaceSize, SpaceStatus } from "./exhibition-data";

export type MediaKind = "image" | "gif" | "text" | "video_preview";

export type MongoId = string;

export type MonthStatus = "draft" | "published" | "locked";

export type EventStatus =
  | "draft"
  | "needs_review"
  | "published"
  | "needs_correction"
  | "archived";

export type EventImportanceLevel = "featured" | "major" | "notable" | "signal";

export type EventTileSize = "featured" | "large" | "medium" | "small";

export type EventSourceDocument = {
  title: string;
  url: string;
  publisher?: string;
  author?: string;
  publishedAt?: string;
  accessedAt?: string;
  sourceType:
    | "encyclopedia"
    | "archive"
    | "official"
    | "news"
    | "academic"
    | "reference"
    | "other";
  notes?: string;
};

export type EventMediaDocument = {
  kind: "image" | "gif" | "video";
  url: string;
  alt: string;
  caption?: string;
  credit?: string;
  license?: string;
};

export type MonthDocument = {
  _id: MongoId;
  slug: string;
  month: number;
  year: number;
  title: string;
  description: string;
  status: MonthStatus;
  layoutSeed: string;
  createdAt: string;
  updatedAt: string;
  lockedAt?: string;
};

export type HistoricalEventDocument = {
  _id: MongoId;
  monthId: MongoId;
  monthSlug: string;
  slug: string;
  title: string;
  summary: string;
  context: string;
  whyItMatters: string;
  category: string;
  date?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  location: string;
  countries: string[];
  relevanceScore: number;
  importanceLevel: EventImportanceLevel;
  tileSize: EventTileSize;
  status: EventStatus;
  media?: EventMediaDocument;
  detailMarkdown: string;
  sources: EventSourceDocument[];
  layout: {
    order: number;
  };
  createdAt: string;
  updatedAt: string;
};

export type CorrectionRequestStatus =
  | "open"
  | "reviewing"
  | "accepted"
  | "rejected"
  | "closed";

export type CorrectionRequestDocument = {
  _id: MongoId;
  eventId: MongoId;
  monthSlug: string;
  message: string;
  sourceUrl?: string;
  contactEmail?: string;
  status: CorrectionRequestStatus;
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
