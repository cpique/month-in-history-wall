import Link from "next/link";
import { notFound } from "next/navigation";
import {
  currentExhibition,
  getStatusSpaceById,
  getStatusSpaces,
} from "@/lib/exhibition-data";

const statusCopy = {
  available: {
    eyebrow: "Available space",
    title: "This space can be reserved.",
    body: "Choose this slot to see its media rules, available months, and reservation form.",
    action: "Reserve this space",
  },
  review: {
    eyebrow: "In review",
    title: "This space is temporarily held.",
    body: "A submission has been received for this slot and is waiting for manual approval. If it is approved, it becomes part of the current wall; if not, the space can return to the available inventory.",
    action: "Browse open spaces",
  },
} as const;

export function generateStaticParams() {
  return getStatusSpaces().map((space) => ({ spaceId: space.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/spaces/[spaceId]">) {
  const { spaceId } = await params;
  const space = getStatusSpaceById(spaceId);

  if (!space) {
    return {
      title: "Space not found | One Month Museum",
    };
  }

  return {
    title: `Space ${space.id} Status | One Month Museum`,
    description: space.description,
  };
}

export default async function SpaceStatusPage({
  params,
}: PageProps<"/spaces/[spaceId]">) {
  const { spaceId } = await params;
  const space = getStatusSpaceById(spaceId);

  if (!space) {
    notFound();
  }

  const copy = space.status === "review" ? statusCopy.review : statusCopy.available;
  const actionHref =
    space.status === "available" ? `/reserve/${space.id}` : "/reserve";
  const isReview = space.status === "review";
  const publicTitle = isReview ? "In review" : space.title;
  const publicDescription = isReview
    ? "This space is held while an admin reviews a submitted work."
    : space.description;
  const publicCategory = isReview ? "Pending approval" : space.category;
  const publicMedium = isReview ? "Held space" : space.medium;

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] px-5 py-5 text-[var(--text-primary)] lg:px-8">
      <div className="grid min-h-[calc(100vh-40px)] gap-8 lg:grid-cols-[minmax(280px,0.62fr)_minmax(560px,1.38fr)]">
        <aside className="flex flex-col justify-between border border-[var(--border-primary)] bg-[var(--bg-card)] p-5 sm:p-7">
          <div className="space-y-8">
            <nav className="flex items-center justify-between gap-4 text-sm uppercase tracking-wide">
              <Link href="/">Current wall</Link>
              <Link href="/reserve">Reserve</Link>
            </nav>

            <div className="space-y-5">
              <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
                {currentExhibition.monthLabel} / Space {space.id}
              </p>
              <h1 className="text-5xl font-semibold leading-none sm:text-6xl">
                {copy.title}
              </h1>
              <p className="text-xl text-[var(--text-secondary)]">
                {space.size} space / {publicMedium}
              </p>
              <p className="text-lg leading-8 text-[var(--text-secondary)]">{copy.body}</p>
            </div>
          </div>

          <Link
            className="mt-10 inline-flex w-fit border border-[var(--border-primary)] bg-[var(--text-primary)] px-4 py-3 text-sm uppercase tracking-wide text-[var(--bg-primary)]"
            href={actionHref}
          >
            {copy.action}
          </Link>
        </aside>

        <section className="grid border border-[var(--border-primary)] bg-[var(--bg-wall)] p-3 text-[var(--text-primary)]">
          <div
            className={`${space.className} flex min-h-[420px] flex-col justify-between border border-[var(--border-primary)] p-5 sm:p-7`}
          >
            <div className="flex items-center justify-between text-sm uppercase tracking-wide">
              <span>{copy.eyebrow}</span>
              <span>{publicCategory}</span>
            </div>
            <div className="max-w-2xl space-y-5">
              <p className="text-3xl font-semibold leading-tight sm:text-5xl">
                {publicTitle}
              </p>
              <p className="text-lg leading-8 opacity-80">{publicDescription}</p>
              <div className="grid gap-3 text-sm uppercase tracking-wide sm:grid-cols-3">
                <p className="border border-current p-3">Status: {space.status}</p>
                <p className="border border-current p-3">Size: {space.size}</p>
                <p className="border border-current p-3">
                  Month: {currentExhibition.monthLabel}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
