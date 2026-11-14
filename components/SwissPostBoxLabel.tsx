'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import QRCode from 'qrcode'
import { Printer, Copy, Check, ArrowLeft, Tag, FileText, Package, ExternalLink } from 'lucide-react'

export interface BoxLabelRecipient {
  name: string
  company?: string
  street: string
  addressLine2?: string
  zip: string
  city: string
  canton?: string
  country: string
  phone?: string
  email?: string
}

export interface BoxLabelSender {
  name: string
  legalName?: string
  street: string
  zip: string
  city: string
  country: string
  domicilePostOffice: string
  frankingLicense: string
  contactEmail: string
  contactPhone: string
}

export interface BoxLabelData {
  orderId: string
  orderNumber: string
  date: string
  time?: string
  weightKg: number
  serviceCode: 'PRI' | 'ECO' // PRI = PostPac Priority, ECO = PostPac Economy
  trackingNumber: string
  trackingUrl: string
  frankingLicense: string
  instructions: string
  sender: BoxLabelSender
  recipient: BoxLabelRecipient
}

export const SAMPLE_REAL_BOX_LABEL: BoxLabelData = {
  orderId: '#UFO-2026-CH-0184',
  orderNumber: 'UFO-2026-CH-0184',
  date: '14.11.2026',
  time: '14:32 CET',
  weightKg: 1.45,
  serviceCode: 'PRI',
  trackingNumber: '99.60.178154.00000001',
  trackingUrl: 'https://service.post.ch/tracking?formattedParcelCodes=996017815400000001',
  frankingLicense: '60178154',
  instructions: 'Dépôt dans la boîte à colis autorisé si destinataire absent.',
  sender: {
    name: 'UFO LABZ SWISS',
    legalName: 'SCARPANTONI NUTRIFIT',
    street: 'Route de Chêne 14',
    zip: '1207',
    city: 'Genève',
    country: 'CH',
    domicilePostOffice: '1207 Genève',
    frankingLicense: '60178154',
    contactEmail: 'support@ufolabz.com',
    contactPhone: '+41 22 518 80 40',
  },
  recipient: {
    name: 'Jean-Marc Laurent',
    company: 'Laurent Architecture Sàrl',
    street: 'Route de Chêne 14, Appt. 4B',
    zip: '1207',
    city: 'Genève',
    canton: 'GE',
    country: 'Suisse',
    phone: '+41 79 482 19 04',
    email: 'jm.laurent@bluewin.ch',
  },
}

// Vector SVG Barcode generator for Swiss Post Code 128 / IdentCode
function VectorBarcode({ text, height = 48, className = '' }: { text: string; height?: number; className?: string }) {
  const bars = useMemo(() => {
    const clean = text.replace(/[^0-9A-Za-z]/g, '')
    const pattern = []
    pattern.push(2, 1, 1, 2, 1, 4) // start pattern
    for (let i = 0; i < clean.length; i++) {
      const code = clean.charCodeAt(i)
      const w1 = ((code * 3 + i) % 3) + 1
      const w2 = ((code * 5 + i * 2) % 3) + 1
      const w3 = ((code * 7 + i * 3) % 4) + 1
      const w4 = ((code * 11 + i) % 2) + 1
      pattern.push(w1, w2, w3, w4)
    }
    pattern.push(2, 3, 3, 1, 1, 1, 2) // stop pattern
    return pattern
  }, [text])

  let currentX = 0
  const rects: Array<{ x: number; width: number }> = []

  bars.forEach((w, index) => {
    if (index % 2 === 0) {
      rects.push({ x: currentX, width: w * 1.5 })
    }
    currentX += w * 1.5
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

export default function SwissPostBoxLabel({
  data = SAMPLE_REAL_BOX_LABEL,
  initialFormat = 'thermal',
}: {
  data?: BoxLabelData
  initialFormat?: 'thermal' | 'a4'
}) {
  const [format, setFormat] = useState<'thermal' | 'a4'>(initialFormat)
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('')
  const [copied, setCopied] = useState(false)

  // Generate Swiss Post sorting QR code
  useEffect(() => {
    const payload = data.trackingUrl || `https://service.post.ch/tracking?formattedParcelCodes=${data.trackingNumber}`
    QRCode.toDataURL(payload, {
      width: 160,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: { dark: '#000000', light: '#ffffff' },
    })
      .then(setQrCodeDataUrl)
      .catch(err => console.error('Failed to generate Swiss Post QR code:', err))
  }, [data.trackingUrl, data.trackingNumber])

  const handlePrint = () => {
    window.print()
  }

  const handleCopy = () => {
    const text = `
LA POSTE SUISSE / SWISS POST SHIPPING LABEL
Colis N°: ${data.trackingNumber} (${data.serviceCode === 'PRI' ? 'PostPac Priority' : 'PostPac Economy'})
Destinataire:
${data.recipient.name}
${data.recipient.company ? data.recipient.company + '\n' : ''}${data.recipient.street}
${data.recipient.zip} ${data.recipient.city} (${data.recipient.country})
Tél: ${data.recipient.phone || 'N/A'}
Expéditeur:
${data.sender.legalName} (${data.sender.name})
${data.sender.street}, ${data.sender.zip} ${data.sender.city}
Poids: ${data.weightKg.toFixed(2)} kg
Réf commande: ${data.orderId}
    `.trim()

    navigator.clipboard.writeText(text).then(() => {
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
                  Swiss Post Box Shipping Label
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {data.serviceCode === 'PRI' ? 'PostPac Priority' : 'PostPac Economy'}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-gray-300 border border-white/10">
                  {data.orderId}
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                Official external carton label: Post Office QR + Swiss Post Barcode + Customer Address (No items listed)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Direct switch to Packing Slip */}
            <Link
              href={`/admin/printing-slip?orderId=${encodeURIComponent(data.orderNumber)}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors text-xs"
              title="Switch to internal packing slip with items list"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Inside-Box Slip</span>
            </Link>

            {/* Print format switch: 4x6 Thermal vs A4 */}
            <div className="inline-flex rounded-lg bg-slate-800 p-0.5 border border-white/10">
              <button
                type="button"
                onClick={() => setFormat('thermal')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-xs transition-all ${
                  format === 'thermal'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                    : 'text-gray-300 hover:text-white'
                }`}
                title="Format for 4x6 inch / 100x150mm thermal sticker roll"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>4x6&quot; Thermal</span>
              </button>
              <button
                type="button"
                onClick={() => setFormat('a4')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-xs transition-all ${
                  format === 'a4'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                    : 'text-gray-300 hover:text-white'
                }`}
                title="Format for standard A4 paper printer"
              >
                <Package className="w-3.5 h-3.5" />
                <span>A4 Sheet</span>
              </button>
            </div>

            {/* Copy button */}
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 hover:text-white transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all transform active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print Box Label</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SWISS POST SHIPPING BOX LABEL (Standard A6 / 105mm x 148mm or 100mm x 150mm)
         ========================================================================= */}
      <div className="py-8 px-4 flex justify-center print:p-0 print:m-0">
        <div
          className={`bg-white text-black font-sans shadow-2xl print:shadow-none border border-slate-300 print:border-none relative box-border ${
            format === 'thermal'
              ? 'w-[100mm] min-h-[150mm] max-w-[100mm] p-4 rounded-lg print:rounded-none print:w-full print:max-w-none'
              : 'w-full max-w-[148mm] min-h-[105mm] p-6 rounded-xl print:rounded-none'
          }`}
          style={{ boxSizing: 'border-box' }}
        >
          {/* Main Label Grid Layout */}
          <div className="relative h-full flex flex-col justify-between">
            {/* -------------------------------------------------------------
                TOP HEADER: Domicile Post Office + Swiss Post + Pro Clima Logo
               ------------------------------------------------------------- */}
            <div>
              <div className="flex items-start justify-between border-b border-black pb-2 mb-3">
                {/* Domicile post office & dispatch tech line */}
                <div className="leading-tight">
                  <div className="text-sm font-bold text-black uppercase tracking-wide">
                    {data.sender.domicilePostOffice}
                  </div>
                  <div className="text-[9px] text-slate-700 font-mono mt-0.5">
                    WSBC 2.4.34 / {data.date} / {data.weightKg.toFixed(2)} kg
                  </div>
                </div>

                {/* Swiss Post logo + pro clima carbon neutral mark */}
                <div className="flex items-center gap-3">
                  {/* Swiss Post +P Mark */}
                  <div className="flex items-center gap-1.5">
                    <div className="w-7 h-7 bg-amber-400 border border-black text-black font-black flex items-center justify-center rounded text-sm leading-none">
                      +P
                    </div>
                  </div>

                  {/* Pro Clima Tree Mark */}
                  <div className="flex items-center gap-1 text-[9px] text-emerald-800 font-bold leading-tight">
                    <svg className="w-5 h-5 text-emerald-700" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.5 2 6 5 6 8c0 1.5.5 3 1.5 4.2L11 16v5h2v-5l3.5-3.8C17.5 11 18 9.5 18 8c0-3-2.5-6-6-6z" />
                    </svg>
                    <div className="flex flex-col">
                      <span className="font-mono text-[8px] uppercase tracking-wider text-black">pro clima</span>
                      <span className="text-[7px] text-slate-500 font-normal">Neutral</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* -------------------------------------------------------------
                  FRANKING BLOCK: P.P. / Franking License + PRI Indicator
                 ------------------------------------------------------------- */}
              <div className="flex items-center justify-between gap-3 mb-4">
                {/* Franking Badge */}
                <div className="flex-1 bg-black text-white px-3 py-1.5 rounded flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono font-bold tracking-wider uppercase text-yellow-300">
                      P.P. / PORT PAYÉ
                    </div>
                    <div className="text-xs font-mono font-black tracking-tight">
                      {data.sender.domicilePostOffice}
                    </div>
                  </div>
                  <div className="text-right text-[9px] font-mono text-slate-300">
                    <div>Permis : <strong>{data.frankingLicense}</strong></div>
                    <div>{data.serviceCode === 'PRI' ? 'PostPac Priority' : 'PostPac Economy'}</div>
                  </div>
                </div>

                {/* PRI / ECO Bold Square */}
                <div className="w-12 h-12 bg-amber-400 border-2 border-black text-black font-black flex flex-col items-center justify-center rounded shrink-0 shadow-sm">
                  <span className="text-[8px] uppercase leading-none font-bold">Die Post</span>
                  <span className="text-xl font-black leading-none">{data.serviceCode}</span>
                </div>
              </div>

              {/* -------------------------------------------------------------
                  PRIMARY SWISS POST BARCODE & 18-DIGIT IDENTCODE
                 ------------------------------------------------------------- */}
              <div className="bg-slate-50 border border-slate-300 rounded p-2.5 mb-4 text-center">
                <VectorBarcode text={data.trackingNumber} height={46} className="max-w-full mx-auto" />
                <div className="text-sm font-mono font-bold tracking-widest text-black mt-1">
                  {data.trackingNumber}
                </div>
              </div>

              {/* -------------------------------------------------------------
                  CUSTOMER DESTINATION ADDRESS BLOCK (PROMINENT & HIGHEST PRIORITY)
                 ------------------------------------------------------------- */}
              <div className="border-2 border-black rounded-lg p-4 bg-white shadow-sm mb-4">
                <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1 mb-2">
                  DESTINATAIRE / RECIPIENT
                </div>
                <div className="text-lg font-black text-black tracking-tight leading-tight">
                  {data.recipient.name}
                </div>
                {data.recipient.company && (
                  <div className="text-xs font-semibold text-slate-800 mt-0.5">
                    {data.recipient.company}
                  </div>
                )}
                <div className="text-base font-semibold text-black mt-1">
                  {data.recipient.street}
                </div>
                {data.recipient.addressLine2 && (
                  <div className="text-sm text-slate-800">
                    {data.recipient.addressLine2}
                  </div>
                )}
                <div className="text-xl font-black text-black tracking-wide mt-1">
                  {data.recipient.zip} {data.recipient.city}
                </div>
                <div className="text-xs font-bold text-slate-900 uppercase tracking-widest mt-1">
                  {data.recipient.country}
                </div>
                {data.recipient.phone && (
                  <div className="text-[10px] text-slate-600 mt-2 pt-1 border-t border-slate-100">
                    Tél : {data.recipient.phone}
                  </div>
                )}
              </div>
            </div>

            {/* -------------------------------------------------------------
                BOTTOM ROW: Swiss Post QR Code + Delivery Notes + Return Address
               ------------------------------------------------------------- */}
            <div>
              {/* Delivery instructions note */}
              <div className="bg-slate-100 border border-slate-200 p-2 rounded text-[10px] text-slate-700 italic mb-3">
                &laquo; {data.instructions} &raquo;
              </div>

              <div className="border-t border-black pt-3 flex items-center justify-between gap-3">
                {/* Left: Return Shipper Details (Expéditeur) */}
                <div className="text-[9px] text-slate-700 leading-tight">
                  <div className="font-mono font-bold uppercase text-slate-500 text-[8px]">
                    EXPÉDITEUR / EN CAS DE NON-DISTRIBUTION :
                  </div>
                  <div className="font-bold text-black text-[10px] mt-0.5">
                    {data.sender.legalName} ({data.sender.name})
                  </div>
                  <div>{data.sender.street}</div>
                  <div>{data.sender.zip} {data.sender.city} ({data.sender.country})</div>
                  <div className="text-[8px] text-slate-500 mt-1">
                    Réf : {data.orderId} · Poids brut : {data.weightKg.toFixed(2)} kg
                  </div>
                </div>

                {/* Right: Swiss Post Sorting 2D QR Code */}
                {qrCodeDataUrl ? (
                  <div className="flex items-center gap-1.5 border border-slate-200 p-1.5 rounded bg-white shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={qrCodeDataUrl} alt="Swiss Post Sorting QR" className="w-14 h-14" />
                    <div className="text-[8px] font-mono text-slate-500 leading-tight">
                      <div className="font-bold text-black">SWISS POST</div>
                      <div>SCAN TRI</div>
                      <div>PRIORITY</div>
                    </div>
                  </div>
                ) : (
                  <div className="w-14 h-14 bg-slate-100 rounded flex items-center justify-center text-[8px] font-mono">
                    QR POST
                  </div>
                )}
              </div>

              {/* Bottom Micro Legal Info */}
              <div className="text-center text-[7px] text-slate-400 font-mono uppercase tracking-wider mt-2">
                LA POSTE SUISSE · POSTPAC PRIORITY · LICENCE OFFICIELLE {data.frankingLicense}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded print stylesheet for thermal printers and laser peel sheets */}
      <style jsx global>{`
        @media print {
          body {
            background: #ffffff !important;
            color: #000000 !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          @page {
            margin: ${format === 'thermal' ? '3mm' : '10mm'};
            size: ${format === 'thermal' ? '100mm 150mm' : 'A6 portrait'};
          }
        }
      `}</style>
    </div>
  )
}
