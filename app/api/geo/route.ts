import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {
  getCurrencyForCountry,
  isEuropeanCountry,
  isSwissCountry,
  SupportedCurrency,
} from '@/lib/config/pricing'

export async function GET(request: NextRequest) {
  // Check geo headers provided by Vercel edge / Cloudflare
  const headerCountry = (
    (request as any).geo?.country ||
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('cf-ipcountry') ||
    request.headers.get('x-country-code') ||
    ''
  ).toUpperCase().trim()

  let country = headerCountry
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    ''

  // Fallback for local testing or non-edge environments with a valid public IP
  if (
    !country &&
    ip &&
    ip !== '127.0.0.1' &&
    ip !== '::1' &&
    !ip.startsWith('192.168.') &&
    !ip.startsWith('10.') &&
    !ip.startsWith('172.16.')
  ) {
    try {
      const res = await fetch(`https://ipapi.co/${ip}/country/`, {
        signal: AbortSignal.timeout(1500),
      })
      if (res.ok) {
        const text = (await res.text()).trim().toUpperCase()
        if (text && text.length === 2) {
          country = text
        }
      }
    } catch {
      // Fallback silently
    }
  }

  // Fallback to Switzerland (CH) if unknown
  const effectiveCountry = country || 'CH'
  const isEurope = isEuropeanCountry(effectiveCountry)
  const isSwitzerland = isSwissCountry(effectiveCountry)
  const currency: SupportedCurrency = getCurrencyForCountry(effectiveCountry)

  const response = NextResponse.json({
    country: effectiveCountry,
    currency,
    isEurope,
    isSwitzerland,
    detectedFrom: headerCountry ? 'headers' : (country ? 'ip-lookup' : 'default'),
  })

  // Set cookies for client persistence
  const existingCookie = request.cookies.get('ufo_currency')?.value
  if (!existingCookie) {
    response.cookies.set('ufo_currency', currency, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: 'lax',
    })
  }

  const existingCountry = request.cookies.get('ufo_country')?.value
  if (!existingCountry && effectiveCountry) {
    response.cookies.set('ufo_country', effectiveCountry, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax',
    })
  }

  return response
}
