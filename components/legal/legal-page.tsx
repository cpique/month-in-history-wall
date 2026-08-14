import Link from "next/link";

export function LegalPage({
  description,
  sections,
  title,
}: {
  description: string;
  sections: Array<{ title: string; items: string[] }>;
  title: string;
}) {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)] px-5 py-5 text-[var(--text-primary)] lg:px-8">
      <section className="border border-[var(--border-primary)] bg-[var(--bg-card)] p-5 sm:p-7">
        <nav className="flex items-center justify-between gap-4 text-sm uppercase tracking-wide">
          <Link href="/">Month in History Wall</Link>
          <Link href="/archive">Archive</Link>
        </nav>
        <div className="mt-20 grid gap-6 lg:grid-cols-[minmax(280px,0.7fr)_minmax(520px,1.3fr)]">
          <div>
            <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">Public information</p>
            <h1 className="mt-3 max-w-3xl text-5xl font-semibold leading-none sm:text-7xl">
              {title}
            </h1>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">{description}</p>
        </div>
      </section>
      <section className="grid gap-5 border-x border-b border-[var(--border-primary)] p-5 lg:grid-cols-2 lg:p-8">
        {sections.map((section) => (
          <article className="border border-[var(--border-primary)] bg-[var(--bg-card)] p-5" key={section.title}>
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
    </main>
  );
}
