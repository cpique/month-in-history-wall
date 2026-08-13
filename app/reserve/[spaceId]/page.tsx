import Link from "next/link";
import { notFound } from "next/navigation";
import { ReservationDraftForm } from "@/components/reservation/reservation-draft-form";
import { ReservationLifecycle } from "@/components/reservation/reservation-lifecycle";
import {
  currentExhibition,
  getReservableSpaceById,
  getReservableSpaces,
} from "@/lib/exhibition-data";

export function generateStaticParams() {
  return getReservableSpaces().map((space) => ({ spaceId: space.id }));
}

export async function generateMetadata({ params }: PageProps<"/reserve/[spaceId]">) {
  const { spaceId } = await params;
  const space = getReservableSpaceById(spaceId);

  if (!space) {
    return {
      title: "Reservation unavailable | One Month Museum",
    };
  }

  return {
    title: `Reserve ${space.title} | One Month Museum`,
    description: space.description,
  };
}

export default async function ReserveSpacePage({
  params,
}: PageProps<"/reserve/[spaceId]">) {
  const { spaceId } = await params;
  const space = getReservableSpaceById(spaceId);

  if (!space || !space.reservation) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] px-5 py-5 text-[var(--text-primary)] lg:px-8">
      <div className="grid min-h-[calc(100vh-40px)] gap-8 lg:grid-cols-[minmax(300px,0.58fr)_minmax(620px,1.42fr)]">
        <aside className="flex flex-col justify-between border border-[var(--border-primary)] bg-[var(--bg-card)] p-5 sm:p-7">
          <div className="space-y-8">
            <nav className="flex items-center justify-between gap-4 text-sm uppercase tracking-wide">
              <Link href="/reserve">Reserve</Link>
              <Link href="/">Current wall</Link>
            </nav>

            <div className="space-y-5">
              <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
                {currentExhibition.monthLabel} / Space {space.id}
              </p>
              <h1 className="text-5xl font-semibold leading-none sm:text-6xl">
                {space.title}
              </h1>
              <p className="text-xl text-[var(--text-secondary)]">
                {space.size} space / {space.reservation.priceLabel}
              </p>
              <p className="text-lg leading-8 text-[var(--text-secondary)]">
                {space.description}
              </p>
            </div>
          </div>

          <div className="mt-10 border border-[var(--border-primary)] p-4">
            <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
              Review-first flow
            </p>
            <p className="mt-3 leading-7 text-[var(--text-secondary)]">
              Payment reserves the space, but publication depends on manual
              approval. Stripe authorizes the payment now; it is captured only
              after the work is approved.
            </p>
          </div>
        </aside>

        <section className="grid gap-5 border border-[var(--border-primary)] bg-[var(--bg-card)] p-5 sm:p-7 lg:grid-cols-[0.78fr_1.22fr]">
          <div
            className={`${space.className} flex min-h-[340px] flex-col justify-between border border-[var(--border-primary)] p-5`}
          >
            <div className="flex items-center justify-between text-sm uppercase tracking-wide">
              <span>{space.medium}</span>
              <span>{space.size}</span>
            </div>
            <div>
              <p className="text-3xl font-semibold leading-tight">{space.title}</p>
              <p className="mt-2 opacity-75">Preview of selected slot</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="border border-[var(--border-primary)] p-4">
                <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
                  Available months
                </p>
                <ul className="mt-4 space-y-2">
                  {space.reservation.availableMonths.map((month) => (
                    <li key={month}>{month}</li>
                  ))}
                </ul>
              </div>
              <div className="border border-[var(--border-primary)] p-4">
                <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
                  Media rules
                </p>
                <ul className="mt-4 space-y-2">
                  {space.reservation.mediaRules.map((rule) => (
                    <li key={rule}>{rule}</li>
                  ))}
                </ul>
              </div>
            </div>

            <ReservationDraftForm
              spaceId={space.id}
              availableMonths={space.reservation.availableMonths}
              priceLabel={space.reservation.priceLabel}
              size={space.size}
            />
            <ReservationLifecycle currentStatus="draft" />
          </div>
        </section>
      </div>
    </main>
  );
}
