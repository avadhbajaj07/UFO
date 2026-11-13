export type Goal = "maintain" | "gain" | "loss";
export type Sex = "male" | "female";
export const GOALS: Goal[] = ["maintain", "gain", "loss"];

/** Grams of protein per kg body weight. Index = activity level [sedentary, light, moderate, high]. */
export const PROTEIN_GPK: Record<Goal, readonly number[]> = {
  maintain: [0.8, 1.2, 1.4, 1.6],
  gain: [1.6, 1.8, 2.0, 2.2],
  loss: [1.6, 1.8, 2.0, 2.4],
};

/** Activity multipliers applied to BMR. Same 4 levels as above. */
export const ACTIVITY_FACTOR: readonly number[] = [1.2, 1.375, 1.55, 1.725];

/** Calorie adjustment vs TDEE by goal. */
export const CAL_ADJUST: Record<Goal, number> = { maintain: 0, gain: 0.1, loss: -0.2 };

export const FAT_MIN_G_PER_KG = 0.8;
export const FAT_MIN_SHARE = 0.25;

export const LIMITS = { kg: [30, 300], cm: [120, 220], age: [16, 80] } as const;

export const round = (n: number, d = 0) => {
  const f = 10 ** d;
  return Math.round(n * f) / f;
};
/** Decimal formatting without Intl (avoids server/client hydration differences). */
export const fmt = (n: number, d: number, locale: string) => {
  const s = n.toFixed(d);
  return locale === "en" ? s : s.replace(".", ",");
};
export const isValidKg = (kg: number) =>
  Number.isFinite(kg) && kg >= LIMITS.kg[0] && kg <= LIMITS.kg[1];

export function proteinTarget(kg: number, goal: Goal, act: number) {
  const gpk = PROTEIN_GPK[goal][act];
  const g = Math.round(kg * gpk);
  return { gpk, g, low: Math.round(g * 0.9), high: Math.round(g * 1.1) };
}

/** Mifflin-St Jeor (1990). */
export function bmrOf(kg: number, cm: number, age: number, sex: Sex) {
  return 10 * kg + 6.25 * cm - 5 * age + (sex === "male" ? 5 : -161);
}

export function energy(kg: number, cm: number, age: number, sex: Sex, act: number) {
  const bmr = bmrOf(kg, cm, age, sex);
  const tdee = bmr * ACTIVITY_FACTOR[act];
  const cut = Math.max(tdee * (1 + CAL_ADJUST.loss), bmr); // never below BMR
  const bulk = tdee * (1 + CAL_ADJUST.gain);
  return { bmr: Math.round(bmr), tdee: Math.round(tdee), cut: Math.round(cut), bulk: Math.round(bulk) };
}

export function macros(kg: number, cm: number, age: number, sex: Sex, act: number, goal: Goal) {
  const e = energy(kg, cm, age, sex, act);
  const kcal = goal === "loss" ? e.cut : goal === "gain" ? e.bulk : e.tdee;
  const protein = Math.round(kg * PROTEIN_GPK[goal][act]);
  const fat = Math.round(Math.max(kg * FAT_MIN_G_PER_KG, (kcal * FAT_MIN_SHARE) / 9));
  const carbs = Math.max(0, Math.round((kcal - protein * 4 - fat * 9) / 4));
  const total = protein * 4 + fat * 9 + carbs * 4 || 1;
  const pctP = Math.round((protein * 4 * 100) / total);
  const pctF = Math.round((fat * 9 * 100) / total);
  return { kcal, protein, fat, carbs, pctP, pctF, pctC: 100 - pctP - pctF };
}
