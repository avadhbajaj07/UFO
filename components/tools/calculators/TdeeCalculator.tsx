"use client";

import { useState } from "react";
import { LIMITS, energy, isValidKg, type Sex } from "@/lib/tools/formulas";
import { useFirstUse } from "@/lib/tools/track";
import { ActivityField, ProductSuggestion, Seg, Slider, WeightField } from "../ui";
import { EmailCapture } from "../EmailCapture";
import type { CalcProps } from "./types";

export function TdeeCalculator({ locale, ui, products }: CalcProps) {
  const [sex, setSex] = useState<Sex>("male");
  const [age, setAge] = useState(30);
  const [cm, setCm] = useState(175);
  const [kg, setKg] = useState(75);
  const [act, setAct] = useState(2);
  const touch = useFirstUse("tdee");

  const e = isValidKg(kg) ? energy(kg, cm, age, sex, act) : null;

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
          <ActivityField ui={ui} value={act} onChange={(v) => { touch(); setAct(v); }} />
        </div>

        <div className="tl-result" aria-live="polite">
          <div>
            <div className="tl-k">{ui.maintenance}</div>
            <div className="tl-big">{e ? e.tdee : "–"}<small>{ui.kcalDay}</small></div>
            {!e && <div className="tl-sub">{ui.enterWeight}</div>}
          </div>
          {e && (
            <div className="tl-lines">
              <div><span>{ui.cutting}</span><b>{e.cut} {ui.kcalDay}</b></div>
              <div><span>{ui.bulking}</span><b>{e.bulk} {ui.kcalDay}</b></div>
              <div><span>{ui.bmr}</span><b>{e.bmr} {ui.kcalDay}</b></div>
              <div className="tl-sub" style={{ display: "block" }}>{ui.floorNote}</div>
            </div>
          )}
          <ProductSuggestion ui={ui} name={products.maintain.name} href={products.maintain.href} />
        </div>
      </div>

      <EmailCapture
        locale={locale} tool="tdee" ui={ui}
        result={e ? {
          [ui.maintenance]: `${e.tdee} ${ui.kcalDay}`,
          [ui.cutting]: `${e.cut} ${ui.kcalDay}`,
          [ui.bulking]: `${e.bulk} ${ui.kcalDay}`,
          [ui.bmr]: `${e.bmr} ${ui.kcalDay}`,
        } : null}
      />
    </>
  );
}
