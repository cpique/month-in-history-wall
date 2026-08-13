import type { SpaceSize } from "./exhibition-data";

export type ReservableSpaceSize = Exclude<SpaceSize, "featured">;

export type InventoryTier = {
  size: SpaceSize;
  label: string;
  count: number;
  relativePrice: number;
  sellable: boolean;
  purpose: string;
};

export const coreProductInventoryTotal = 48;

export const coreProductInventoryTiers: InventoryTier[] = [
  {
    size: "tiny",
    label: "Tiny",
    count: 16,
    relativePrice: 1,
    sellable: true,
    purpose: "Icons, very short text, small images, or minimal GIFs.",
  },
  {
    size: "small",
    label: "Small",
    count: 18,
    relativePrice: 2,
    sellable: true,
    purpose: "Single images, short written pieces, calm GIFs, or project notes.",
  },
  {
    size: "medium",
    label: "Medium",
    count: 9,
    relativePrice: 4,
    sellable: true,
    purpose: "Larger artwork, video previews, image-led launches, or longer text.",
  },
  {
    size: "large",
    label: "Large",
    count: 4,
    relativePrice: 8,
    sellable: true,
    purpose: "Prominent visual work, image series, or major creative statements.",
  },
  {
    size: "featured",
    label: "Featured",
    count: 1,
    relativePrice: 15,
    sellable: false,
    purpose: "Curated anchor placement, guest artist, editorial work, or sponsor after review.",
  },
];

export const reservationSalesModel = {
  sellsExactSlot: false,
  primaryUnit: "size_and_visibility_category",
  maxInitialMonths: 3,
  notes: [
    "Participants choose a visible available slot during reservation, but the paid product sells a size and visibility category rather than permanent coordinates.",
    "The selected slot can act as a preference and hold target for the current month.",
    "Multi-month reservations guarantee similar size and visibility, not the same position or neighbors.",
  ],
} as const;
