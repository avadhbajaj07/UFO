export const LOCALES = ["en", "fr", "de"] as const;
export type Locale = (typeof LOCALES)[number];

const envDefault = process.env.NEXT_PUBLIC_DEFAULT_LOCALE as Locale | undefined;
/** Locale served WITHOUT a URL prefix. Must match DEFAULT_LOCALE used in next.config.js rewrites. */
export const DEFAULT_LOCALE: Locale = envDefault && LOCALES.includes(envDefault) ? envDefault : "en";

export const TOOL_IDS = ["protein", "tdee", "macro"] as const;
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
};

/** Public URL segment for the tools hub, per language. */
export const SEGMENT: Record<Locale, string> = { en: "tools", fr: "outils", de: "tools" };

export const isLocale = (x: string): x is Locale => (LOCALES as readonly string[]).includes(x);

export const prefix = (l: Locale) => (l === DEFAULT_LOCALE ? "" : `/${l}`);
export const homePath = (l: Locale) => prefix(l) || "/";
export const hubPath = (l: Locale) => `${prefix(l)}/${SEGMENT[l]}`;
export const toolPath = (l: Locale, id: ToolId) => `${hubPath(l)}/${TOOLS[id].slugs[l]}`;

export function toolFromSlug(l: Locale, slug: string): ToolId | null {
  return TOOL_IDS.find((id) => TOOLS[id].slugs[l] === slug) ?? null;
}
