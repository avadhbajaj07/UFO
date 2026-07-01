import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('[STRIPE] STRIPE_SECRET_KEY is not configured.')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_missing', {
  apiVersion: '2024-06-20',
  typescript: true,
})

export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY)
}
