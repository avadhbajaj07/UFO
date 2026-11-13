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
  if (id === "macro") {
    const pct = (v: number) => `${v > 0 ? "+" : v < 0 ? "−" : ""}${Math.round(Math.abs(v) * 100)}%`;
    return {
      head: [ui.goal, ui.calAdjust, ui.proteinPerKg, ui.fat],
      rows: GOALS.map((g) => {
        const a = PROTEIN_GPK[g];
        return [ui.goals[g].n, pct(CAL_ADJUST[g]), `${fmt(Math.min(...a), 1, locale)}–${fmt(Math.max(...a), 1, locale)}`, ui.fatRule];
      }),
    };
  }
  if (id === "bmi") {
    // BMI classification table
    const rows = [
      ["< 18.5", ui.underweight, "🔵"],
      ["18.5 – 24.9", ui.normal, "🟢"],
      ["25 – 29.9", ui.overweight, "🟡"],
      ["≥ 30", ui.obese, "🔴"],
    ];
    return { head: ["BMI", ui.bmiCategory, ""], rows };
  }
  if (id === "bodyfat") {
    const rows = locale === "de"
      ? [
          [ui.essential, "< 6 %", "< 14 %"],
          [ui.athlete, "6 – 13 %", "14 – 20 %"],
          [ui.fitness, "14 – 17 %", "21 – 24 %"],
          [ui.average, "18 – 24 %", "25 – 31 %"],
          [ui.obese, "> 25 %", "> 32 %"],
        ]
      : [
          [ui.essential, "< 6%", "< 14%"],
          [ui.athlete, "6–13%", "14–20%"],
          [ui.fitness, "14–17%", "21–24%"],
          [ui.average, "18–24%", "25–31%"],
          [ui.obese, "> 25%", "> 32%"],
        ];
    return { head: [ui.bmiCategory, ui.male, ui.female], rows };
  }
  if (id === "lbm") {
    // Protein targets based on LBM
    const rows = [
      [ui.goals.maintain.n, `${fmt(1.6, 1, locale)} g/kg LBM`],
      [ui.goals.gain.n, `${fmt(1.8, 1, locale)} – ${fmt(2.2, 1, locale)} g/kg LBM`],
      [ui.goals.loss.n, `${fmt(2.0, 1, locale)} – ${fmt(2.4, 1, locale)} g/kg LBM`],
    ];
    return { head: [ui.goal, ui.proteinPerKg], rows };
  }
  if (id === "orm") {
    // 1RM percentage table
    const pcts = [60, 65, 70, 75, 80, 85, 90, 95];
    const rows = pcts.map((p) => [`${p}%`, `× ${fmt(p / 100, 2, locale)}`, `~${20 - Math.round((p - 60) / 5)} reps`]);
    return { head: ["% 1RM", ui.multiplier, "Rep range"], rows };
  }
  if (id === "water") {
    // Hydration by activity level
    const baseMl = 70 * 35; // example for 70kg person
    const rows = ui.acts.map((a, i) => {
      const total = baseMl + i * 400;
      return [a.n, `${fmt(total / 1000, 1, locale)} L`, `~${Math.round(total / 250)} glasses`];
    });
    return { head: [ui.activity, ui.litresDay, ui.glassesDay], rows };
  }
  if (id === "deficit") {
    // Deficit by loss rate
    const rates = [0.25, 0.5, 0.75, 1.0];
    const rows = rates.map((r) => {
      const deficit = Math.round((r * 7700) / 7);
      return [`${fmt(r, 2, locale)} kg/week`, `${deficit} kcal/day`, `${Math.round(5 / r)} weeks to 5 kg`];
    });
    return { head: [ui.lossRate, ui.kcalDeficit, ui.weeksTo5kg], rows };
  }
  if (id === "creatine") {
    // Creatine protocol comparison
    const rows = [
      [ui.loadingPhase, "0.3 g/kg/day × 7 days", "~7 days", "4 doses/day"],
      [ui.noLoadingPhase, "0.03 g/kg/day", "~28 days", "1 dose/day"],
      [ui.maintenancePhase, "0.03 g/kg/day", "ongoing", "1 dose/day"],
    ];
    return { head: [ui.phase, ui.gPerDayCr, "Time to saturation", ui.doses], rows };
  }
  // fallback
  const pct = (v: number) => `${v > 0 ? "+" : v < 0 ? "−" : ""}${Math.round(Math.abs(v) * 100)}%`;
  return {
    head: [ui.goal, ui.calAdjust, ui.proteinPerKg, ui.fat],
    rows: GOALS.map((g) => {
      const a = PROTEIN_GPK[g];
      return [ui.goals[g].n, pct(CAL_ADJUST[g]), `${fmt(Math.min(...a), 1, locale)}–${fmt(Math.max(...a), 1, locale)}`, ui.fatRule];
    }),
  };
}
