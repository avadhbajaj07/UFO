'use client'

import { useTranslation, Link } from '@/lib/i18n'
import {
  UserPlus,
  Share2,
  DollarSign,
  Percent,
  BarChart2,
  Gift,
  Clock,
  CreditCard,
  Headphones,
  ArrowRight,
  Sparkles,
} from 'lucide-react'

const CONTENT: Record<string, any> = {
  fr: {
    badge: '💰 GAGNEZ JUSQU’À 25% DE COMMISSION',
    hero_title: 'REJOIGNEZ LE PROGRAMME D’AFFILIATION UFO LABZ',
    hero_subtitle: 'Transformez votre audience en revenus. Partagez votre passion, gagnez des commissions attractives et grandissez aux côtés de la marque de suppléments la plus futuriste de la galaxie.',
    apply_btn: 'POSTULER MAINTENANT',
    learn_more: 'EN SAVOIR PLUS',
    stats: [
      { value: '25%', label: 'Commission Max' },
      { value: '30 Jours', label: 'Durée des Cookies' },
      { value: 'CHF 850+', label: 'Revenus Moyens Mensuels' },
      { value: '500+', label: 'Affiliés Actifs' },
    ],
    how_it_works: 'COMMENT ÇA MARCHE',
    steps: [
      {
        icon: UserPlus,
        title: 'INSCRIVEZ-VOUS',
        description: 'Postulez à notre programme d’affiliation. Validation rapide sous 24h et accès immédiat à votre tableau de bord.',
      },
      {
        icon: Share2,
        title: 'PARTAGEZ & PROMOUVEZ',
        description: 'Utilisez votre lien unique, vos codes promo personnalisés et nos supports marketing haute définition.',
      },
      {
        icon: DollarSign,
        title: 'TOUCHEZ VOS COMMISSIONS',
        description: 'Gagnez de 15 à 25% sur chaque vente. Suivez vos conversions en temps réel avec paiement mensuel sécurisé.',
      },
    ],
    why_partner: 'POURQUOI DEVENIR PARTENAIRE',
    benefits: [
      {
        icon: Percent,
        title: 'COMMISSIONS ÉLEVÉES',
        description: 'De 15 à 25% sur chaque commande générée, avec bonus de performance pour les meilleurs ambassadeurs.',
      },
      {
        icon: BarChart2,
        title: 'DASHBOARD TEMPS RÉEL',
        description: 'Visualisez clics, commandes, taux de conversion et revenus en direct avec statistiques transparentes.',
      },
      {
        icon: Gift,
        title: 'AVANTAGES EXCLUSIFS',
        description: 'Échantillons gratuits, accès prioritaire aux nouveaux lancements et réductions dédiées pour votre communauté.',
      },
      {
        icon: Clock,
        title: 'COOKIE 30 JOURS',
        description: 'Attribution sur 30 jours pour garantir votre commission même si l’achat est finalisé plusieurs semaines plus tard.',
      },
      {
        icon: CreditCard,
        title: 'PAIEMENTS FLEXIBLES',
        description: 'Paiements directs par TWINT, virement bancaire SEPA ou PayPal dès CHF 50 de gains cumulés.',
      },
      {
        icon: Headphones,
        title: 'SUPPORT DÉDIÉ',
        description: 'Un responsable d’affiliation dédié et un canal direct pour maximiser vos résultats marketing.',
      },
    ],
    tiers_title: 'PALIERS DE COMMISSION',
    th_tier: 'Palier',
    th_sales: 'Ventes Mensuelles',
    th_commission: 'Commission',
    th_bonus: 'Avantages',
    tiers: [
      { name: 'EXPLORER', sales: '0 — 10 ventes', commission: '15%', bonus: '—', highlighted: false },
      { name: 'ASTRONAUT', sales: '11 — 50 ventes', commission: '20%', bonus: 'Formule offerte chaque mois', highlighted: false },
      { name: 'COMMANDER', sales: '51+ ventes', commission: '25%', bonus: 'Formules offertes + Support VIP', highlighted: true },
    ],
    ready_title: 'PRÊT À COMMENCER L’AVENTURE ?',
    ready_subtitle: 'Rejoignez des centaines d’athlètes et créateurs qui collaborent déjà avec UFO LABZ.',
    ready_btn: 'DEVENIR AFFILIÉ',
  },
  en: {
    badge: '💰 EARN UP TO 25% COMMISSION',
    hero_title: 'JOIN THE UFO LABZ AFFILIATE PROGRAM',
    hero_subtitle: 'Turn your audience into income. Share what you love, earn generous commissions, and grow alongside the most futuristic supplement brand in the galaxy.',
    apply_btn: 'APPLY NOW',
    learn_more: 'LEARN MORE',
    stats: [
      { value: '25%', label: 'Max Commission' },
      { value: '30 Days', label: 'Cookie Duration' },
      { value: 'CHF 850+', label: 'Avg Monthly Earnings' },
      { value: '500+', label: 'Active Affiliates' },
    ],
    how_it_works: 'HOW IT WORKS',
    steps: [
      {
        icon: UserPlus,
        title: 'SIGN UP',
        description: 'Apply for our affiliate program. Fast approval within 24 hours and instant access to your portal.',
      },
      {
        icon: Share2,
        title: 'SHARE & PROMOTE',
        description: 'Use your unique referral link, custom coupon codes, and high-definition official marketing assets.',
      },
      {
        icon: DollarSign,
        title: 'EARN COMMISSIONS',
        description: 'Earn 15-25% commission on every single sale. Track conversions in real-time with reliable payouts.',
      },
    ],
    why_partner: 'WHY PARTNER WITH US',
    benefits: [
      {
        icon: Percent,
        title: 'HIGH COMMISSION RATES',
        description: 'Earn 15-25% on every referred order, with performance bonus tiers for top ambassadors.',
      },
      {
        icon: BarChart2,
        title: 'REAL-TIME DASHBOARD',
        description: 'Track clicks, conversions, and earnings live with complete transparent analytics.',
      },
      {
        icon: Gift,
        title: 'EXCLUSIVE PERKS',
        description: 'Complimentary formula samples, early access to new drops, and exclusive community discounts.',
      },
      {
        icon: Clock,
        title: '30-DAY COOKIE',
        description: 'Our 30-day tracking window guarantees you earn commissions even on delayed customer purchases.',
      },
      {
        icon: CreditCard,
        title: 'FLEXIBLE PAYOUTS',
        description: 'Receive payouts via TWINT, Swiss/SEPA bank transfer, or PayPal starting at just CHF 50 threshold.',
      },
      {
        icon: Headphones,
        title: 'DEDICATED SUPPORT',
        description: 'Direct communication with your personal affiliate manager to optimize your campaigns.',
      },
    ],
    tiers_title: 'COMMISSION TIERS',
    th_tier: 'Tier',
    th_sales: 'Monthly Sales',
    th_commission: 'Commission',
    th_bonus: 'Bonus Perks',
    tiers: [
      { name: 'EXPLORER', sales: '0 — 10 sales', commission: '15%', bonus: '—', highlighted: false },
      { name: 'ASTRONAUT', sales: '11 — 50 sales', commission: '20%', bonus: 'Free monthly supplement', highlighted: false },
      { name: 'COMMANDER', sales: '51+ sales', commission: '25%', bonus: 'Free products + VIP support', highlighted: true },
    ],
    ready_title: 'READY TO START EARNING?',
    ready_subtitle: 'Join hundreds of creators and athletes thriving with UFO LABZ.',
    ready_btn: 'BECOME AN AFFILIATE',
  },
  de: {
    badge: '💰 BIS ZU 25% PROVISION VERDIENEN',
    hero_title: 'WERDEN SIE TEIL DES UFO LABZ PARTNERPROGRAMMS',
    hero_subtitle: 'Verwandeln Sie Ihre Reichweite in Einkommen. Teilen Sie wissenschaftliche Premium-Supplements und wachsen Sie mit der innovativsten Schweizer Marke.',
    apply_btn: 'JETZT BEWERBEN',
    learn_more: 'MEHR ERFAHREN',
    stats: [
      { value: '25%', label: 'Max. Provision' },
      { value: '30 Tage', label: 'Cookie-Laufzeit' },
      { value: 'CHF 850+', label: 'Ø Monatsverdienst' },
      { value: '500+', label: 'Aktive Partner' },
    ],
    how_it_works: 'SO FUNKTIONIERT ES',
    steps: [
      {
        icon: UserPlus,
        title: 'ANMELDEN',
        description: 'Bewerben Sie sich in wenigen Minuten. Schnelle Prüfung innerhalb von 24h und sofortiger Dashboard-Zugang.',
      },
      {
        icon: Share2,
        title: 'TEILEN & EMPFEHLEN',
        description: 'Nutzen Sie Ihren persönlichen Empfehlungslink, individuelle Gutscheincodes und Profi-Werbemittel.',
      },
      {
        icon: DollarSign,
        title: 'PROVISIONEN ERHALTEN',
        description: 'Verdienen Sie 15–25% an jedem vermittelten Kauf. Verfolgen Sie Ihre Erlöse in Echtzeit mit pünktlicher Auszahlung.',
      },
    ],
    why_partner: 'IHRE VORTEILE',
    benefits: [
      {
        icon: Percent,
        title: 'ATTRAKTIVE PROVISIONEN',
        description: '15 bis 25% Provision auf jede Bestellung, plus Bonuszahlungen für Spitzen-Performer.',
      },
      {
        icon: BarChart2,
        title: 'ECHTZEIT-DASHBOARD',
        description: 'Behalten Sie Klicks, Konversionen und Guthaben immer aktuell im Blick.',
      },
      {
        icon: Gift,
        title: 'EXKLUSIVE EXTRAS',
        description: 'Kostenlose Produktsamples, Vorab-Zugang zu neuen Drops und Community-Rabattcodes.',
      },
      {
        icon: Clock,
        title: '30-TAGE COOKIE',
        description: 'Verdienen Sie auch dann Provisionen, wenn Kunden erst Wochen nach dem Klick bestellen.',
      },
      {
        icon: CreditCard,
        title: 'FLEXIBLE AUSZAHLUNG',
        description: 'Auszahlung via TWINT, Banküberweisung oder PayPal ab CHF 50 Mindestbetrag.',
      },
      {
        icon: Headphones,
        title: 'PERSÖNLICHER SUPPORT',
        description: 'Fester Ansprechpartner und priorisierter Support zur Optimierung Ihrer Kampagnen.',
      },
    ],
    tiers_title: 'PROVISIONSSTUFEN',
    th_tier: 'Stufe',
    th_sales: 'Monatliche Verkäufe',
    th_commission: 'Provision',
    th_bonus: 'Bonus',
    tiers: [
      { name: 'EXPLORER', sales: '0 — 10 Verkäufe', commission: '15%', bonus: '—', highlighted: false },
      { name: 'ASTRONAUT', sales: '11 — 50 Verkäufe', commission: '20%', bonus: 'Monatliches Produkt geschenkt', highlighted: false },
      { name: 'COMMANDER', sales: '51+ Verkäufe', commission: '25%', bonus: 'Kostenlose Produkte + VIP Support', highlighted: true },
    ],
    ready_title: 'BEREIT DURCHZUSTARTEN?',
    ready_subtitle: 'Schliessen Sie sich Hunderten erfolgreichen UFO LABZ Partnern an.',
    ready_btn: 'JETZT PARTNER WERDEN',
  },
  it: {
    badge: '💰 GUADAGNA FINO AL 25% DI COMMISSIONE',
    hero_title: 'UNISCITI AL PROGRAMMA DI AFFILIAZIONE UFO LABZ',
    hero_subtitle: 'Trasforma il tuo pubblico in una fonte di guadagno. Condividi formule scientifiche svizzere di altissima qualità e cresci con noi.',
    apply_btn: 'CANDIDATI ORA',
    learn_more: 'SCOPRI DI PIÙ',
    stats: [
      { value: '25%', label: 'Commissione Max' },
      { value: '30 Giorni', label: 'Durata Cookie' },
      { value: 'CHF 850+', label: 'Guadagno Medio Mensile' },
      { value: '500+', label: 'Affiliati Attivi' },
    ],
    how_it_works: 'COME FUNZIONA',
    steps: [
      {
        icon: UserPlus,
        title: 'ISCRIVITI',
        description: 'Compila la richiesta di affiliazione. Approvazione rapida entro 24 ore e accesso immediato alla dashboard.',
      },
      {
        icon: Share2,
        title: 'CONDIVIDI & PROMUOVI',
        description: 'Usa il tuo link esclusivo, codici coupon dedicati e materiali promozionali ad alta risoluzione.',
      },
      {
        icon: DollarSign,
        title: 'GUADAGNA COMMISSIONI',
        description: 'Guadagna dal 15 al 25% su ogni ordine generato. Monitoraggio in tempo reale e pagamenti mensili puntuali.',
      },
    ],
    why_partner: 'PERCHÉ COLLABORARE CON NOI',
    benefits: [
      {
        icon: Percent,
        title: 'COMMISSIONI ELEVATE',
        description: 'Guadagni fino al 25% su ogni ordine, con livelli bonus per i migliori creator e atleti.',
      },
      {
        icon: BarChart2,
        title: 'DASHBOARD IN TEMPO REALE',
        description: 'Analisi chiare e trasparenti su clic, conversioni e ricavi generati in tempo reale.',
      },
      {
        icon: Gift,
        title: 'VANTAGGI ESCLUSIVI',
        description: 'Campioni gratuiti, accesso anticipato ai nuovi lanci e sconti esclusivi per la tua community.',
      },
      {
        icon: Clock,
        title: 'COOKIE DI 30 GIORNI',
        description: 'Tracciamento prolungato per garantirti la commissione anche se l’acquisto avviene settimane dopo.',
      },
      {
        icon: CreditCard,
        title: 'PAGAMENTI FLESSIBILI',
        description: 'Pagamenti tramite TWINT, bonifico bancario SEPA o PayPal a partire da CHF 50.',
      },
      {
        icon: Headphones,
        title: 'SUPPORTO DEDICATO',
        description: 'Un affiliate manager a te dedicato per massimizzare la crescita del tuo canale.',
      },
    ],
    tiers_title: 'LIVELLI DI COMMISSIONE',
    th_tier: 'Livello',
    th_sales: 'Vendite Mensili',
    th_commission: 'Commissione',
    th_bonus: 'Vantaggi',
    tiers: [
      { name: 'EXPLORER', sales: '0 — 10 vendite', commission: '15%', bonus: '—', highlighted: false },
      { name: 'ASTRONAUT', sales: '11 — 50 vendite', commission: '20%', bonus: 'Prodotto omaggio ogni mese', highlighted: false },
      { name: 'COMMANDER', sales: '51+ vendite', commission: '25%', bonus: 'Prodotti omaggio + Supporto VIP', highlighted: true },
    ],
    ready_title: 'PRONTO A GUADAGNARE?',
    ready_subtitle: 'Unisciti a centinaia di atleti e creator che collaborano con UFO LABZ.',
    ready_btn: 'DIVENTA UN AFFILIATO',
  },
  es: {
    badge: '💰 GANA HASTA UN 25% DE COMISIÓN',
    hero_title: 'ÚNETE AL PROGRAMA DE AFILIADOS DE UFO LABZ',
    hero_subtitle: 'Convierte tu audiencia en ingresos. Comparte suplementos suizos de precisión y crece con la marca más futurista de la galaxia.',
    apply_btn: 'SOLICITAR AHORA',
    learn_more: 'MÁS INFORMACIÓN',
    stats: [
      { value: '25%', label: 'Comisión Máxima' },
      { value: '30 Días', label: 'Duración de Cookies' },
      { value: 'CHF 850+', label: 'Ganancia Mensual Media' },
      { value: '500+', label: 'Afiliados Activos' },
    ],
    how_it_works: 'CÓMO FUNCIONA',
    steps: [
      {
        icon: UserPlus,
        title: 'REGÍSTRATE',
        description: 'Solicita unirte al programa. Aprobación en menos de 24 horas y acceso inmediato a tu panel de control.',
      },
      {
        icon: Share2,
        title: 'COMPARTE Y PROMOCIONA',
        description: 'Utiliza tu enlace de referido único, cupones personalizados y materiales de marketing oficiales en alta resolución.',
      },
      {
        icon: DollarSign,
        title: 'GANA COMISIONES',
        description: 'Gana del 15% al 25% por cada venta. Rastrea tus ganancias en tiempo real con pagos mensuales garantizados.',
      },
    ],
    why_partner: 'POR QUÉ ASOCIARTE CON NOSOTROS',
    benefits: [
      {
        icon: Percent,
        title: 'ALTAS COMISIONES',
        description: 'Del 15% al 25% en cada venta referida, con bonificaciones adicionales para los mejores creadores.',
      },
      {
        icon: BarChart2,
        title: 'PANEL EN TIEMPO REAL',
        description: 'Supervisa clics, conversiones y comisiones al instante con total transparencia.',
      },
      {
        icon: Gift,
        title: 'BENEFICIOS EXCLUSIVOS',
        description: 'Muestras de producto gratis, acceso prioritario a nuevos lanzamientos y descuentos dedicados.',
      },
      {
        icon: Clock,
        title: 'COOKIE DE 30 DÍAS',
        description: 'Ventana de seguimiento de 30 días para asegurar tu comisión incluso en compras posteriores.',
      },
      {
        icon: CreditCard,
        title: 'PAGOS FLEXIBLES',
        description: 'Cobros seguros por transferencia bancaria SEPA o PayPal a partir de tan solo 50 CHF / EUR.',
      },
      {
        icon: Headphones,
        title: 'SOPORTE DEDICADO',
        description: 'Un gestor de afiliados dedicado para ayudarte a optimizar tus campañas y maximizar ingresos.',
      },
    ],
    tiers_title: 'NIVELES DE COMISIÓN',
    th_tier: 'Nivel',
    th_sales: 'Ventas Mensuales',
    th_commission: 'Comisión',
    th_bonus: 'Beneficios Extra',
    tiers: [
      { name: 'EXPLORER', sales: '0 — 10 ventas', commission: '15%', bonus: '—', highlighted: false },
      { name: 'ASTRONAUT', sales: '11 — 50 ventas', commission: '20%', bonus: 'Suplemento gratis al mes', highlighted: false },
      { name: 'COMMANDER', sales: '51+ ventas', commission: '25%', bonus: 'Productos gratis + Soporte VIP', highlighted: true },
    ],
    ready_title: '¿LISTO PARA EMPEZAR A GANAR?',
    ready_subtitle: 'Únete a cientos de atletas y creadores que ya generan ingresos con UFO LABZ.',
    ready_btn: 'CONVIÉRTETE EN AFILIADO',
  },
  pt: {
    badge: '💰 GANHE ATÉ 25% DE COMISSÃO',
    hero_title: 'JUNTE-SE AO PROGRAMA DE AFILIADOS UFO LABZ',
    hero_subtitle: 'Transforme o seu público em rendimento. Partilhe suplementos suíços de precisão e cresça com a marca mais futurista da galáxia.',
    apply_btn: 'CANDIDATAR AGORA',
    learn_more: 'SABER MAIS',
    stats: [
      { value: '25%', label: 'Comissão Máxima' },
      { value: '30 Dias', label: 'Duração dos Cookies' },
      { value: 'CHF 850+', label: 'Rendimento Médio Mensal' },
      { value: '500+', label: 'Afiliados Ativos' },
    ],
    how_it_works: 'COMO FUNCIONA',
    steps: [
      {
        icon: UserPlus,
        title: 'REGISTE-SE',
        description: 'Submeta a sua candidatura. Aprovação em menos de 24 horas e acesso imediato ao painel.',
      },
      {
        icon: Share2,
        title: 'PARTILHE & DIVULGUE',
        description: 'Use o seu link exclusivo, cupões personalizados e materiais oficiais de marketing em alta resolução.',
      },
      {
        icon: DollarSign,
        title: 'RECEBA COMISSÕES',
        description: 'Ganhe entre 15% e 25% em cada venda. Acompanhe os resultados em tempo real com pagamentos mensais pontuais.',
      },
    ],
    why_partner: 'PORQUÊ SER NOSSO PARCEIRO',
    benefits: [
      {
        icon: Percent,
        title: 'COMISSÕES ELEVADAS',
        description: 'De 15% a 25% em cada encomenda recomendada, com bónus de desempenho para os melhores afiliados.',
      },
      {
        icon: BarChart2,
        title: 'PAINEL EM TEMPO REAL',
        description: 'Visualize cliques, conversões e ganhos ao vivo com estatísticas claras e transparentes.',
      },
      {
        icon: Gift,
        title: 'VANTAGENS EXCLUSIVAS',
        description: 'Amostras de produtos gratuitas, acesso antecipado a novidades e descontos exclusivos.',
      },
      {
        icon: Clock,
        title: 'COOKIE DE 30 DIAS',
        description: 'Janela de 30 dias para garantir a sua comissão mesmo se a compra for finalizada mais tarde.',
      },
      {
        icon: CreditCard,
        title: 'PAGAMENTOS FLEXÍVEIS',
        description: 'Receba via transferência bancária SEPA ou PayPal com limite mínimo de apenas 50 CHF / EUR.',
      },
      {
        icon: Headphones,
        title: 'SUPORTE DEDICADO',
        description: 'Gestor de afiliados dedicado para o apoiar na otimização dos seus resultados.',
      },
    ],
    tiers_title: 'ESCALÕES DE COMISSÃO',
    th_tier: 'Escalão',
    th_sales: 'Vendas Mensais',
    th_commission: 'Comissão',
    th_bonus: 'Vantagens',
    tiers: [
      { name: 'EXPLORER', sales: '0 — 10 vendas', commission: '15%', bonus: '—', highlighted: false },
      { name: 'ASTRONAUT', sales: '11 — 50 vendas', commission: '20%', bonus: 'Suplemento grátis mensal', highlighted: false },
      { name: 'COMMANDER', sales: '51+ vendas', commission: '25%', bonus: 'Produtos grátis + Apoio VIP', highlighted: true },
    ],
    ready_title: 'PRONTO PARA COMEÇAR A GANHAR?',
    ready_subtitle: 'Junte-se a centenas de criadores e atletas que já lucram com a UFO LABZ.',
    ready_btn: 'TORNAR-SE AFILIADO',
  },
}

export default function AffiliateClient() {
  const { locale } = useTranslation()
  const c = CONTENT[locale] || CONTENT.fr

  return (
    <div className="pt-28">
      {/* ── Hero ── */}
      <section className="pb-16 text-center relative overflow-hidden">
        <div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(200,80,255,0.15) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] translate-x-1/2 translate-y-1/2 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(0,255,136,0.1) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="card-glass inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono text-alien-green border border-alien-green/20 mb-6">
            {c.badge}
          </span>

          <h1 className="font-display text-5xl md:text-7xl tracking-wider max-w-4xl mx-auto">
            {c.hero_title}
          </h1>

          <p className="text-lg text-muted max-w-2xl mx-auto mt-5 mb-8">
            {c.hero_subtitle}
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/affiliate"
              className="btn-primary inline-flex items-center gap-2"
            >
              {c.apply_btn}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#how-it-works"
              className="btn-outline inline-flex items-center gap-2"
            >
              {c.learn_more}
            </a>
          </div>
        </div>
      </section>

      {/* ── Stats Banner ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="card-glass p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {c.stats.map((stat: any) => (
              <div key={stat.label}>
                <div className="font-display text-3xl md:text-4xl text-gradient-cosmic">
                  {stat.value}
                </div>
                <div className="text-xs font-mono text-muted uppercase tracking-wider mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section
        id="how-it-works"
        className="py-16 md:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <h2 className="font-display text-3xl md:text-5xl mb-12 text-center">
          {c.how_it_works}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {c.steps.map((step: any, idx: number) => {
            const Icon = step.icon
            return (
              <div key={step.title} className="card-glass p-8 text-center relative">
                <span className="absolute top-4 right-4 w-8 h-8 rounded-full bg-nebula-800/50 border border-nebula-600/30 flex items-center justify-center font-mono text-xs text-nebula-400">
                  {idx + 1}
                </span>

                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                  style={{
                    background: 'linear-gradient(135deg, #7B2FBE 0%, #00FF88 100%)',
                  }}
                >
                  <Icon className="w-6 h-6 text-space-950" />
                </div>

                <h3 className="font-display text-xl tracking-wider mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {step.description}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="py-16 md:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl md:text-5xl mb-12 text-center">
          {c.why_partner}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {c.benefits.map((benefit: any) => {
            const Icon = benefit.icon
            return (
              <div
                key={benefit.title}
                className="card-glass p-6 hover:border-nebula-600/30 transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-xl bg-nebula-800/30 border border-nebula-600/20 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-nebula-400 group-hover:text-alien-green transition-colors" />
                </div>
                <h3 className="font-display text-lg tracking-wider mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted">{benefit.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Commission Tiers ── */}
      <section className="py-16 md:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl md:text-5xl mb-12 text-center">
          {c.tiers_title}
        </h2>

        <div className="card-glass p-1 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-space-800/80">
              <tr>
                <th className="text-xs font-mono uppercase tracking-wider text-muted py-4 px-6">
                  {c.th_tier}
                </th>
                <th className="text-xs font-mono uppercase tracking-wider text-muted py-4 px-6">
                  {c.th_sales}
                </th>
                <th className="text-xs font-mono uppercase tracking-wider text-muted py-4 px-6">
                  {c.th_commission}
                </th>
                <th className="text-xs font-mono uppercase tracking-wider text-muted py-4 px-6">
                  {c.th_bonus}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {c.tiers.map((tier: any) => (
                <tr
                  key={tier.name}
                  className={tier.highlighted ? 'bg-nebula-800/20' : ''}
                >
                  <td className="py-4 px-6 font-mono text-sm text-white">
                    <span className="inline-flex items-center gap-1.5">
                      {tier.name}
                      {tier.highlighted && (
                        <Sparkles className="w-4 h-4 text-nebula-400" />
                      )}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-muted">{tier.sales}</td>
                  <td className="py-4 px-6 text-sm text-alien-green font-mono">
                    {tier.commission}
                  </td>
                  <td className="py-4 px-6 text-sm text-muted">{tier.bonus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-16 md:py-24 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="card-glass p-12 text-center relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 50% 50%, rgba(200,80,255,0.1) 0%, transparent 70%)',
            }}
          />

          <div className="relative z-10">
            <h2 className="font-display text-4xl md:text-5xl tracking-wider mb-4">
              {c.ready_title}
            </h2>
            <p className="text-muted mb-8">
              {c.ready_subtitle}
            </p>
            <Link
              href="/affiliate"
              className="btn-primary inline-flex items-center text-lg px-8 py-4 gap-2"
            >
              {c.ready_btn}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
