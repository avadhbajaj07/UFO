"use client";

import { useState } from "react";
import { waterIntake, isValidKg } from "@/lib/tools/formulas";
import { useFirstUse } from "@/lib/tools/track";
import { ActivityField, WeightField } from "../ui";
import type { CalcProps } from "./types";

export function WaterCalculator({ locale, ui }: CalcProps) {
  const [kg, setKg] = useState(70);
  const [act, setAct] = useState(1);
  const touch = useFirstUse("water");

  const valid = isValidKg(kg);
  const result = valid ? waterIntake(kg, act) : null;

  return (
    <div className="tl-tool">
      <div className="tl-inputs">
        <WeightField ui={ui} kg={kg} onKg={(v) => { touch(); setKg(v); }} />
        <ActivityField ui={ui} value={act} onChange={(v) => { touch(); setAct(v); }} />
      </div>

      <div className="tl-result" aria-live="polite">
        <div>
          <div className="tl-k">{ui.yourWater}</div>
          <div className="tl-big">
            {result ? result.litres : "–"}<small> {ui.litresDay}</small>
          </div>
          {result && (
            <div className="tl-sub">≈ {result.glasses} {ui.glassesDay} (250 ml each)</div>
          )}
        </div>
        {result && (
          <div className="tl-stats">
            <div>
              <b>{result.ml}</b>
              <span>ml / day</span>
            </div>
            <div>
              <b>{result.glasses}</b>
              <span>{ui.glassesDay}</span>
            </div>
          </div>
        )}
        {!valid && <div className="tl-sub">{ui.enterWeight}</div>}
      </div>
    </div>
  );
}
