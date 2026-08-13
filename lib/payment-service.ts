import type { ReservationDocument } from "./domain-types";
import { getAppUrl, getStripe } from "./stripe";

export async function createReservationCheckoutSession(
  reservation: ReservationDocument,
): Promise<string> {
  const stripe = getStripe();
  const appUrl = getAppUrl();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_intent_data: {
      capture_method: "manual",
    },
    line_items: [
      {
        price_data: {
          currency: reservation.currency.toLowerCase(),
          unit_amount: reservation.totalAmountCents,
          product_data: {
            name: `One Month Museum - ${reservation.requestedSize} space`,
            description: `Reservation months: ${reservation.months.join(", ")}`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      reservationId: reservation._id,
    },
    success_url: `${appUrl}/reserve/success?reservation_id=${reservation._id}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/reserve/cancel?reservation_id=${reservation._id}`,
  });

  if (!session.url) {
    throw new Error("Stripe did not return a checkout session URL.");
  }

  return session.url;
}

export async function getCheckoutSessionPaymentIntent(sessionId: string): Promise<{
  paymentIntentId: string;
  authorized: boolean;
}> {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["payment_intent"],
  });

  if (typeof session.payment_intent === "string" || !session.payment_intent) {
    throw new Error("Stripe session did not include a payment intent.");
  }

  const paymentIntent = session.payment_intent;
  const authorized = paymentIntent.status === "requires_capture";

  if (!authorized && paymentIntent.status !== "succeeded") {
    throw new Error(`Payment intent status is ${paymentIntent.status}; authorization was not successful.`);
  }

  return { paymentIntentId: paymentIntent.id, authorized };
}

export async function capturePaymentIntent(paymentIntentId: string): Promise<void> {
  const stripe = getStripe();
  await stripe.paymentIntents.capture(paymentIntentId);
}

export async function cancelPaymentIntent(paymentIntentId: string): Promise<void> {
  const stripe = getStripe();
  await stripe.paymentIntents.cancel(paymentIntentId);
}
