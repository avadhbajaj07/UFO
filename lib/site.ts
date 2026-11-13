import type { Goal } from "./tools/formulas";
import type { Locale } from "./tools/config";

type Product = { name: Record<Locale, string>; href: Record<Locale, string> };
type Preset = {
  name: string;
  url: string;
  accent: string;
  logo: string;
  sameAs: string[];
  reviewer: { name: string; role: string };
  /** grams of protein / active serving in one scoop (used for scoops stat) */
  scoopG: number;
  products: Record<Goal, Product>;
};

const all = (s: string): Record<Locale, string> => ({ en: s, fr: s, de: s });

const PRESETS: Record<"ufolabz" | "nutrifitness", Preset> = {
  ufolabz: {
    name: "UFO LABZ",
    url: "https://ufolabz.com",
    accent: "#00FF88",
    logo: "/images/ufo-logo-new.png",
    sameAs: [
      "https://www.instagram.com/ufolabz_official?igsi=NGR1YWNzcDBhdGx3",
      "https://facebook.com/ufolabz",
    ],
    reviewer: { name: "Marco Scarpantoni", role: "Head of Sports Nutrition & Formulation" },
    scoopG: 25,
    products: {
      maintain: {
        name: { en: "Astro Creatine Pure 300g", fr: "Astro Créatine Pure 300g", de: "Astro Kreatin Pur 300g" },
        href: all("/products/astro-creatine"),
      },
      gain: {
        name: { en: "Blast Pre-Workout Energy 300g", fr: "Blast Pré-Workout Énergie 300g", de: "Blast Pre-Workout Energie 300g" },
        href: all("/products/blast-pre-workout-energy"),
      },
      loss: {
        name: { en: "Amino Fuel EAA Mango 300g", fr: "Amino Fuel EAA Mangue 300g", de: "Amino Fuel EAA Mango 300g" },
        href: all("/products/amino-fuel-mango"),
      },
    },
  },
  nutrifitness: {
    name: "Nutrifitness",
    url: "https://nutrifitness.ch",
    accent: "#c8102e",
    logo: "/logo.png",
    sameAs: [],
    reviewer: { name: "Nutrition Specialist", role: "Nutrition Reviewer" },
    scoopG: 24,
    products: {
      maintain: { name: all("Whey Protein Isolate"), href: all("/boutique") },
      gain: { name: all("Mass Gainer Complex"), href: all("/boutique") },
      loss: { name: all("Diet Whey Lean Matrix"), href: all("/boutique") },
    },
  },
};

const key = process.env.NEXT_PUBLIC_SITE_PRESET === "nutrifitness" ? "nutrifitness" : "ufolabz";
const preset = PRESETS[key];

export const site = {
  ...preset,
  preset: key,
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? preset.url).replace(/\/$/, ""),
};

export const absUrl = (path: string) => `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
