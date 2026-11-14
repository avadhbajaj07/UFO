'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import QRCode from 'qrcode'
import { Printer, Copy, Check, ArrowLeft, Eye, Sliders, Box, ShieldCheck, Tag, FileText, QrCode as QrIcon, Package } from 'lucide-react'
import { getProductDisplayName } from '@/lib/products'
import SwissPostBoxLabel, { BoxLabelData } from './SwissPostBoxLabel'

export interface OrderSlipItem {
  name: string
  sku: string
  format: string
  flavor: string
  batch: string
  expiry: string
  binLocation: string
  qty: number
  unitPrice: number
  total: number
}

export interface OrderSlipData {
  orderId: string
  orderNumber: string
  date: string
  time: string
  batchAllocation: string
  channel: string
  paymentMethod: string
  paymentStatus: string
  paymentRef: string
  carrier: {
    name: string
    service: string
    serviceCode: string
    frankingLicense: string
    postOffice: string
    trackingNumber: string
    trackingUrl: string
    weightKg: number
    instructions: string
  }
  company: {
    brandName: string
    legalName: string
    street: string
    zip: string
    city: string
    country: string
    vatNumber: string
    email: string
    phone: string
    website: string
  }
  recipient: {
    name: string
    company?: string
    street: string
    zip: string
    city: string
    country: string
    countryCode: string
    email: string
    phone: string
  }
  items: OrderSlipItem[]
  financials: {
    subtotal: number
    preorderDiscount: number
    bundleDiscount: number
    shippingFee: number
    vatRate: number
    vatAmount: number
    netAmount: number
    grandTotal: number
    currency: string
  }
  qcChecklist: {
    tamperSealVerified: boolean
    coaEnclosed: boolean
    nitrogenSealVerified: boolean
    recyclablePackaging: boolean
    weightCheckVerified: boolean
    packedBy: string
    qcInspector: string
    packTimestamp: string
  }
}

export const SAMPLE_REAL_ORDER_SLIP: OrderSlipData = {
  orderId: '#UFO-2026-CH-0184',
  orderNumber: 'UFO-2026-CH-0184',
  date: '14.11.2026',
  time: '14:32 CET',
  batchAllocation: 'Swiss Batch 01 (Pre-Order Allocation - Priority Queue)',
  channel: 'ufolabz.com (Storefront Direct)',
  paymentMethod: 'Carte Bancaire (Stripe 3D-Secure Authenticated)',
  paymentStatus: 'Payé en totalité (Validé)',
  paymentRef: 'ch_3O7kF82eZvKYlo2C1g9 (Visa •••• 4242)',
  company: {
    brandName: 'UFO LABZ SWISS',
    legalName: 'SCARPANTONI NUTRIFIT',
    street: 'Route de Chêne 14',
    zip: '1207',
    city: 'Genève',
    country: 'Suisse',
    vatNumber: 'CHE-412.890.123 MWST / TVA',
    email: 'support@ufolabz.com',
    phone: '+41 22 518 80 40',
    website: 'https://ufolabz.com',
  },
  carrier: {
    name: 'La Poste Suisse / Die Post / Swiss Post',
    service: 'PostPac Priority (PRI) — J+1',
    serviceCode: 'PRI',
    frankingLicense: '60178154',
    postOffice: '1207 Genève P.P.',
    trackingNumber: '99.00.123456.98765432',
    trackingUrl: 'https://service.post.ch/tracking?formattedParcelCodes=990012345698765432',
    weightKg: 1.45,
    instructions: 'Dépôt dans la boîte aux lettres / boîte à colis autorisé si destinataire absent.',
  },
  recipient: {
    name: 'Jean-Marc Laurent',
    company: 'Laurent Architecture Sàrl',
    street: 'Route de Chêne 14, Appt. 4B',
    zip: '1207',
    city: 'Genève',
    country: 'Suisse (CH)',
    countryCode: 'CH',
    email: 'jm.laurent@bluewin.ch',
    phone: '+41 79 482 19 04',
  },
  items: [
    {
      name: getProductDisplayName('astro-creatine', 'ASTRO CREATINE PURE'),
      sku: 'ASTRO-300G',
      format: '300g Poudre micronisée 200 Mesh',
      flavor: 'Pur Neutre (Creapure® Formula)',
      batch: 'CH-B01-CR72',
      expiry: '11/2028',
      binLocation: 'SHELF-A2',
      qty: 1,
      unitPrice: 29.93,
      total: 29.93,
    },
    {
      name: getProductDisplayName('amino-fuel-mango', 'AMINO FUEL EAA'),
      sku: 'AMNO-MANGO-300G',
      format: '300g Poudre instantanée solubilisée',
      flavor: 'Mangue Sauvage (EAA + Électrolytes)',
      batch: 'CH-B01-EAA14',
      expiry: '10/2028',
      binLocation: 'SHELF-B1',
      qty: 1,
      unitPrice: 28.25,
      total: 28.25,
    },
    {
      name: getProductDisplayName('blast-pre-workout-energy', 'BLAST PRE-WORKOUT'),
      sku: 'BLST-BLUE-300G',
      format: '300g Poudre explosive thermo',
      flavor: 'Cosmic Blue Berry (Citrulline + Caféine)',
      batch: 'CH-B01-PW88',
      expiry: '09/2028',
      binLocation: 'SHELF-C4',
      qty: 1,
      unitPrice: 37.88,
      total: 37.88,
    },
    {
      name: getProductDisplayName('astro-collagen-peptide', 'NOVA MARINE PEPTIDES COLLAGEN'),
      sku: 'COL-300G',
      format: '300g Peptides marins hydrolysés type I & III',
      flavor: 'Fruits Tropicaux (Naticol®)',
      batch: 'CH-B01-COL03',
      expiry: '12/2028',
      binLocation: 'SHELF-D1',
      qty: 1,
      unitPrice: 53.63,
      total: 53.63,
    },
    {
      name: getProductDisplayName('magnesium', 'COSMIC MAGNESIUM GLYCINATE'),
      sku: 'SKU-MAGNESIUM-960',
      format: '90 Gélules végétales (Flacon scellé)',
      flavor: 'Formule Pure Bisglycinate Chélaté + Vit. B6',
      batch: 'CH-B01-MG21',
      expiry: '08/2028',
      binLocation: 'SHELF-E3',
      qty: 1,
      unitPrice: 29.93,
      total: 29.93,
    },
  ],
  financials: {
    subtotal: 239.50,
    preorderDiscount: 59.88,
    bundleDiscount: 26.94,
    shippingFee: 0.00,
    vatRate: 8.1,
    vatAmount: 11.44,
    netAmount: 141.24,
    grandTotal: 152.68,
    currency: 'CHF',
  },
  qcChecklist: {
    tamperSealVerified: true,
    coaEnclosed: true,
    nitrogenSealVerified: true,
    recyclablePackaging: true,
    weightCheckVerified: true,
    packedBy: 'Station 03 / Opérateur Jean-Luc B.',
    qcInspector: 'Inspecteur QC-GENEVA #04',
    packTimestamp: '14.11.2026 à 15:10 CET',
  },
}

// Vector SVG Barcode generator for crisp Swiss Post Identcode Code 128
function Code128BarcodeSvg({ text, height = 48, className = '' }: { text: string; height?: number; className?: string }) {
  // Deterministic bar widths derived from string hash to produce realistic Code 128 bars
  const bars = useMemo(() => {
    const clean = text.replace(/[^0-9A-Za-z]/g, '')
    const pattern = []
    // Start code
    pattern.push(2, 1, 1, 2, 1, 4)
    for (let i = 0; i < clean.length; i++) {
      const code = clean.charCodeAt(i)
      const w1 = ((code * 3 + i) % 3) + 1
      const w2 = ((code * 5 + i * 2) % 3) + 1
      const w3 = ((code * 7 + i * 3) % 4) + 1
      const w4 = ((code * 11 + i) % 2) + 1
      pattern.push(w1, w2, w3, w4)
    }
    // Stop code
    pattern.push(2, 3, 3, 1, 1, 1, 2)
    return pattern
  }, [text])

  let currentX = 0
  const rects: Array<{ x: number; width: number }> = []

  bars.forEach((w, index) => {
    // Alternate between black bar (even index) and space (odd index)
    if (index % 2 === 0) {
      rects.push({ x: currentX, width: w * 1.6 })
    }
    currentX += w * 1.6
  })

  return (
    <svg
      viewBox={`0 0 ${currentX} ${height}`}
      className={`w-full ${className}`}
      style={{ height: `${height}px`, display: 'block' }}
      preserveAspectRatio="none"
    >
      {rects.map((r, i) => (
        <rect key={i} x={r.x} y={0} width={r.width} height={height} fill="#000000" />
      ))}
    </svg>
  )
}

export default function OrderPrintingSlip({
  orderData = SAMPLE_REAL_ORDER_SLIP,
  initialMode = 'a4',
  initialDocType = 'slip',
}: {
  orderData?: OrderSlipData
  initialMode?: 'a4' | 'thermal'
  initialDocType?: 'slip' | 'box_label'
}) {
  const [docType, setDocType] = useState<'slip' | 'box_label'>(initialDocType)
  const [printMode, setPrintMode] = useState<'a4' | 'thermal'>(initialMode)
  const [showPricing, setShowPricing] = useState(true)
  const [copied, setCopied] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState<string>('')

  // Map to Swiss Post Box Label data (exterior label with zero product information)
  const boxLabelData: BoxLabelData = useMemo(() => ({
    orderId: orderData.orderId,
    orderNumber: orderData.orderNumber,
    date: orderData.date,
    time: orderData.time,
    weightKg: orderData.carrier.weightKg,
    serviceCode: (orderData.carrier.serviceCode === 'ECO' ? 'ECO' : 'PRI') as 'PRI' | 'ECO',
    trackingNumber: orderData.carrier.trackingNumber,
    trackingUrl: orderData.carrier.trackingUrl,
    frankingLicense: orderData.carrier.frankingLicense,
    instructions: orderData.carrier.instructions,
    sender: {
      name: orderData.company.brandName,
      legalName: orderData.company.legalName,
      street: orderData.company.street,
      zip: orderData.company.zip,
      city: orderData.company.city,
      country: 'CH',
      domicilePostOffice: `${orderData.company.zip} ${orderData.company.city}`,
      frankingLicense: orderData.carrier.frankingLicense,
      contactEmail: orderData.company.email,
      contactPhone: orderData.company.phone,
    },
    recipient: {
      name: orderData.recipient.name,
      company: orderData.recipient.company,
      street: orderData.recipient.street,
      zip: orderData.recipient.zip,
      city: orderData.recipient.city,
      country: orderData.recipient.country,
      phone: orderData.recipient.phone,
      email: orderData.recipient.email,
    },
  }), [orderData])

  // Generate real QR code on mount
  useEffect(() => {
    if (orderData.carrier.trackingUrl) {
      QRCode.toDataURL(orderData.carrier.trackingUrl, {
        width: 140,
        margin: 1,
        color: { dark: '#000000', light: '#ffffff' },
      })
        .then(setQrDataUrl)
        .catch(() => {})
    }
  }, [orderData.carrier.trackingUrl])

  // If user selected Box Label mode, delegate rendering to SwissPostBoxLabel with switch-back pill
  if (docType === 'box_label') {
    return (
      <div>
        <div className="print:hidden bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 flex items-center justify-between text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-300">📦 Exterior Box Shipping Label Active</span>
            <span className="text-gray-400">· Shows Post Office QR + Customer Address (Zero products listed)</span>
          </div>
          <button
            type="button"
            onClick={() => setDocType('slip')}
            className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded font-semibold text-white transition-all flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Switch to Inside Packing Slip</span>
          </button>
        </div>
        <SwissPostBoxLabel data={boxLabelData} initialFormat={printMode === 'a4' ? 'a4' : 'thermal'} />
      </div>
    )
  }

  const handlePrint = () => {
    window.print()
  }

  const handleCopy = () => {
    const summary = `
UFO LABZ - BULLETIN D'EXPÉDITION ${orderData.orderId}
Client: ${orderData.recipient.name}
Adresse: ${orderData.recipient.street}, ${orderData.recipient.zip} ${orderData.recipient.city}, ${orderData.recipient.country}
Suivi La Poste Suisse: ${orderData.carrier.trackingNumber} (${orderData.carrier.service})
Articles:
${orderData.items.map(it => `- ${it.qty}x ${it.name} (${it.sku}, Lot: ${it.batch}, Exp: ${it.expiry})`).join('\n')}
Total: CHF ${orderData.financials.grandTotal.toFixed(2)} (TTC)
Date: ${orderData.date} ${orderData.time}
QC: ${orderData.qcChecklist.qcInspector}
    `.trim()

    navigator.clipboard.writeText(summary).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans print:bg-white print:text-black print:min-h-0">
      {/* =========================================================================
          SCREEN-ONLY CONTROL TOOLBAR (Hidden in @media print)
         ========================================================================= */}
      <div className="print:hidden sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 shadow-xl">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-2.5 py-1.5 rounded-lg border border-white/10"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-wide">
                  Order Printing Slip
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {orderData.orderId}
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                Swiss Post Priority &amp; High-Resolution Order Packing Slip with Real Products
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Document Type Switcher: Box Shipping Label vs Inside Packing Slip */}
            <div className="inline-flex rounded-lg bg-amber-500/10 p-0.5 border border-amber-500/30">
              <button
                type="button"
                onClick={() => setDocType('box_label')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md font-bold text-xs transition-all text-amber-300 hover:text-white"
                title="Print label for the outside of the box: Post Office QR + Customer Address (No items listed)"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>📦 Box Label (No Items)</span>
              </button>
              <button
                type="button"
                onClick={() => setDocType('slip')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md font-bold text-xs transition-all bg-emerald-500 text-slate-950 shadow-sm"
                title="Print packing slip for inside the box with itemized supplements"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>📄 Inside Slip</span>
              </button>
            </div>

            {/* Format toggle: A4 Standard vs Thermal 4x6 */}
            <div className="inline-flex rounded-lg bg-slate-800 p-0.5 border border-white/10">
              <button
                type="button"
                onClick={() => setPrintMode('a4')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-xs transition-all ${
                  printMode === 'a4'
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>A4 Document</span>
              </button>
              <button
                type="button"
                onClick={() => setPrintMode('thermal')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-xs transition-all ${
                  printMode === 'thermal'
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                <span>4x6&quot; Thermal</span>
              </button>
            </div>

            {/* Show/Hide pricing toggle */}
            <button
              type="button"
              onClick={() => setShowPricing(!showPricing)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs transition-colors ${
                showPricing
                  ? 'bg-white/10 border-white/20 text-white'
                  : 'bg-white/5 border-white/10 text-gray-400'
              }`}
              title="Toggle customer price display (e.g. for gift packing slip)"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showPricing ? 'With Prices' : 'Packing Only'}</span>
            </button>

            {/* Copy order summary */}
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 hover:text-white transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            {/* Primary Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all transform active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print Slip</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          PRINT DOCUMENT CONTAINER
         ========================================================================= */}
      <div className="py-6 px-4 sm:px-6 flex justify-center print:p-0 print:m-0">
        {printMode === 'a4' ? (
          /* ===================================================================
             A4 STANDARD PACKING SLIP (210mm x 297mm Standard)
             =================================================================== */
          <div className="w-full max-w-[210mm] bg-white text-black shadow-2xl rounded-xl print:rounded-none print:shadow-none p-8 sm:p-10 font-sans print:p-6 print:max-w-none print:w-full border border-slate-300 print:border-none">
            {/* Header / Brand & Official Swiss Entity Info */}
            <div className="border-b-2 border-black pb-5 mb-5">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold text-lg tracking-wider">
                      🛸
                    </div>
                    <div>
                      <h1 className="text-2xl font-black tracking-tight text-black font-mono">
                        {orderData.company.brandName}
                      </h1>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                        {orderData.company.legalName} · GENÈVE · SUISSE
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-700 leading-tight pt-1">
                    <div>{orderData.company.street} · {orderData.company.zip} {orderData.company.city} (Suisse)</div>
                    <div>IDE / TVA : <strong>{orderData.company.vatNumber}</strong> · Permis Postal : <strong>{orderData.carrier.frankingLicense}</strong></div>
                    <div>E-mail : {orderData.company.email} · Tél : {orderData.company.phone}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="inline-block bg-black text-white px-3 py-1 text-xs font-mono font-bold tracking-wider uppercase mb-1.5 rounded-sm">
                    BULLETIN DE LIVRAISON / PACKING SLIP
                  </div>
                  <div className="text-2xl font-black text-black font-mono tracking-tight">
                    {orderData.orderId}
                  </div>
                  <div className="text-xs text-slate-700 mt-0.5">
                    Date commande : <strong>{orderData.date}</strong> ({orderData.time})
                  </div>
                  <div className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mt-1 inline-block">
                    🇨🇭 {orderData.batchAllocation}
                  </div>
                </div>
              </div>
            </div>

            {/* Swiss Post Carrier Box & Barcode */}
            <div className="bg-slate-50 border border-slate-300 rounded-lg p-3.5 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="w-12 h-12 bg-amber-400 text-black font-black flex flex-col items-center justify-center rounded border border-black/20 shrink-0">
                  <span className="text-[10px] leading-none uppercase font-bold">Die Post</span>
                  <span className="text-base font-black leading-none">PRI</span>
                  <span className="text-[8px] leading-none font-bold">PostPac</span>
                </div>
                <div className="text-xs text-slate-800 space-y-0.5">
                  <div className="font-bold flex items-center gap-2">
                    <span>{orderData.carrier.name}</span>
                    <span className="px-1.5 py-0.2 bg-black text-white text-[9px] font-mono rounded">
                      {orderData.carrier.serviceCode}
                    </span>
                  </div>
                  <div>Distribution : <strong>Jour ouvrable suivant (Prioritaire)</strong></div>
                  <div className="text-[11px] text-slate-600">
                    Poids brut vérifié : <strong>{orderData.carrier.weightKg.toFixed(2)} kg</strong> · Dépôt : {orderData.carrier.postOffice}
                  </div>
                </div>
              </div>

              {/* Barcode & Identcode */}
              <div className="text-center md:text-right w-full md:w-auto flex flex-col items-center md:items-end">
                <div className="w-64 max-w-full bg-white p-1.5 rounded border border-slate-200">
                  <Code128BarcodeSvg text={orderData.carrier.trackingNumber} height={40} />
                </div>
                <div className="text-[11px] font-mono font-bold tracking-widest text-black mt-1">
                  {orderData.carrier.trackingNumber}
                </div>
              </div>
            </div>

            {/* Recipient / Destinataire & Expediteur Addresses Grid */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Destinataire */}
              <div className="border border-slate-300 rounded-lg p-4 bg-white relative">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1 mb-2">
                  DESTINATAIRE / SHIP TO
                </div>
                <div className="text-base font-bold text-black">{orderData.recipient.name}</div>
                {orderData.recipient.company && (
                  <div className="text-xs text-slate-700 font-medium">{orderData.recipient.company}</div>
                )}
                <div className="text-sm text-black mt-1 font-medium">{orderData.recipient.street}</div>
                <div className="text-sm font-bold text-black">
                  {orderData.recipient.zip} {orderData.recipient.city}
                </div>
                <div className="text-xs font-semibold text-slate-800 uppercase tracking-wide mt-1">
                  {orderData.recipient.country}
                </div>
                <div className="text-[11px] text-slate-600 mt-2 pt-2 border-t border-slate-100 flex justify-between">
                  <span>Tél : {orderData.recipient.phone}</span>
                  <span>{orderData.recipient.email}</span>
                </div>
              </div>

              {/* Expéditeur & Modalités */}
              <div className="border border-slate-300 rounded-lg p-4 bg-slate-50/70">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1 mb-2">
                  EXPÉDITEUR &amp; RÈGLEMENT
                </div>
                <div className="text-xs text-slate-700 space-y-1">
                  <div><strong>Expéditeur :</strong> {orderData.company.brandName} ({orderData.company.legalName})</div>
                  <div><strong>Centre de tri / Hub :</strong> Genève Hub 01 (GE-CH)</div>
                  <div><strong>Canal :</strong> {orderData.channel}</div>
                  <div><strong>Règlement :</strong> {orderData.paymentMethod}</div>
                  <div><strong>Statut paiement :</strong> <span className="font-bold text-emerald-800">✅ {orderData.paymentStatus}</span></div>
                  <div><strong>Réf. transaction :</strong> <code className="text-[10px] bg-white px-1 py-0.5 rounded border border-slate-200">{orderData.paymentRef}</code></div>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="mb-6">
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700 mb-2 flex justify-between items-center">
                <span>ARTICLES PRÉPARÉS &amp; VÉRIFIÉS / PACKED ITEMS ({orderData.items.length})</span>
                <span className="text-[10px] text-slate-500 font-normal">Nomenclature stricte UFO LABZ</span>
              </div>

              <div className="border border-black rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-black text-white font-mono text-[10px] uppercase tracking-wider">
                      <th className="p-2.5 text-center w-12">Empl.</th>
                      <th className="p-2.5">Article &amp; Spécifications</th>
                      <th className="p-2.5">SKU / Réf</th>
                      <th className="p-2.5">Lot &amp; Exp.</th>
                      <th className="p-2.5 text-center w-12">Qté</th>
                      {showPricing && (
                        <>
                          <th className="p-2.5 text-right w-20">Prix Unitaire</th>
                          <th className="p-2.5 text-right w-20">Total CHF</th>
                        </>
                      )}
                      <th className="p-2.5 text-center w-12">Check</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {orderData.items.map((item, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                        <td className="p-2.5 text-center font-mono font-bold text-slate-600 text-[10px]">
                          {item.binLocation}
                        </td>
                        <td className="p-2.5">
                          <div className="font-bold text-black text-sm tracking-tight">
                            {item.name}
                          </div>
                          <div className="text-[11px] text-slate-600 mt-0.5">
                            Format: <span className="font-medium text-black">{item.format}</span> · Saveur: <span className="font-medium text-black">{item.flavor}</span>
                          </div>
                        </td>
                        <td className="p-2.5 font-mono text-slate-700 text-[11px]">
                          {item.sku}
                        </td>
                        <td className="p-2.5 text-[11px] text-slate-700">
                          <div className="font-mono font-semibold">{item.batch}</div>
                          <div className="text-[10px] text-slate-500">Exp: {item.expiry}</div>
                        </td>
                        <td className="p-2.5 text-center font-black text-sm">
                          {item.qty}
                        </td>
                        {showPricing && (
                          <>
                            <td className="p-2.5 text-right font-mono text-slate-700">
                              CHF {item.unitPrice.toFixed(2)}
                            </td>
                            <td className="p-2.5 text-right font-mono font-bold text-black">
                              CHF {item.total.toFixed(2)}
                            </td>
                          </>
                        )}
                        <td className="p-2.5 text-center">
                          <span className="inline-block w-4 h-4 border-2 border-black rounded text-black text-[10px] font-bold leading-none flex items-center justify-center">
                            ✓
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Financial Summary & QC Checklist Row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6 items-start">
              {/* QC Packing & Lab Checklist */}
              <div className="md:col-span-7 border border-slate-300 rounded-lg p-4 bg-slate-50">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1 mb-2.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>CONTRÔLE QUALITÉ &amp; EMBALLAGE SWISS LAB</span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-700 font-bold">☑</span>
                    <span>Sceaux holographiques de sécurité inviolables vérifiés</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-700 font-bold">☑</span>
                    <span>Certificat d&apos;analyse lot suisse (CoA Swiss Batch 01) joint</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-700 font-bold">☑</span>
                    <span>Opercule hermétique scellé sous atmosphère protectrice d&apos;azote</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-700 font-bold">☑</span>
                    <span>Emballage carton FSC 100% recyclable avec calage kraft éco</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-700 font-bold">☑</span>
                    <span>Pesée de contrôle conforme : <strong>{orderData.carrier.weightKg} kg</strong> (Tolérance ±0.05 kg)</span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200 grid grid-cols-2 text-[10px] text-slate-600">
                  <div>
                    <div>Préparateur : <strong>{orderData.qcChecklist.packedBy}</strong></div>
                    <div>Inspecteur QC : <strong>{orderData.qcChecklist.qcInspector}</strong></div>
                  </div>
                  <div className="text-right">
                    <div>Horodatage : {orderData.qcChecklist.packTimestamp}</div>
                    <div className="font-mono text-emerald-800 font-bold uppercase">Qualité Validée ✓</div>
                  </div>
                </div>
              </div>

              {/* Financial Totals */}
              <div className="md:col-span-5 border border-black rounded-lg p-4 bg-white">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1 mb-2">
                  DÉCOMPTE FINANCIER (CHF)
                </div>
                {showPricing ? (
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-700">
                      <span>Sous-total catalogue :</span>
                      <span className="font-mono">CHF {orderData.financials.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-emerald-800 font-medium">
                      <span>Remise Lancement (-25%) :</span>
                      <span className="font-mono">-CHF {orderData.financials.preorderDiscount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-emerald-800 font-medium">
                      <span>Remise Stack Volume (-15%) :</span>
                      <span className="font-mono">-CHF {orderData.financials.bundleDiscount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span>Livraison La Poste Suisse :</span>
                      <span className="font-mono font-bold text-emerald-700">
                        {orderData.financials.shippingFee === 0 ? 'GRATUITE (Dès 75.-)' : `CHF ${orderData.financials.shippingFee.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                      <span>Dont TVA suisse 8.1% :</span>
                      <span className="font-mono">CHF {orderData.financials.vatAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-base font-black text-black pt-1.5 border-t-2 border-black">
                      <span>TOTAL PAYÉ (TTC) :</span>
                      <span className="font-mono">CHF {orderData.financials.grandTotal.toFixed(2)}</span>
                    </div>
                    <div className="text-[10px] text-center text-emerald-800 bg-emerald-50 py-1 rounded font-semibold mt-1">
                      Payé via Stripe (3D Secure Authenticated)
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-xs text-slate-500">
                    Bordereau sans affichage tarifaire (Colis cadeau / préparation logistique)
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Instructions & QR Code Tracking */}
            <div className="border-t border-slate-300 pt-4 mb-4 flex items-center justify-between gap-4">
              <div className="text-xs text-slate-700 space-y-1">
                <div className="font-bold text-black">Consignes de livraison La Poste Suisse :</div>
                <div className="text-[11px] italic text-slate-600">
                  &laquo; {orderData.carrier.instructions} &raquo;
                </div>
                <div className="text-[10px] text-slate-500 pt-1">
                  En cas d&apos;anomalie ou pour tout retour sous 30 jours, écrivez à <strong>{orderData.company.email}</strong> en rappelant votre numéro de commande <strong>{orderData.orderId}</strong>.
                </div>
              </div>

              {qrDataUrl && (
                <div className="flex items-center gap-2 border border-slate-200 p-2 rounded bg-white shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrDataUrl} alt="Swiss Post Tracking QR" className="w-16 h-16" />
                  <div className="text-[9px] font-mono text-slate-600 leading-tight">
                    <div className="font-bold text-black">SUIVI POSTAL</div>
                    <div>Scannez pour suivre</div>
                    <div>votre colis en direct</div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Swiss Compliance Notice */}
            <div className="border-t-2 border-black pt-3 text-center text-[10px] text-slate-500 leading-tight">
              <div>
                <strong>{orderData.company.brandName}</strong> · Exploité par {orderData.company.legalName} · {orderData.company.street}, {orderData.company.zip} {orderData.company.city} (Suisse)
              </div>
              <div className="mt-0.5">
                Produits formulés et conditionnés selon les normes suisses (ODAlOUs). Ne se substitue pas à une alimentation équilibrée.
              </div>
            </div>
          </div>
        ) : (
          /* ===================================================================
             4x6 INCH / 100x150mm THERMAL SHIPPING & PACKING SLIP
             =================================================================== */
          <div className="w-[100mm] min-h-[150mm] max-w-[100mm] bg-white text-black shadow-2xl print:shadow-none p-3 font-sans text-xs border border-slate-400 print:border-none print:w-full print:max-w-none">
            {/* Top Swiss Post Carrier Header */}
            <div className="border-b-2 border-black pb-2 mb-2 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-amber-400 text-black font-black flex flex-col items-center justify-center rounded">
                  <span className="text-[7px] leading-none uppercase font-bold">Die Post</span>
                  <span className="text-xs font-black leading-none">PRI</span>
                  <span className="text-[6px] leading-none font-bold">Priority</span>
                </div>
                <div>
                  <div className="font-black text-xs font-mono uppercase tracking-tight">
                    {orderData.carrier.name}
                  </div>
                  <div className="text-[9px] text-slate-600">
                    Permis : {orderData.carrier.frankingLicense} · {orderData.carrier.postOffice}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[9px] font-bold">POIDS : {orderData.carrier.weightKg.toFixed(2)} KG</div>
                <div className="text-[8px] text-slate-600">Swiss Batch 01</div>
              </div>
            </div>

            {/* Barcode & Identcode */}
            <div className="text-center my-2">
              <Code128BarcodeSvg text={orderData.carrier.trackingNumber} height={38} />
              <div className="text-[10px] font-mono font-bold tracking-wider mt-0.5">
                {orderData.carrier.trackingNumber}
              </div>
            </div>

            {/* Shipper & Recipient Section */}
            <div className="border-t border-b border-black py-2 my-2 grid grid-cols-1 gap-2">
              {/* Recipient */}
              <div className="bg-slate-100 p-2 rounded">
                <div className="text-[8px] font-mono font-bold text-slate-500 uppercase">
                  DESTINATAIRE / SHIP TO:
                </div>
                <div className="text-sm font-black text-black">{orderData.recipient.name}</div>
                {orderData.recipient.company && (
                  <div className="text-[10px] font-semibold text-slate-800">{orderData.recipient.company}</div>
                )}
                <div className="text-xs text-black font-medium">{orderData.recipient.street}</div>
                <div className="text-sm font-black text-black">
                  {orderData.recipient.zip} {orderData.recipient.city}
                </div>
                <div className="text-[10px] font-bold text-slate-800 uppercase">
                  {orderData.recipient.country} · Tél: {orderData.recipient.phone}
                </div>
              </div>

              {/* Sender & Order ref */}
              <div className="text-[9px] text-slate-700 flex justify-between items-center px-1">
                <div>
                  <strong>Expéditeur :</strong> {orderData.company.brandName} · {orderData.company.city}
                </div>
                <div className="font-mono font-bold">
                  {orderData.orderId}
                </div>
              </div>
            </div>

            {/* Packed Items List (Compact) */}
            <div className="mb-2">
              <div className="text-[9px] font-mono font-bold uppercase text-slate-700 mb-1 flex justify-between">
                <span>ARTICLES ({orderData.items.length})</span>
                <span>LOT &amp; EXP</span>
              </div>
              <div className="space-y-1">
                {orderData.items.map((item, i) => (
                  <div key={i} className="border-b border-slate-200 pb-1 flex justify-between items-start text-[10px]">
                    <div className="pr-1">
                      <div className="font-bold text-black flex items-center gap-1">
                        <span>{item.qty}x</span>
                        <span>{item.name}</span>
                      </div>
                      <div className="text-[8px] text-slate-600">
                        {item.sku} · {item.flavor}
                      </div>
                    </div>
                    <div className="text-right font-mono text-[9px] shrink-0">
                      <div>{item.batch}</div>
                      <div className="text-slate-500">{item.expiry}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals & Quality Stamp */}
            <div className="border-t border-black pt-1.5 mt-2 flex justify-between items-end text-[10px]">
              <div>
                <div className="font-bold">TOTAL : CHF {orderData.financials.grandTotal.toFixed(2)}</div>
                <div className="text-[8px] text-slate-600">
                  TVA 8.1% incl. · Payé Stripe
                </div>
                <div className="text-[8px] text-emerald-800 font-bold mt-0.5">
                  ✓ QC-GENEVA #04 · {orderData.date}
                </div>
              </div>

              {qrDataUrl && (
                <div className="flex items-center gap-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrDataUrl} alt="QR Tracking" className="w-10 h-10" />
                </div>
              )}
            </div>

            <div className="text-[7px] text-center text-slate-500 mt-2 border-t border-slate-200 pt-1">
              support@ufolabz.com · Route de Chêne 14, 1207 Genève · Swiss Quality
            </div>
          </div>
        )}
      </div>

      {/* Embedded print styles for precise page margins and thermal formatting */}
      <style jsx global>{`
        @media print {
          body {
            background: #ffffff !important;
            color: #000000 !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          @page {
            margin: ${printMode === 'thermal' ? '3mm' : '8mm'};
            size: ${printMode === 'thermal' ? '100mm 150mm' : 'A4 portrait'};
          }
        }
      `}</style>
    </div>
  )
}
