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

export type EventSource = {
  title: string;
  url: string;
  publisher: string;
  sourceType: "encyclopedia" | "archive" | "official" | "news" | "reference";
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
  date?: string;
  location?: string;
  importanceLevel?: "featured" | "major" | "notable" | "signal";
  sources?: EventSource[];
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
  slug: "1984-06",
  title: "Month in History Wall",
  monthLabel: "June 1984",
  templateLabel: "Historical wall template 001",
  reviewNote: "Seeded editorial snapshot / sources attached in data",
  tagline: "June 1984: the world in one crowded wall.",
  description:
    "A first historical month wall mixing politics, science, culture, sports, disasters, and everyday signals. Larger tiles carry higher editorial importance.",
  status: "current",
  theme: "Cold War, culture, and change",
  stats: [
    { value: "12", label: "events" },
    { value: "6", label: "categories" },
    { value: "8", label: "countries" },
    { value: "1", label: "monthly wall" },
  ],
  spaces: [
    {
      id: "1984-06-06-india",
      title: "Operation Blue Star",
      creator: "Amritsar, India",
      status: "featured",
      size: "featured",
      category: "Conflict",
      medium: "June 1-8",
      date: "1984-06-01",
      location: "Amritsar, India",
      importanceLevel: "featured",
      description:
        "Indian forces entered the Golden Temple complex to remove Sikh militants, a defining crisis with lasting political and communal consequences.",
      externalUrl: "https://www.britannica.com/event/Operation-Blue-Star",
      mediaPreview: {
        alt: "A featured historical tile with the Golden Temple reflected in water.",
        caption: "Golden Temple, Amritsar.",
        shape: "cinematic",
        pattern: "signal",
        background: "#171411",
        foreground: "#f8f1df",
        marks: ["34%", "72%", "48%", "88%", "42%", "64%"],
        mediaUrl: commonsFile("Golden Temple India.jpg"),
        mediaAlt: "The Golden Temple in Amritsar reflected in the surrounding water.",
      },
      sources: [
        {
          title: "Operation Blue Star",
          url: "https://www.britannica.com/event/Operation-Blue-Star",
          publisher: "Encyclopaedia Britannica",
          sourceType: "encyclopedia",
        },
      ],
      className:
        "col-span-4 row-span-4 bg-[#171411] text-[#f8f1df] lg:col-span-6",
    },
    {
      id: "1984-06-05-indira-gandhi",
      title: "Indira Gandhi Orders The Army Into Punjab",
      creator: "New Delhi, India",
      status: "occupied",
      size: "large",
      category: "Politics",
      medium: "June 5",
      date: "1984-06-05",
      location: "India",
      importanceLevel: "major",
      description:
        "The prime minister's decision to use military force in Punjab shaped Indian politics through the rest of 1984 and beyond.",
      externalUrl: "https://www.britannica.com/biography/Indira-Gandhi",
      mediaPreview: {
        alt: "A large political-history tile with a portrait of Indira Gandhi.",
        caption: "Indira Gandhi.",
        shape: "portrait",
        pattern: "frames",
        background: "#d8d1bd",
        foreground: "#171411",
        marks: ["0%", "18%", "8%"],
        mediaUrl: commonsFile("Indira Gandhi 1966.jpg"),
        mediaAlt: "Portrait photograph of Indira Gandhi.",
      },
      sources: [
        {
          title: "Indira Gandhi",
          url: "https://www.britannica.com/biography/Indira-Gandhi",
          publisher: "Encyclopaedia Britannica",
          sourceType: "encyclopedia",
        },
      ],
      className: "col-span-4 row-span-3 bg-[#d8d1bd] text-[#171411]",
    },
    {
      id: "1984-06-08-ghostbusters",
      title: "Ghostbusters Opens",
      creator: "United States",
      status: "occupied",
      size: "medium",
      category: "Film",
      medium: "June 8",
      date: "1984-06-08",
      location: "United States",
      importanceLevel: "notable",
      description:
        "The supernatural comedy opened in U.S. theaters and became one of the defining popular films of the summer.",
      externalUrl: "https://www.britannica.com/topic/Ghostbusters-film-1984",
      mediaPreview: {
        alt: "A medium culture tile for Ghostbusters with a New York street scene.",
        caption: "New York street scene.",
        shape: "square",
        pattern: "blocks",
        background: "#c9d7f1",
        foreground: "#171411",
        marks: ["0.45", "0.86", "0.62", "0.74"],
        mediaUrl: commonsFile("New York City at night HDR.jpg"),
        mediaAlt: "A nighttime New York City street scene.",
      },
      sources: [
        {
          title: "Ghostbusters",
          url: "https://www.britannica.com/topic/Ghostbusters-film-1984",
          publisher: "Encyclopaedia Britannica",
          sourceType: "encyclopedia",
        },
      ],
      className: "col-span-3 row-span-2 bg-[#c9d7f1] text-[#171411]",
    },
    {
      id: "1984-06-06-tetris",
      title: "Tetris Is Created In Moscow",
      creator: "Moscow, Soviet Union",
      status: "occupied",
      size: "medium",
      category: "Technology",
      medium: "June 1984",
      date: "1984-06",
      location: "Moscow, Soviet Union",
      importanceLevel: "notable",
      description:
        "Alexey Pajitnov created the first version of Tetris on an Electronika 60, beginning one of the most durable global stories in video games.",
      externalUrl: "https://tetris.com/news/the-history-of-tetris",
      mediaPreview: {
        alt: "A technology-history tile with block-like geometric shapes.",
        caption: "Geometric puzzle blocks.",
        shape: "square",
        pattern: "blocks",
        background: "#bcc9cb",
        foreground: "#171411",
        marks: ["0.45", "0.86", "0.62", "0.74"],
      },
      sources: [
        {
          title: "The History of Tetris",
          url: "https://tetris.com/news/the-history-of-tetris",
          publisher: "Tetris",
          sourceType: "official",
        },
      ],
      className: "col-span-3 row-span-2 bg-[#bcc9cb] text-[#171411]",
    },
    {
      id: "1984-06-22-virgin-atlantic",
      title: "Virgin Atlantic's First Flight",
      creator: "London to Newark",
      status: "occupied",
      size: "small",
      category: "Business",
      medium: "June 22",
      date: "1984-06-22",
      location: "United Kingdom / United States",
      importanceLevel: "signal",
      description:
        "Virgin Atlantic began service with a transatlantic flight, a small June signal of the changing airline market.",
      externalUrl: "https://corporate.virginatlantic.com/gb/en/media/press-releases/virgin-atlantic-celebrates-40-years.html",
      mediaPreview: {
        alt: "A small aviation tile with a passenger aircraft in flight.",
        caption: "Passenger aircraft in flight.",
        shape: "strip",
        pattern: "signal",
        background: "#aec6b4",
        foreground: "#171411",
        marks: ["72%", "44%", "86%", "58%", "66%"],
        mediaUrl: commonsFile("Virgin Atlantic Boeing 747-400 G-VBIG.jpg"),
        mediaAlt: "A Virgin Atlantic Boeing 747 in flight.",
      },
      sources: [
        {
          title: "Virgin Atlantic celebrates 40 years",
          url: "https://corporate.virginatlantic.com/gb/en/media/press-releases/virgin-atlantic-celebrates-40-years.html",
          publisher: "Virgin Atlantic",
          sourceType: "official",
        },
      ],
      className: "col-span-2 row-span-2 bg-[#aec6b4] text-[#171411]",
    },
    {
      id: "1984-06-24-f1-detroit",
      title: "Nelson Piquet Wins In Detroit",
      creator: "Detroit, United States",
      status: "occupied",
      size: "small",
      category: "Sports",
      medium: "June 24",
      date: "1984-06-24",
      location: "Detroit, United States",
      importanceLevel: "signal",
      description:
        "Nelson Piquet won the Detroit Grand Prix during a Formula One season remembered for tight championship margins.",
      externalUrl: "https://www.formula1.com/en/results/1984/races/424/united-states-grand-prix/race-result",
      mediaPreview: {
        alt: "A small sports tile with a racing circuit texture.",
        caption: "Detroit street circuit era.",
        shape: "strip",
        pattern: "receipt",
        background: "#e8b9a7",
        foreground: "#171411",
        marks: ["72%", "44%", "86%", "58%", "66%"],
      },
      sources: [
        {
          title: "1984 United States Grand Prix results",
          url: "https://www.formula1.com/en/results/1984/races/424/united-states-grand-prix/race-result",
          publisher: "Formula 1",
          sourceType: "official",
        },
      ],
      className: "col-span-2 row-span-2 bg-[#e8b9a7] text-[#171411]",
    },
    {
      id: "1984-06-25-prince-purple-rain",
      title: "Purple Rain Is Released",
      creator: "United States",
      status: "occupied",
      size: "medium",
      category: "Music",
      medium: "June 25",
      date: "1984-06-25",
      location: "United States",
      importanceLevel: "major",
      description:
        "Prince and the Revolution released Purple Rain, a landmark album tied to the film and to Prince's global breakthrough.",
      externalUrl: "https://www.grammy.com/news/prince-purple-rain-album-film-legacy",
      mediaPreview: {
        alt: "A medium music tile with stage lights and a concert atmosphere.",
        caption: "Concert stage lights.",
        shape: "cinematic",
        pattern: "signal",
        background: "#ead6e8",
        foreground: "#171411",
        marks: ["34%", "72%", "48%", "88%", "42%", "64%"],
        mediaUrl: commonsFile("Prince (cropped).jpg"),
        mediaAlt: "Prince performing on stage.",
      },
      sources: [
        {
          title: "Prince's Purple Rain legacy",
          url: "https://www.grammy.com/news/prince-purple-rain-album-film-legacy",
          publisher: "Recording Academy",
          sourceType: "reference",
        },
      ],
      className: "col-span-3 row-span-2 bg-[#ead6e8] text-[#171411]",
    },
    {
      id: "1984-06-25-eec-election",
      title: "European Parliament Election Aftermath",
      creator: "European Community",
      status: "occupied",
      size: "small",
      category: "Politics",
      medium: "June 14-17",
      date: "1984-06-17",
      location: "European Community",
      importanceLevel: "notable",
      description:
        "The second direct European Parliament election closed in mid-June, reflecting a still-young experiment in cross-border democratic representation.",
      externalUrl: "https://www.europarl.europa.eu/election-results-2019/en/european-results/1984-1989/constitutive-session/",
      mediaPreview: {
        alt: "A small politics tile with the European Parliament building.",
        caption: "European Parliament.",
        shape: "square",
        pattern: "frames",
        background: "#d6e7dc",
        foreground: "#171411",
        marks: ["0%", "18%", "8%"],
        mediaUrl: commonsFile("European Parliament Strasbourg Hemicycle - Diliff.jpg"),
        mediaAlt: "The European Parliament hemicycle in Strasbourg.",
      },
      sources: [
        {
          title: "European election results 1984",
          url: "https://www.europarl.europa.eu/election-results-2019/en/european-results/1984-1989/constitutive-session/",
          publisher: "European Parliament",
          sourceType: "official",
        },
      ],
      className: "col-span-2 row-span-2 bg-[#d6e7dc] text-[#171411]",
    },
    {
      id: "1984-06-27-france-euro",
      title: "France Wins UEFA Euro 1984",
      creator: "Paris, France",
      status: "occupied",
      size: "medium",
      category: "Sports",
      medium: "June 27",
      date: "1984-06-27",
      location: "Paris, France",
      importanceLevel: "major",
      description:
        "France defeated Spain in the final and won its first major international football title, powered by Michel Platini's tournament.",
      externalUrl: "https://www.uefa.com/uefaeuro/history/seasons/1984/",
      mediaPreview: {
        alt: "A medium sports tile with a football stadium crowd.",
        caption: "European football stadium.",
        shape: "cinematic",
        pattern: "blocks",
        background: "#f5e0bd",
        foreground: "#171411",
        marks: ["0.95", "0.68", "0.82", "0.5"],
        mediaUrl: commonsFile("Parc des Princes Paris.jpg"),
        mediaAlt: "Parc des Princes stadium in Paris.",
      },
      sources: [
        {
          title: "UEFA Euro 1984",
          url: "https://www.uefa.com/uefaeuro/history/seasons/1984/",
          publisher: "UEFA",
          sourceType: "official",
        },
      ],
      className: "col-span-3 row-span-2 bg-[#f5e0bd] text-[#171411]",
    },
    {
      id: "1984-06-28-rose-bowl",
      title: "Olympic Preparations Near Their Final Month",
      creator: "Los Angeles, United States",
      status: "occupied",
      size: "small",
      category: "Sports",
      medium: "June 1984",
      date: "1984-06",
      location: "Los Angeles, United States",
      importanceLevel: "signal",
      description:
        "With the Los Angeles Olympics weeks away, June carried the logistics, boycotts, and anticipation of a Cold War-era Games.",
      externalUrl: "https://olympics.com/en/olympic-games/los-angeles-1984",
      mediaPreview: {
        alt: "A small Olympics tile with the Los Angeles Memorial Coliseum.",
        caption: "Los Angeles Memorial Coliseum.",
        shape: "square",
        pattern: "frames",
        background: "#f2d0c0",
        foreground: "#171411",
        marks: ["4%", "0%", "12%"],
        mediaUrl: commonsFile("Los Angeles Memorial Coliseum.JPG"),
        mediaAlt: "The Los Angeles Memorial Coliseum.",
      },
      sources: [
        {
          title: "Los Angeles 1984 Olympic Games",
          url: "https://olympics.com/en/olympic-games/los-angeles-1984",
          publisher: "International Olympic Committee",
          sourceType: "official",
        },
      ],
      className: "col-span-2 row-span-2 bg-[#f2d0c0] text-[#171411]",
    },
    {
      id: "1984-06-30-bruce-springsteen",
      title: "Born In The U.S.A. Dominates The Summer",
      creator: "United States",
      status: "occupied",
      size: "small",
      category: "Music",
      medium: "June 4",
      date: "1984-06-04",
      location: "United States",
      importanceLevel: "notable",
      description:
        "Bruce Springsteen released Born in the U.S.A., sending a rock record with complicated patriotism into mass culture.",
      externalUrl: "https://www.brucespringsteen.net/albums/born-in-the-u-s-a/",
      mediaPreview: {
        alt: "A small music tile with a concert-stage preview.",
        caption: "Rock concert lighting.",
        shape: "strip",
        pattern: "receipt",
        background: "#ece8dd",
        foreground: "#171411",
        marks: ["72%", "44%", "86%", "58%", "66%"],
      },
      sources: [
        {
          title: "Born in the U.S.A.",
          url: "https://www.brucespringsteen.net/albums/born-in-the-u-s-a/",
          publisher: "Bruce Springsteen official site",
          sourceType: "official",
        },
      ],
      className: "col-span-2 row-span-2 bg-[#ece8dd] text-[#171411]",
    },
    {
      id: "1984-06-30-apple-macintosh",
      title: "Macintosh Enters Everyday Conversation",
      creator: "United States",
      status: "occupied",
      size: "tiny",
      category: "Technology",
      medium: "June 1984",
      date: "1984-06",
      location: "United States",
      importanceLevel: "signal",
      description:
        "Months after launch, the Macintosh was becoming a recognizable symbol of personal computing's new visual interface era.",
      externalUrl: "https://www.computerhistory.org/revolution/personal-computers/17/297",
      mediaPreview: {
        alt: "A tiny technology tile for early personal computing.",
        caption: "Early personal computing.",
        shape: "square",
        pattern: "blocks",
        background: "#f4f1ea",
        foreground: "#171411",
        marks: ["0.45", "0.86", "0.62", "0.74"],
      },
      sources: [
        {
          title: "Apple Macintosh",
          url: "https://www.computerhistory.org/revolution/personal-computers/17/297",
          publisher: "Computer History Museum",
          sourceType: "archive",
        },
      ],
      className: "col-span-1 row-span-1 bg-[#f4f1ea] text-[#171411]",
    },
  ],
};

export const archivedExhibitions: Exhibition[] = [
  {
    slug: "2001-09",
    title: "Month in History Wall",
    monthLabel: "September 2001",
    templateLabel: "Archived wall template 000",
    reviewNote: "Locked archive snapshot",
    tagline: "September 2001",
    description:
      "A future locked historical wall for a month defined by the September 11 attacks and global aftershocks.",
    status: "archived",
    theme: "Shock and aftermath",
    stats: [
      { value: "0", label: "events" },
      { value: "0", label: "published" },
      { value: "0", label: "sources" },
      { value: "1", label: "month" },
    ],
    spaces: [],
  },
  {
    slug: "1969-07",
    title: "Month in History Wall",
    monthLabel: "July 1969",
    templateLabel: "Archived wall template 000",
    reviewNote: "Locked archive snapshot",
    tagline: "July 1969",
    description:
      "A future locked historical wall centered on Apollo 11, geopolitics, culture, and the late-1960s public imagination.",
    status: "archived",
    theme: "Moonshot month",
    stats: [
      { value: "0", label: "events" },
      { value: "0", label: "published" },
      { value: "0", label: "sources" },
      { value: "1", label: "month" },
    ],
    spaces: [],
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

export function getStatusSpaces() {
  return currentExhibition.spaces.filter(
    (space) => space.status === "available" || space.status === "review",
  );
}

export function getStatusSpaceById(spaceId: string) {
  return getStatusSpaces().find((space) => space.id === spaceId);
}

export function getReservableSpaceById(spaceId: string) {
  return getReservableSpaces().find((space) => space.id === spaceId);
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
