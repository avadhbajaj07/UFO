"use client";

import { useState } from "react";
import { GOALS, LIMITS, isValidKg, macros, type Goal, type Sex } from "@/lib/tools/formulas";
import { useFirstUse } from "@/lib/tools/track";
import { ActivityField, Choices, ProductSuggestion, Seg, Slider, WeightField } from "../ui";
import { EmailCapture } from "../EmailCapture";
import type { CalcProps } from "./types";

export function MacroCalculator({ locale, ui, products }: CalcProps) {
  const [sex, setSex] = useState<Sex>("male");
  const [age, setAge] = useState(30);
  const [cm, setCm] = useState(175);
  const [kg, setKg] = useState(75);
  const [act, setAct] = useState(2);
  const [goal, setGoal] = useState<Goal>("gain");
  const touch = useFirstUse("macro");

  const m = isValidKg(kg) ? macros(kg, cm, age, sex, act, goal) : null;

  return (
    <>
      <div className="tl-tool">
        <div className="tl-inputs">
          <Seg
            label={ui.sex} value={sex}
            options={[{ v: "male", l: ui.male }, { v: "female", l: ui.female }]}
            onChange={(v) => { touch(); setSex(v); }}
          />
          <Slider
            id="tl-age" label={ui.age} value={age} min={LIMITS.age[0]} max={LIMITS.age[1]}
            display={`${age} ${ui.years}`} onChange={(v) => { touch(); setAge(v); }}
          />
          <Slider
            id="tl-cm" label={ui.height} value={cm} min={LIMITS.cm[0]} max={LIMITS.cm[1]}
            display={`${cm} ${ui.cm}`} onChange={(v) => { touch(); setCm(v); }}
          />
          <WeightField ui={ui} kg={kg} onKg={(v) => { touch(); setKg(v); }} />
          <Choices
            label={ui.goal} value={goal}
            options={GOALS.map((g) => ({ v: g, n: ui.goals[g].n, d: ui.goals[g].d }))}
            onChange={(v) => { touch(); setGoal(v); }}
          />
          <ActivityField ui={ui} value={act} onChange={(v) => { touch(); setAct(v); }} />
        </div>

        <div className="tl-result" aria-live="polite">
          <div>
            <div className="tl-k">{ui.yourCalories}</div>
            <div className="tl-big">{m ? m.kcal : "–"}<small>{ui.kcalDay}</small></div>
            {!m && <div className="tl-sub">{ui.enterWeight}</div>}
          </div>
          {m && (
            <>
              <div className="tl-bar" role="img" aria-label={`${ui.protein} ${m.pctP}%, ${ui.carbs} ${m.pctC}%, ${ui.fat} ${m.pctF}%`}>
                <i className="p" style={{ width: `${m.pctP}%` }} />
                <i className="c" style={{ width: `${m.pctC}%` }} />
                <i className="f" style={{ width: `${m.pctF}%` }} />
              </div>
              <div className="tl-stats">
                <div><b>{m.protein} {ui.g}</b><span>{ui.protein} · {m.pctP}%</span></div>
                <div><b>{m.carbs} {ui.g}</b><span>{ui.carbs} · {m.pctC}%</span></div>
                <div><b>{m.fat} {ui.g}</b><span>{ui.fat} · {m.pctF}%</span></div>
              </div>
            </>
          )}
          <ProductSuggestion ui={ui} name={products[goal].name} href={products[goal].href} />
        </div>
      </div>

      <EmailCapture
        locale={locale} tool="macro" ui={ui}
        result={m ? {
          [ui.yourCalories]: `${m.kcal} ${ui.kcalDay}`,
          [ui.protein]: `${m.protein} ${ui.g}`,
          [ui.carbs]: `${m.carbs} ${ui.g}`,
          [ui.fat]: `${m.fat} ${ui.g}`,
          [ui.goal]: ui.goals[goal].n,
          [ui.activity]: ui.acts[act].n,
        } : null}
      />
    </>
  );
}
