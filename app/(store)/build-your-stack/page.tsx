import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import BuildYourStackClient, {
  StackProductCardItem,
} from '@/components/stack/BuildYourStackClient'
import {
  DEFAULT_STACK_TIERS,
  DEFAULT_PRESET_STACKS,
  PresetStackDef,
  StackTier,
} from '@/lib/config/stack'
import { getCanonicalUnitPrice } from '@/lib/config/pricing'
import { FLAVOR_FAMILIES } from '@/lib/config/flavors'
import { getLocalizedField } from '@/types'

export const revalidate = 3600 // ISR: revalidate every hour

export const metadata: Metadata = {
  title: 'Build Your Custom Stack — Save up to 15% | UFO LABZ Switzerland',
  description:
    'Formulate your custom UFO LABZ performance stack. Bundle 2 products for 10% off, or 3+ for an automatic 15% discount. Free delivery in Switzerland on orders from CHF 75.',
  alternates: {
    canonical: 'https://ufolabz.com/build-your-stack',
  },
  openGraph: {
    title: 'Build Your Stack — Save up to 15% | UFO LABZ',
    description:
      'Curate your personal protocol of clinical-grade Swiss supplements. Bundle 2 to save 10%, or 3+ to save 15%. Pre-order Batch 01 now.',
    url: 'https://ufolabz.com/build-your-stack',
    type: 'website',
    images: [
      {
        url: 'https://res.cloudinary.com/dm4jfxbcs/image/upload/v1782667544/UFO4_nuzyls.png',
        width: 1200,
        height: 630,
        alt: 'UFO LABZ Build Your Stack Protocol',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Build Your Stack — Save up to 15% | UFO LABZ',
    description:
      'Bundle 2 formulas to save 10%, or 3+ to save 15%. Automatic volume discounts applied at checkout.',
    images: ['https://res.cloudinary.com/dm4jfxbcs/image/upload/v1782667544/UFO4_nuzyls.png'],
  },
}

const DEFAULT_STACK_PRODUCTS: StackProductCardItem[] = [
  {
    id: 'prod-creatine',
    slug: 'astro-creatine',
    name: 'Astro Creatine Pure 300g',
    tagline: '100% Pure Micronized Creatine Monohydrate for ATP Saturation',
    category: 'Creatine',
    basePrice: 29.90,
    color: '#00FF88',
    imageUrl:
      'https://res.cloudinary.com/dm4jfxbcs/image/upload/v1782667544/UFO4_nuzyls.png',
    hasVariants: false,
    flavors: [
      {
        slug: 'astro-creatine',
        flavorName: 'Natural Taste',
        color: '#00FF88',
        imageUrl:
          'https://res.cloudinary.com/dm4jfxbcs/image/upload/v1782667544/UFO4_nuzyls.png',
      },
    ],
    variantId: '41e83bf4-2c4b-4f87-9019-aca3960f268c',
    sku: 'ASTRO-300G',
  },
  {
    id: 'prod-eaa',
    slug: 'amino-fuel-mango',
    name: 'Amino Fuel EAA 300g',
    tagline: 'Fermented Full-Spectrum EAAs & Cellular Electrolytes',
    category: 'Amino Acids',
    basePrice: 39.90,
    color: '#FF8C00',
    imageUrl:
      'https://res.cloudinary.com/dm4jfxbcs/image/upload/v1782667544/UFO5_l42elt.png',
    hasVariants: true,
    flavors: [
      {
        slug: 'amino-fuel-mango',
        flavorName: 'Mango',
        color: '#FF8C00',
        imageUrl:
          'https://res.cloudinary.com/dm4jfxbcs/image/upload/v1782667544/UFO5_l42elt.png',
      },
      {
        slug: 'amino-fuel-blue-raspberry',
        flavorName: 'Blue Raspberry',
        color: '#00CFFF',
        imageUrl:
          'https://res.cloudinary.com/dm4jfxbcs/image/upload/v1782667544/UFO6_uhxvep.png',
      },
    ],
    variantId: 'e36a0dc0-9d4f-4d57-81b7-12cb7e61d43a',
    sku: 'AMNO-MANGO-300G',
  },
  {
    id: 'prod-blast',
    slug: 'blast-pre-workout-energy',
    name: 'Blast Pre-Workout 300g',
    tagline: 'High-Impact Neuro-Drive, Nitric Oxide Pumps & Zero Crash',
    category: 'Pre-Workout',
    basePrice: 39.90,
    color: '#FF2244',
    imageUrl:
      'https://res.cloudinary.com/dm4jfxbcs/image/upload/v1782667544/UFO3_bfwhlr.png',
    hasVariants: true,
    flavors: [
      {
        slug: 'blast-pre-workout-energy',
        flavorName: 'Energy Drink',
        color: '#FF2244',
        imageUrl:
          'https://res.cloudinary.com/dm4jfxbcs/image/upload/v1782667544/UFO3_bfwhlr.png',
      },
      {
        slug: 'blast-pre-workout-blue',
        flavorName: 'Blue Raspberry',
        color: '#00CFFF',
        imageUrl:
          'https://res.cloudinary.com/dm4jfxbcs/image/upload/v1782667544/UFO2_hnupdu.png',
      },
    ],
    variantId: 'd17fe515-1b23-47f5-a017-898d03ab7ccc',
    sku: 'BLAST-ENERGY-300G',
  },
  {
    id: 'prod-collagen',
    slug: 'astro-collagen-peptide',
    name: 'Nova Marine Collagen 300g',
    tagline: 'Hydrolyzed Bioactive Marine Collagen Peptides for Joints & Skin',
    category: 'Marine Collagen',
    basePrice: 39.90,
    color: '#FF2244',
    imageUrl:
      'https://res.cloudinary.com/dm4jfxbcs/image/upload/v1794316727/NEW_NOVA_COLLAGEN_1_y4eyr2.png',
    hasVariants: false,
    flavors: [
      {
        slug: 'astro-collagen-peptide',
        flavorName: 'Tropical Fruits',
        color: '#FF2244',
        imageUrl:
          'https://res.cloudinary.com/dm4jfxbcs/image/upload/v1794316727/NEW_NOVA_COLLAGEN_1_y4eyr2.png',
      },
    ],
    variantId: '4ecb2866-9067-45cc-bddf-1e79b549c64d',
    sku: 'COL-300G',
  },
  {
    id: 'prod-magnesium',
    slug: 'magnesium',
    name: 'Magnesium 90 Capsules',
    tagline: 'Chelated Bisglycinate for Neuromuscular Rest & Deep Sleep',
    category: 'Magnesium',
    basePrice: 34.90,
    color: '#00FF88',
    imageUrl:
      'https://res.cloudinary.com/dm4jfxbcs/image/upload/v1794316725/Flacon_de_magne%CC%81sium_au_design_extraterrestre_1_oo2r28.png',
    hasVariants: false,
    flavors: [
      {
        slug: 'magnesium',
        flavorName: '90 Vegan Caps',
        color: '#00FF88',
        imageUrl:
          'https://res.cloudinary.com/dm4jfxbcs/image/upload/v1794316725/Flacon_de_magne%CC%81sium_au_design_extraterrestre_1_oo2r28.png',
      },
    ],
    variantId: 'b08be57c-17b4-49d3-a2bc-df41cb88ad4b',
    sku: 'SKU-MAGNESIUM-960',
  },
]

async function loadStackData() {
  const supabase = createClient()

  // 1. Load active tiers from DB or fallback
  let tiers: StackTier[] = DEFAULT_STACK_TIERS
  try {
    const { data: dbTiers } = await (supabase.from('stack_tiers') as any)
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (dbTiers && dbTiers.length > 0) {
      tiers = dbTiers.map((t: any) => ({
        minUnits: t.min_units,
        percent: t.discount_percent,
        label: `${t.discount_percent}% OFF`,
        badge: `Save ${t.discount_percent}%`,
      }))
    }
  } catch {
    // Graceful fallback to default tiers
  }

  // 2. Load presets from DB or fallback
  let presets: PresetStackDef[] = DEFAULT_PRESET_STACKS
  try {
    const { data: dbPresets } = await (supabase.from('preset_stacks') as any)
      .select(`
        *,
        items:preset_stack_items(product_slug, variant_sku, quantity, sort_order)
      `)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (dbPresets && dbPresets.length > 0) {
      presets = dbPresets.map((p: any) => {
        const matchingDefault = DEFAULT_PRESET_STACKS.find((dp) => dp.slug === p.slug)
        return {
          id: p.id,
          slug: p.slug,
          name: p.name,
          tagline: p.tagline || matchingDefault?.tagline || '',
          description: p.description || matchingDefault?.description || '',
          badge: p.badge || matchingDefault?.badge || '',
          discountPercent: p.discount_percent,
          items: matchingDefault?.items || [],
        }
      })
    }
  } catch {
    // Graceful fallback to default presets
  }

  return {
    products: DEFAULT_STACK_PRODUCTS,
    tiers,
    presets,
  }
}

export default async function BuildYourStackPage() {
  const { products, tiers, presets } = await loadStackData()

  // Structured Data Schema for Search Engines
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'UFO LABZ Custom Protocol Stack',
    description:
      'Curate your personal protocol of clinical-grade Swiss supplements with automatic volume discounts up to 15% off.',
    brand: {
      '@type': 'Brand',
      name: 'UFO LABZ',
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'CHF',
      lowPrice: 25.87,
      highPrice: 129.61,
      offerCount: products.length,
      availability: 'https://schema.org/PreOrder',
      url: 'https://ufolabz.com/build-your-stack',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <BuildYourStackClient
        products={products}
        initialTiers={tiers}
        initialPresets={presets}
      />
    </>
  )
}
