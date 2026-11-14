import React from 'react'
import Link from 'next/link'
import { ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

interface Props {
  params: { token: string }
}

export default async function UnsubscribePage({ params }: Props) {
  const { token } = params
  let unsubscribed = false

  if (token) {
    try {
      const supabase = createAdminClient()
      await supabase
        .from('subscribers')
        .update({
          status: 'unsubscribed',
          unsubscribed_at: new Date().toISOString(),
        })
        .or(`id.eq.${token},email.eq.${decodeURIComponent(token)}`)

      unsubscribed = true
    } catch {
      // Fallback
    }
  }

  return (
    <div className="min-h-screen bg-space-950 flex items-center justify-center px-4 py-16 selection:bg-alien-green selection:text-space-950">
      <div className="max-w-md w-full card-glass bg-space-900/80 border border-white/[0.08] p-8 rounded-3xl text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-gray-400">
          <CheckCircle2 className="w-8 h-8 text-alien-green" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400 font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10">
            Désinscription Réussie
          </span>
          <h1 className="text-2xl font-display uppercase tracking-wider text-white font-bold pt-2">
            Vous Êtes Désinscrit
          </h1>
          <p className="text-xs text-gray-400 leading-relaxed">
            Votre adresse e-mail a été retirée de nos listes de diffusion marketing conformément à la réglementation suisse nLPD et RGPD.
            Vous continuerez uniquement à recevoir les confirmations indispensables liées à vos commandes.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-xl text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
          >
            <span>Retour à l’accueil</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="border-t border-white/5 pt-4 text-[10px] text-gray-500 font-mono">
          UFO LABZ GmbH · Rue de Genève, 1200 Genève, Switzerland
        </div>
      </div>
    </div>
  )
}
