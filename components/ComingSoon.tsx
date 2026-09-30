'use client'

import { useState } from 'react'
import { Sparkles, Shield, Beaker, CheckCircle2, Send, Mail } from 'lucide-react'

export default function ComingSoon() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubmitted(true)
    }
  }

  return (
    <div className="min-h-screen bg-space-950 text-white flex flex-col justify-between relative overflow-hidden selection:bg-alien-green selection:text-space-950">
      {/* ── Cosmic Ambient Lighting ── */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[500px] rounded-full opacity-20 blur-[140px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #9B30FF 0%, #00FF88 60%, transparent 80%)',
        }}
      />
      <div
        className="absolute bottom-10 left-10 w-[350px] h-[350px] rounded-full opacity-10 blur-[100px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #00CFFF 0%, transparent 70%)' }}
      />

      {/* ── Top Header Bar ── */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 flex items-center justify-center">
        <img
          src="https://res.cloudinary.com/dm4jfxbcs/image/upload/v1782711478/UFO_logo_horizontal_kr0e7j.jpg"
          alt="UFO LABZ"
          className="h-12 sm:h-14 w-auto object-contain rounded-xl border border-white/10 shadow-glow-purple/20"
        />
      </header>

      {/* ── Main Hero Section ── */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12 text-center flex-1 flex flex-col items-center justify-center">
        {/* Status Tag & Swiss Origin */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md mb-8">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-alien-green shadow-[0_0_10px_#00FF88] animate-pulse" />
            <span className="text-xs font-mono tracking-widest text-alien-green uppercase font-semibold">
              LANCEMENT IMMINENT
            </span>
          </div>
          <span className="text-white/20 hidden sm:inline">•</span>
          <span className="text-xs font-mono tracking-widest text-white/90 uppercase font-semibold flex items-center gap-1.5">
            Formule spatiale de Suisse 🇨🇭
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-5xl sm:text-7xl md:text-8xl tracking-wider text-white mb-6 leading-none uppercase">
          CONÇU AU-DELÀ <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-nebula-400 via-alien-green to-white">
            DE LA TERRE
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-muted sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
          Technologie de performance extraterrestre — <span className="text-white font-medium">Formule spatiale de Suisse 🇨🇭</span>. Nous finalisons actuellement notre mise en orbite. Compléments sportifs haut de gamme conçus pour repousser les limites du potentiel humain.
        </p>

        {/* Email Notify Card */}
        <div className="w-full max-w-md card-glass p-6 sm:p-8 rounded-2xl mb-12 shadow-2xl border border-white/[0.08]">
          {submitted ? (
            <div className="py-4 text-center">
              <div className="w-12 h-12 rounded-full bg-alien-green/10 border border-alien-green/30 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6 text-alien-green" />
              </div>
              <h3 className="font-display text-xl text-white tracking-wider mb-1">
                ACCÈS ACCORDÉ
              </h3>
              <p className="text-xs text-muted">
                Vous êtes sur la liste prioritaire. Vous recevrez une transmission exclusive le jour du lancement.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-left">
                <label className="text-xs font-mono uppercase tracking-wider text-muted mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-alien-green" />
                  Soyez averti lors du lancement
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Entrez votre adresse e-mail"
                    className="w-full bg-space-900/90 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-muted focus:outline-none focus:border-alien-green/60 transition-all"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn-primary w-full py-3.5 rounded-xl font-bold tracking-wider uppercase flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
              >
                <span>M'avertir du lancement</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        {/* Brand Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
          <div className="card-glass p-4 rounded-xl flex items-center justify-center gap-3 border border-white/5">
            <Shield className="w-4 h-4 text-alien-green flex-shrink-0" />
            <span className="text-xs font-mono text-muted uppercase tracking-wider">Testé en Laboratoire</span>
          </div>
          <div className="card-glass p-4 rounded-xl flex items-center justify-center gap-3 border border-white/5">
            <Beaker className="w-4 h-4 text-nebula-400 flex-shrink-0" />
            <span className="text-xs font-mono text-muted uppercase tracking-wider">Formules Hautement Dosées</span>
          </div>
          <div className="card-glass p-4 rounded-xl flex items-center justify-center gap-3 border border-white/5">
            <Sparkles className="w-4 h-4 text-[#00CFFF] flex-shrink-0" />
            <span className="text-xs font-mono text-muted uppercase tracking-wider">Formule Spatiale Suisse 🇨🇭</span>
          </div>
        </div>
      </main>

      {/* ── Footer Bar ── */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted/60">
        <p>© {new Date().getFullYear()} UFO LABZ GmbH. Tous droits réservés.</p>
        <div className="flex items-center gap-6">
          <a
            href="mailto:support@ufolabz.com"
            className="hover:text-white transition-colors flex items-center gap-1.5 text-muted"
          >
            <Mail className="w-3.5 h-3.5" />
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
