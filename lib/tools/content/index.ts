import type { Locale, ToolId } from "../config";
import { fr } from "./fr";
import { en } from "./en";
import { de } from "./de";
import { it } from "./it";
import { es } from "./es";
import { pt } from "./pt";

export type ToolContent = {
  cardTitle: string;
  cardBlurb: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  /** 2-3 sentence direct answer shown above the calculator (AEO/GEO). */
  answer: string;
  formula: string[];
  tableTitle: string;
  faq: { q: string; a: string }[];
  sources: { label: string; url: string }[];
  /** ISO date. Update whenever you review the page. */
  updated: string;
};

export type LocaleContent = {
  hub: { metaTitle: string; metaDescription: string; h1: string; intro: string; groupNutrition: string; groupStrength: string; groupHydration: string };
  tools: Record<ToolId, ToolContent>;
};

export const CONTENT: Record<Locale, LocaleContent> = { fr, en, de, it, es, pt };
