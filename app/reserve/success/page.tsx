import Link from "next/link";
import { getCheckoutSessionPaymentIntent } from "@/lib/payment-service";
import { getMongoDb } from "@/lib/mongodb";
import {
  findReservationById,
  updateReservationPaymentStatus,
} from "@/lib/reservation-repository";

type PaymentConfirmation =
  | {
      success: true;
      reservationId: string;
      paymentIntentId: string;
    }
  | {
      success: false;
      message: string;
    };

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Payment Confirmed | One Month Museum",
  description: "Your reservation payment has been authorized.",
};

export default async function ReserveSuccessPage({
  searchParams,
}: PageProps<"/reserve/success">) {
  const { reservation_id: rawReservationId, session_id: rawSessionId } = await searchParams;
  const reservation_id = Array.isArray(rawReservationId) ? rawReservationId[0] : rawReservationId;
  const session_id = Array.isArray(rawSessionId) ? rawSessionId[0] : rawSessionId;

  if (!reservation_id || !session_id) {
    return (
      <main className="min-h-screen bg-[var(--bg-primary)] px-5 py-5 text-[var(--text-primary)] lg:px-8">
        <section className="border border-[var(--border-primary)] bg-[var(--bg-warning)] p-5 sm:p-7">
          <h1 className="text-3xl font-semibold">Missing payment details</h1>
          <p className="mt-3 text-[var(--text-secondary)]">
            The confirmation link is missing a reservation or session id.
          </p>
          <Link
            className="mt-5 inline-block text-sm uppercase tracking-wide underline underline-offset-4"
            href="/reserve"
          >
            Back to reserve
          </Link>
        </section>
      </main>
    );
  }

  const confirmation = await confirmPayment(reservation_id, session_id);

  if (confirmation.success) {
    return (
      <main className="min-h-screen bg-[var(--bg-primary)] px-5 py-5 text-[var(--text-primary)] lg:px-8">
        <section className="border border-[var(--border-primary)] bg-[var(--bg-success)] p-5 sm:p-7">
          <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">
            Payment authorized
          </p>
          <h1 className="mt-3 text-5xl font-semibold leading-none sm:text-7xl">
            Your space is held.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">
            The reservation is now submitted for manual review. Payment has been
            authorized but not captured. If the work is approved, payment will be
            captured and the work will be published.
          </p>
          <div className="mt-8 text-sm text-[var(--text-secondary)]">
            <p>Reservation: {confirmation.reservationId}</p>
            <p>Payment intent: {confirmation.paymentIntentId}</p>
          </div>
          <Link
            className="mt-8 inline-block text-sm uppercase tracking-wide underline underline-offset-4"
            href="/"
          >
            View current wall
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] px-5 py-5 text-[var(--text-primary)] lg:px-8">
      <section className="border border-[var(--border-primary)] bg-[var(--bg-warning)] p-5 sm:p-7">
        <h1 className="text-3xl font-semibold">Could not confirm payment</h1>
        <p className="mt-3 text-[var(--text-secondary)]">{confirmation.message}</p>
        <Link
          className="mt-5 inline-block text-sm uppercase tracking-wide underline underline-offset-4"
          href="/reserve"
        >
          Back to reserve
        </Link>
      </section>
    </main>
  );
}

async function confirmPayment(
  reservationId: string,
  sessionId: string,
): Promise<PaymentConfirmation> {
  try {
    const { paymentIntentId, authorized } =
      await getCheckoutSessionPaymentIntent(sessionId);
    const db = await getMongoDb();
    const reservation = await findReservationById(reservationId, db);

    if (!reservation) {
      throw new Error("Reservation not found.");
    }

    if (authorized) {
      await updateReservationPaymentStatus(
        reservation._id,
        {
          paymentStatus: "authorized",
          stripePaymentIntentId: paymentIntentId,
        },
        db,
      );
    }

    return {
      success: true,
      reservationId: reservation._id,
      paymentIntentId,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong.",
    };
  }
}
