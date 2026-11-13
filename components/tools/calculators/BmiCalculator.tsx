"use client";

import { useState } from "react";
import { bmi, bmiCategory, isValidKg } from "@/lib/tools/formulas";
import { useFirstUse } from "@/lib/tools/track";
import { Slider, WeightField } from "../ui";
import type { CalcProps } from "./types";

export function BmiCalculator({ locale, ui }: CalcProps) {
  const [kg, setKg] = useState(75);
  const [cm, setCm] = useState(175);
  const touch = useFirstUse("bmi");

  const valid = isValidKg(kg) && cm >= 100 && cm <= 250;
  const result = valid ? bmi(kg, cm) : null;
  const cat = result !== null ? bmiCategory(result) : null;

  const catLabel: Record<string, string> = {
    underweight: ui.underweight,
    normal: ui.normal,
    overweight: ui.overweight,
    obese: ui.obese,
  };
  const catColor: Record<string, string> = {
    underweight: "#60a5fa",
    normal: "#00FF88",
    overweight: "#fbbf24",
    obese: "#f87171",
  };

  return (
    <div className="tl-tool">
      <div className="tl-inputs">
        <WeightField ui={ui} kg={kg} onKg={(v) => { touch(); setKg(v); }} />
        <div>
          <div className="tl-head">
            <label className="tl-lab" htmlFor="tl-cm">{ui.height}</label>
            <span className="tl-val">{cm} {ui.cm}</span>
          </div>
          <input
            id="tl-cm" className="tl-range" type="range" min={100} max={220} step={1}
            value={cm} onChange={(e) => { touch(); setCm(Number(e.target.value)); }}
            style={{ "--p": `${((cm - 100) / 120) * 100}%` } as React.CSSProperties}
          />
          <div className="tl-ticks"><span>100 {ui.cm}</span><span>220 {ui.cm}</span></div>
        </div>
      </div>

      <div className="tl-result" aria-live="polite">
        <div>
          <div className="tl-k">{ui.yourBmi}</div>
          <div className="tl-big">
            {result !== null ? result.toFixed(1) : "–"}
          </div>
          {cat && (
            <div className="tl-sub" style={{ color: catColor[cat] }}>
              {catLabel[cat]}
            </div>
          )}
        </div>
        {!valid && <div className="tl-sub" style={{ marginTop: 8 }}>{ui.enterWeight}</div>}
      </div>
    </div>
  );
}
