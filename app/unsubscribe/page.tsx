import React from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function GeneralUnsubscribePage() {
  return (
    <div className="min-h-screen bg-space-950 flex items-center justify-center px-4 py-16 selection:bg-alien-green selection:text-space-950">
      <div className="max-w-md w-full card-glass bg-space-900/80 border border-white/[0.08] p-8 rounded-3xl text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-gray-400">
          <CheckCircle2 className="w-8 h-8 text-alien-green" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400 font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10">
            Désinscription
          </span>
          <h1 className="text-2xl font-display uppercase tracking-wider text-white font-bold pt-2">
            Gestion de vos Abonnements
          </h1>
          <p className="text-xs text-gray-400 leading-relaxed">
            Pour vous désinscrire d’une liste, veuillez cliquer directement sur le lien de désinscription figurant au bas de l’un de nos e-mails reçus, ou contactez notre support à support@ufolabz.com.
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
      </div>
    </div>
  )
}
