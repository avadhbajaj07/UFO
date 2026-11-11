import { getSwissPostToken, clearSwissPostTokenCache } from './auth'

export interface ParsedAddress {
  firstName: string
  lastName: string
  street: string
  houseNumber: string
  zip: string
  city: string
  country: string
}

export interface AddressValidationResult {
  isValid: boolean
  quality: 'CERTIFIED' | 'CORRECTED' | 'USABLE' | 'UNUSABLE' | 'UNKNOWN'
  normalized?: {
    street: string
    houseNumber: string
    zip: string
    city: string
    houseKey?: string
  }
  error?: string
}

/**
 * Splits a full name into first and last name components
 */
export function parseName(fullName: string): { firstName: string; lastName: string } {
  const trimmed = (fullName || '').trim()
  if (!trimmed) {
    return { firstName: 'Valued', lastName: 'Customer' }
  }
  const parts = trimmed.split(/\s+/)
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: parts[0] }
  }
  const firstName = parts[0]
  const lastName = parts.slice(1).join(' ')
  return { firstName, lastName }
}

/**
 * Parses a single street address line into street name and house number
 * Handles formats like:
 * "Bahnhofstrasse 12" -> street: "Bahnhofstrasse", houseNumber: "12"
 * "Rue du Rhône 42 B" -> street: "Rue du Rhône", houseNumber: "42 B"
 * "Musterweg" -> street: "Musterweg", houseNumber: ""
 */
export function parseStreetAndNumber(rawAddress: string): { street: string; houseNumber: string } {
  const trimmed = (rawAddress || '').trim()
  if (!trimmed) {
    return { street: '', houseNumber: '' }
  }

  // Look for trailing number + optional letter/suffix
  const match = trimmed.match(/^(.*?)[,\s]+(\d+[\w\s\-\/]*)$/)
  if (match) {
    return {
      street: match[1].trim(),
      houseNumber: match[2].trim(),
    }
  }

  return {
    street: trimmed,
    houseNumber: '',
  }
}

/**
 * Validates a Swiss domicile address using the Swiss Post Address API
 */
export async function validateSwissAddress(
  rawName: string,
  rawStreet: string,
  rawZip: string,
  rawCity: string,
  isRetry = false
): Promise<AddressValidationResult> {
  const url = process.env.SWISSPOST_ADDRESS_VALIDATE_URL || 'https://dcapi.apis.post.ch/address/v1/addresses/validation'
  const { firstName, lastName } = parseName(rawName)
  const { street, houseNumber } = parseStreetAndNumber(rawStreet)
  const zip = (rawZip || '').replace(/\D/g, '').trim()
  const city = (rawCity || '').trim()

  if (!zip || !city || !street) {
    return {
      isValid: false,
      quality: 'UNUSABLE',
      error: 'Missing required address components (street, postal code, or city).',
    }
  }

  const payload = {
    addressee: {
      firstName,
      lastName,
    },
    geographicLocation: {
      house: {
        street,
        houseNumber: houseNumber || undefined,
      },
      zip: {
        zip,
        city,
      },
    },
    fullValidation: true,
  }

  try {
    const token = await getSwissPostToken('DCAPI_ADDRESS_VALIDATE')
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    })

    if (res.status === 401 && !isRetry) {
      clearSwissPostTokenCache('DCAPI_ADDRESS_VALIDATE')
      return validateSwissAddress(rawName, rawStreet, rawZip, rawCity, true)
    }

    if (!res.ok) {
      const errText = await res.text().catch(() => '')
      console.warn('[SWISSPOST ADDRESS] Validation API returned non-200:', res.status, errText)
      // Allow fallback if Post service returns 5xx
      return {
        isValid: true,
        quality: 'UNKNOWN',
        error: `Address validation service unavailable (${res.status}). Proceeding with uncertified address.`,
      }
    }

    const data = await res.json()
    const quality = data.quality as AddressValidationResult['quality']

    if (quality === 'UNUSABLE') {
      return {
        isValid: false,
        quality: 'UNUSABLE',
        error: `Swiss Post could not verify "${street} ${houseNumber}, ${zip} ${city}". Please verify the street and postal code.`,
      }
    }

    const geo = data.address?.geographicLocation
    return {
      isValid: true,
      quality: quality || 'CERTIFIED',
      normalized: {
        street: geo?.house?.street || street,
        houseNumber: geo?.house?.houseNumber || houseNumber,
        zip: geo?.zip?.zip || zip,
        city: geo?.zip?.city || city,
        houseKey: geo?.house?.houseKey,
      },
    }
  } catch (err: any) {
    console.error('[SWISSPOST ADDRESS] Exception during address validation:', err)
    // Non-blocking fallback on network failure
    return {
      isValid: true,
      quality: 'UNKNOWN',
      error: err.message,
    }
  }
}
