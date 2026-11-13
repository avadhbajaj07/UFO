"use client";

import { useState } from "react";
import { leanBodyMass, isValidKg } from "@/lib/tools/formulas";
import { useFirstUse } from "@/lib/tools/track";
import { Slider, WeightField } from "../ui";
import type { CalcProps } from "./types";

export function LbmCalculator({ locale, ui }: CalcProps) {
  const [kg, setKg] = useState(80);
  const [bfPct, setBfPct] = useState(20);
  const touch = useFirstUse("lbm");

  const valid = isValidKg(kg);
  const lbm = valid ? leanBodyMass(kg, bfPct) : null;
  const fatMassKg = lbm !== null ? Math.round((kg - lbm) * 10) / 10 : null;

  return (
    <div className="tl-tool">
      <div className="tl-inputs">
        <WeightField ui={ui} kg={kg} onKg={(v) => { touch(); setKg(v); }} />
        <Slider
          id="tl-bf" label={ui.bfPct} value={bfPct} min={5} max={50} step={1}
          display={`${bfPct}${ui.pct}`}
          minLabel="5%" maxLabel="50%"
          onChange={(v) => { touch(); setBfPct(v); }}
        />
      </div>

      <div className="tl-result" aria-live="polite">
        <div>
          <div className="tl-k">{ui.yourLbm}</div>
          <div className="tl-big">
            {lbm !== null ? lbm : "–"}<small> {ui.kg}</small>
          </div>
          <div className="tl-sub">{ui.bfPct}: {bfPct}{ui.pct}</div>
        </div>
        {lbm !== null && (
          <div className="tl-stats">
            <div>
              <b>{fatMassKg}</b>
              <span>{ui.fatMass} ({ui.kg})</span>
            </div>
            <div>
              <b>{Math.round(lbm * 2.0)}</b>
              <span>Min protein (g) @ 2.0 g/kg LBM</span>
            </div>
          </div>
        )}
        {!valid && <div className="tl-sub">{ui.enterWeight}</div>}
      </div>
    </div>
  );
}
