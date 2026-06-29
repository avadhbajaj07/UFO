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
  {
    id: 'cat-special-edition',
    name: { en: 'Special Edition', de: 'Sonderedition', fr: 'Édition Spéciale' },
    slug: 'special-edition',
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
      en: 'Formulated identically to our Mango blend, Amino Fuel Blue provides the ultimate intra-workout recovery experience with a punchy, interstellar Blue Raspberry taste. Provides critical hydration and prevents muscle breakdown. Formulated under clean lab standards in Switzerland.',
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
  {
    id: 'prod-special',
    name: { en: 'Special Edition', de: 'Sonderedition', fr: 'Édition Spéciale' },
    slug: 'special-edition',
    tagline: {
      en: 'Cosmic Brain & Muscle Catalyst',
      de: 'Kosmischer Gehirn- & Muskelkatalysator',
      fr: 'Catalyseur Cosmique Cerveau & Muscle',
    },
    short_description: {
      en: 'Limitless potential. Hybrid physical and cognitive performance booster with adaptogens and nootropics.',
      de: 'Grenzenloses Potenzial. Hybrider physischer und kognitiver Leistungsbooster mit Adaptogenen und Nootropika.',
      fr: 'Potentiel illimité. Booster de performance physique et cognitive hybride avec adaptogènes et nootropiques.',
    },
    description: {
      en: 'The crown jewel of UFO LABZ. Special Edition is a limited-run hybrid formulation combining premium physical performance enhancers with advanced cognitive nootropics. Featuring Alpha-GPC, Lion\'s Mane Extract, and Rhodiola Rosea alongside premium Pump agents, it creates a ultimate mind-muscle connection. Swiss engineered for elite minds and bodies.',
      de: 'Das Kronjuwel von UFO LABZ. Die Sonderedition ist eine limitierte Hybrid-Formulierung, die erstklassige körperliche Leistungssteigerer mit fortschrittlichen kognitiven Nootropika kombiniert. Mit Alpha-GPC, Igelstachelbart-Extrakt (Lion\'s Mane) und Rhodiola Rosea neben erstklassigen Pump-Wirkstoffen schafft es eine ultimative Geist-Muskel-Verbindung. In der Schweiz entwickelt für Elite-Köpfe und -Körper.',
      fr: 'Le joyau de la couronne d\'UFO LABZ. Special Edition est une formule hybride en édition limitée combinant des boosters de performance physique de qualité supérieure avec des nootropiques cognitifs avancés. Comprenant de l\'Alpha-GPC, de l\'extrait de crinière de lion et de la Rhodiola Rosea, ainsi que des agents de congestion haut de gamme, il crée une connexion esprit-muscle ultime. Conçu en Suisse pour les esprits et les corps d\'élite.',
    },
    product_color: '#9B30FF',
    color_name: 'cosmic-purple',
    base_price: 69.00,
    compare_at_price: 79.00,
    avg_rating: 5.0,
    total_reviews: 14,
    is_new: true,
    is_best_seller: false,
    status: 'active',
    featured: true,
    category: CATEGORIES[3],
    images: [
      { id: 'img-s1', url: '/products/Product5.jpeg', alt: { en: 'Special Edition Bottle' }, is_primary: true, sort_order: 1 },
    ],
    variants: [
      { id: 'var-s1', name: '360g (30 Servings) - Cosmic Grape', price: 69.00, compare_at_price: 79.00, stock: 40, is_default: true, sort_order: 1 },
    ],
    pricing_rules: [],
    faqs: [
      {
        id: 'faq-s1',
        question: { en: 'What makes this Special Edition different?', de: 'Was macht diese Sonderedition so besonders?' },
        answer: { en: 'It is a dual-effect formula. Traditional pre-workouts only stimulate muscles, but Special Edition enhances cognitive flow state, reaction time, and focus through safe nootropics, allowing extreme mental endurance alongside physical strength.', de: 'Es ist eine Formel mit zweifacher Wirkung. Traditionelle Pre-Workouts stimulieren nur die Muskeln, aber die Sonderedition verbessert den kognitiven Flow-Zustand, die Reaktionszeit und den Fokus durch sichere Nootropika, was eine extreme mentale Ausdauer neben der körperlichen Kraft ermöglicht.' },
      },
    ],
  },
]
