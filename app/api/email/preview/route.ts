import { NextRequest, NextResponse } from 'next/server'
import { ALL_EMAIL_TEMPLATE_KEYS, renderEmail, EmailTemplateKey } from '@/lib/email/templates'
import { Locale, LOCALES, DEFAULT_LOCALE } from '@/lib/i18n/config'
import { SupportedCurrency } from '@/lib/config/pricing'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const template = (searchParams.get('template') || 'order_confirmation') as EmailTemplateKey
  const locale = (searchParams.get('locale') || DEFAULT_LOCALE) as Locale
  const currency = (searchParams.get('currency') || 'CHF') as SupportedCurrency

  const safeLocale: Locale = LOCALES.includes(locale) ? locale : 'fr'
  const safeCurrency: SupportedCurrency = currency === 'EUR' ? 'EUR' : 'CHF'
  const safeTemplate: EmailTemplateKey = ALL_EMAIL_TEMPLATE_KEYS.includes(template)
    ? template
    : 'order_confirmation'

  // Sample data for rendering realistic previews
  const sampleVariables: Record<string, any> = {
    first_name: 'Alexandre',
    customer_name: 'Alexandre Dupont',
    order_number: 'UFO-88492',
    order_date: new Date().toLocaleDateString(safeLocale === 'fr' ? 'fr-CH' : safeLocale === 'de' ? 'de-CH' : safeLocale === 'it' ? 'it-CH' : 'en-GB'),
    payment_method: safeCurrency === 'CHF' ? 'TWINT' : 'Credit Card',
    shipping_method: 'Swiss Post Priority',
    shipping_address: 'Route du Jura 15, 1000 Lausanne, Switzerland',
    subtotal: safeCurrency === 'CHF' ? 'CHF 119.80' : '€ 119.80',
    discount: safeCurrency === 'CHF' ? 'CHF 29.95' : '€ 29.95',
    shipping: 'FREE',
    total: safeCurrency === 'CHF' ? 'CHF 89.85' : '€ 89.85',
    order_url: `https://ufolabz.com/account`,
    cart_url: `https://ufolabz.com/checkout`,
    tracking_number: '99.00.123456.12345678',
    tracking_url: 'https://service.post.ch/tracking?formattedParcelCodes=990012345612345678',
    estimated_delivery: safeLocale === 'fr' ? 'Demain matin (Swiss Post Priority)' : 'Next morning (Swiss Post Priority)',
    last_product_name: 'ASTRO CREATINE PURE',
    reorder_url: 'https://ufolabz.com/products/astro-creatine',
    discount_code: 'ORBITAL10',
    restock_code: 'RESTOCK10',
    restock_discount: '10% OFF',
    code_expiry: '7 days',
    new_eta: '18 Nov 2026',
    delay_reason: 'Custom batch purity verification protocol',
    cancel_date: '14 Nov 2026',
    cancel_reason: 'Customer requested modification',
    refund_amount: safeCurrency === 'CHF' ? 'CHF 89.85' : '€ 89.85',
    refund_days: '2-3 business days',
    review_url: 'https://ufolabz.com/account',
    athlete_name: 'Alexandre Dupont',
    sport: 'Functional Fitness / Hyrox',
    instagram_handle: '@alex_dupont',
    review_days: '2 business days',
    commission_rate: '15%',
    dashboard_url: 'https://ufolabz.com/affiliate',
    coupon_code: 'ALEX10',
    coupon_discount: '10%',
    reject_reason: 'Code already in use by another athlete',
    commission_amount: safeCurrency === 'CHF' ? 'CHF 24.50' : '€ 24.50',
    order_total: safeCurrency === 'CHF' ? 'CHF 163.30' : '€ 163.30',
    confirm_url: 'https://ufolabz.com/auth/confirm?token=preview-token-xyz',
    reset_url: 'https://ufolabz.com/auth/reset-password?token=preview-reset-xyz',
    expiry_hours: '24',
    expiry_minutes: '60',
    change_date: '14 Nov 2026, 12:45',
    days_since_order: '45',
    inactive_days: '60',
    lead_source: 'Free Fitness Calculators',
    vip_code: 'VIP15',
    vip_discount: '15% OFF',
    last_active: '30 days ago',
    bonus_commission: '20%',
  }

  const { subject, html } = renderEmail(safeTemplate, sampleVariables, safeLocale, safeCurrency)

  // If format=raw, return just the email html (great for iframe embedding)
  if (searchParams.get('format') === 'raw') {
    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  }

  // Interactive full preview dashboard
  const fullPageHtml = `<!DOCTYPE html>
<html lang="${safeLocale}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Preview | UFO LABZ [${safeTemplate}] [${safeLocale.toUpperCase()}] [${safeCurrency}]</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #06080F;
      color: #E2E8F0;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .top-bar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(10, 14, 26, 0.95);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding: 12px 20px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }
    .bar-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 800;
      letter-spacing: 0.1em;
      color: #1FFFB3;
      font-size: 14px;
    }
    .bar-brand span.pill {
      background: rgba(31, 255, 179, 0.15);
      border: 1px solid rgba(31, 255, 179, 0.4);
      color: #1FFFB3;
      padding: 2px 8px;
      border-radius: 9999px;
      font-size: 10px;
    }
    .controls {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px;
    }
    select, button {
      background: #0E1322;
      color: #F8FAFC;
      border: 1px solid rgba(255, 255, 255, 0.15);
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-family: inherit;
      cursor: pointer;
      outline: none;
      transition: all 0.15s;
    }
    select:hover, select:focus {
      border-color: #1FFFB3;
    }
    .btn-group {
      display: inline-flex;
      border-radius: 6px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.15);
    }
    .btn-group a {
      background: #0E1322;
      color: #94A3B8;
      padding: 6px 12px;
      font-size: 12px;
      text-decoration: none;
      border-right: 1px solid rgba(255, 255, 255, 0.1);
      transition: all 0.15s;
    }
    .btn-group a:last-child {
      border-right: none;
    }
    .btn-group a.active {
      background: rgba(31, 255, 179, 0.2);
      color: #1FFFB3;
      font-weight: 700;
    }
    .subject-line {
      width: 100%;
      background: #0A0E1A;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      padding: 10px 24px;
      font-size: 13px;
      color: #CBD5E1;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .subject-line strong {
      color: #94A3B8;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    .preview-container {
      flex: 1;
      display: flex;
      justify-content: center;
      padding: 24px 16px;
      background: #04060A;
    }
    iframe {
      width: 100%;
      max-width: 660px;
      height: 900px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      background: #0A0E1A;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
    }
  </style>
</head>
<body>
  <div class="top-bar">
    <div class="bar-brand">
      <span>🛸 UFO LABZ</span>
      <span class="pill">EMAIL ENGINE PREVIEW</span>
    </div>

    <div class="controls">
      <!-- Template Selector -->
      <label style="font-size:12px; color:#94A3B8;">Template:</label>
      <select onchange="location.href='?template=' + this.value + '&locale=${safeLocale}&currency=${safeCurrency}'">
        ${ALL_EMAIL_TEMPLATE_KEYS.map((k) => `
          <option value="${k}" ${k === safeTemplate ? 'selected' : ''}>
            ${k.replace(/_/g, ' ').toUpperCase()}
          </option>
        `).join('')}
      </select>

      <!-- Locale Selector -->
      <div class="btn-group">
        <a href="?template=${safeTemplate}&locale=fr&currency=${safeCurrency}" class="${safeLocale === 'fr' ? 'active' : ''}">🇫🇷 FR (Default)</a>
        <a href="?template=${safeTemplate}&locale=en&currency=${safeCurrency}" class="${safeLocale === 'en' ? 'active' : ''}">🇬🇧 EN</a>
        <a href="?template=${safeTemplate}&locale=de&currency=${safeCurrency}" class="${safeLocale === 'de' ? 'active' : ''}">🇩🇪 DE</a>
        <a href="?template=${safeTemplate}&locale=it&currency=${safeCurrency}" class="${safeLocale === 'it' ? 'active' : ''}">🇮🇹 IT</a>
      </div>

      <!-- Currency Selector -->
      <div class="btn-group">
        <a href="?template=${safeTemplate}&locale=${safeLocale}&currency=CHF" class="${safeCurrency === 'CHF' ? 'active' : ''}">🇨🇭 CHF</a>
        <a href="?template=${safeTemplate}&locale=${safeLocale}&currency=EUR" class="${safeCurrency === 'EUR' ? 'active' : ''}">🇪🇺 EUR</a>
      </div>
    </div>
  </div>

  <div class="subject-line">
    <strong>Subject:</strong>
    <span>${escapeHtml(subject)}</span>
  </div>

  <div class="preview-container">
    <iframe src="?template=${safeTemplate}&locale=${safeLocale}&currency=${safeCurrency}&format=raw" title="Email preview"></iframe>
  </div>
</body>
</html>`

  return new NextResponse(fullPageHtml, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
