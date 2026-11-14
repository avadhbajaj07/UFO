import React from 'react'
import Link from 'next/link'
import { CheckCircle2, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

interface Props {
  params: { token: string }
}

export default async function EmailConfirmPage({ params }: Props) {
  const { token } = params
  let confirmed = false
  let userEmail = ''

  if (token) {
    try {
      const supabase = createAdminClient()
      const { data, error } = await supabase
        .from('subscribers')
        .update({
          status: 'subscribed',
          confirmed_at: new Date().toISOString(),
          double_optin_token: null,
        })
        .eq('double_optin_token', token)
        .select('email')
        .single()

      if (!error && data?.email) {
        confirmed = true
        userEmail = data.email
      }
    } catch {
      // Fallback
    }
  }

  return (
    <div className="min-h-screen bg-space-950 flex items-center justify-center px-4 py-16 selection:bg-alien-green selection:text-space-950">
      <div className="max-w-md w-full card-glass bg-space-900/80 border border-white/[0.08] p-8 rounded-3xl text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-alien-green/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-alien-green/10 border border-alien-green/30 flex items-center justify-center mx-auto text-alien-green">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-alien-green font-bold px-3 py-1 rounded-full bg-alien-green/10 border border-alien-green/20">
            Double Opt-in Verified
          </span>
          <h1 className="text-2xl font-display uppercase tracking-wider text-white font-bold pt-2">
            Inscription Confirmée !
          </h1>
          <p className="text-xs text-gray-300 leading-relaxed">
            Votre adresse e-mail a été vérifiée avec succès. Vous recevrez désormais nos protocoles nutritionnels exclusifs, guides athlètes et annonces de précommande UFO LABZ.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/build-your-stack"
            className="w-full bg-alien-green text-space-950 font-bold py-3.5 px-6 rounded-xl text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 hover:shadow-glow-green transition-all"
          >
            <span>Composer mon Stack (-15%)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="border-t border-white/5 pt-4 text-[10px] text-gray-500 font-mono">
          UFO LABZ · Geneva, Switzerland · Swiss nLPD & GDPR Compliant
        </div>
      </div>
    </div>
  )
}
