import Link from "next/link";
import {
  ExhibitionWall,
  type ExhibitionWallFilter,
} from "@/components/exhibition/exhibition-wall";
import { WallFullscreenShell } from "@/components/exhibition/wall-fullscreen-shell";
import { getCurrentExhibition } from "@/lib/exhibition-service";

type HomePageProps = {
  searchParams: Promise<{ q?: string; view?: string }>;
};

export default async function Home({ searchParams }: HomePageProps) {
  const { q, view } = await searchParams;
  const filter: ExhibitionWallFilter =
    view === "published" || view === "available" || view === "review" ? view : "all";
  const exhibition = await getCurrentExhibition();

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <section className="flex min-h-screen flex-col gap-4 px-5 py-5 lg:px-8">
        <header className="flex flex-wrap items-end justify-between gap-4 border border-[var(--border-primary)] bg-[var(--bg-card)] p-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
              {exhibition.monthLabel} / {exhibition.theme ?? "Current exhibition"}
            </p>
            <h1 className="mt-1 text-3xl font-semibold leading-tight sm:text-4xl">
              {exhibition.tagline}
            </h1>
          </div>
          <nav className="flex flex-wrap gap-4 text-sm uppercase tracking-wide underline underline-offset-4">
            <Link href="/archive">Archive</Link>
          </nav>
        </header>
        <WallFullscreenShell
          fullscreen={
            <ExhibitionWall
              exhibition={exhibition}
              filter={filter}
              query={typeof q === "string" ? q : ""}
              wallOnly
            />
          }
        >
          <ExhibitionWall
            exhibition={exhibition}
            filter={filter}
            query={typeof q === "string" ? q : ""}
          />
        </WallFullscreenShell>
      </section>
    </main>
  );
}
