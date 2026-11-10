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
    title: 'Amino Fuel EAA 300g',
    flavors: [
      {
        slug: 'amino-fuel-mango',
        name: 'Amino Fuel EAA (Mango)',
        flavorName: 'Mango',
        description: 'Tropical Alphonso mango with a crisp, refreshing citrus finish.',
        color: '#FF8C00',
        colorName: 'Mango Orange',
        imageUrl: 'https://res.cloudinary.com/dm4jfxbcs/image/upload/v1782667544/UFO5_l42elt.png',
        badge: 'Popular',
      },
      {
        slug: 'amino-fuel-blue-raspberry',
        name: 'Amino Fuel EAA (Blue Raspberry)',
        flavorName: 'Blue Raspberry',
        description: 'Electrifying cosmic blue raspberry with a balanced, thirst-quenching tang.',
        color: '#00CFFF',
        colorName: 'Electric Blue',
        imageUrl: 'https://res.cloudinary.com/dm4jfxbcs/image/upload/v1782667544/UFO6_uhxvep.png',
        badge: 'Top Rated',
      },
    ],
  },
  blast: {
    familyKey: 'blast',
    title: 'Blast Pre-Workout 300g',
    flavors: [
      {
        slug: 'blast-pre-workout-energy',
        name: 'Blast Pre-Workout (Energy Drink)',
        flavorName: 'Energy Drink',
        description: 'Classic crisp energy kick with subtle citrus zest for maximum training drive.',
        color: '#FF2244',
        colorName: 'Laser Red',
        imageUrl: 'https://res.cloudinary.com/dm4jfxbcs/image/upload/v1782667544/UFO3_bfwhlr.png',
        badge: 'Original Formula',
      },
      {
        slug: 'blast-pre-workout-blue',
        name: 'Blast Pre-Workout (Blue Raspberry)',
        flavorName: 'Blue Raspberry',
        description: 'Hyper-drive blue raspberry infusion engineered for extreme focus and vascular pumps.',
        color: '#00CFFF',
        colorName: 'Neon Blue',
        imageUrl: 'https://res.cloudinary.com/dm4jfxbcs/image/upload/v1782667544/UFO2_hnupdu.png',
        badge: 'Bestseller',
      },
    ],
  },
  creatine: {
    familyKey: 'creatine',
    title: 'Astro Creatine Pure 300g',
    flavors: [
      {
        slug: 'astro-creatine',
        name: 'Astro Creatine Pure',
        flavorName: 'Natural Taste',
        description: '100% pure micronized creatine monohydrate in natural unflavored taste for rapid ATP energy.',
        color: '#00FF88',
        colorName: 'Alien Green',
        imageUrl: 'https://res.cloudinary.com/dm4jfxbcs/image/upload/v1782667544/UFO4_nuzyls.png',
      },
    ],
  },
  collagen: {
    familyKey: 'collagen',
    title: 'Nova Marine Collagen 300g',
    flavors: [
      {
        slug: 'astro-collagen-peptide',
        name: 'Nova Marine Collagen (Tropical Fruit)',
        flavorName: 'Tropical Fruit',
        description: 'Bioactive hydrolysed marine collagen peptides infused with tropical fruits for joints & skin elasticity.',
        color: '#FF2244',
        colorName: 'Tropical Fruit Red',
        imageUrl: 'https://res.cloudinary.com/dm4jfxbcs/image/upload/v1794316727/NEW_NOVA_COLLAGEN_1_y4eyr2.png',
      },
    ],
  },
  magnesium: {
    familyKey: 'magnesium',
    title: 'Magnesium 90 Capsules',
    flavors: [
      {
        slug: 'magnesium',
        name: 'Magnesium 90 Caps',
        flavorName: '90 Vegan Caps',
        description: 'High-absorption chelated magnesium bisglycinate delivered in 90 vegan capsules.',
        color: '#00FF88',
        colorName: 'Alien Green',
        imageUrl: 'https://res.cloudinary.com/dm4jfxbcs/image/upload/v1794316725/Flacon_de_magne%CC%81sium_au_design_extraterrestre_1_oo2r28.png',
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
