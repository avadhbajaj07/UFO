"use client";

import { useState } from "react";
import { oneRepMax } from "@/lib/tools/formulas";
import { useFirstUse } from "@/lib/tools/track";
import { Slider } from "../ui";
import type { CalcProps } from "./types";

export function OrmCalculator({ locale, ui }: CalcProps) {
  const [weight, setWeight] = useState(100);
  const [reps, setReps] = useState(5);
  const touch = useFirstUse("orm");

  const valid = weight > 0 && reps >= 1 && reps <= 20;
  const result = valid ? oneRepMax(weight, reps) : null;

  const pcts = result ? [
    { pct: 95, kg: result.pct90 },
    { pct: 90, kg: result.pct90 },
    { pct: 80, kg: result.pct80 },
    { pct: 70, kg: result.pct70 },
    { pct: 60, kg: result.pct60 },
  ] : [];

  return (
    <div className="tl-tool">
      <div className="tl-inputs">
        <div>
          <div className="tl-head">
            <label className="tl-lab" htmlFor="tl-lift">{ui.liftWeightKg}</label>
            <span className="tl-val">{weight} {ui.kg}</span>
          </div>
          <input
            id="tl-lift" className="tl-range" type="range" min={20} max={300} step={2.5}
            value={weight}
            onChange={(e) => { touch(); setWeight(Number(e.target.value)); }}
            style={{ "--p": `${((weight - 20) / 280) * 100}%` } as React.CSSProperties}
          />
          <div className="tl-ticks"><span>20 {ui.kg}</span><span>300 {ui.kg}</span></div>
        </div>
        <Slider
          id="tl-reps" label={ui.reps} value={reps} min={1} max={15} step={1}
          minLabel="1" maxLabel="15"
          onChange={(v) => { touch(); setReps(v); }}
        />
      </div>

      <div className="tl-result" aria-live="polite">
        <div>
          <div className="tl-k">{ui.your1rm}</div>
          <div className="tl-big">
            {result ? result.avg : "–"}<small> {ui.kg}</small>
          </div>
        </div>
        {result && (
          <div className="tl-stats">
            {[
              { label: "90%", val: result.pct90 },
              { label: "80%", val: result.pct80 },
              { label: "70%", val: result.pct70 },
              { label: "60%", val: result.pct60 },
            ].map(({ label, val }) => (
              <div key={label}>
                <b>{val}</b>
                <span>{label} 1RM ({ui.kg})</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
