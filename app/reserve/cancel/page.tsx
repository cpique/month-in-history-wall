import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Payment Cancelled | One Month Museum",
  description: "The reservation payment was not completed.",
};

export default async function ReserveCancelPage({
  searchParams,
}: PageProps<"/reserve/cancel">) {
  const { reservation_id } = await searchParams;

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] px-5 py-5 text-[var(--text-primary)] lg:px-8">
      <section className="border border-[var(--border-primary)] bg-[var(--bg-warning)] p-5 sm:p-7">
        <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
          Payment not completed
        </p>
        <h1 className="mt-3 text-5xl font-semibold leading-none sm:text-7xl">
          Reservation not held.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">
          The checkout was cancelled and no payment was authorized. You can start
          a new reservation from the available spaces.
        </p>
        {reservation_id ? (
          <p className="mt-3 text-sm text-[var(--text-secondary)]">
            Reservation reference: {reservation_id}
          </p>
        ) : null}
        <Link
          className="mt-8 inline-block text-sm uppercase tracking-wide underline underline-offset-4"
          href="/reserve"
        >
          Back to reserve
        </Link>
      </section>
    </main>
  );
}
