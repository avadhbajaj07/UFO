export const SITE_URL = 'https://ufolabz.com'

type SeoEntry = {
  title: string
  description: string
  keywords: string[]
}

export const PRODUCT_SEO: Record<string, SeoEntry> = {
  'astro-creatine': {
    title: 'Micronized Creatine Monohydrate Switzerland | Astro Creatine',
    description: 'Shop Astro Creatine Pure: 100% micronized creatine monohydrate for strength, power and muscle performance. Fast Swiss delivery from UFO LABZ.',
    keywords: ['creatine monohydrate Switzerland', 'micronized creatine', 'creatine powder Switzerland', 'creatine for strength'],
  },
  'amino-fuel-mango': {
    title: 'EAA Amino Acids Mango with Electrolytes | UFO LABZ',
    description: 'Complete 9-EAA amino acid powder with BCAAs and hydration electrolytes in mango flavour. Support training recovery with Swiss delivery.',
    keywords: ['EAA powder Switzerland', 'essential amino acids mango', 'EAA with electrolytes', 'amino acids for recovery'],
  },
  'amino-fuel-blue-raspberry': {
    title: 'EAA Powder Blue Raspberry with Electrolytes | UFO LABZ',
    description: 'Complete essential amino acid blend with all 9 EAAs and electrolytes in blue raspberry flavour. Made for workout hydration and recovery.',
    keywords: ['EAA blue raspberry', 'essential amino acids Switzerland', 'workout hydration powder', 'EAA recovery supplement'],
  },
  'blast-pre-workout-energy': {
    title: 'Pre-Workout Powder with Citrulline & Caffeine | UFO LABZ',
    description: 'High-performance pre-workout with 8g citrulline malate, 3.2g beta-alanine and 200mg caffeine for energy, focus and muscle pumps.',
    keywords: ['pre workout Switzerland', 'pre workout with citrulline', 'pre workout with caffeine', 'energy and focus supplement'],
  },
  'blast-pre-workout-blue': {
    title: 'Blue Raspberry Pre-Workout for Energy & Focus | UFO LABZ',
    description: 'Blue raspberry pre-workout with L-citrulline, beta-alanine and botanical caffeine. Built for training energy, focus and muscle pumps.',
    keywords: ['blue raspberry pre workout', 'pre workout energy Switzerland', 'pre workout for focus', 'pre workout for muscle pump'],
  },
  magnesium: {
    title: 'Magnesium Supplement for Muscles & Recovery | UFO LABZ',
    description: 'Daily magnesium supplement supporting normal muscle function, energy metabolism, recovery and reduced tiredness. Swiss delivery available.',
    keywords: ['magnesium supplement Switzerland', 'magnesium for muscle recovery', 'magnesium for athletes', 'daily magnesium supplement'],
  },
  'astro-collagen-peptide': {
    title: 'Hydrolyzed Collagen Peptides for Joints & Skin | UFO LABZ',
    description: 'Grass-fed Type I and III hydrolyzed collagen peptides with 10g per serving to support joints, cartilage and skin elasticity.',
    keywords: ['collagen peptides Switzerland', 'hydrolyzed collagen powder', 'collagen for joints', 'grass fed collagen peptides'],
  },
}

export const CATEGORY_SEO: Record<string, SeoEntry & { heading: string; intro: string }> = {
  creatine: {
    title: 'Creatine Monohydrate Switzerland | Shop UFO LABZ',
    description: 'Shop micronized creatine monohydrate in Switzerland for strength, power and high-intensity training performance. Fast Swiss delivery.',
    heading: 'CREATINE MONOHYDRATE',
    intro: 'Explore micronized creatine monohydrate engineered for strength, explosive power and repeated high-intensity performance.',
    keywords: ['creatine Switzerland', 'creatine monohydrate Switzerland', 'buy creatine powder Switzerland'],
  },
  'pre-workout': {
    title: 'Pre-Workout Supplements Switzerland | Energy & Focus',
    description: 'Shop pre-workout powders with citrulline, beta-alanine and caffeine for training energy, focus and muscle pumps. Swiss delivery.',
    heading: 'PRE-WORKOUT SUPPLEMENTS',
    intro: 'Find pre-workout formulas designed to support training energy, mental focus, endurance and muscle pumps.',
    keywords: ['pre workout Switzerland', 'pre workout powder', 'pre workout energy and focus'],
  },
  'amino-acids': {
    title: 'EAA Amino Acid Supplements Switzerland | UFO LABZ',
    description: 'Shop complete EAA powders with all nine essential amino acids and electrolytes for workout hydration and muscle recovery.',
    heading: 'EAA AMINO ACIDS',
    intro: 'Complete essential amino acid and electrolyte formulas for workout hydration, protein synthesis and post-training recovery.',
    keywords: ['EAA Switzerland', 'essential amino acids', 'amino acid powder for recovery'],
  },
  magnesium: {
    title: 'Magnesium Supplements Switzerland | Muscles & Recovery',
    description: 'Shop magnesium supplements supporting normal muscle function, recovery, energy metabolism and reduced tiredness.',
    heading: 'MAGNESIUM SUPPLEMENTS',
    intro: 'Daily magnesium support for active lifestyles, normal muscle function, energy metabolism and recovery.',
    keywords: ['magnesium Switzerland', 'magnesium for muscles', 'magnesium recovery supplement'],
  },
  'special-edition': {
    title: 'Special Edition Sports Supplements | UFO LABZ Switzerland',
    description: 'Discover limited and special-edition UFO LABZ sports supplements created for athletes and active lifestyles in Switzerland.',
    heading: 'SPECIAL EDITION SUPPLEMENTS',
    intro: 'Discover limited-release and special-edition performance supplements from UFO LABZ.',
    keywords: ['special edition supplements', 'sports supplements Switzerland', 'UFO LABZ supplements'],
  },
}

export function getProductSeo(slug: string, fallback: SeoEntry): SeoEntry {
  return PRODUCT_SEO[slug] ?? fallback
}

