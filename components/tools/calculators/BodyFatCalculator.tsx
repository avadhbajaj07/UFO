"use client";

import { useState } from "react";
import { bodyFat, bodyFatCategory, isValidKg, type Sex } from "@/lib/tools/formulas";
import { useFirstUse } from "@/lib/tools/track";
import { Seg, WeightField } from "../ui";
import type { CalcProps } from "./types";

export function BodyFatCalculator({ locale, ui }: CalcProps) {
  const [kg, setKg] = useState(75);
  const [sex, setSex] = useState<Sex>("male");
  const [waist, setWaist] = useState(85);
  const [neck, setNeck] = useState(38);
  const [hip, setHip] = useState(95);
  const [cm, setCm] = useState(175);
  const touch = useFirstUse("bodyfat");

  const valid = isValidKg(kg) && cm >= 100 && waist > neck;
  const result = valid ? bodyFat(sex, waist, neck, cm, sex === "female" ? hip : undefined) : null;
  const cat = result !== null ? bodyFatCategory(result, sex) : null;

  const catLabel: Record<string, string> = {
    essential: ui.essential, athlete: ui.athlete, fitness: ui.fitness, average: ui.average, obese: ui.obese,
  };
  const catColor: Record<string, string> = {
    essential: "#60a5fa", athlete: "#00FF88", fitness: "#00FF88", average: "#fbbf24", obese: "#f87171",
  };

  const numInput = (
    id: string, label: string, value: number, min: number, max: number, onChange: (v: number) => void
  ) => (
    <div>
      <div className="tl-head">
        <label className="tl-lab" htmlFor={id}>{label}</label>
        <span className="tl-val">{value} {ui.cm}</span>
      </div>
      <input
        id={id} className="tl-range" type="range" min={min} max={max} step={1} value={value}
        onChange={(e) => { touch(); onChange(Number(e.target.value)); }}
        style={{ "--p": `${((value - min) / (max - min)) * 100}%` } as React.CSSProperties}
      />
      <div className="tl-ticks"><span>{min}</span><span>{max}</span></div>
    </div>
  );

  return (
    <div className="tl-tool">
      <div className="tl-inputs">
        <Seg
          label={ui.sex} value={sex}
          options={[{ v: "male" as Sex, l: ui.male }, { v: "female" as Sex, l: ui.female }]}
          onChange={(v) => { touch(); setSex(v); }}
        />
        <WeightField ui={ui} kg={kg} onKg={(v) => { touch(); setKg(v); }} />
        {numInput("tl-h", ui.height, cm, 140, 220, setCm)}
        {numInput("tl-w", ui.waist, waist, 55, 150, setWaist)}
        {numInput("tl-n", ui.neck, neck, 25, 60, setNeck)}
        {sex === "female" && numInput("tl-hip", ui.hip, hip, 70, 160, setHip)}
      </div>

      <div className="tl-result" aria-live="polite">
        <div>
          <div className="tl-k">{ui.yourBodyFat}</div>
          <div className="tl-big">
            {result !== null ? `${result.toFixed(1)}${ui.pct}` : "–"}
          </div>
          {cat && (
            <div className="tl-sub" style={{ color: catColor[cat] }}>{catLabel[cat]}</div>
          )}
        </div>
        {result !== null && (
          <div className="tl-stats">
            <div>
              <b>{(kg * (result / 100)).toFixed(1)}</b>
              <span>{ui.fatMass} ({ui.kg})</span>
            </div>
            <div>
              <b>{(kg * (1 - result / 100)).toFixed(1)}</b>
              <span>{ui.yourLbm} ({ui.kg})</span>
            </div>
          </div>
        )}
        {!valid && <div className="tl-sub">{ui.enterWeight}</div>}
      </div>
    </div>
  );
}
