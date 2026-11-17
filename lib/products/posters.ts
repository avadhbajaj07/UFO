// lib/products/posters.ts
// Metadata and helper utilities for official UFO LABZ product infographic posters (6 posters per product)

export interface ProductPosterMeta {
  index: number; // 1 to 6
  tag: string;
  title: string;
  subtitle: string;
  localPath: string;
}

export const PRODUCT_POSTERS_MAP: Record<string, ProductPosterMeta[]> = {
  'astro-creatine': [
    {
      index: 1,
      tag: 'BENEFITS',
      title: 'THE BENEFITS OF CREATINE',
      subtitle: 'Swiss Engineered Micronized Creatine Monohydrate for Peak Power',
      localPath: '/images/products/posters/astro-creatine/1.png',
    },
    {
      index: 2,
      tag: 'SUPPLEMENT FACTS',
      title: 'SUPPLEMENT FACTS & PURITY',
      subtitle: '100% Pure Creatine Monohydrate, Zero Fillers, Creapure Quality Standard',
      localPath: '/images/products/posters/astro-creatine/2.png',
    },
    {
      index: 3,
      tag: 'HOW TO USE',
      title: 'HOW TO USE ASTRO CREATINE',
      subtitle: 'Recommended Daily Dosage, Mixing Protocol & Timing',
      localPath: '/images/products/posters/astro-creatine/3.png',
    },
    {
      index: 4,
      tag: 'STRENGTH',
      title: 'BUILDS STRENGTH & POWER',
      subtitle: 'Accelerates Cellular ATP Regeneration in High-Intensity Resistance Training',
      localPath: '/images/products/posters/astro-creatine/4.png',
    },
    {
      index: 5,
      tag: 'GROWTH',
      title: 'SUPPORTS MUSCLE GROWTH',
      subtitle: 'Enhances Intracellular Hydration & Protein Synthesis for Lean Mass',
      localPath: '/images/products/posters/astro-creatine/5.png',
    },
    {
      index: 6,
      tag: 'ENDURANCE',
      title: 'MORE ENDURANCE & RECOVERY',
      subtitle: 'Delays Neuromuscular Fatigue and Accelerates Post-Session Recovery',
      localPath: '/images/products/posters/astro-creatine/6.png',
    },
  ],

  'amino-fuel-mango': [
    {
      index: 1,
      tag: 'BENEFITS',
      title: 'THE BENEFITS OF AMINO FUEL',
      subtitle: 'Complete Spectrum Essential Amino Acids + Cellular Hydration Matrix',
      localPath: '/images/products/posters/amino-fuel-mango/1.png',
    },
    {
      index: 2,
      tag: 'SUPPLEMENT FACTS',
      title: 'SUPPLEMENT FACTS & RATIOS',
      subtitle: 'Clinical EAA Formulation, Natural Mango Flavoring, Zero Added Sugars',
      localPath: '/images/products/posters/amino-fuel-mango/2.png',
    },
    {
      index: 3,
      tag: 'HOW TO USE',
      title: 'HOW TO USE AMINO FUEL',
      subtitle: 'Intra-Workout Hydration & Post-Workout Anabolic Preservation Protocol',
      localPath: '/images/products/posters/amino-fuel-mango/3.png',
    },
    {
      index: 4,
      tag: 'HYDRATION',
      title: 'RAPID CELLULAR HYDRATION',
      subtitle: 'Bio-Available Electrolytes for Optimal Intracellular Fluid Equilibrium',
      localPath: '/images/products/posters/amino-fuel-mango/4.png',
    },
    {
      index: 5,
      tag: 'ANTI-CATABOLIC',
      title: 'PREVENTS MUSCLE BREAKDOWN',
      subtitle: 'Protects Lean Muscle Tissue During Intense Caloric Deficit or Fasted Training',
      localPath: '/images/products/posters/amino-fuel-mango/5.png',
    },
    {
      index: 6,
      tag: 'RECOVERY',
      title: 'FASTER POST-WORKOUT RECOVERY',
      subtitle: 'Reduces Muscle Soreness (DOMS) and Replenishes Amino Acid Pools',
      localPath: '/images/products/posters/amino-fuel-mango/6.png',
    },
  ],

  'amino-fuel-blue-raspberry': [
    {
      index: 1,
      tag: 'BENEFITS',
      title: 'THE BENEFITS OF AMINO FUEL',
      subtitle: 'Complete Spectrum Essential Amino Acids + Cellular Hydration Matrix',
      localPath: '/images/products/posters/amino-fuel-mango/1.png',
    },
    {
      index: 2,
      tag: 'SUPPLEMENT FACTS',
      title: 'SUPPLEMENT FACTS & RATIOS',
      subtitle: 'Clinical EAA Formulation, Blue Raspberry Profile, Zero Added Sugars',
      localPath: '/images/products/posters/amino-fuel-mango/2.png',
    },
    {
      index: 3,
      tag: 'HOW TO USE',
      title: 'HOW TO USE AMINO FUEL',
      subtitle: 'Intra-Workout Hydration & Post-Workout Anabolic Preservation Protocol',
      localPath: '/images/products/posters/amino-fuel-mango/3.png',
    },
    {
      index: 4,
      tag: 'HYDRATION',
      title: 'RAPID CELLULAR HYDRATION',
      subtitle: 'Bio-Available Electrolytes for Optimal Intracellular Fluid Equilibrium',
      localPath: '/images/products/posters/amino-fuel-mango/4.png',
    },
    {
      index: 5,
      tag: 'ANTI-CATABOLIC',
      title: 'PREVENTS MUSCLE BREAKDOWN',
      subtitle: 'Protects Lean Muscle Tissue During Intense Caloric Deficit or Fasted Training',
      localPath: '/images/products/posters/amino-fuel-mango/5.png',
    },
    {
      index: 6,
      tag: 'RECOVERY',
      title: 'FASTER POST-WORKOUT RECOVERY',
      subtitle: 'Reduces Muscle Soreness (DOMS) and Replenishes Amino Acid Pools',
      localPath: '/images/products/posters/amino-fuel-mango/6.png',
    },
  ],

  'blast-pre-workout-energy': [
    {
      index: 1,
      tag: 'BENEFITS',
      title: 'THE BENEFITS OF BLAST',
      subtitle: 'High-Impact Clean Neuro-Energy, Vasodilation & Maximum Workout Output',
      localPath: '/images/products/posters/blast-pre-workout-energy/1.png',
    },
    {
      index: 2,
      tag: 'SUPPLEMENT FACTS',
      title: 'SUPPLEMENT FACTS & DOSING',
      subtitle: 'Full Transparency Clinical Dosing: Citrulline Malate, Beta-Alanine, Caffeine Anhydrous',
      localPath: '/images/products/posters/blast-pre-workout-energy/2.png',
    },
    {
      index: 3,
      tag: 'HOW TO USE',
      title: 'HOW TO USE BLAST PRE-WORKOUT',
      subtitle: 'Pre-Session Protocol: Take 20-30 Minutes Prior to High-Intensity Training',
      localPath: '/images/products/posters/blast-pre-workout-energy/3.png',
    },
    {
      index: 4,
      tag: 'ENERGY',
      title: 'EXPLOSIVE CLEAN ENERGY',
      subtitle: 'Synergistic Neuro-Stimulants for Sustained Drive Without Crashing',
      localPath: '/images/products/posters/blast-pre-workout-energy/4.png',
    },
    {
      index: 5,
      tag: 'PUMPS',
      title: 'MASSIVE MUSCLE PUMPS',
      subtitle: 'Nitric Oxide Precursors Drive Intense Vasodilation & Nutrient Transport',
      localPath: '/images/products/posters/blast-pre-workout-energy/5.png',
    },
    {
      index: 6,
      tag: 'FOCUS',
      title: 'LASER-SHARP FOCUS',
      subtitle: 'Heightened Mind-Muscle Connection and Cognitive Alertness on Heavy Sets',
      localPath: '/images/products/posters/blast-pre-workout-energy/6.png',
    },
  ],

  'blast-pre-workout-blue': [
    {
      index: 1,
      tag: 'BENEFITS',
      title: 'THE BENEFITS OF BLAST',
      subtitle: 'High-Impact Clean Neuro-Energy, Vasodilation & Maximum Workout Output',
      localPath: '/images/products/posters/blast-pre-workout-energy/1.png',
    },
    {
      index: 2,
      tag: 'SUPPLEMENT FACTS',
      title: 'SUPPLEMENT FACTS & DOSING',
      subtitle: 'Full Transparency Clinical Dosing: Citrulline Malate, Beta-Alanine, Blue Electric Profile',
      localPath: '/images/products/posters/blast-pre-workout-energy/2.png',
    },
    {
      index: 3,
      tag: 'HOW TO USE',
      title: 'HOW TO USE BLAST PRE-WORKOUT',
      subtitle: 'Pre-Session Protocol: Take 20-30 Minutes Prior to High-Intensity Training',
      localPath: '/images/products/posters/blast-pre-workout-energy/3.png',
    },
    {
      index: 4,
      tag: 'ENERGY',
      title: 'EXPLOSIVE CLEAN ENERGY',
      subtitle: 'Synergistic Neuro-Stimulants for Sustained Drive Without Crashing',
      localPath: '/images/products/posters/blast-pre-workout-energy/4.png',
    },
    {
      index: 5,
      tag: 'PUMPS',
      title: 'MASSIVE MUSCLE PUMPS',
      subtitle: 'Nitric Oxide Precursors Drive Intense Vasodilation & Nutrient Transport',
      localPath: '/images/products/posters/blast-pre-workout-energy/5.png',
    },
    {
      index: 6,
      tag: 'FOCUS',
      title: 'LASER-SHARP FOCUS',
      subtitle: 'Heightened Mind-Muscle Connection and Cognitive Alertness on Heavy Sets',
      localPath: '/images/products/posters/blast-pre-workout-energy/6.png',
    },
  ],

  'astro-collagen-peptide': [
    {
      index: 1,
      tag: 'BENEFITS',
      title: 'THE BENEFITS OF NOVA COLLAGEN',
      subtitle: 'Pure Hydrolyzed Marine Collagen Peptides for Joint & Tissue Regeneration',
      localPath: '/images/products/posters/astro-collagen-peptide/1.png',
    },
    {
      index: 2,
      tag: 'SUPPLEMENT FACTS',
      title: 'SUPPLEMENT FACTS & COMPOSITION',
      subtitle: 'Type I & III Bioactive Peptides, Zero Odor, Enhanced Hydrolysis for Rapid Uptake',
      localPath: '/images/products/posters/astro-collagen-peptide/2.png',
    },
    {
      index: 3,
      tag: 'HOW TO USE',
      title: 'HOW TO USE NOVA COLLAGEN',
      subtitle: 'Daily Morning or Post-Training Protocol in Coffee, Smoothies or Water',
      localPath: '/images/products/posters/astro-collagen-peptide/3.png',
    },
    {
      index: 4,
      tag: 'JOINTS',
      title: 'JOINT MOBILITY & TISSUE REPAIR',
      subtitle: 'Stimulates Cartilage Chondrocytes and Fortifies Ligamentous Elasticity',
      localPath: '/images/products/posters/astro-collagen-peptide/4.png',
    },
    {
      index: 5,
      tag: 'SKIN & GLOW',
      title: 'SKIN ELASTICITY & HYDRATION',
      subtitle: 'Clinically Proven Cellular Matrix Hydration for Radiant Skin & Stronger Nails',
      localPath: '/images/products/posters/astro-collagen-peptide/5.png',
    },
    {
      index: 6,
      tag: 'TENDONS',
      title: 'CARTILAGE & TENDON FORTIFICATION',
      subtitle: 'Protects Heavy Lifters Against Tendinopathy & Degenerative Stress',
      localPath: '/images/products/posters/astro-collagen-peptide/6.png',
    },
  ],

  'magnesium': [
    {
      index: 1,
      tag: 'BENEFITS',
      title: 'THE BENEFITS OF COSMIC MAGNESIUM',
      subtitle: 'Chelated Bisglycinate for Neuromuscular Relaxation & Deep Restorative Sleep',
      localPath: '/images/products/posters/magnesium/1.png',
    },
    {
      index: 2,
      tag: 'SUPPLEMENT FACTS',
      title: 'SUPPLEMENT FACTS & PURITY',
      subtitle: 'High Elemental Yield, 100% Fully Chelated Bisglycinate, Zero Magnesium Oxide',
      localPath: '/images/products/posters/magnesium/2.png',
    },
    {
      index: 3,
      tag: 'HOW TO USE',
      title: 'HOW TO USE COSMIC MAGNESIUM',
      subtitle: 'Evening Protocol: Take 1-2 Capsules 45 Minutes Before Bedtime',
      localPath: '/images/products/posters/magnesium/3.png',
    },
    {
      index: 4,
      tag: 'SLEEP',
      title: 'DEEP SLEEP & RECOVERY',
      subtitle: 'Regulates GABA Neurotransmitters to Induce Soporific, Deep REM Sleep Stages',
      localPath: '/images/products/posters/magnesium/4.png',
    },
    {
      index: 5,
      tag: 'BIO-AVAILABILITY',
      title: 'ZERO DIGESTIVE DISCOMFORT',
      subtitle: 'Chelated with Glycine Amino Acid to Prevent Laxative Effects & Boost Absorption',
      localPath: '/images/products/posters/magnesium/5.png',
    },
    {
      index: 6,
      tag: 'NERVES & MUSCLE',
      title: 'NEUROMUSCULAR CRAMP RELIEF',
      subtitle: 'Prevents Muscle Spasms, Lowers Cortisol, and Supports Cardiac Health',
      localPath: '/images/products/posters/magnesium/6.png',
    },
  ],
};

/**
 * Returns metadata for all 6 posters for a given product slug.
 */
export function getProductPosters(slug: string): ProductPosterMeta[] {
  return PRODUCT_POSTERS_MAP[slug] || [];
}

/**
 * Ensures that product.images contains all 7 images (tub + 6 posters).
 * If the database images only have the tub render, this automatically appends
 * the 6 poster objects with localized alt text and metadata.
 */
export function ensureProductImages(product: any): any[] {
  if (!product) return [];
  const existingImages: any[] = Array.isArray(product.images) ? [...product.images] : [];
  const posters = getProductPosters(product.slug);

  if (posters.length === 0) return existingImages;

  // Check if posters are already in existing images
  const hasPosters = existingImages.some(
    (img) => (img.url && (img.url.includes('/posters/') || img.url.includes('1.png') || img.url.includes('2.png')))
  );

  if (hasPosters && existingImages.length >= 7) {
    // Already has all posters, return sorted by sort_order
    return existingImages.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  }

  // If posters are not yet present, or partial, let's keep the primary non-poster image
  const nonPosterImages = existingImages.filter(
    (img) => !(img.url && img.url.includes('/posters/'))
  );

  // If no primary image at all, use default tub render
  if (nonPosterImages.length === 0) {
    nonPosterImages.push({
      id: `primary-${product.slug}`,
      product_id: product.id,
      url: `/images/products/${product.slug}.png`,
      is_primary: true,
      sort_order: 0,
      alt: { en: product.name?.en || product.name || 'UFO LABZ' },
    });
  }

  // Append the 6 posters
  const posterImages = posters.map((p, idx) => ({
    id: `poster-${product.slug}-${p.index}`,
    product_id: product.id,
    url: p.localPath,
    is_primary: false,
    sort_order: idx + 2,
    poster_meta: p,
    alt: {
      en: `${p.title} - ${p.subtitle}`,
      fr: `${p.title} - ${p.subtitle}`,
      de: `${p.title} - ${p.subtitle}`,
      it: `${p.title} - ${p.subtitle}`,
    },
  }));

  return [...nonPosterImages, ...posterImages].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
}
