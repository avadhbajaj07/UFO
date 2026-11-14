import type { Metadata } from 'next'
import Link from 'next/link'
import { ShieldCheck, Truck, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react'
import { PREORDER_CONFIG } from '@/lib/config/preorder'
import { SHIPPING_CONFIG } from '@/lib/config/pricing'

export const metadata: Metadata = {
  title: 'Pre-Order Policy & Guarantee | UFO LABZ Switzerland',
  description:
    'Read the official UFO LABZ Pre-Order Terms, Batch 01 dispatch timelines, Swiss shipping details, and our 100% full refund cancellation guarantee.',
}

export default function PreOrderPolicyPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-4xl mx-auto container-px space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-alien-green/15 border border-alien-green/40 text-alien-green font-mono text-xs font-bold uppercase tracking-wider">
            Official Store Policy
          </div>
          <h1 className="font-display text-4xl sm:text-5xl text-white tracking-wide">
            PRE-ORDER TERMS & GUARANTEE
          </h1>
          <p className="text-gray-400 text-sm max-w-xl mx-auto leading-relaxed">
            All UFO LABZ nutritional formulations are produced under sterile laboratory standards in
            Switzerland. Learn how our batch pre-order reservation model protects you with a 100% risk-free guarantee.
          </p>
        </div>

        {/* Highlight Guarantee Box */}
        <div className="card-glass border border-alien-green/30 p-8 rounded-3xl relative overflow-hidden bg-space-900/90 shadow-glow-green">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-alien-green/20 border border-alien-green/40 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-8 h-8 text-alien-green" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-xl font-bold text-white tracking-wide">
                100% Full Refund Guarantee Before Dispatch
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                You may modify or cancel your pre-order reservation at any time prior to shipment for an
                instant 100% refund to your original payment method (Card or TWINT) with zero processing fees.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-8">
          {/* 1. Production Model */}
          <div className="bg-space-900 border border-white/5 p-6 rounded-2xl space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-alien-green font-mono text-xs font-bold">
                01
              </span>
              <h3 className="font-bold text-lg text-white">How UFO LABZ Pre-Orders Work</h3>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed pl-10">
              Every formula in the UFO LABZ collection (ASTRO CREATINE PURE, AMINO FUEL EAA, BLAST PRE-WORKOUT,
              NOVA MARINE PEPTIDES COLLAGEN, and COSMIC MAGNESIUM GLYCINATE) is strictly allocated per production batch.
              Payment is charged at the moment of checkout to lock in your unit reservation from Swiss Batch 01.
            </p>
          </div>

          {/* 2. Dispatch Timeline */}
          <div className="bg-space-900 border border-white/5 p-6 rounded-2xl space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-alien-green font-mono text-xs font-bold">
                02
              </span>
              <h3 className="font-bold text-lg text-white">Estimated Shipping Timeline</h3>
            </div>
            <div className="pl-10 space-y-2 text-sm text-gray-400 leading-relaxed">
              <div className="p-3 bg-space-950 border border-alien-green/20 rounded-xl flex items-center gap-2 text-white font-medium">
                <Truck className="w-4 h-4 text-alien-green shrink-0" />
                <span>Estimated Batch 01 Dispatch: {PREORDER_CONFIG.estimatedShipDate}</span>
              </div>
              <p>
                As your batch passes quality verification and enters tamper-evident packaging, you will receive
                automated tracking updates via email and SMS. Deliveries in Switzerland are fulfilled via Swiss Post.
              </p>
            </div>
          </div>

          {/* 3. Shipping Rates */}
          <div className="bg-space-900 border border-white/5 p-6 rounded-2xl space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-alien-green font-mono text-xs font-bold">
                03
              </span>
              <h3 className="font-bold text-lg text-white">Shipping Rates & Thresholds</h3>
            </div>
            <div className="pl-10 space-y-3 text-sm text-gray-400 leading-relaxed">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 bg-space-950 border border-white/5 rounded-xl space-y-1">
                  <div className="font-bold text-white text-xs font-mono uppercase">Switzerland (CHF)</div>
                  <p className="text-xs text-gray-300">• Free shipping for orders CHF {SHIPPING_CONFIG.switzerland.freeThreshold.toFixed(2)}+</p>
                  <p className="text-xs text-gray-300">• CHF {SHIPPING_CONFIG.switzerland.standardFee.toFixed(2)} standard shipping under CHF 75</p>
                  <p className="text-xs text-alien-green font-semibold">• Tracked Swiss Post dispatch</p>
                </div>
                <div className="p-4 bg-space-950 border border-white/5 rounded-xl space-y-1">
                  <div className="font-bold text-white text-xs font-mono uppercase">European Union (EUR)</div>
                  <p className="text-xs text-gray-300">• Free EU shipping for orders €{SHIPPING_CONFIG.eu.freeThreshold.toFixed(2)}+</p>
                  <p className="text-xs text-gray-300">• Standard EU delivery from €{SHIPPING_CONFIG.eu.defaultStandardFee.toFixed(2)}</p>
                  <p className="text-xs text-gray-400">• Currency automatically adjusts to EUR</p>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Cancellation Process */}
          <div className="bg-space-900 border border-white/5 p-6 rounded-2xl space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-alien-green font-mono text-xs font-bold">
                04
              </span>
              <h3 className="font-bold text-lg text-white">How to Cancel or Modify Your Pre-Order</h3>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed pl-10">
              Need to change your shipping address, adjust quantities, or cancel your order? Simply send an email to{' '}
              <a href="mailto:support@ufolabz.com" className="text-alien-green hover:underline font-mono">
                support@ufolabz.com
              </a>{' '}
              quoting your order number. Cancellations requested before dispatch are processed within 24 hours.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8">
          <Link href="/products" className="btn-primary shadow-glow-green text-sm px-8 py-3.5 inline-flex items-center gap-2">
            Explore Pre-Order Formulas
          </Link>
        </div>
      </div>
    </div>
  )
}
