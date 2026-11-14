/**
 * Product Flavor Configuration for UFO LABZ
 * Maps products and flavor families so customers can choose their desired flavor from the product page.
 */

export interface ProductFlavor {
  slug: string
  name: string
  flavorName: string
  description: string
  color: string
  colorName: string
  imageUrl: string
  badge?: string
}

export interface ProductFlavorOption extends ProductFlavor {
  isCurrent: boolean
}

export const FLAVOR_FAMILIES: Record<string, { familyKey: string; title: string; flavors: ProductFlavor[] }> = {
  eaa: {
    familyKey: 'eaa',
    title: 'AMINO FUEL EAA',
    flavors: [
      {
        slug: 'amino-fuel-mango',
        name: 'AMINO FUEL EAA',
        flavorName: 'Mango',
        description: 'Tropical Alphonso mango with a crisp, refreshing citrus finish.',
        color: '#FF8C00',
        colorName: 'Mango Orange',
        imageUrl: 'https://qhwbmniqplygipszkhcb.supabase.co/storage/v1/object/public/product-images/amino-fuel-mango.png',
        badge: 'Popular',
      },
      {
        slug: 'amino-fuel-blue-raspberry',
        name: 'AMINO FUEL EAA',
        flavorName: 'Blue Raspberry',
        description: 'Electrifying cosmic blue raspberry with a balanced, thirst-quenching tang.',
        color: '#00CFFF',
        colorName: 'Electric Blue',
        imageUrl: 'https://qhwbmniqplygipszkhcb.supabase.co/storage/v1/object/public/product-images/amino-fuel-blue-raspberry.png',
        badge: 'Top Rated',
      },
    ],
  },
  blast: {
    familyKey: 'blast',
    title: 'BLAST PRE-WORKOUT',
    flavors: [
      {
        slug: 'blast-pre-workout-energy',
        name: 'BLAST PRE-WORKOUT',
        flavorName: 'Energy Drink',
        description: 'Classic crisp energy kick with subtle citrus zest for maximum training drive.',
        color: '#FF2244',
        colorName: 'Laser Red',
        imageUrl: 'https://qhwbmniqplygipszkhcb.supabase.co/storage/v1/object/public/product-images/blast-pre-workout-energy.png',
        badge: 'Original Formula',
      },
      {
        slug: 'blast-pre-workout-blue',
        name: 'BLAST PRE-WORKOUT',
        flavorName: 'Blue Raspberry',
        description: 'Hyper-drive blue raspberry infusion engineered for extreme focus and vascular pumps.',
        color: '#00CFFF',
        colorName: 'Neon Blue',
        imageUrl: 'https://qhwbmniqplygipszkhcb.supabase.co/storage/v1/object/public/product-images/blast-pre-workout-blue.png',
        badge: 'Bestseller',
      },
    ],
  },
  creatine: {
    familyKey: 'creatine',
    title: 'ASTRO CREATINE PURE',
    flavors: [
      {
        slug: 'astro-creatine',
        name: 'ASTRO CREATINE PURE',
        flavorName: 'Natural Taste',
        description: '100% pure micronized creatine monohydrate in natural unflavored taste for rapid ATP energy.',
        color: '#00FF88',
        colorName: 'Alien Green',
        imageUrl: 'https://qhwbmniqplygipszkhcb.supabase.co/storage/v1/object/public/product-images/astro-creatine.png',
      },
    ],
  },
  collagen: {
    familyKey: 'collagen',
    title: 'NOVA MARINE PEPTIDES COLLAGEN',
    flavors: [
      {
        slug: 'astro-collagen-peptide',
        name: 'NOVA MARINE PEPTIDES COLLAGEN',
        flavorName: 'Tropical Fruits',
        description: 'Bioactive hydrolysed marine collagen peptides infused with tropical fruits for joints & skin elasticity.',
        color: '#FF2244',
        colorName: 'Tropical Fruits Red',
        imageUrl: 'https://qhwbmniqplygipszkhcb.supabase.co/storage/v1/object/public/product-images/nova-marine-collagen.png',
      },
    ],
  },
  magnesium: {
    familyKey: 'magnesium',
    title: 'COSMIC MAGNESIUM GLYCINATE',
    flavors: [
      {
        slug: 'magnesium',
        name: 'COSMIC MAGNESIUM GLYCINATE',
        flavorName: '90 Vegan Caps',
        description: 'High-absorption chelated magnesium bisglycinate delivered in 90 vegan capsules.',
        color: '#00FF88',
        colorName: 'Alien Green',
        imageUrl: 'https://qhwbmniqplygipszkhcb.supabase.co/storage/v1/object/public/product-images/magnesium.png',
      },
    ],
  },
}

/**
 * Returns all flavor options for a given product slug.
 * Returns only families with more than 1 flavor when hasMultipleOnly is true.
 */
export function getProductFlavors(currentSlug: string): {
  familyTitle: string
  hasMultipleFlavors: boolean
  flavors: ProductFlavorOption[]
  currentFlavor: ProductFlavorOption | null
} {
  const normalized = (currentSlug || '').toLowerCase().trim()

  for (const family of Object.values(FLAVOR_FAMILIES)) {
    const isMember = family.flavors.some(
      (f) =>
        f.slug.toLowerCase() === normalized ||
        (f.slug === 'astro-collagen-peptide' && normalized === 'astro-collagen')
    )

    if (isMember) {
      const flavorsWithCurrent: ProductFlavorOption[] = family.flavors.map((f) => {
        const isCurrent =
          f.slug.toLowerCase() === normalized ||
          (f.slug === 'astro-collagen-peptide' && normalized === 'astro-collagen')
        return {
          ...f,
          isCurrent,
        }
      })

      const currentFlavor = flavorsWithCurrent.find((f) => f.isCurrent) || flavorsWithCurrent[0]

      return {
        familyTitle: family.title,
        hasMultipleFlavors: family.flavors.length > 1,
        flavors: flavorsWithCurrent,
        currentFlavor,
      }
    }
  }

  return {
    familyTitle: '',
    hasMultipleFlavors: false,
    flavors: [],
    currentFlavor: null,
  }
}
