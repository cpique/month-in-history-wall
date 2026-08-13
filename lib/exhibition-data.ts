export type SpaceStatus = "occupied" | "available" | "review" | "featured";

export type SpaceSize = "tiny" | "small" | "medium" | "large" | "featured";

const commonsFile = (filename: string) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}`;

export type WorkMediaPreview = {
  alt: string;
  caption: string;
  shape: "cinematic" | "portrait" | "square" | "strip";
  pattern: "signal" | "receipt" | "frames" | "blocks";
  background: string;
  foreground: string;
  marks: string[];
  mediaUrl?: string;
  mediaAlt?: string;
};

export type ReservationDetails = {
  priceLabel: string;
  priceCents: number;
  availableMonths: string[];
  mediaRules: string[];
};

export type ExhibitionSpace = {
  id: string;
  title: string;
  creator: string;
  status: SpaceStatus;
  size: SpaceSize;
  className: string;
  category: string;
  medium: string;
  description: string;
  externalUrl?: string;
  mediaPreview?: WorkMediaPreview;
  reservation?: ReservationDetails;
};

export type ExhibitionStat = {
  value: string;
  label: string;
};

export type Exhibition = {
  slug: string;
  title: string;
  monthLabel: string;
  templateLabel: string;
  reviewNote: string;
  tagline: string;
  description: string;
  stats: ExhibitionStat[];
  spaces: ExhibitionSpace[];
  status: "current" | "archived";
  theme?: string;
};

export const currentExhibition: Exhibition = {
  slug: "2026-08",
  title: "One Month Museum",
  monthLabel: "August 2026",
  templateLabel: "Monthly wall template 001",
  reviewNote: "Manual approval before publication",
  tagline: "One page. One month. One exhibition.",
  description:
    "A curated digital museum wall where creators reserve limited spaces for images, GIFs, video previews, text, and experiments. When the month ends, the wall becomes a permanent archive.",
  status: "current",
  theme: "Signal",
  stats: [
    { value: "48", label: "spaces" },
    { value: "17", label: "reserved" },
    { value: "12", label: "days to open" },
    { value: "1", label: "monthly wall" },
  ],
  spaces: [
    {
      id: "01",
      title: "Signal Room",
      creator: "Mira Vale",
      status: "featured",
      size: "featured",
      category: "Featured work",
      medium: "Video preview",
      description:
        "A dark, slow-moving room of signal fragments and small acts of attention. The featured slot anchors the current wall and demonstrates the premium placement model.",
      externalUrl: "https://example.com/signal-room",
      mediaPreview: {
        alt: "A quiet preview frame for Signal Room with vertical signal bars on a dark field.",
        caption: "Public-domain teleidoscope animation used as a seeded wall visual.",
        shape: "cinematic",
        pattern: "signal",
        background: "#12110f",
        foreground: "#f8f1df",
        marks: ["34%", "72%", "48%", "88%", "42%", "64%"],
        mediaUrl: commonsFile("Teleidoscope animation.gif"),
        mediaAlt:
          "A colorful kaleidoscopic animation radiating from a dark center.",
      },
      className:
        "col-span-4 row-span-4 bg-[#12110f] text-[#f8f1df] lg:col-span-6",
    },
    {
      id: "02",
      title: "Soft Index",
      creator: "Ana Ito",
      status: "occupied",
      size: "medium",
      category: "Visual art",
      medium: "Image",
      description:
        "A quiet index of shapes, margins, and pale greens. This medium slot is an example of a standard occupied artwork placement.",
      externalUrl: "https://example.com/soft-index",
      mediaPreview: {
        alt: "A soft abstract preview for Soft Index with pale framed panels.",
        caption: "Public-domain abstract composition used as a seeded wall visual.",
        shape: "square",
        pattern: "frames",
        background: "#d6e7dc",
        foreground: "#171411",
        marks: ["0%", "18%", "8%"],
        mediaUrl: commonsFile("Suprematism - Abstract Composition (Malevich, 1915).jpg"),
        mediaAlt:
          "A Suprematist abstract composition with geometric blocks on a pale field.",
      },
      className: "col-span-2 row-span-3 bg-[#d6e7dc] text-[#171411] lg:col-span-3",
    },
    {
      id: "03",
      title: "Open Space",
      creator: "Reserve",
      status: "available",
      size: "small",
      category: "Available",
      medium: "Image, GIF, or text",
      description:
        "A small slot available for reservation. Available spaces should explain size, media rules, price, and month availability once reservation flow exists.",
      reservation: {
        priceLabel: "2x base price",
        priceCents: 2000,
        availableMonths: ["August 2026", "September 2026", "October 2026"],
        mediaRules: ["JPG, PNG, WebP, or GIF", "Short text allowed", "One external link", "Alt text required"],
      },
      className: "col-span-2 row-span-2 bg-[#f5e0bd] text-[#171411]",
    },
    {
      id: "04",
      title: "Night Receipt",
      creator: "Theo Min",
      status: "occupied",
      size: "small",
      category: "Writing",
      medium: "Short text",
      description:
        "A compact text work about proof, memory, and what a browser remembers after midnight.",
      externalUrl: "https://example.com/night-receipt",
      mediaPreview: {
        alt: "A text-work preview for Night Receipt with short horizontal receipt lines.",
        caption: "Short text preview for a compact writing work.",
        shape: "portrait",
        pattern: "receipt",
        background: "#c9d7f1",
        foreground: "#171411",
        marks: ["72%", "44%", "86%", "58%", "66%"],
      },
      className: "col-span-2 row-span-2 bg-[#c9d7f1] text-[#171411]",
    },
    {
      id: "05",
      title: "Almost Blue",
      creator: "N. Field",
      status: "review",
      size: "tiny",
      category: "In review",
      medium: "GIF",
      description:
        "A tiny animated submission waiting for manual approval before publication.",
      className: "col-span-1 row-span-2 bg-[#ead6e8] text-[#171411]",
    },
    {
      id: "06",
      title: "Public Draft",
      creator: "Open",
      status: "available",
      size: "medium",
      category: "Available",
      medium: "Image, GIF, video preview, or text",
      description:
        "A medium slot available for a more substantial visual, writing, or project announcement.",
      reservation: {
        priceLabel: "4x base price",
        priceCents: 4000,
        availableMonths: ["August 2026", "September 2026", "October 2026"],
        mediaRules: ["JPG, PNG, WebP, or GIF", "Muted video preview allowed", "Short description required", "One external link"],
      },
      className: "col-span-3 row-span-2 bg-[#e8b9a7] text-[#171411]",
    },
    {
      id: "07",
      title: "Afterimage",
      creator: "Jules Park",
      status: "occupied",
      size: "large",
      category: "Photography",
      medium: "Image series",
      description:
        "A large photographic placement built around repetition, glare, and the residue of looking.",
      externalUrl: "https://example.com/afterimage",
      mediaPreview: {
        alt: "A large photography preview for Afterimage with repeated framed exposures.",
        caption: "Public-domain abstract photograph used as a seeded wall visual.",
        shape: "cinematic",
        pattern: "frames",
        background: "#aec6b4",
        foreground: "#171411",
        marks: ["4%", "0%", "12%"],
        mediaUrl: commonsFile("Paul Strand. Abstraction, Twin Lakes, Connecticut. 1916.jpg"),
        mediaAlt:
          "Black and white abstract shadows from Paul Strand's Twin Lakes photograph.",
      },
      className: "col-span-4 row-span-3 bg-[#aec6b4] text-[#171411]",
    },
    {
      id: "08",
      title: "One Line Poem",
      creator: "TBD",
      status: "available",
      size: "tiny",
      category: "Available",
      medium: "Short text or icon",
      description:
        "A tiny slot for a very short message, icon, small image, or minimal animation.",
      reservation: {
        priceLabel: "1x base price",
        priceCents: 1000,
        availableMonths: ["August 2026", "September 2026"],
        mediaRules: ["Small image, icon, or short text", "No video", "One external link", "Alt text required"],
      },
      className: "col-span-1 row-span-1 bg-[#f2d0c0] text-[#171411]",
    },
    {
      id: "09",
      title: "Loop Study",
      creator: "Cam Studio",
      status: "occupied",
      size: "small",
      category: "Animation",
      medium: "GIF",
      description:
        "A short looping study intended to stay calm on the wall and open with more context in detail view.",
      externalUrl: "https://example.com/loop-study",
      mediaPreview: {
        alt: "A calm animation preview for Loop Study with four repeated blocks.",
        caption: "Public-domain kaleidoscope GIF used as a seeded wall visual.",
        shape: "strip",
        pattern: "blocks",
        background: "#d8d1bd",
        foreground: "#171411",
        marks: ["0.95", "0.68", "0.82", "0.5"],
        mediaUrl: commonsFile("Animated Kaleidoscope.gif"),
        mediaAlt: "A small animated kaleidoscope loop.",
      },
      className: "col-span-2 row-span-2 bg-[#d8d1bd] text-[#171411]",
    },
    {
      id: "10",
      title: "Archive Seed",
      creator: "Museum",
      status: "occupied",
      size: "medium",
      category: "Editorial",
      medium: "Text and image",
      description:
        "A platform-authored piece showing how unsold space can become editorial material without making the wall feel empty.",
      mediaPreview: {
        alt: "An editorial preview for Archive Seed with measured block shapes.",
        caption: "CC0 abstract image used as a seeded wall visual.",
        shape: "square",
        pattern: "blocks",
        background: "#bcc9cb",
        foreground: "#171411",
        marks: ["0.45", "0.86", "0.62", "0.74"],
        mediaUrl: commonsFile("Abstract Art 2002.jpg"),
        mediaAlt: "A square abstract artwork with layered color and texture.",
      },
      className: "col-span-3 row-span-2 bg-[#bcc9cb] text-[#171411]",
    },
  ],
};

export const archivedExhibitions: Exhibition[] = [
  {
    slug: "2026-07",
    title: "One Month Museum",
    monthLabel: "July 2026",
    templateLabel: "Archived wall template 000",
    reviewNote: "Locked archive snapshot",
    tagline: "Small Joys",
    description:
      "The pilot archive snapshot for small, quiet internet offerings: tiny drawings, short text pieces, calm loops, and one invited featured work.",
    status: "archived",
    theme: "Small Joys",
    stats: [
      { value: "32", label: "spaces" },
      { value: "24", label: "published" },
      { value: "8", label: "invited" },
      { value: "1", label: "theme" },
    ],
    spaces: [
      {
        id: "01",
        title: "Cup Window",
        creator: "Lina Moss",
        status: "featured",
        size: "featured",
        category: "Featured work",
        medium: "Image",
        description:
          "A featured pilot work about morning light, kitchen tables, and small rituals.",
        className:
          "col-span-4 row-span-4 bg-[#2f342f] text-[#f8f1df] lg:col-span-5",
      },
      {
        id: "02",
        title: "Tiny Parade",
        creator: "Oro Press",
        status: "occupied",
        size: "medium",
        category: "Illustration",
        medium: "GIF",
        description:
          "A gentle loop of shapes crossing a narrow street, preserved in the first archive month.",
        className: "col-span-3 row-span-2 bg-[#f0c7a6] text-[#171411]",
      },
      {
        id: "03",
        title: "Field Note 7",
        creator: "Mae Solo",
        status: "occupied",
        size: "small",
        category: "Writing",
        medium: "Short text",
        description:
          "A short field note preserved as an example of archive text work.",
        className: "col-span-2 row-span-2 bg-[#d7dfcf] text-[#171411]",
      },
      {
        id: "04",
        title: "Blue Button",
        creator: "Tess Venn",
        status: "occupied",
        size: "tiny",
        category: "Object",
        medium: "Image",
        description: "A tiny image placement from the pilot wall.",
        className: "col-span-1 row-span-1 bg-[#bdcce7] text-[#171411]",
      },
    ],
  },
  {
    slug: "2026-06",
    title: "One Month Museum",
    monthLabel: "June 2026",
    templateLabel: "Archived wall template 000",
    reviewNote: "Locked archive snapshot",
    tagline: "Unfinished Work",
    description:
      "An archive month for sketches, fragments, work-in-progress notes, and almost-finished experiments.",
    status: "archived",
    theme: "Unfinished Work",
    stats: [
      { value: "28", label: "spaces" },
      { value: "19", label: "published" },
      { value: "9", label: "curated" },
      { value: "1", label: "theme" },
    ],
    spaces: [
      {
        id: "01",
        title: "Draft Sun",
        creator: "Nora Type",
        status: "featured",
        size: "featured",
        category: "Featured work",
        medium: "Image",
        description:
          "A deliberately incomplete featured image from the archive month.",
        className:
          "col-span-4 row-span-3 bg-[#efe0aa] text-[#171411] lg:col-span-5",
      },
      {
        id: "02",
        title: "Margin Test",
        creator: "Studio Low",
        status: "occupied",
        size: "small",
        category: "Design",
        medium: "Image",
        description:
          "A visual test preserved to show how unfinished work can still belong in a curated month.",
        className: "col-span-2 row-span-2 bg-[#c7d8d2] text-[#171411]",
      },
      {
        id: "03",
        title: "Maybe Later",
        creator: "Rae Kim",
        status: "occupied",
        size: "medium",
        category: "Writing",
        medium: "Short text",
        description: "A text fragment about postponement and permanence.",
        className: "col-span-3 row-span-2 bg-[#e7c4d7] text-[#171411]",
      },
    ],
  },
];

export function getSpaceById(spaceId: string) {
  return currentExhibition.spaces.find((space) => space.id === spaceId);
}

export function getPublishedSpaces() {
  return currentExhibition.spaces.filter(
    (space) => space.status === "occupied" || space.status === "featured",
  );
}

export function getReservableSpaces() {
  return currentExhibition.spaces.filter(
    (space) => space.status === "available" && space.reservation,
  );
}

export function getReservableSpaceById(spaceId: string) {
  return getReservableSpaces().find((space) => space.id === spaceId);
}

export function getStatusSpaces() {
  return currentExhibition.spaces.filter(
    (space) => space.status === "available" || space.status === "review",
  );
}

export function getStatusSpaceById(spaceId: string) {
  return getStatusSpaces().find((space) => space.id === spaceId);
}

export function getArchivedExhibitionBySlug(slug: string) {
  return archivedExhibitions.find((exhibition) => exhibition.slug === slug);
}

export function getArchiveSummaries() {
  return archivedExhibitions.map((exhibition) => ({
    slug: exhibition.slug,
    monthLabel: exhibition.monthLabel,
    theme: exhibition.theme,
    description: exhibition.description,
    stats: exhibition.stats,
    publishedCount: exhibition.spaces.filter(
      (space) => space.status === "occupied" || space.status === "featured",
    ).length,
  }));
}
