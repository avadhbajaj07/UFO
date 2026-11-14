/**
 * Internationalization Configuration for UFO LABZ
 * Supported locales: fr (Default, no URL prefix), en, de, it.
 */

export const LOCALES = ['fr', 'en', 'de', 'it'] as const
export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'fr'

export interface LocaleMeta {
  code: Locale
  name: string
  nativeName: string
  flag: string
  ogLocale: string
  htmlLang: string
  currencyFallback: 'CHF' | 'EUR'
}

export const LOCALE_METAS: Record<Locale, LocaleMeta> = {
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    ogLocale: 'fr_CH',
    htmlLang: 'fr-CH',
    currencyFallback: 'CHF',
  },
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    ogLocale: 'en_GB',
    htmlLang: 'en-GB',
    currencyFallback: 'CHF',
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    ogLocale: 'de_CH',
    htmlLang: 'de-CH',
    currencyFallback: 'CHF',
  },
  it: {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    ogLocale: 'it_CH',
    htmlLang: 'it-CH',
    currencyFallback: 'CHF',
  },
}

export function isValidLocale(val: unknown): val is Locale {
  return typeof val === 'string' && (LOCALES as readonly string[]).includes(val)
}

/**
 * Returns path prefixed with locale, unless locale is DEFAULT_LOCALE ('fr')
 */
export function getLocalePath(path: string, locale: Locale): string {
  if (!path) return locale === DEFAULT_LOCALE ? '/' : `/${locale}`
  
  // Strip any existing locale prefix
  const cleanPath = stripLocalePrefix(path)

  if (locale === DEFAULT_LOCALE) {
    return cleanPath || '/'
  }

  return cleanPath === '/' ? `/${locale}` : `/${locale}${cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`}`
}

/**
 * Strips any leading /(en|de|it|fr) from a pathname
 */
export function stripLocalePrefix(pathname: string): string {
  if (!pathname) return '/'
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`
  const regex = /^\/(en|de|it|fr)(\/|$)/
  const replaced = normalized.replace(regex, '/')
  return replaced.length > 1 && replaced.endsWith('/') ? replaced.slice(0, -1) : replaced || '/'
}

/**
 * Extracts the locale from a pathname, falling back to 'fr'
 */
export function extractLocaleFromPathname(pathname: string): Locale {
  if (!pathname) return DEFAULT_LOCALE
  const segments = pathname.split('/').filter(Boolean)
  const first = segments[0] as Locale
  if (isValidLocale(first)) {
    return first
  }
  return DEFAULT_LOCALE
}

/**
 * Detects user preferred locale from Accept-Language header
 */
export function detectLocaleFromAcceptLanguage(header: string | null | undefined): Locale {
  if (!header) return DEFAULT_LOCALE
  const lower = header.toLowerCase()
  // Check in priority order or parse quality values
  const langs = lower.split(',').map((part) => part.split(';')[0].trim())
  for (const lang of langs) {
    if (lang.startsWith('fr')) return 'fr'
    if (lang.startsWith('de')) return 'de'
    if (lang.startsWith('it')) return 'it'
    if (lang.startsWith('en')) return 'en'
  }
  return DEFAULT_LOCALE
}
