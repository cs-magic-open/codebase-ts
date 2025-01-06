"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import type { Stripe } from "stripe"

import { CURRENCY } from "./config"
import { stripe } from "./server"
import { formatAmountForStripe } from "./utils"

export async function createCheckoutSession(data: FormData): Promise<void> {
  const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create({
    mode: "payment",
    submit_type: "donate",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: CURRENCY,
          product_data: {
            name: "Custom amount donation",
          },
          unit_amount: formatAmountForStripe(Number(data.get("customDonation")!), CURRENCY),
        },
      },
    ],
    success_url: `${headers().get("origin")!}/donate-with-checkout/result?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${headers().get("origin")!}/donate-with-checkout`,
  })

  redirect(checkoutSession.url!)
}

export async function createPaymentIntent(data: FormData): Promise<{
  client_secret: string
}> {
  const paymentIntent: Stripe.PaymentIntent = await stripe.paymentIntents.create({
    amount: formatAmountForStripe(Number(data.get("customDonation")!), CURRENCY),
    automatic_payment_methods: { enabled: true },
    currency: CURRENCY,
  })

  return { client_secret: paymentIntent.client_secret! }
}
