export type Goal = "maintain" | "gain" | "loss";
export type Sex = "male" | "female";
export const GOALS: Goal[] = ["maintain", "gain", "loss"];

// ─── BMI ─────────────────────────────────────────────────────────────────────
export function bmi(kg: number, cm: number) {
  const m = cm / 100;
  return Math.round((kg / (m * m)) * 10) / 10;
}
export function bmiCategory(b: number): "underweight" | "normal" | "overweight" | "obese" {
  if (b < 18.5) return "underweight";
  if (b < 25) return "normal";
  if (b < 30) return "overweight";
  return "obese";
}

// ─── Body Fat % (US Navy Method) ────────────────────────────────────────────
export function bodyFat(sex: Sex, waistCm: number, neckCm: number, cm: number, hipCm?: number) {
  if (sex === "male") {
    const val = 495 / (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(cm)) - 450;
    return Math.max(2, Math.round(val * 10) / 10);
  } else {
    const hip = hipCm ?? waistCm * 1.05;
    const val = 495 / (1.29579 - 0.35004 * Math.log10(waistCm + hip - neckCm) + 0.22100 * Math.log10(cm)) - 450;
    return Math.max(10, Math.round(val * 10) / 10);
  }
}
export function bodyFatCategory(bf: number, sex: Sex): string {
  if (sex === "male") {
    if (bf < 6) return "essential";
    if (bf < 14) return "athlete";
    if (bf < 18) return "fitness";
    if (bf < 25) return "average";
    return "obese";
  } else {
    if (bf < 14) return "essential";
    if (bf < 21) return "athlete";
    if (bf < 25) return "fitness";
    if (bf < 32) return "average";
    return "obese";
  }
}

// ─── Lean Body Mass ───────────────────────────────────────────────────────────
export function leanBodyMass(kg: number, bfPct: number) {
  const lbm = kg * (1 - bfPct / 100);
  return Math.round(lbm * 10) / 10;
}

// ─── 1 Rep Max ────────────────────────────────────────────────────────────────
export function oneRepMax(weightKg: number, reps: number) {
  // Brzycki formula — most common
  const brzycki = weightKg / (1.0278 - 0.0278 * reps);
  // Epley formula
  const epley = weightKg * (1 + reps / 30);
  const avg = (brzycki + epley) / 2;
  return {
    brzycki: Math.round(brzycki * 10) / 10,
    epley: Math.round(epley * 10) / 10,
    avg: Math.round(avg * 10) / 10,
    pct90: Math.round(avg * 0.9 * 10) / 10,
    pct80: Math.round(avg * 0.8 * 10) / 10,
    pct70: Math.round(avg * 0.7 * 10) / 10,
    pct60: Math.round(avg * 0.6 * 10) / 10,
  };
}

// ─── Water Intake ─────────────────────────────────────────────────────────────
export function waterIntake(kg: number, actLevel: number) {
  // Base: 35ml/kg, +500ml per activity level above sedentary
  const baseMl = kg * 35;
  const actBonus = actLevel * 400;
  const totalMl = Math.round((baseMl + actBonus) / 50) * 50;
  return {
    ml: totalMl,
    litres: Math.round(totalMl / 100) / 10,
    glasses: Math.round(totalMl / 250),
  };
}

// ─── Calorie Deficit ──────────────────────────────────────────────────────────
export function calorieDeficit(tdeeKcal: number, rateKgPerWeek: number) {
  // 1kg fat ≈ 7700 kcal
  const weeklyDeficit = rateKgPerWeek * 7700;
  const dailyDeficit = Math.round(weeklyDeficit / 7);
  const targetCalories = Math.max(1200, tdeeKcal - dailyDeficit);
  const weeksTo5kg = Math.round(5 / rateKgPerWeek);
  return { dailyDeficit, targetCalories, weeksTo5kg };
}

// ─── Creatine Dosage ──────────────────────────────────────────────────────────
export type CreatinePhase = "loading" | "maintenance" | "no-loading";
export function creatineDose(kg: number, phase: CreatinePhase) {
  if (phase === "loading") {
    const dailyTotal = Math.round(kg * 0.3 * 10) / 10; // 0.3g/kg during loading
    const doses = 4;
    const perDose = Math.round((dailyTotal / doses) * 10) / 10;
    return { dailyG: dailyTotal, doses, perDoseG: perDose, durationDays: 7, maintenanceG: Math.round(kg * 0.03 * 10) / 10 };
  } else if (phase === "maintenance") {
    const daily = Math.round(Math.max(3, kg * 0.03) * 10) / 10;
    return { dailyG: daily, doses: 1, perDoseG: daily, durationDays: null, maintenanceG: daily };
  } else {
    // No loading — start at maintenance dose immediately
    const daily = Math.round(Math.max(3, kg * 0.03) * 10) / 10;
    return { dailyG: daily, doses: 1, perDoseG: daily, durationDays: null, maintenanceG: daily };
  }
}

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
