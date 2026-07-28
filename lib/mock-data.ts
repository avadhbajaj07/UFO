export const CATEGORIES = [
  {
    id: 'cat-creatine',
    name: { en: 'Creatine', de: 'Kreatin', fr: 'Créatine' },
    slug: 'creatine',
  },
  {
    id: 'cat-pre-workout',
    name: { en: 'Pre Workout', de: 'Pre-Workout', fr: 'Pre-Workout' },
    slug: 'pre-workout',
  },
  {
    id: 'cat-amino-acids',
    name: { en: 'Amino Acids', de: 'Aminosäuren', fr: 'Acides Aminés' },
    slug: 'amino-acids',
  },
]

export const PRODUCTS = [
  {
    id: 'prod-amino-blue',
    name: { en: 'Amino Fuel Blue', de: 'Amino Fuel Blue', fr: 'Amino Fuel Blue' },
    slug: 'amino-fuel-blue',
    tagline: {
      en: 'Blue Raspberry EAA & BCAA Hydration Formula',
      de: 'Blaue Himbeere EAA & BCAA Hydrationsformel',
      fr: 'Formule d\'Hydratation EAA & BCAA Framboise Bleue',
    },
    short_description: {
      en: 'Premium recovery matrix. Fast-absorbing EAAs with a refreshing cosmic blue raspberry flavor.',
      de: 'Erstklassige Erholungsmatrix. Schnell einziehende EAAs mit einem erfrischenden kosmischen Blaue-Himbeere-Geschmack.',
      fr: 'Matrice de récupération premium. EAA à absorption rapide avec un goût rafraîchissant de framboise bleue cosmique.',
    },
    description: {
      en: 'Formulated identically to our Mango blend, Amino Fuel Blue provides the ultimate intra-workout recovery experience with a punchy, interstellar Blue Raspberry taste. Provides critical hydration and prevents muscle breakdown. Formulated under clean European laboratory standards.',
      de: 'Identisch formuliert wie unsere Mango-Mischung, bietet Amino Fuel Blue das ultimative Intra-Workout-Erholungserlebnis mit einem spritzigen, interstellaren Blaue-Himbeere-Geschmack. Bietet wichtige Hydratation und verhindert Muskelabbau. Formuliert unter sauberen Laborstandards in der Schweiz.',
      fr: 'Formulé de manière identique à notre mélange Mango, Amino Fuel Blue offre l\'expérience ultime de récupération intra-entraînement avec un goût de framboise bleue interstellaire percutant. Fournit une hydratation critique et prévient la dégradation musculaire. Formulé selon les normes de laboratoire en Suisse.',
    },
    product_color: '#00CFFF',
    color_name: 'neon-blue',
    base_price: 45.00,
    compare_at_price: null,
    avg_rating: 4.9,
    total_reviews: 26,
    is_new: true,
    is_best_seller: false,
    status: 'active',
    featured: true,
    category: CATEGORIES[2],
    images: [
      { id: 'img-ab1', url: '/products/Product4.jpeg', alt: { en: 'Amino Fuel Blue Bottle' }, is_primary: true, sort_order: 1 },
    ],
    variants: [
      { id: 'var-ab1', name: '390g (30 Servings)', price: 45.00, compare_at_price: null, stock: 75, is_default: true, sort_order: 1 },
    ],
    pricing_rules: [],
    faqs: [],
  },
]
