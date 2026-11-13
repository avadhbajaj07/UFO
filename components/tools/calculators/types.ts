import type { Locale } from "@/lib/tools/config";
import type { Goal } from "@/lib/tools/formulas";
import type { UI } from "@/lib/tools/ui-strings";

export type CalcProps = {
  locale: Locale;
  ui: UI;
  /** Product to suggest per goal, already resolved for the current language. */
  products: Record<Goal, { name: string; href: string }>;
  scoopG: number;
};
