'use client'

import React, { useState } from 'react'
import { Mail, CheckCircle2, Loader2, Sparkles, ShieldCheck } from 'lucide-react'
import { useTranslation, Locale } from '@/lib/i18n'
import { SupportedCurrency } from '@/lib/config/pricing'

export interface EmailResultsCardProps {
  calculatorSlug: string
  calculatorName: string
  heroNumber: string
  heroUnit: string
  heroInterpretation: string
  progressPercent?: number
  inputs: Record<string, string | number>
}

export function EmailResultsCard({
  calculatorSlug,
  calculatorName,
  heroNumber,
  heroUnit,
  heroInterpretation,
  progressPercent = 70,
  inputs,
}: EmailResultsCardProps) {
  const { locale, currency } = useTranslation()
  const [email, setEmail] = useState('')
  const [marketingConsent, setMarketingConsent] = useState(false)
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const isFr = locale === 'fr'
  const isDe = locale === 'de'
  const isIt = locale === 'it'

  const headingText = isFr
    ? 'Recevoir mes résultats par e-mail'
    : isDe
    ? 'Meine Ergebnisse per E-Mail erhalten'
    : isIt
    ? 'Ricevi i miei risultati via e-mail'
    : 'Email me my results'

  const subText = isFr
    ? 'Recevez votre fiche personnalisée avec recommandations nutritionnelles et plan d’action immédiat.'
    : 'Receive your personalized scientific breakdown, supplement protocol, and action plan.'

  const btnText = isFr ? 'Envoyer mes résultats' : 'Send My Results'
  const successText = isFr ? 'Vérifiez votre boîte mail ✓' : 'Check your inbox ✓'
  const successSub = isFr
    ? 'Vos résultats et votre plan nutrition ont été expédiés à votre adresse.'
    : 'Your custom breakdown and supplement protocol are on their way.'

  const marketingLabel = isFr
    ? 'Je souhaite recevoir des conseils nutrition et offres exclusives UFO LABZ'
    : isDe
    ? 'Ich möchte Ernährungstipps und exklusive Angebote von UFO LABZ erhalten'
    : isIt
    ? 'Desidero ricevere consigli sulla nutrizione e offerte esclusive UFO LABZ'
    : 'I would like to receive performance nutrition advice and exclusive UFO LABZ drops'

  const privacyNotice = isFr
    ? 'En renseignant votre e-mail, vous acceptez notre'
    : 'By entering your email, you agree to our'

  const privacyLink = isFr ? 'politique de confidentialité' : 'privacy policy'
  const disclaimerNotice = isFr
    ? 'Estimations indicatives à but éducatif, ne remplacent pas un avis médical.'
    : 'Informational scientific estimates only, not a substitute for medical advice.'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) return

    setStatus('loading')
    setErrorMessage('')

    try {
      // 1. Push GTM dataLayer event
      if (typeof window !== 'undefined') {
        const dataLayer = (window as any).dataLayer || []
        dataLayer.push({
          event: 'calculator_used',
          calculator_name: calculatorName,
          calculator_slug: calculatorSlug,
        })
        dataLayer.push({
          event: 'email_captured',
          calculator_name: calculatorName,
          marketing_consent: marketingConsent,
        })
      }

      // 2. Dispatch to API
      const res = await fetch('/api/tools/email-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          calculatorSlug,
          calculatorName,
          heroNumber,
          heroUnit,
          heroInterpretation,
          progressPercent,
          inputs,
          locale,
          currency,
          marketingConsent,
          honeypot,
          referrer: typeof document !== 'undefined' ? document.referrer : '',
        }),
      })

      const data = await res.json()
      if (res.ok && data.ok) {
        setStatus('success')
      } else {
        setStatus('error')
        setErrorMessage(data.message || 'Error sending email. Please try again.')
      }
    } catch (err: any) {
      setStatus('error')
      setErrorMessage(err?.message || 'Network error.')
    }
  }

  return (
    <div className="mt-8 rounded-2xl border border-alien-green/30 bg-gradient-to-b from-space-900/90 to-space-950 p-6 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden text-left">
      {/* Ambient background glow */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-alien-green/10 rounded-full blur-3xl pointer-events-none" />

      {status === 'success' ? (
        <div className="py-6 text-center animate-fade-in space-y-3">
          <div className="w-14 h-14 rounded-full bg-alien-green/20 border border-alien-green/50 flex items-center justify-center mx-auto text-alien-green">
            <CheckCircle2 className="w-8 h-8 animate-scale-in" />
          </div>
          <h3 className="text-xl font-display uppercase tracking-wider text-white font-bold">
            {successText}
          </h3>
          <p className="text-sm text-gray-300 max-w-md mx-auto leading-relaxed">
            {successSub}
          </p>
          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-alien-green" />
              <span>{email}</span>
            </span>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-alien-green/10 border border-alien-green/30 flex items-center justify-center text-alien-green shrink-0 mt-0.5">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>{headingText}</span>
              </h3>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                {subText}
              </p>
            </div>
          </div>

          {/* Honeypot field (hidden from real users) */}
          <div className="hidden" aria-hidden="true">
            <input
              type="text"
              name="hp_phone_fax"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          {/* Email input + CTA button */}
          <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre.email@exemple.ch"
              className="flex-1 bg-space-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-alien-green transition-all"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-alien-green text-space-950 font-bold px-6 py-3 rounded-xl hover:shadow-glow-green active:scale-98 transition-all flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-wider shrink-0 disabled:opacity-60"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Envoi...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{btnText}</span>
                </>
              )}
            </button>
          </div>

          {errorMessage && (
            <p className="text-xs text-red-400 animate-fade-in font-mono">{errorMessage}</p>
          )}

          {/* Swiss nLPD & GDPR compliance checkboxes (both unchecked by default) */}
          <div className="pt-2 space-y-2.5 text-xs text-gray-400">
            <label className="flex items-start gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={marketingConsent}
                onChange={(e) => setMarketingConsent(e.target.checked)}
                className="mt-0.5 rounded border-white/20 bg-space-950 text-alien-green focus:ring-alien-green/40 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-[11px] leading-relaxed group-hover:text-gray-300 transition-colors">
                {marketingLabel}
              </span>
            </label>

            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span>
                {privacyNotice}{' '}
                <a
                  href="/pages/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-alien-green transition-colors"
                >
                  {privacyLink}
                </a>
                . {disclaimerNotice}
              </span>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}
