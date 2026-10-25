'use client'

import { useState } from 'react'
import { Sparkles, Shield, Beaker, CheckCircle2, Send, Mail, Globe, Lock } from 'lucide-react'

type Language = 'en' | 'fr' | 'de'

const content = {
  en: {
    status: 'SYSTEMS UPGRADING • LAUNCH IN PREPARATION',
    origin: 'Swiss Spatial Formula 🇨🇭',
    headlineMain: 'ENGINEERED BEYOND',
    headlineSub: 'THE EARTH',
    description:
      'Alien Performance Technology — engineered in Swiss laboratories. Our digital store is currently sealed as our scientists finalize our next orbital release. Public access is temporarily private while we prepare something extraordinary for peak human performance.',
    boxTitle: 'Get Priority VIP Access at Launch',
    inputPlaceholder: 'Enter your email address',
    buttonText: 'Notify Me First',
    successTitle: 'ACCESS TRANSMISSION GRANTED',
    successMessage:
      'You are registered on our priority launch list. You will receive an exclusive transmission the exact moment our doors unlock.',
    badge1: 'Swiss Laboratory Certified',
    badge2: 'Clinical High-Dose Formulas',
    badge3: 'Purity & Peak Performance',
    rights: 'All rights reserved.',
  },
  fr: {
    status: 'MISE À NIVEAU DES SYSTÈMES • LANCEMENT IMMINENT',
    origin: 'Formule Spatiale Suisse 🇨🇭',
    headlineMain: 'CONÇU AU-DELÀ',
    headlineSub: 'DE LA TERRE',
    description:
      'Technologie de performance extraterrestre — conçue dans les laboratoires suisses. Notre boutique en ligne est actuellement scellée pendant que nos scientifiques finalisent notre prochain lancement orbital. L’accès public est temporairement privé pendant que nous préparons une expérience d’exception.',
    boxTitle: 'Soyez averti en priorité lors du lancement',
    inputPlaceholder: 'Entrez votre adresse e-mail',
    buttonText: 'M’avertir en priorité',
    successTitle: 'TRANSMISSION D’ACCÈS ACCORDÉE',
    successMessage:
      'Vous êtes inscrit sur la liste prioritaire. Vous recevrez une transmission exclusive à la seconde exacte où notre boutique sera accessible.',
    badge1: 'Testé en Laboratoire Suisse',
    badge2: 'Formules Hautement Dosées',
    badge3: 'Pureté & Performance Ultime',
    rights: 'Tous droits réservés.',
  },
  de: {
    status: 'SYSTEM-UPGRADE • START IN VORBEREITUNG',
    origin: 'Schweizer Raumfahrt-Formel 🇨🇭',
    headlineMain: 'JENSEITS DER ERDE',
    headlineSub: 'ENTWICKELT',
    description:
      'Alien Performance Technology — entwickelt in Schweizer Laboratorien. Unser Online-Shop ist derzeit versiegelt, während unsere Wissenschaftler den nächsten orbitalen Drop fertigstellen. Der öffentliche Zugang ist vorübergehend privat, während wir uns auf den offiziellen Start vorbereiten.',
    boxTitle: 'Prioritätszugang beim Start erhalten',
    inputPlaceholder: 'Geben Sie Ihre E-Mail-Adresse ein',
    buttonText: 'Mich als Erster benachrichtigen',
    successTitle: 'ZUGANGSBESTÄTIGUNG ERTEILT',
    successMessage:
      'Sie stehen auf der VIP-Prioritätsliste. Sie erhalten eine exklusive Mitteilung in genau dem Moment, in dem unsere Pforten öffnen.',
    badge1: 'Schweizer Laborgeprüft',
    badge2: 'Klinisch hochdosierte Formeln',
    badge3: 'Reinheit & Spitzenleistung',
    rights: 'Alle Rechte vorbehalten.',
  },
}

export default function ComingSoon() {
  const [lang, setLang] = useState<Language>('en')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const t = content[lang]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      try {
        const existing = JSON.parse(localStorage.getItem('ufo_waitlist_emails') || '[]')
        existing.push({ email: email.trim(), date: new Date().toISOString(), lang })
        localStorage.setItem('ufo_waitlist_emails', JSON.stringify(existing))
      } catch {
        /* ignore */
      }
      setSubmitted(true)
    }
  }

  return (
    <div className="min-h-screen bg-space-950 text-white flex flex-col justify-between relative overflow-hidden selection:bg-alien-green selection:text-space-950">
      {/* ── Cosmic Ambient Lighting ── */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[500px] rounded-full opacity-25 blur-[150px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #9B30FF 0%, #00FF88 55%, transparent 75%)',
        }}
      />
      <div
        className="absolute bottom-10 left-10 w-[380px] h-[380px] rounded-full opacity-15 blur-[120px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #00CFFF 0%, transparent 70%)' }}
      />
      <div
        className="absolute top-10 right-10 w-[300px] h-[300px] rounded-full opacity-10 blur-[100px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #00FF88 0%, transparent 70%)' }}
      />

      {/* ── Top Header Bar with Language Switcher ── */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="https://res.cloudinary.com/dm4jfxbcs/image/upload/v1782711478/UFO_logo_horizontal_kr0e7j.jpg"
            alt="UFO LABZ"
            className="h-11 sm:h-13 w-auto object-contain rounded-xl border border-white/10 shadow-glow-purple/20"
          />
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/mail"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white/70 hover:text-alien-green hover:border-alien-green/30 transition-all shadow-sm"
            title="UFO LABZ Business Mail"
          >
            <Mail className="w-3.5 h-3.5 text-alien-green" />
            <span className="hidden sm:inline">UFO Mail</span>
            <span className="sm:hidden">Mail</span>
          </a>

          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-white/[0.05] border border-white/10 rounded-xl p-1 backdrop-blur-md">
            <Globe className="w-3.5 h-3.5 text-white/40 ml-2 mr-1" />
            {(['en', 'fr', 'de'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2.5 py-1 text-xs font-mono uppercase rounded-lg transition-all ${
                  lang === l
                    ? 'bg-alien-green text-space-950 font-bold shadow-sm'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── Main Hero Section ── */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-10 text-center flex-1 flex flex-col items-center justify-center">
        {/* Status Tag & Swiss Origin */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md mb-8 shadow-inner">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-alien-green shadow-[0_0_12px_#00FF88] animate-pulse" />
            <span className="text-xs font-mono tracking-widest text-alien-green uppercase font-semibold">
              {t.status}
            </span>
          </div>
          <span className="text-white/20 hidden sm:inline">•</span>
          <span className="text-xs font-mono tracking-widest text-white/90 uppercase font-semibold flex items-center gap-1.5">
            {t.origin}
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-wider text-white mb-6 leading-tight uppercase">
          {t.headlineMain} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-nebula-400 via-alien-green to-white">
            {t.headlineSub}
          </span>
        </h1>

        {/* Subtitle / Explanatory Notice */}
        <p className="text-muted text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
          {t.description}
        </p>

        {/* Sealed Notice Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.07] text-white/50 text-xs font-mono mb-8">
          <Lock className="w-3.5 h-3.5 text-alien-green/80" />
          <span>PORTAL TEMPORARILY RESTRICTED</span>
        </div>

        {/* Email Notify Card */}
        <div className="w-full max-w-md card-glass p-6 sm:p-8 rounded-2xl mb-12 shadow-2xl border border-white/[0.08] backdrop-blur-xl">
          {submitted ? (
            <div className="py-4 text-center animate-in fade-in zoom-in-95 duration-300">
              <div className="w-12 h-12 rounded-full bg-alien-green/10 border border-alien-green/30 flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(0,255,136,0.15)]">
                <CheckCircle2 className="w-6 h-6 text-alien-green" />
              </div>
              <h3 className="font-display text-xl text-white tracking-wider mb-2">
                {t.successTitle}
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                {t.successMessage}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-left">
                <label className="text-xs font-mono uppercase tracking-wider text-muted mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-alien-green" />
                  {t.boxTitle}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.inputPlaceholder}
                    className="w-full bg-space-900/90 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-muted focus:outline-none focus:border-alien-green/60 focus:ring-1 focus:ring-alien-green/40 transition-all"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn-primary w-full py-3.5 rounded-xl font-bold tracking-wider uppercase flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-glow-green/20"
              >
                <span>{t.buttonText}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        {/* Brand Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
          <div className="card-glass p-4 rounded-xl flex items-center justify-center gap-3 border border-white/5">
            <Shield className="w-4 h-4 text-alien-green flex-shrink-0" />
            <span className="text-xs font-mono text-muted uppercase tracking-wider">{t.badge1}</span>
          </div>
          <div className="card-glass p-4 rounded-xl flex items-center justify-center gap-3 border border-white/5">
            <Beaker className="w-4 h-4 text-nebula-400 flex-shrink-0" />
            <span className="text-xs font-mono text-muted uppercase tracking-wider">{t.badge2}</span>
          </div>
          <div className="card-glass p-4 rounded-xl flex items-center justify-center gap-3 border border-white/5">
            <Sparkles className="w-4 h-4 text-[#00CFFF] flex-shrink-0" />
            <span className="text-xs font-mono text-muted uppercase tracking-wider">{t.badge3}</span>
          </div>
        </div>
      </main>

      {/* ── Footer Bar ── */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted/60">
        <p>© {new Date().getFullYear()} UFO LABZ GmbH. {t.rights}</p>
        <div className="flex items-center gap-6">
          <a
            href="/mail"
            className="hover:text-alien-green transition-colors flex items-center gap-1.5 text-muted font-mono"
          >
            <Mail className="w-3.5 h-3.5 text-alien-green" />
            UFO Mail
          </a>
          <a
            href="mailto:support@ufolabz.com"
            className="hover:text-white transition-colors flex items-center gap-1.5 text-muted"
          >
            <Mail className="w-3.5 h-3.5 text-alien-green" />
            support@ufolabz.com
          </a>
          <a
            href="https://www.instagram.com/ufolabz_official?igsi=NGR1YWNzcDBhdGx3"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors text-muted"
          >
            Instagram
          </a>
        </div>
      </footer>
    </div>
  )
}
