export const LOCALES = ["en", "fr", "de"] as const;
export type Locale = (typeof LOCALES)[number];

const envDefault = process.env.NEXT_PUBLIC_DEFAULT_LOCALE as Locale | undefined;
export const DEFAULT_LOCALE: Locale = envDefault && LOCALES.includes(envDefault) ? envDefault : "en";

export const TOOL_IDS = [
  "protein", "tdee", "macro",
  "bmi", "bodyfat", "lbm", "orm", "water", "deficit", "creatine",
] as const;
export type ToolId = (typeof TOOL_IDS)[number];

export const TOOLS: Record<ToolId, { slugs: Record<Locale, string>; related: ToolId[] }> = {
  protein: {
    slugs: { en: "protein-calculator", fr: "calculateur-proteines", de: "protein-rechner" },
    related: ["tdee", "macro"],
  },
  tdee: {
    slugs: { en: "tdee-calculator", fr: "calculateur-tdee", de: "tdee-rechner" },
    related: ["macro", "protein"],
  },
  macro: {
    slugs: { en: "macro-calculator", fr: "calculateur-macros", de: "makro-rechner" },
    related: ["tdee", "protein"],
  },
  bmi: {
    slugs: { en: "bmi-calculator", fr: "calculateur-imc", de: "bmi-rechner" },
    related: ["bodyfat", "lbm"],
  },
  bodyfat: {
    slugs: { en: "body-fat-calculator", fr: "calculateur-masse-graisseuse", de: "koerperfett-rechner" },
    related: ["lbm", "bmi"],
  },
  lbm: {
    slugs: { en: "lean-body-mass-calculator", fr: "calculateur-masse-maigre", de: "magermasse-rechner" },
    related: ["bodyfat", "protein"],
  },
  orm: {
    slugs: { en: "one-rep-max-calculator", fr: "calculateur-1rm", de: "einwiederholungsmaximum-rechner" },
    related: ["protein", "water"],
  },
  water: {
    slugs: { en: "water-intake-calculator", fr: "calculateur-hydratation", de: "wasserhaushalt-rechner" },
    related: ["tdee", "orm"],
  },
  deficit: {
    slugs: { en: "calorie-deficit-calculator", fr: "calculateur-deficit-calorique", de: "kaloriendefizit-rechner" },
    related: ["tdee", "macro"],
  },
  creatine: {
    slugs: { en: "creatine-calculator", fr: "calculateur-creatine", de: "kreatin-rechner" },
    related: ["protein", "water"],
  },
};

export const SEGMENT: Record<Locale, string> = { en: "tools", fr: "outils", de: "tools" };

export const isLocale = (x: string): x is Locale => (LOCALES as readonly string[]).includes(x);

export const prefix = (l: Locale) => (l === DEFAULT_LOCALE ? "" : `/${l}`);
export const homePath = (l: Locale) => prefix(l) || "/";
export const hubPath = (l: Locale) => `${prefix(l)}/${SEGMENT[l]}`;
export const toolPath = (l: Locale, id: ToolId) => `${hubPath(l)}/${TOOLS[id].slugs[l]}`;

export function toolFromSlug(l: Locale, slug: string): ToolId | null {
  return TOOL_IDS.find((id) => TOOLS[id].slugs[l] === slug) ?? null;
}
