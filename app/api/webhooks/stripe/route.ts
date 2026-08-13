import { NextResponse } from "next/server";
import { getCheckoutSessionPaymentIntent } from "@/lib/payment-service";
import { getMongoDb } from "@/lib/mongodb";
import {
  findReservationById,
  updateReservationPaymentStatus,
} from "@/lib/reservation-repository";
import { getStripe } from "@/lib/stripe";
import { insertParticipantEvent } from "@/lib/analytics-repository";

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature") ?? "";
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret) {
    return new Response("Webhook secret is not configured.", { status: 500 });
  }

  try {
    const event = getStripe().webhooks.constructEvent(payload, signature, secret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const reservationId = session.metadata?.reservationId;

      if (reservationId && session.id) {
        const { paymentIntentId, authorized } = await getCheckoutSessionPaymentIntent(session.id);

        if (authorized) {
          const db = await getMongoDb();
          const reservation = await findReservationById(reservationId, db);

          if (reservation && reservation.status === "submitted") {
            await updateReservationPaymentStatus(
              reservation._id,
              {
                paymentStatus: "authorized",
                stripePaymentIntentId: paymentIntentId,
              },
              db,
            );

            await insertParticipantEvent({
              type: "payment_authorized",
              participantEmail: reservation.primaryContactEmail,
              reservationId: reservation._id,
              createdAt: new Date().toISOString(),
            }, db);
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook error";
    return new Response(`Webhook error: ${message}`, { status: 400 });
  }
}
