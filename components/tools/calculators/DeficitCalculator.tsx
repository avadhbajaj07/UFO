"use client";

import { useState } from "react";
import { calorieDeficit } from "@/lib/tools/formulas";
import { useFirstUse } from "@/lib/tools/track";
import { Slider } from "../ui";
import type { CalcProps } from "./types";

export function DeficitCalculator({ locale, ui }: CalcProps) {
  const [tdee, setTdee] = useState(2200);
  const [rate, setRate] = useState(0.5);
  const touch = useFirstUse("deficit");

  const valid = tdee >= 1200 && tdee <= 6000;
  const result = valid ? calorieDeficit(tdee, rate) : null;

  const rateOptions = [0.25, 0.5, 0.75, 1.0];

  return (
    <div className="tl-tool">
      <div className="tl-inputs">
        <div>
          <div className="tl-head">
            <label className="tl-lab" htmlFor="tl-tdee">{ui.tdeeLabel}</label>
            <span className="tl-val">{tdee} kcal</span>
          </div>
          <input
            id="tl-tdee" className="tl-range" type="range" min={1200} max={5000} step={50}
            value={tdee}
            onChange={(e) => { touch(); setTdee(Number(e.target.value)); }}
            style={{ "--p": `${((tdee - 1200) / 3800) * 100}%` } as React.CSSProperties}
          />
          <div className="tl-ticks"><span>1200</span><span>5000</span></div>
        </div>
        <div>
          <div className="tl-head">
            <span className="tl-lab">{ui.lossRate}</span>
            <span className="tl-val">{rate} {ui.kgPerWeek}</span>
          </div>
          <div className="tl-seg" role="group" aria-label={ui.lossRate}>
            {rateOptions.map((r) => (
              <button
                key={r} type="button" aria-pressed={rate === r}
                onClick={() => { touch(); setRate(r); }}
              >
                {r} kg
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="tl-result" aria-live="polite">
        <div>
          <div className="tl-k">{ui.yourDeficit}</div>
          <div className="tl-big">
            {result ? result.dailyDeficit : "–"}<small> {ui.kcalDeficit}</small>
          </div>
        </div>
        {result && (
          <div className="tl-stats">
            <div>
              <b>{result.targetCalories}</b>
              <span>{ui.targetCalories} (kcal)</span>
            </div>
            <div>
              <b>{result.weeksTo5kg}</b>
              <span>{ui.weeksTo5kg}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
