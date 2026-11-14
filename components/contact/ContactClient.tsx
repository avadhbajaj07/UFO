'use client'

import { useState } from 'react'
import { Mail, Phone, Send, CheckCircle2, Clock } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

export default function ContactPageClient() {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState(t('contact_page.general_inquiry'))
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const resetForm = () => {
    setName('')
    setEmail('')
    setSubject(t('contact_page.general_inquiry'))
    setMessage('')
    setSubmitted(false)
  }

  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="pt-28 pb-12 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-nebula-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-[300px] h-[300px] bg-nebula-800/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-alien-green mb-4">
            {t('contact_page.badge')}
          </p>
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl tracking-wider text-white mb-4 uppercase">
            {t('contact_page.title')}
          </h1>
          <p className="text-base sm:text-lg text-muted max-w-xl mx-auto leading-relaxed">
            {t('contact_page.subtitle')}
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {/* Email */}
          <div className="card-glass p-6 text-center group hover:border-alien-green/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-nebula-800/30 border border-nebula-600/20 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-5 h-5 text-alien-green" />
            </div>
            <h3 className="font-display text-lg text-white mb-1">
              {t('contact_page.card_email_title')}
            </h3>
            <a
              href="mailto:support@ufolabz.com"
              className="text-sm text-muted group-hover:text-alien-green transition-colors"
            >
              support@ufolabz.com
            </a>
            <p className="text-xs text-muted/70 mt-1">
              {t('contact_page.card_email_desc')}
            </p>
          </div>

          {/* Support Hours */}
          <div className="card-glass p-6 text-center group hover:border-alien-green/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-nebula-800/30 border border-nebula-600/20 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-5 h-5 text-alien-green" />
            </div>
            <h3 className="font-display text-lg text-white mb-1">
              {t('contact_page.address_title')}
            </h3>
            <p className="text-sm text-gray-300">
              Zurich & Geneva, Switzerland
            </p>
            <p className="text-xs text-muted/70 mt-1">
              {t('contact_page.support_hours')}
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="card-glass p-8 md:p-10">
          {submitted ? (
            <div className="text-center p-8 animate-fade-in">
              <CheckCircle2 className="w-16 h-16 text-alien-green mx-auto mb-4" />
              <h2 className="font-display text-2xl sm:text-3xl text-white mb-2">
                {t('contact_page.success_message')}
              </h2>
              <button
                type="button"
                onClick={resetForm}
                className="mt-6 py-2.5 px-6 rounded-xl border border-alien-green/40 text-alien-green hover:bg-alien-green/10 font-mono text-xs font-bold transition-all"
              >
                {t('common.try_again')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="font-display text-2xl tracking-wider text-white mb-6">
                {t('contact_page.form_title')}
              </h2>

              {/* Name */}
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-muted mb-2 block">
                  {t('contact_page.name_label')}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jean Dupont"
                  required
                  className="w-full bg-space-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-alien-green/50 transition-colors text-sm"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-muted mb-2 block">
                  {t('contact_page.email_label')}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full bg-space-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-alien-green/50 transition-colors text-sm"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-muted mb-2 block">
                  {t('contact_page.subject_label')}
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-space-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-alien-green/50 transition-colors text-sm"
                >
                  <option value={t('contact_page.general_inquiry')}>{t('contact_page.general_inquiry')}</option>
                  <option value={t('contact_page.order_support')}>{t('contact_page.order_support')}</option>
                  <option value={t('contact_page.wholesale')}>{t('contact_page.wholesale')}</option>
                  <option value={t('contact_page.press')}>{t('contact_page.press')}</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-muted mb-2 block">
                  {t('contact_page.message_label')}
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="..."
                  rows={5}
                  required
                  className="w-full bg-space-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-alien-green/50 transition-colors resize-none text-sm"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl font-mono text-xs sm:text-sm font-bold bg-alien-green text-space-950 hover:bg-alien-green/90 shadow-glow-green transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-space-950" />
                <span>{t('contact_page.send_btn')}</span>
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}
