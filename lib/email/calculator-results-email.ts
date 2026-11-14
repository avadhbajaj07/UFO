/**
 * UFO LABZ — Calculator Results Email Template (Phase 2)
 * High-conversion responsive email template engineered for 600px width,
 * cross-client compatibility (Gmail, Apple Mail, Outlook), dark alien aesthetics.
 */

import { Locale } from '@/lib/i18n/config'
import { SupportedCurrency } from '@/lib/config/pricing'

export interface CalculatorEmailPayload {
  calculatorSlug: string
  calculatorName: string
  heroNumber: string
  heroUnit: string
  heroInterpretation: string
  progressPercent?: number
  inputs: Record<string, string | number>
  locale: Locale
  currency: SupportedCurrency
  doubleOptInToken?: string
  appUrl?: string
}

interface ProductRec {
  name: string
  slug: string
  price: string
  image: string
  tag: string
}

const PRODUCT_RECS: Record<string, ProductRec[]> = {
  protein: [
    {
      name: 'AMINO FUEL EAA',
      slug: 'amino-fuel-mango',
      price: 'CHF 29.93',
      image: 'https://qhwbmniqplygipszkhcb.supabase.co/storage/v1/object/public/product-images/amino-fuel-mango.png',
      tag: 'Optimal Protein Synthesis',
    },
    {
      name: 'ASTRO CREATINE PURE',
      slug: 'astro-creatine',
      price: 'CHF 22.43',
      image: 'https://qhwbmniqplygipszkhcb.supabase.co/storage/v1/object/public/product-images/astro-creatine.png',
      tag: 'Cellular Hydration & ATP',
    },
  ],
  creatine: [
    {
      name: 'ASTRO CREATINE PURE',
      slug: 'astro-creatine',
      price: 'CHF 22.43',
      image: 'https://qhwbmniqplygipszkhcb.supabase.co/storage/v1/object/public/product-images/astro-creatine.png',
      tag: '100% Ultra-Pure Creapure',
    },
    {
      name: 'BLAST PRE-WORKOUT',
      slug: 'blast-pre-workout-energy',
      price: 'CHF 29.93',
      image: 'https://qhwbmniqplygipszkhcb.supabase.co/storage/v1/object/public/product-images/blast-pre-workout.png',
      tag: 'Laser Focus & Pump',
    },
  ],
  tdee: [
    {
      name: 'BLAST PRE-WORKOUT',
      slug: 'blast-pre-workout-energy',
      price: 'CHF 29.93',
      image: 'https://qhwbmniqplygipszkhcb.supabase.co/storage/v1/object/public/product-images/blast-pre-workout.png',
      tag: 'Metabolic Energy & Focus',
    },
    {
      name: 'AMINO FUEL EAA',
      slug: 'amino-fuel-mango',
      price: 'CHF 29.93',
      image: 'https://qhwbmniqplygipszkhcb.supabase.co/storage/v1/object/public/product-images/amino-fuel-mango.png',
      tag: 'Zero Calorie Muscle Shield',
    },
  ],
  macro: [
    {
      name: 'AMINO FUEL EAA',
      slug: 'amino-fuel-mango',
      price: 'CHF 29.93',
      image: 'https://qhwbmniqplygipszkhcb.supabase.co/storage/v1/object/public/product-images/amino-fuel-mango.png',
      tag: 'Preserves Lean Mass',
    },
    {
      name: 'COSMIC MAGNESIUM GLYCINATE',
      slug: 'magnesium',
      price: 'CHF 26.18',
      image: 'https://qhwbmniqplygipszkhcb.supabase.co/storage/v1/object/public/product-images/magnesium.png',
      tag: 'Glycogen & Nutrient Partitioning',
    },
  ],
  water: [
    {
      name: 'COSMIC MAGNESIUM GLYCINATE',
      slug: 'magnesium',
      price: 'CHF 26.18',
      image: 'https://qhwbmniqplygipszkhcb.supabase.co/storage/v1/object/public/product-images/magnesium.png',
      tag: 'Essential Electrolyte Balance',
    },
    {
      name: 'AMINO FUEL EAA',
      slug: 'amino-fuel-mango',
      price: 'CHF 29.93',
      image: 'https://qhwbmniqplygipszkhcb.supabase.co/storage/v1/object/public/product-images/amino-fuel-mango.png',
      tag: 'Rapid Cellular Hydration',
    },
  ],
  deficit: [
    {
      name: 'NOVA MARINE PEPTIDES COLLAGEN',
      slug: 'astro-collagen-peptide',
      price: 'CHF 29.93',
      image: 'https://qhwbmniqplygipszkhcb.supabase.co/storage/v1/object/public/product-images/nova-marine-collagen.png',
      tag: 'Joint Support While Cutting',
    },
    {
      name: 'AMINO FUEL EAA',
      slug: 'amino-fuel-mango',
      price: 'CHF 29.93',
      image: 'https://qhwbmniqplygipszkhcb.supabase.co/storage/v1/object/public/product-images/amino-fuel-mango.png',
      tag: 'Anti-Catabolic Protection',
    },
  ],
}

function getInsights(slug: string, locale: Locale): string[] {
  const isFr = locale === 'fr'
  switch (slug) {
    case 'protein':
      return isFr
        ? [
            'Répartissez cet apport sur 3 à 5 prises espacées de 3–4 heures pour maximiser la synthèse protéique.',
            'Visez 20 à 35 g de protéines de haute valeur biologique (ou EAAs) après chaque séance d’entraînement.',
            'En période de restriction calorique (sèche), restez dans la fourchette haute pour préserver votre masse maigre.',
          ]
        : [
            'Distribute this intake across 3 to 5 meals spaced 3–4 hours apart to maximize muscle protein synthesis.',
            'Aim for 20 to 35 g of high biological value protein (or EAAs) within your post-workout window.',
            'During a calorie deficit or cutting phase, target the higher end to safeguard lean tissue.',
          ]
    case 'creatine':
      return isFr
        ? [
            'La phase de charge (20 g / jour) est optionnelle : 3 à 5 g quotidiens saturent vos réserves intramusculaires en 28 jours.',
            'Prenez votre créatine de préférence avec une source de glucides ou après l’entraînement pour optimiser la rétention.',
            'La régularité quotidienne est la clé : prenez-la même les jours de repos.',
          ]
        : [
            'A loading phase (20g/day) is optional: 3 to 5g daily will fully saturate muscle phosphocreatine stores within 28 days.',
            'Consume with a carbohydrate source or post-workout for optimal cellular uptake.',
            'Consistency is king: keep taking your daily dose on both training and rest days.',
          ]
    case 'tdee':
    case 'deficit':
      return isFr
        ? [
            'Votre métabolisme de base (BMR) représente 60 à 70 % de votre dépense totale d’énergie.',
            'Un déficit modéré de 300 à 500 kcal/jour garantit une perte de graisse constante sans perte de force.',
            'Ajustez vos calories toutes les 2 à 3 semaines selon l’évolution de votre poids moyen hebdomadaire.',
          ]
        : [
            'Your Basal Metabolic Rate (BMR) accounts for 60 to 70% of your total daily energy expenditure.',
            'A moderate deficit of 300 to 500 kcal/day ensures steady fat loss while sparing athletic performance.',
            'Re-evaluate every 2–3 weeks based on your weekly average weight trend.',
          ]
    default:
      return isFr
        ? [
            'Ce résultat repose sur des formules biométriques validées par la recherche scientifique.',
            'Associez ces données à un programme d’entraînement structuré et un sommeil de 7 à 9 heures.',
            'La nutrition de précision optimise vos temps de récupération et vos adaptations neuromusculaires.',
          ]
        : [
            'This calculation is based on validated peer-reviewed physiological formulas.',
            'Pair these targets with progressive resistance training and 7–9 hours of deep sleep.',
            'Precision nutrition accelerates cellular recovery and neuromuscular adaptations.',
          ]
  }
}

export function renderCalculatorResultsEmail(payload: CalculatorEmailPayload): {
  subject: string
  html: string
} {
  const {
    calculatorSlug,
    calculatorName,
    heroNumber,
    heroUnit,
    heroInterpretation,
    progressPercent = 70,
    inputs,
    locale,
    currency,
    doubleOptInToken,
    appUrl = 'https://ufolabz.com',
  } = payload

  const isFr = locale === 'fr'
  const isDe = locale === 'de'
  const isIt = locale === 'it'

  const subject = isFr
    ? `Vos résultats ${calculatorName} sont prêts 🛸`
    : isDe
    ? `Deine Ergebnisse für ${calculatorName} sind bereit 🛸`
    : isIt
    ? `I tuoi risultati per ${calculatorName} sono pronti 🛸`
    : `Your ${calculatorName} results are ready 🛸`

  const preheader = isFr
    ? `Vos résultats ${calculatorName} : ${heroNumber} ${heroUnit}. Votre plan d'action UFO LABZ en 1 minute.`
    : `Your ${calculatorName} results: ${heroNumber} ${heroUnit}. Your UFO LABZ action plan inside.`

  const recs = PRODUCT_RECS[calculatorSlug] || PRODUCT_RECS.protein
  const insights = getInsights(calculatorSlug, locale)

  const inputRows = Object.entries(inputs)
    .map(
      ([key, val]) => `
      <tr>
        <td style="padding: 7px 12px; color: #94A3B8; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.06); text-transform: capitalize;">${escapeHtml(
          key.replace(/_/g, ' ')
        )}</td>
        <td style="padding: 7px 12px; color: #F8FAFC; font-size: 13px; font-weight: 600; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.06); font-family: monospace;">${escapeHtml(
          String(val)
        )}</td>
      </tr>
    `
    )
    .join('')

  const insightsHtml = insights
    .map(
      (ins) => `
      <div style="display: flex; gap: 12px; margin-bottom: 10px; align-items: flex-start;">
        <span style="color: #1FFFB3; font-weight: bold; font-size: 14px; line-height: 20px;">✓</span>
        <span style="color: #CBD5E1; font-size: 13px; line-height: 20px;">${escapeHtml(
          ins
        )}</span>
      </div>
    `
    )
    .join('')

  const productCardsHtml = recs
    .map(
      (p) => `
      <td width="50%" style="padding: 6px; vertical-align: top;">
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 14px; text-align: center;">
          <img src="${p.image}" alt="${escapeHtml(
        p.name
      )}" style="width: 100px; height: 100px; object-fit: contain; margin: 0 auto 10px;" />
          <div style="color: #1FFFB3; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px;">${escapeHtml(
            p.tag
          )}</div>
          <div style="color: #FFFFFF; font-size: 13px; font-weight: 700; margin-bottom: 6px; line-height: 16px;">${escapeHtml(
            p.name
          )}</div>
          <div style="color: #94A3B8; font-size: 12px; font-family: monospace; font-weight: bold; margin-bottom: 10px;">${
            p.price
          }</div>
          <a href="${appUrl}/products/${p.slug}?utm_source=calculator_email&utm_medium=email&utm_campaign=${calculatorSlug}" style="display: inline-block; background: #0E1322; border: 1px solid rgba(31,255,179,0.3); color: #1FFFB3; font-size: 11px; font-weight: 700; padding: 6px 12px; border-radius: 6px; text-decoration: none;">
            ${isFr ? 'Découvrir' : 'View Formula'}
          </a>
        </div>
      </td>
    `
    )
    .join('')

  const otherCalculators = [
    { name: isFr ? 'Intake Protéines' : 'Protein Intake', slug: 'protein-calculator' },
    { name: isFr ? 'Calculateur TDEE' : 'TDEE & Calories', slug: 'tdee-calculator' },
    { name: isFr ? 'Dosage Créatine' : 'Creatine Dosage', slug: 'creatine-calculator' },
  ].filter((c) => !c.slug.includes(calculatorSlug))

  const otherTilesHtml = otherCalculators
    .map(
      (c) => `
      <td width="50%" style="padding: 4px;">
        <a href="${appUrl}/tools/${c.slug}?utm_source=calculator_email&utm_medium=internal_tile" style="display: block; background: #0A0E1A; border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 10px; text-align: center; color: #CBD5E1; text-decoration: none; font-size: 12px; font-weight: 600;">
          ⚡ ${escapeHtml(c.name)}
        </a>
      </td>
    `
    )
    .join('')

  const doubleOptInSection = doubleOptInToken
    ? `
    <!-- Double Opt-in Confirm Block -->
    <div style="background: rgba(31, 255, 179, 0.08); border: 1px solid rgba(31, 255, 179, 0.3); border-radius: 12px; padding: 16px; margin: 24px 0; text-align: center;">
      <p style="color: #FFFFFF; font-size: 13px; font-weight: 600; margin: 0 0 10px;">
        ${
          isFr
            ? '🚀 Confirmez votre adresse pour recevoir nos guides nutrition & offres VIP UFO LABZ'
            : '🚀 Confirm your subscription to receive our VIP nutrition guides & private drops'
        }
      </p>
      <a href="${appUrl}/email/confirm/${doubleOptInToken}" style="display: inline-block; background: #1FFFB3; color: #06080F; font-size: 13px; font-weight: 800; padding: 10px 24px; border-radius: 8px; text-decoration: none; letter-spacing: 0.03em;">
        ${isFr ? 'Confirmer mon inscription ✓' : 'Confirm Subscription ✓'}
      </a>
    </div>
  `
    : ''

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #06080F; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; -webkit-font-smoothing: antialiased; color: #E2E8F0;">
  <!-- Preheader preview text -->
  <div style="display: none; max-height: 0px; overflow: hidden; opacity: 0; font-size: 1px; line-height: 1px;">
    ${escapeHtml(preheader)}
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #06080F; padding: 24px 12px;">
    <tr>
      <td align="center">
        <!-- Main Email Container (600px max) -->
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #0A0E1A; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.8);">

          <!-- Brand Header -->
          <tr>
            <td style="padding: 24px 28px 16px; border-bottom: 1px solid rgba(255,255,255,0.06); text-align: center;">
              <img src="https://qhwbmniqplygipszkhcb.supabase.co/storage/v1/object/public/product-images/ufo-logo-new.png" alt="UFO LABZ" width="130" style="width: 130px; height: auto; object-fit: contain; margin-bottom: 6px;" />
              <div style="color: #94A3B8; font-size: 10px; font-family: monospace; letter-spacing: 0.15em; text-transform: uppercase;">Alien Performance Technology · Geneva, Switzerland</div>
            </td>
          </tr>

          <!-- Hero Result Card -->
          <tr>
            <td style="padding: 28px 24px 20px;">
              <div style="background: radial-gradient(circle at 50% 0%, rgba(31,255,179,0.15) 0%, rgba(10,14,26,0.95) 75%); border: 1px solid rgba(31,255,179,0.3); border-radius: 16px; padding: 24px 20px; text-align: center;">
                <div style="color: #1FFFB3; font-size: 11px; font-weight: 800; font-family: monospace; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 6px;">
                  ${isFr ? 'VOS RÉSULTATS OFFICIELS' : 'OFFICIAL SCIENTIFIC RESULT'}
                </div>
                <div style="color: #FFFFFF; font-size: 18px; font-weight: 700; margin-bottom: 16px;">
                  ${escapeHtml(calculatorName)}
                </div>

                <!-- Big Result Number -->
                <div style="font-size: 48px; font-weight: 900; color: #1FFFB3; font-family: -apple-system, BlinkMacSystemFont, monospace; line-height: 1; margin-bottom: 4px; text-shadow: 0 0 20px rgba(31,255,179,0.4);">
                  ${escapeHtml(heroNumber)}
                </div>
                <div style="color: #94A3B8; font-size: 14px; font-family: monospace; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 14px;">
                  ${escapeHtml(heroUnit)}
                </div>

                <!-- Gauge Progress Bar -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 14px;">
                  <tr>
                    <td style="background: rgba(255,255,255,0.06); border-radius: 6px; height: 8px; overflow: hidden;">
                      <div style="background: linear-gradient(90deg, #1FFFB3, #00FF88); width: ${Math.min(
                        100,
                        Math.max(10, progressPercent)
                      )}%; height: 8px; border-radius: 6px;"></div>
                    </td>
                  </tr>
                </table>

                <div style="color: #CBD5E1; font-size: 13px; line-height: 18px; max-width: 440px; margin: 0 auto;">
                  ${escapeHtml(heroInterpretation)}
                </div>
              </div>
            </td>
          </tr>

          <!-- Your Inputs Recap -->
          <tr>
            <td style="padding: 0 24px 20px;">
              <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 16px;">
                <div style="color: #FFFFFF; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 12px;">
                  ${isFr ? 'Vos Données Saisies' : 'Your Parameter Inputs'}
                </div>
                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                  ${inputRows}
                </table>
              </div>
            </td>
          </tr>

          <!-- What It Means: Insights -->
          <tr>
            <td style="padding: 0 24px 20px;">
              <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 16px;">
                <div style="color: #FFFFFF; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 12px;">
                  ${isFr ? 'Ce Que Cela Signifie Pour Vos Objectifs' : 'Key Performance Takeaways'}
                </div>
                ${insightsHtml}
              </div>
            </td>
          </tr>

          ${doubleOptInSection}

          <!-- Recommended Supplement Protocol -->
          <tr>
            <td style="padding: 0 24px 20px;">
              <div style="color: #FFFFFF; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 12px; text-align: center;">
                ${isFr ? 'Protocoles Recommandés Pour Votre Profil' : 'Recommended Supplement Protocol'}
              </div>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  ${productCardsHtml}
                </tr>
              </table>
            </td>
          </tr>

          <!-- Primary Stack CTA -->
          <tr>
            <td style="padding: 0 24px 24px; text-align: center;">
              <a href="${appUrl}/build-your-stack?utm_source=calculator_email&utm_medium=email&utm_campaign=stack_cta" style="display: block; background: #1FFFB3; color: #06080F; font-size: 14px; font-weight: 800; padding: 14px 28px; border-radius: 10px; text-decoration: none; text-transform: uppercase; letter-spacing: 0.05em; box-shadow: 0 8px 24px rgba(31,255,179,0.3);">
                ${isFr ? 'Composez votre Stack & Économisez 15% 🚀' : 'Build Your Stack & Save 15% 🚀'}
              </a>
            </td>
          </tr>

          <!-- Pre-order Strip -->
          <tr>
            <td style="padding: 0 24px 24px;">
              <div style="background: rgba(123,47,190,0.12); border: 1px solid rgba(123,47,190,0.3); border-radius: 10px; padding: 12px 16px; text-align: center;">
                <span style="color: #C850FF; font-weight: 800; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em;">
                  ${
                    isFr
                      ? 'PRÉCOMMANDE LOT 01 — Expédition dès la 2e semaine de décembre 2026. Livraison offerte en Suisse dès CHF 75 (Europe dès €50).'
                      : 'PRE-ORDER BATCH 01 — Ships 2nd week of December 2026. Free delivery in Switzerland over CHF 75 (Europe over €50).'
                  }
                </span>
              </div>
            </td>
          </tr>

          <!-- Explore Next Tiles -->
          <tr>
            <td style="padding: 0 24px 24px;">
              <div style="color: #94A3B8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px; text-align: center;">
                ${isFr ? 'Calculateurs Complémentaires' : 'Explore Related Calculators'}
              </div>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  ${otherTilesHtml}
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 28px; background: #06080F; border-top: 1px solid rgba(255,255,255,0.06); text-align: center;">
              <!-- Social links -->
              <div style="margin-bottom: 14px;">
                <a href="https://instagram.com/ufolabz_official" style="color: #94A3B8; text-decoration: none; font-size: 11px; margin: 0 8px; font-weight: 600;">Instagram</a>
                <span style="color: #334155;">·</span>
                <a href="https://facebook.com/ufolabz" style="color: #94A3B8; text-decoration: none; font-size: 11px; margin: 0 8px; font-weight: 600;">Facebook</a>
                <span style="color: #334155;">·</span>
                <a href="https://youtube.com/@ufolabz" style="color: #94A3B8; text-decoration: none; font-size: 11px; margin: 0 8px; font-weight: 600;">YouTube</a>
              </div>

              <!-- Medical disclaimer -->
              <p style="color: #64748B; font-size: 11px; line-height: 16px; margin: 0 0 12px; max-width: 480px; margin-left: auto; margin-right: auto;">
                ${
                  isFr
                    ? 'Avis légal : Ces estimations et recommandations sont indicatives et basées sur des données physiologiques générales. Elles ne remplacent en aucun cas un avis médical ou un bilan personnalisé.'
                    : 'Disclaimer: These scientific estimates are informational and do not substitute for professional medical advice, diagnosis, or personalized dietary consultation.'
                }
              </p>

              <!-- Company info & unsubscribe -->
              <p style="color: #475569; font-size: 11px; line-height: 16px; margin: 0 0 8px;">
                UFO LABZ GmbH · Rue de Genève, 1200 Genève, Switzerland<br />
                <a href="mailto:support@ufolabz.com" style="color: #94A3B8; text-decoration: underline;">support@ufolabz.com</a>
              </p>
              <p style="color: #475569; font-size: 10px; margin: 0 0 12px;">
                <a href="${appUrl}/unsubscribe" style="color: #64748B; text-decoration: underline;">${
                  isFr ? 'Se désinscrire' : 'Unsubscribe'
                }</a> · 
                <a href="${appUrl}/pages/privacy" style="color: #64748B; text-decoration: underline;">${
                  isFr ? 'Politique de confidentialité' : 'Privacy Policy'
                }</a>
              </p>

              <div style="color: #334155; font-size: 10px; font-family: monospace;">
                Architected on Earth by Avadh Bajaj 🛸
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  return { subject, html }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
