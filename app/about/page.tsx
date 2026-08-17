import Link from "next/link";

export const metadata = {
  title: "About | Month in History Wall",
  description:
    "A visual archive of the world, one month at a time. Learn how Month in History Wall curates historical events, sources, and editorial importance.",
};

const sections = [
  {
    title: "What this is",
    items: [
      "Month in History Wall turns a single month into an explorable digital wall of historical events.",
      "Each wall is a curated snapshot: politics, culture, conflict, sport, science, business, and everyday signals from that month.",
      "It is not a news feed, a social timeline, or a random grid. It is closer to an atlas or a museum wall.",
    ],
  },
  {
    title: "How the wall works",
    items: [
      "Events appear as tiles. Larger tiles mark higher editorial importance; smaller tiles mark notable or contextual signals.",
      "Importance is editorial, not sponsored. If paid placement is introduced later, it will be clearly labeled and visually distinct.",
      "Open any tile to read what happened, why it mattered, and which sources support it.",
    ],
  },
  {
    title: "Sources and trust",
    items: [
      "Every published event should have at least one source citation. Preferred sources include encyclopedias, public archives, official records, newspapers, academic works, and licensed media repositories.",
      "AI-generated summaries are treated as drafts. A human editor reviews claims and citations before publication.",
      "If you spot an error or a missing source, use the correction request form on any event detail page.",
    ],
  },
  {
    title: "Editorial workflow",
    items: [
      "Months are imported as structured JSON files, then reviewed as an editorial set.",
      "Events move through draft, needs review, published, needs correction, and archived states.",
      "A locked month becomes an immutable archive snapshot, preserved exactly as reviewed.",
    ],
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)] px-5 py-5 text-[var(--text-primary)] lg:px-8">
      <section className="border border-[var(--border-primary)] bg-[var(--bg-card)] p-5 sm:p-7">
        <nav className="flex items-center justify-between gap-4 text-sm uppercase tracking-wide">
          <Link href="/">Month in History Wall</Link>
          <div className="flex gap-4">
            <Link href="/archive">Archive</Link>
            <Link href="/search">Search</Link>
          </div>
        </nav>

        <div className="mt-20 grid gap-6 lg:grid-cols-[minmax(280px,0.7fr)_minmax(520px,1.3fr)]">
          <div>
            <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
              About the project
            </p>
            <h1 className="mt-3 max-w-3xl text-5xl font-semibold leading-none sm:text-7xl">
              Pick a month. See the world as it was then.
            </h1>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">
            Month in History Wall is a visual archive built one month at a time.
            Each wall argues that history is uneven, crowded, surprising, and
            interconnected.
          </p>
        </div>
      </section>

      <section className="grid gap-5 border-x border-b border-[var(--border-primary)] p-5 lg:grid-cols-2 lg:p-8">
        {sections.map((section) => (
          <article
            className="border border-[var(--border-primary)] bg-[var(--bg-card)] p-5"
            key={section.title}
          >
            <h2 className="text-2xl font-semibold">{section.title}</h2>
            <ul className="mt-5 space-y-4 leading-7 text-[var(--text-secondary)]">
              {section.items.map((item) => (
                <li className="border-t border-[var(--border-tertiary)] pt-4" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="border-x border-b border-[var(--border-primary)] p-5 lg:p-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            className="border border-[var(--border-primary)] bg-[var(--bg-card)] p-5 text-center text-sm uppercase tracking-wide transition-transform duration-200 hover:-translate-y-1"
            href="/"
          >
            View the current wall
          </Link>
          <Link
            className="border border-[var(--border-primary)] bg-[var(--bg-card)] p-5 text-center text-sm uppercase tracking-wide transition-transform duration-200 hover:-translate-y-1"
            href="/archive"
          >
            Browse the archive
          </Link>
          <Link
            className="border border-[var(--border-primary)] bg-[var(--bg-card)] p-5 text-center text-sm uppercase tracking-wide transition-transform duration-200 hover:-translate-y-1"
            href="/search"
          >
            Search events
          </Link>
        </div>
      </section>
    </main>
  );
}
