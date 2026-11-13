"use client";

import { useState } from "react";
import { creatineDose, isValidKg, type CreatinePhase } from "@/lib/tools/formulas";
import { useFirstUse } from "@/lib/tools/track";
import { Seg, WeightField, ProductSuggestion } from "../ui";
import type { CalcProps } from "./types";

export function CreatineCalculator({ locale, ui, products }: CalcProps) {
  const [kg, setKg] = useState(80);
  const [phase, setPhase] = useState<CreatinePhase>("maintenance");
  const touch = useFirstUse("creatine");

  const valid = isValidKg(kg);
  const result = valid ? creatineDose(kg, phase) : null;

  const phaseOptions: { v: CreatinePhase; l: string }[] = [
    { v: "loading", l: ui.loadingPhase },
    { v: "maintenance", l: ui.maintenancePhase },
    { v: "no-loading", l: ui.noLoadingPhase },
  ];

  return (
    <>
      <div className="tl-tool">
        <div className="tl-inputs">
          <WeightField ui={ui} kg={kg} onKg={(v) => { touch(); setKg(v); }} />
          <Seg
            label={ui.phase} value={phase}
            options={phaseOptions}
            onChange={(v) => { touch(); setPhase(v); }}
          />
        </div>

        <div className="tl-result" aria-live="polite">
          <div>
            <div className="tl-k">{ui.yourCreatine}</div>
            <div className="tl-big">
              {result ? result.dailyG : "–"}<small> {ui.gPerDayCr}</small>
            </div>
            {result && (
              <div className="tl-sub">
                {result.doses > 1
                  ? `${result.perDoseG}g × ${result.doses} ${ui.doses}`
                  : `${result.perDoseG}g × 1 ${ui.doses[0] === "d" ? "dose" : ui.doses}`}
                {result.durationDays && ` — ${result.durationDays} days`}
              </div>
            )}
          </div>
          {result && result.durationDays && (
            <div className="tl-stats">
              <div>
                <b>{result.maintenanceG}</b>
                <span>{ui.maintenancePhase} ({ui.gPerDayCr})</span>
              </div>
              <div>
                <b>{result.durationDays}</b>
                <span>Days loading</span>
              </div>
            </div>
          )}
          {!valid && <div className="tl-sub">{ui.enterWeight}</div>}
          <ProductSuggestion ui={ui} name={products.gain.name} href={products.gain.href} />
        </div>
      </div>
    </>
  );
}
