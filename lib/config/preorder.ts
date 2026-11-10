/**
 * Global Pre-Order Configuration for UFO LABZ
 * Single source of truth for pre-order mode, estimated dispatch dates,
 * and storefront pre-order guarantee policies.
 */

export const PREORDER_CONFIG = {
  // Global Pre-order mode flag (env fallback to true)
  isPreorderMode: process.env.NEXT_PUBLIC_PREORDER_MODE !== 'false',

  // Estimated Ship Date placeholder (to be confirmed by merchant)
  estimatedShipDate: '2nd Week of December 2026 (Batch 01)',
  estimatedShipNotice: 'Laboratory formulation in progress. Expected dispatch: 2nd Week of December 2026.',

  // Storefront Badges & Labels
  badgeText: 'PRE-ORDER',
  actionButtonText: 'Pre-order Now',
  secondaryActionText: 'Pre-order',
  checkoutTitle: 'Pre-order Reservation',
  orderStatus: 'preorder_confirmed',

  // Pre-Order Policy Block
  policy: {
    title: 'UFO LABZ Pre-Order Policy & Guarantee',
    highlight: '100% Risk-Free Pre-Order Guarantee',
    terms: [
      {
        heading: 'Batch Production Reservation',
        description:
          'Your card or TWINT is charged at the time of order placement to lock in your allocation from UFO LABZ Batch 01.',
      },
      {
        heading: 'Estimated Dispatch Timeline',
        description:
          'Shipments are scheduled for dispatch in the 2nd week of December 2026. You will receive real-time email tracking updates as your order enters precision packaging.',
      },
      {
        heading: '100% Full Refund Anytime Before Dispatch',
        description:
          'You may modify or cancel your pre-order at any time prior to shipping for an instant 100% full refund with zero cancellation fees. Simply contact support@ufolabz.com.',
      },
      {
        heading: 'Switzerland & European Union Direct Dispatch',
        description:
          'Orders ship directly to your door with tracked precision shipping throughout Switzerland and the European Union. Free delivery on all orders from CHF 75 / €75.',
      },
    ],
  },
}
