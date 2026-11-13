"use client";

import { useState } from "react";
import { GOALS, fmt, isValidKg, proteinTarget, type Goal } from "@/lib/tools/formulas";
import { useFirstUse } from "@/lib/tools/track";
import { ActivityField, Choices, ProductSuggestion, Slider, WeightField } from "../ui";
import { EmailCapture } from "../EmailCapture";
import type { CalcProps } from "./types";

export function ProteinCalculator({ locale, ui, products, scoopG }: CalcProps) {
  const [kg, setKg] = useState(75);
  const [goal, setGoal] = useState<Goal>("gain");
  const [act, setAct] = useState(2);
  const [meals, setMeals] = useState(4);
  const touch = useFirstUse("protein");

  const r = isValidKg(kg) ? proteinTarget(kg, goal, act) : null;
  const perMeal = r ? Math.round(r.g / meals) : 0;
  const scoops = r ? Math.round((r.g / scoopG) * 10) / 10 : 0;

  return (
    <>
      <div className="tl-tool">
        <div className="tl-inputs">
          <WeightField ui={ui} kg={kg} onKg={(v) => { touch(); setKg(v); }} />
          <Choices
            label={ui.goal} value={goal}
            options={GOALS.map((g) => ({ v: g, n: ui.goals[g].n, d: ui.goals[g].d }))}
            onChange={(v) => { touch(); setGoal(v); }}
          />
          <ActivityField ui={ui} value={act} onChange={(v) => { touch(); setAct(v); }} />
          <Slider
            id="tl-meals" label={ui.meals} value={meals} min={2} max={6}
            minLabel="2" maxLabel="6" onChange={(v) => { touch(); setMeals(v); }}
          />
        </div>

        <div className="tl-result" aria-live="polite">
          <div>
            <div className="tl-k">{ui.yourProtein}</div>
            <div className="tl-big">{r ? r.g : "–"}<small>{ui.gPerDay}</small></div>
            <div className="tl-sub">{r ? `${ui.range}: ${r.low}–${r.high} ${ui.gPerDay}` : ui.enterWeight}</div>
          </div>
          {r && (
            <div className="tl-stats">
              <div><b>{fmt(r.gpk, 1, locale)}</b><span>{ui.gPerKg}</span></div>
              <div><b>{perMeal}</b><span>{ui.gPerMeal.replace("{n}", String(meals))}</span></div>
              <div><b>{fmt(scoops, 1, locale)}</b><span>{ui.scoops}</span></div>
            </div>
          )}
          <ProductSuggestion ui={ui} name={products[goal].name} href={products[goal].href} />
        </div>
      </div>

      <EmailCapture
        locale={locale} tool="protein" ui={ui}
        result={r ? {
          [ui.yourProtein]: `${r.g} ${ui.gPerDay}`,
          [ui.range]: `${r.low}–${r.high} ${ui.gPerDay}`,
          [ui.gPerKg]: fmt(r.gpk, 1, locale),
          [ui.gPerMeal.replace("{n}", String(meals))]: perMeal,
          [ui.goal]: ui.goals[goal].n,
          [ui.activity]: ui.acts[act].n,
        } : null}
      />
    </>
  );
}
