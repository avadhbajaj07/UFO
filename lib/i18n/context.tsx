'use client'

import React, { createContext, useContext, useEffect, useState, useTransition, useMemo } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  Locale,
  LOCALES,
  DEFAULT_LOCALE,
  LOCALE_METAS,
  isValidLocale,
  getLocalePath,
  stripLocalePrefix,
  extractLocaleFromPathname,
} from './config'
import frDict from '@/messages/fr.json'
import enDict from '@/messages/en.json'
import deDict from '@/messages/de.json'
import itDict from '@/messages/it.json'
import esDict from '@/messages/es.json'
import ptDict from '@/messages/pt.json'
import { formatCurrencyPrice, SupportedCurrency } from '@/lib/config/pricing'
import { createClient } from '@/lib/supabase/client'
import { useCurrencyStore } from '@/store/currency'

const DICTIONARIES: Record<Locale, any> = {
  fr: frDict,
  en: enDict,
  de: deDict,
  it: itDict,
  es: esDict,
  pt: ptDict,
}

export interface I18nContextValue {
  locale: Locale
  currency: SupportedCurrency
  t: (key: string, params?: Record<string, string | number>) => string
  setLocale: (newLocale: Locale) => void
  setCurrency: (newCurrency: SupportedCurrency) => void
  formatPrice: (amount: number, overrideCurrency?: SupportedCurrency) => string
  formatNumber: (value: number) => string
  formatDate: (date: string | Date) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

function resolveKey(obj: any, path: string): string | undefined {
  const parts = path.split('.')
  let current = obj
  for (const p of parts) {
    if (current && typeof current === 'object' && p in current) {
      current = current[p]
    } else {
      return undefined
    }
  }
  return typeof current === 'string' ? current : undefined
}

export function I18nProvider({
  children,
  initialLocale,
  initialCurrency,
}: {
  children: React.ReactNode
  initialLocale?: Locale
  initialCurrency?: SupportedCurrency
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  // Derive initial locale from pathname, prop, or fallback
  const pathnameLocale = extractLocaleFromPathname(pathname)
  const [locale, setLocaleState] = useState<Locale>(initialLocale || pathnameLocale || DEFAULT_LOCALE)
  const storeCurrency = useCurrencyStore((s) => s.currency)
  const [currency, setCurrencyState] = useState<SupportedCurrency>(initialCurrency || storeCurrency || 'CHF')

  // Keep currency in sync with useCurrencyStore
  useEffect(() => {
    if (storeCurrency && storeCurrency !== currency) {
      setCurrencyState(storeCurrency)
    }
  }, [storeCurrency, currency])

  // Keep locale state in sync when pathname changes
  useEffect(() => {
    const loc = extractLocaleFromPathname(pathname)
    if (loc !== locale) {
      setLocaleState(loc)
    }
  }, [pathname])

  // Read cookies on mount for client hydration
  useEffect(() => {
    try {
      const matchLoc = document.cookie.match(/(^|;\s*)NEXT_LOCALE=([^;]+)/)
      if (matchLoc && isValidLocale(matchLoc[2])) {
        // If on default root without prefix, don't force redirect, but sync state
        setLocaleState(matchLoc[2])
      }
      const matchCur = document.cookie.match(/(^|;\s*)ufo_currency=([^;]+)/)
      if (matchCur && (matchCur[2] === 'CHF' || matchCur[2] === 'EUR')) {
        setCurrencyState(matchCur[2] as SupportedCurrency)
      }
    } catch {}
  }, [])

  const setLocale = (newLocale: Locale) => {
    if (!isValidLocale(newLocale) || newLocale === locale) return
    setLocaleState(newLocale)

    // 1. Set cookie for persistence (1 year)
    try {
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`
    } catch {}

    // 2. Persist in Supabase user profile if logged in
    try {
      const supabase = createClient()
      supabase.auth.getUser().then(({ data }: any) => {
        if (data?.user?.id) {
          ;(supabase.from('profiles') as any)
            .update({ preferred_locale: newLocale })
            .eq('id', data.user.id)
            .then(() => {})
        }
      })
    } catch {}

    // 3. Navigate to equivalent path in new locale
    const currentPath = pathname || '/'
    const targetPath = getLocalePath(currentPath, newLocale)
    startTransition(() => {
      window.location.href = targetPath + (window.location.search || '')
    })
  }

  const setCurrency = (newCurrency: SupportedCurrency) => {
    if (newCurrency !== 'CHF' && newCurrency !== 'EUR') return
    setCurrencyState(newCurrency)

    // Sync Zustand currency store
    try {
      useCurrencyStore.getState().setCurrency(newCurrency, true)
    } catch {}

    // 1. Set cookies for currency & manual override
    try {
      document.cookie = `ufo_currency=${newCurrency}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`
      document.cookie = `ufo_currency_manual=true; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`
    } catch {}

    // 2. Persist in profile if logged in
    try {
      const supabase = createClient()
      supabase.auth.getUser().then(({ data }: any) => {
        if (data?.user?.id) {
          ;(supabase.from('profiles') as any)
            .update({ preferred_currency: newCurrency })
            .eq('id', data.user.id)
            .then(() => {})
        }
      })
    } catch {}

    // Trigger custom window event so any non-react listeners update
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ufo:currency-change', { detail: { currency: newCurrency } }))
    }
  }

  const t = useMemo(() => {
    const dict = DICTIONARIES[locale] || DICTIONARIES[DEFAULT_LOCALE]
    const fallbackDict = DICTIONARIES[DEFAULT_LOCALE]

    return (key: string, params?: Record<string, string | number>): string => {
      let str = resolveKey(dict, key) ?? resolveKey(fallbackDict, key) ?? key
      if (params && typeof str === 'string') {
        Object.entries(params).forEach(([k, v]) => {
          str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v))
        })
      }
      return str
    }
  }, [locale])

  const formatPrice = (amount: number, overrideCurrency?: SupportedCurrency): string => {
    const activeCurrency = overrideCurrency || currency
    const activeLocaleMeta = LOCALE_METAS[locale] || LOCALE_METAS.fr
    return formatCurrencyPrice(amount, activeCurrency, activeLocaleMeta.htmlLang)
  }

  const formatNumber = (value: number): string => {
    const activeLocaleMeta = LOCALE_METAS[locale] || LOCALE_METAS.fr
    return new Intl.NumberFormat(activeLocaleMeta.htmlLang).format(value)
  }

  const formatDate = (date: string | Date): string => {
    const activeLocaleMeta = LOCALE_METAS[locale] || LOCALE_METAS.fr
    const d = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat(activeLocaleMeta.htmlLang, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(d)
  }

  return (
    <I18nContext.Provider
      value={{
        locale,
        currency,
        t,
        setLocale,
        setCurrency,
        formatPrice,
        formatNumber,
        formatDate,
      }}
    >
      {children}
    </I18nContext.Provider>
  )
}

export function useTranslation(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    // Graceful fallback for components rendered outside I18nProvider
    const fallbackMeta = LOCALE_METAS.fr
    return {
      locale: DEFAULT_LOCALE,
      currency: 'CHF',
      t: (key: string, params?: Record<string, string | number>) => {
        let str = resolveKey(DICTIONARIES.fr, key) ?? key
        if (params && typeof str === 'string') {
          Object.entries(params).forEach(([k, v]) => {
            str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v))
          })
        }
        return str
      },
      setLocale: () => {},
      setCurrency: () => {},
      formatPrice: (amount: number, curr?: SupportedCurrency) =>
        formatCurrencyPrice(amount, curr || 'CHF', fallbackMeta.htmlLang),
      formatNumber: (val: number) => new Intl.NumberFormat(fallbackMeta.htmlLang).format(val),
      formatDate: (d: string | Date) =>
        new Intl.DateTimeFormat(fallbackMeta.htmlLang, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }).format(typeof d === 'string' ? new Date(d) : d),
    }
  }
  return ctx
}
