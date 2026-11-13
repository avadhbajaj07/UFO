import type { Locale, ToolId } from "./config";
import { ACTIVITY_FACTOR, CAL_ADJUST, GOALS, PROTEIN_GPK, fmt } from "./formulas";
import { UI_STRINGS } from "./ui-strings";

export type RefTable = { head: string[]; rows: string[][] };

/** Reference tables are generated from the same constants as the calculators, rendered as real HTML on the server. */
export function tableFor(id: ToolId, locale: Locale): RefTable {
  const ui = UI_STRINGS[locale];
  if (id === "protein") {
    return {
      head: [ui.goal, ...ui.acts.map((a) => a.n)],
      rows: GOALS.map((g) => [ui.goals[g].n, ...PROTEIN_GPK[g].map((x) => `${fmt(x, 1, locale)} g/kg`)]),
    };
  }
  if (id === "tdee") {
    return {
      head: [ui.activity, ui.multiplier, ui.description],
      rows: ui.acts.map((a, i) => [a.n, `× ${fmt(ACTIVITY_FACTOR[i], 3, locale).replace(/0+$/, "").replace(/[.,]$/, "")}`, a.d]),
    };
  }
  const pct = (v: number) => `${v > 0 ? "+" : v < 0 ? "−" : ""}${Math.round(Math.abs(v) * 100)}%`;
  return {
    head: [ui.goal, ui.calAdjust, ui.proteinPerKg, ui.fat],
    rows: GOALS.map((g) => {
      const a = PROTEIN_GPK[g];
      return [ui.goals[g].n, pct(CAL_ADJUST[g]), `${fmt(Math.min(...a), 1, locale)}–${fmt(Math.max(...a), 1, locale)}`, ui.fatRule];
    }),
  };
}
