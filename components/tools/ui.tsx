"use client";

import { useState, type CSSProperties } from "react";
import type { UI } from "@/lib/tools/ui-strings";
import { LIMITS } from "@/lib/tools/formulas";

export function Slider(p: {
  id: string; label: string; value: number; min: number; max: number; step?: number;
  onChange: (v: number) => void; display?: string; minLabel?: string; maxLabel?: string;
}) {
  const pct = Math.min(100, Math.max(0, ((p.value - p.min) / (p.max - p.min)) * 100));
  return (
    <div>
      <div className="tl-head">
        <label className="tl-lab" htmlFor={p.id}>{p.label}</label>
        <span className="tl-val">{p.display ?? p.value}</span>
      </div>
      <input
        id={p.id} type="range" className="tl-range" min={p.min} max={p.max} step={p.step ?? 1}
        value={p.value} onChange={(e) => p.onChange(Number(e.target.value))}
        style={{ "--p": `${pct}%` } as CSSProperties}
      />
      {(p.minLabel || p.maxLabel) && (
        <div className="tl-ticks"><span>{p.minLabel}</span><span>{p.maxLabel}</span></div>
      )}
    </div>
  );
}

export function Seg<T extends string>(p: {
  label: string; value: T; options: { v: T; l: string }[]; onChange: (v: T) => void;
}) {
  return (
    <div>
      <div className="tl-head"><span className="tl-lab">{p.label}</span></div>
      <div className="tl-seg" role="group" aria-label={p.label}>
        {p.options.map((o) => (
          <button key={o.v} type="button" aria-pressed={p.value === o.v} onClick={() => p.onChange(o.v)}>{o.l}</button>
        ))}
      </div>
    </div>
  );
}

export function Choices<T extends string>(p: {
  label: string; value: T; options: { v: T; n: string; d: string }[]; onChange: (v: T) => void;
}) {
  return (
    <div>
      <div className="tl-head"><span className="tl-lab">{p.label}</span></div>
      <div className="tl-choices">
        {p.options.map((o) => (
          <button key={o.v} type="button" aria-pressed={p.value === o.v} onClick={() => p.onChange(o.v)}>
            {o.n} <small>{o.d}</small>
          </button>
        ))}
      </div>
    </div>
  );
}

export function ActivityField(p: { ui: UI; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <Slider
        id="tl-act" label={p.ui.activity} value={p.value} min={0} max={3}
        display={p.ui.acts[p.value].n} onChange={p.onChange}
      />
      <div className="tl-note">{p.ui.acts[p.value].d}</div>
    </div>
  );
}

const LB = 2.20462;

/** Weight input with kg/lb toggle, number box and slider. Reports kg (NaN when empty). */
export function WeightField(p: { ui: UI; kg: number; onKg: (kg: number) => void }) {
  const [unit, setUnit] = useState<"kg" | "lb">("kg");
  const [text, setText] = useState(String(Math.round(p.kg)));
  const [lo, hi] = LIMITS.kg;
  const min = unit === "kg" ? lo : Math.round(lo * LB);
  const max = unit === "kg" ? 200 : Math.round(200 * LB);
  const shown = Number(text);
  const toKg = (v: number) => (unit === "kg" ? v : v / LB);

  const onText = (t: string) => {
    setText(t);
    const v = parseFloat(t);
    p.onKg(Number.isFinite(v) && v > 0 ? toKg(v) : NaN);
  };
  const switchUnit = (u: "kg" | "lb") => {
    if (u === unit) return;
    setUnit(u);
    if (Number.isFinite(p.kg)) setText(String(u === "kg" ? Math.round(p.kg) : Math.round(p.kg * LB)));
  };

  return (
    <div>
      <div className="tl-head">
        <label className="tl-lab" htmlFor="tl-w">{p.ui.weight}</label>
        <span className="tl-val">{Number.isFinite(shown) && shown > 0 ? `${shown} ${unit}` : "–"}</span>
      </div>
      <div className="tl-row">
        <input id="tl-w" className="tl-num" type="number" inputMode="decimal" min={min} max={max} value={text} onChange={(e) => onText(e.target.value)} />
        <div className="tl-seg" role="group" aria-label="Unit">
          {(["kg", "lb"] as const).map((u) => (
            <button key={u} type="button" aria-pressed={unit === u} onClick={() => switchUnit(u)}>{u}</button>
          ))}
        </div>
      </div>
      <input
        className="tl-range" type="range" aria-label={p.ui.weight} min={min} max={max} step={1}
        value={Math.min(max, Math.max(min, Number.isFinite(shown) ? shown : min))}
        onChange={(e) => onText(e.target.value)}
        style={{ "--p": `${Math.min(100, Math.max(0, ((shown - min) / (max - min)) * 100)) || 0}%` } as CSSProperties}
      />
      <div className="tl-ticks"><span>{min} {unit}</span><span>{max} {unit}</span></div>
    </div>
  );
}

export function ProductSuggestion(p: { ui: UI; name: string; href: string }) {
  return (
    <div className="tl-product">
      <p><small>{p.ui.suggested}</small><br /><strong>{p.name}</strong></p>
      <a href={p.href}>{p.ui.view}</a>
    </div>
  );
}
