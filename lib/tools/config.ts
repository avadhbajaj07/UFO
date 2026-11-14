export const LOCALES = ["fr", "en", "de", "it"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "fr";

export const TOOL_IDS = [
  "protein", "tdee", "macro",
  "bmi", "bodyfat", "lbm", "orm", "water", "deficit", "creatine",
] as const;
export type ToolId = (typeof TOOL_IDS)[number];

export const TOOLS: Record<ToolId, { slugs: Record<Locale, string>; related: ToolId[] }> = {
  protein: {
    slugs: { fr: "calculateur-proteines", en: "protein-calculator", de: "protein-rechner", it: "calcolatore-proteine" },
    related: ["tdee", "macro"],
  },
  tdee: {
    slugs: { fr: "calculateur-tdee", en: "tdee-calculator", de: "tdee-rechner", it: "calcolatore-tdee" },
    related: ["macro", "protein"],
  },
  macro: {
    slugs: { fr: "calculateur-macros", en: "macro-calculator", de: "makro-rechner", it: "calcolatore-macro" },
    related: ["tdee", "protein"],
  },
  bmi: {
    slugs: { fr: "calculateur-imc", en: "bmi-calculator", de: "bmi-rechner", it: "calcolatore-imc" },
    related: ["bodyfat", "lbm"],
  },
  bodyfat: {
    slugs: { fr: "calculateur-masse-graisseuse", en: "body-fat-calculator", de: "koerperfett-rechner", it: "calcolatore-grasso-corporeo" },
    related: ["lbm", "bmi"],
  },
  lbm: {
    slugs: { fr: "calculateur-masse-maigre", en: "lean-body-mass-calculator", de: "magermasse-rechner", it: "calcolatore-massa-magra" },
    related: ["bodyfat", "protein"],
  },
  orm: {
    slugs: { fr: "calculateur-1rm", en: "one-rep-max-calculator", de: "einwiederholungsmaximum-rechner", it: "calcolatore-1rm" },
    related: ["protein", "water"],
  },
  water: {
    slugs: { fr: "calculateur-hydratation", en: "water-intake-calculator", de: "wasserhaushalt-rechner", it: "calcolatore-idratazione" },
    related: ["tdee", "orm"],
  },
  deficit: {
    slugs: { fr: "calculateur-deficit-calorique", en: "calorie-deficit-calculator", de: "kaloriendefizit-rechner", it: "calcolatore-deficit-calorico" },
    related: ["tdee", "macro"],
  },
  creatine: {
    slugs: { fr: "calculateur-creatine", en: "creatine-calculator", de: "kreatin-rechner", it: "calcolatore-creatina" },
    related: ["protein", "water"],
  },
};

export const SEGMENT: Record<Locale, string> = { fr: "tools", en: "tools", de: "tools", it: "tools" };

export const isLocale = (x: string): x is Locale => (LOCALES as readonly string[]).includes(x as any);

export const prefix = (l: Locale) => (l === DEFAULT_LOCALE ? "" : `/${l}`);
export const homePath = (l: Locale) => prefix(l) || "/";
export const hubPath = (l: Locale) => `${prefix(l)}/${SEGMENT[l]}`;
export const toolPath = (l: Locale, id: ToolId) => `${hubPath(l)}/${TOOLS[id].slugs[l]}`;

export function toolFromSlug(l: Locale, slug: string): ToolId | null {
  return TOOL_IDS.find((id) => TOOLS[id].slugs[l] === slug) ?? null;
}
