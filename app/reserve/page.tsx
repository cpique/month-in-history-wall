import Link from "next/link";
import { getReservableSpaces } from "@/lib/exhibition-data";

export const metadata = {
  title: "Reserve a Space | One Month Museum",
  description: "Choose an available space in the current monthly exhibition.",
};

export default function ReservePage() {
  const spaces = getReservableSpaces();

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] px-5 py-5 text-[var(--text-primary)] lg:px-8">
      <section className="border border-[var(--border-primary)] bg-[var(--bg-card)] p-5 sm:p-7">
        <nav className="flex items-center justify-between gap-4 text-sm uppercase tracking-wide">
          <Link href="/">One Month Museum</Link>
          <Link href="/archive">Archive</Link>
        </nav>

        <div className="mt-20 grid gap-6 lg:grid-cols-[minmax(280px,0.7fr)_minmax(520px,1.3fr)]">
          <div>
            <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
              Reserve a space
            </p>
            <h1 className="mt-3 max-w-3xl text-5xl font-semibold leading-none sm:text-7xl">
              Choose a space for this month.
            </h1>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">
            Browse the available inventory, see media rules and pricing, and
            start a reservation. Payment is authorized before review; approved
            work is published and captured, rejected work is refunded.
          </p>
        </div>
      </section>

      <section className="grid gap-5 border-x border-b border-[var(--border-primary)] p-5 lg:grid-cols-3 lg:p-8">
        {spaces.map((space) => (
          <Link
            className={`${space.className} flex min-h-[260px] flex-col justify-between border border-[var(--border-primary)] p-5 transition-transform duration-200 hover:-translate-y-1`}
            href={`/reserve/${space.id}`}
            key={space.id}
          >
            <div className="flex items-start justify-between text-sm uppercase tracking-wide">
              <span>Space {space.id}</span>
              <span>{space.size}</span>
            </div>
            <div className="space-y-3">
              <p className="text-3xl font-semibold leading-tight">{space.title}</p>
              <p className="leading-7 opacity-80">{space.medium}</p>
              <p className="text-sm uppercase tracking-wide">
                {space.reservation?.priceLabel}
              </p>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
