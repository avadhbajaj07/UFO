/**
 * UFO LABZ — Alien Screen Damage FX
 * Zero dependencies. Browser only: call from event handlers, never during SSR.
 *
 *  "full" -> desktop footer links: alien + laser + full-screen cracks (~2s)
 *  "lite" -> mobile tab bar: tiny alien + tiny cracks (~1.2s), never blocks navigation
 */

export type AlienFxMode = "full" | "lite";

export const AFX_CONFIG = {
  /** Element that shakes on impact (full mode). Use "" to disable shake. */
  shakeSelector: "main",
  /** Layouts treated as "lite" when fx="auto". */
  liteQuery: "(max-width: 767px), (pointer: coarse)",
  fullTotalMs: 2050,
  liteTotalMs: 1250,
} as const;

const NS = "http://www.w3.org/2000/svg";
const rnd = (a: number, b: number): number => a + Math.random() * (b - a);
const later = (fn: () => void, ms: number): number => window.setTimeout(fn, ms);

export const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isLiteLayout = (): boolean =>
  typeof window !== "undefined" && window.matchMedia(AFX_CONFIG.liteQuery).matches;

/* ------------------------------------------------------------------ */
/* Artwork                                                             */
/* ------------------------------------------------------------------ */

const UFO_FULL =
  '<svg viewBox="0 0 64 44" fill="none" xmlns="http://www.w3.org/2000/svg"><g class="afx-bob">' +
  // Cockpit glass dome
  '<path d="M20 20 C20 9, 44 9, 44 20 Z" fill="#0d1f18" stroke="#a855f7" stroke-width="1.3"/>' +
  '<path d="M22 19 C23 11, 41 11, 42 19 Z" fill="#133624" opacity="0.85"/>' +
  // Alien Pilot
  '<ellipse cx="32" cy="16.5" rx="5" ry="6" fill="#1fff6b"/>' +
  '<ellipse cx="30" cy="16.5" rx="1.5" ry="2.5" fill="#030712" transform="rotate(16 30 16.5)"/>' +
  '<ellipse cx="34" cy="16.5" rx="1.5" ry="2.5" fill="#030712" transform="rotate(-16 34 16.5)"/>' +
  '<circle cx="29.7" cy="15.6" r="0.5" fill="#fff"/><circle cx="33.7" cy="15.6" r="0.5" fill="#fff"/>' +
  // Cockpit antenna
  '<line x1="32" y1="9" x2="32" y2="4" stroke="#1fff6b" stroke-width="1.5"/>' +
  '<circle cx="32" cy="3" r="1.8" fill="#a855f7" stroke="#1fff6b" stroke-width="0.8"/>' +
  // Glare
  '<path d="M24 15 Q28 11 34 11" stroke="#fff" stroke-width="1.2" stroke-linecap="round" fill="none" opacity="0.75"/>' +
  // Saucer lower hull
  '<path d="M16 24 C16 33, 48 33, 48 24 Z" fill="#0a0e17" stroke="#1fff6b" stroke-width="1.2"/>' +
  // Main disc
  '<ellipse cx="32" cy="23" rx="27" ry="7.5" fill="#111726" stroke="#a855f7" stroke-width="1.4"/>' +
  '<ellipse cx="32" cy="22.5" rx="25" ry="5.5" fill="#1a2236"/>' +
  // Rim LEDs
  '<circle cx="7" cy="23" r="1.6" fill="#1fff6b"/>' +
  '<circle cx="15" cy="25.5" r="1.8" fill="#a855f7"/>' +
  '<circle cx="23" cy="27" r="2" fill="#1fff6b"/>' +
  '<circle cx="32" cy="27.5" r="2.2" fill="#00ff88"/>' +
  '<circle cx="41" cy="27" r="2" fill="#1fff6b"/>' +
  '<circle cx="49" cy="25.5" r="1.8" fill="#a855f7"/>' +
  '<circle cx="57" cy="23" r="1.6" fill="#1fff6b"/>' +
  // Bottom tractor emitter
  '<ellipse cx="32" cy="30" rx="6" ry="2.4" fill="#a855f7" stroke="#1fff6b" stroke-width="1"/>' +
  '<circle cx="32" cy="30" r="2" fill="#fff"/>' +
  '</g></svg>';

const UFO_LITE =
  '<svg viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">' +
  // Cockpit glass dome
  '<path d="M15 15 C15 7, 33 7, 33 15 Z" fill="#0d1f18" stroke="#a855f7" stroke-width="1"/>' +
  '<path d="M16 14 C17 8.5, 31 8.5, 32 14 Z" fill="#133624" opacity="0.8"/>' +
  // Alien pilot inside dome
  '<ellipse cx="24" cy="12.5" rx="3.5" ry="4.2" fill="#1fff6b"/>' +
  '<ellipse cx="22.5" cy="12.5" rx="1.1" ry="1.8" fill="#030712" transform="rotate(16 22.5 12.5)"/>' +
  '<ellipse cx="25.5" cy="12.5" rx="1.1" ry="1.8" fill="#030712" transform="rotate(-16 25.5 12.5)"/>' +
  '<circle cx="22.3" cy="11.8" r="0.4" fill="#fff"/>' +
  '<circle cx="25.3" cy="11.8" r="0.4" fill="#fff"/>' +
  // Cockpit antenna / beacon
  '<line x1="24" y1="7" x2="24" y2="3.5" stroke="#1fff6b" stroke-width="1.2"/>' +
  '<circle cx="24" cy="2.5" r="1.3" fill="#a855f7" stroke="#1fff6b" stroke-width="0.6"/>' +
  // Glass glare reflection
  '<path d="M18 11 Q21 8 26 8" stroke="#fff" stroke-width="0.9" stroke-linecap="round" fill="none" opacity="0.7"/>' +
  // Saucer lower hull
  '<path d="M12 18 C12 24, 36 24, 36 18 Z" fill="#0a0e17" stroke="#1fff6b" stroke-width="0.9"/>' +
  // Saucer main disc (body)
  '<ellipse cx="24" cy="17" rx="20" ry="5.5" fill="#111726" stroke="#a855f7" stroke-width="1.1"/>' +
  '<ellipse cx="24" cy="16.5" rx="18.5" ry="4" fill="#1a2236"/>' +
  // Saucer rim running lights (green and purple LEDs)
  '<circle cx="6.5" cy="17" r="1.2" fill="#1fff6b"/>' +
  '<circle cx="12" cy="18.8" r="1.3" fill="#a855f7"/>' +
  '<circle cx="18" cy="19.8" r="1.4" fill="#1fff6b"/>' +
  '<circle cx="24" cy="20.2" r="1.6" fill="#00ff88"/>' +
  '<circle cx="30" cy="19.8" r="1.4" fill="#1fff6b"/>' +
  '<circle cx="36" cy="18.8" r="1.3" fill="#a855f7"/>' +
  '<circle cx="41.5" cy="17" r="1.2" fill="#1fff6b"/>' +
  // Bottom tractor emitter core
  '<ellipse cx="24" cy="22" rx="4.5" ry="1.8" fill="#a855f7" stroke="#1fff6b" stroke-width="0.8"/>' +
  '<circle cx="24" cy="22" r="1.5" fill="#fff"/>' +
  '</svg>';

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

interface CrackOpts {
  rays: number;
  lenMin: number;
  lenMax: number;
  steps: [number, number];
  branches: boolean;
  ring: boolean;
  baseDelayMs: number;
  staggerMs: number;
}

function buildCracks(x: number, y: number, o: CrackOpts): SVGGElement {
  const g = document.createElementNS(NS, "g");
  const items: Array<[string, boolean]> = [];

  for (let i = 0; i < o.rays; i++) {
    let a = (i / o.rays) * Math.PI * 2 + rnd(-0.28, 0.28);
    let px = x;
    let py = y;
    let d = `M${x} ${y}`;
    const steps = Math.round(rnd(o.steps[0], o.steps[1]));
    const len = rnd(o.lenMin, o.lenMax);
    for (let j = 0; j < steps; j++) {
      a += rnd(-0.3, 0.3);
      const s = (len / steps) * rnd(0.7, 1.3);
      px += Math.cos(a) * s;
      py += Math.sin(a) * s;
      d += ` L${px.toFixed(1)} ${py.toFixed(1)}`;
      if (o.branches && (j === 1 || j === 3)) {
        const ba = a + (Math.random() < 0.5 ? -1 : 1) * rnd(0.6, 1);
        const bx = px + Math.cos(ba) * rnd(25, 70);
        const by = py + Math.sin(ba) * rnd(25, 70);
        items.push([`M${px.toFixed(1)} ${py.toFixed(1)} L${bx.toFixed(1)} ${by.toFixed(1)}`, true]);
      }
    }
    items.push([d, false]);
  }

  if (o.ring) {
    let ring = `M${x + 16} ${y}`;
    for (let i = 1; i <= 9; i++) {
      const t = (i / 9) * Math.PI * 2;
      const r = rnd(12, 22);
      ring += ` L${(x + Math.cos(t) * r).toFixed(1)} ${(y + Math.sin(t) * r).toFixed(1)}`;
    }
    items.push([`${ring}Z`, true]);
  }

  items.forEach(([d, branch], k) => {
    const el = document.createElementNS(NS, "path");
    el.setAttribute("d", d);
    el.setAttribute("pathLength", "1");
    el.setAttribute("class", branch ? "afx-crack afx-b" : "afx-crack");
    el.style.transitionDelay = `${o.baseDelayMs + (branch ? 120 : 0) + k * o.staggerMs}ms`;
    g.appendChild(el);
  });
  return g;
}

function startDraw(g: SVGGElement): void {
  requestAnimationFrame(() =>
    requestAnimationFrame(() =>
      g.querySelectorAll("path").forEach((p) => p.classList.add("afx-draw")),
    ),
  );
}

function sparks(x: number, y: number): void {
  for (let i = 0; i < 14; i++) {
    const s = document.createElement("div");
    s.className = "afx-spark";
    s.setAttribute("aria-hidden", "true");
    s.style.left = `${x}px`;
    s.style.top = `${y}px`;
    document.body.appendChild(s);
    const a = rnd(0, Math.PI * 2);
    const d = rnd(20, 70);
    const anim = s.animate(
      [
        { transform: "translate(0,0)", opacity: 1 },
        { transform: `translate(${Math.cos(a) * d}px,${Math.sin(a) * d + 18}px)`, opacity: 0 },
      ],
      { duration: rnd(350, 650), easing: "ease-out" },
    );
    anim.onfinish = () => s.remove();
  }
}

/* ------------------------------------------------------------------ */
/* FULL — desktop                                                      */
/* ------------------------------------------------------------------ */

function playFull(x: number, y: number): void {
  const side = x > window.innerWidth - 110 ? -1 : 1;

  const overlay = document.createElementNS(NS, "svg");
  overlay.setAttribute("class", "afx-overlay");
  overlay.setAttribute("aria-hidden", "true");

  const flash = document.createElement("div");
  flash.className = "afx-flash";
  flash.setAttribute("aria-hidden", "true");
  flash.style.setProperty("--x", `${x}px`);
  flash.style.setProperty("--y", `${y}px`);

  const alien = document.createElement("div");
  alien.className = "afx-alien";
  alien.setAttribute("aria-hidden", "true");
  alien.innerHTML = UFO_FULL;
  alien.style.top = `${y - 24}px`;
  alien.style.left = `${side > 0 ? x + 24 : x - 24 - 64}px`;
  if (side < 0) (alien.firstElementChild as SVGElement).style.transform = "scaleX(-1)";

  document.body.append(overlay, flash, alien);

  const shakeEl = AFX_CONFIG.shakeSelector
    ? document.querySelector<HTMLElement>(AFX_CONFIG.shakeSelector)
    : null;

  const tx = side > 0 ? x + 56 : x - 56;
  const ty = y + 6;
  let beam: SVGLineElement | null = null;

  requestAnimationFrame(() => alien.classList.add("afx-in"));

  later(() => {
    beam = document.createElementNS(NS, "line");
    beam.setAttribute("class", "afx-beam");
    beam.setAttribute("x1", String(tx));
    beam.setAttribute("y1", String(ty));
    beam.setAttribute("x2", String(x));
    beam.setAttribute("y2", String(y));
    overlay.appendChild(beam);
  }, 320);

  later(() => {
    const g = buildCracks(x, y, {
      rays: 9, lenMin: 90, lenMax: 260, steps: [4, 7],
      branches: true, ring: true, baseDelayMs: 0, staggerMs: 8,
    });
    overlay.appendChild(g);
    startDraw(g);
    sparks(x, y);
    flash.classList.add("afx-go");
    shakeEl?.classList.add("afx-shake");
  }, 420);

  later(() => sparks(x, y), 750);

  later(() => {
    (beam as SVGLineElement | null)?.remove();
    alien.classList.add("afx-out");
  }, 1250);

  later(() => overlay.classList.add("afx-out"), 1500);

  later(() => {
    alien.remove();
    overlay.remove();
    flash.remove();
    shakeEl?.classList.remove("afx-shake");
  }, AFX_CONFIG.fullTotalMs);
}

/* ------------------------------------------------------------------ */
/* LITE — mobile tab bar                                               */
/* ------------------------------------------------------------------ */

function playLite(x: number, y: number, icon?: Element | null): void {
  const zap = document.createElement("div");
  zap.className = "afx-zap";
  zap.setAttribute("aria-hidden", "true");
  zap.style.left = `${x}px`;
  zap.style.top = `${y}px`;

  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("class", "afx-f");
  svg.setAttribute("viewBox", "-48 -48 96 96");
  const g = buildCracks(0, 0, {
    rays: 6, lenMin: 10, lenMax: 18, steps: [3, 3],
    branches: false, ring: false, baseDelayMs: 270, staggerMs: 20,
  });
  svg.appendChild(g);

  const tractor = document.createElement("div");
  tractor.className = "afx-tractor-lite";

  const beam = document.createElement("div");
  beam.className = "afx-beam-lite";
  const alien = document.createElement("div");
  alien.className = "afx-al";
  alien.innerHTML = UFO_LITE;

  zap.append(svg, tractor, beam, alien);
  document.body.appendChild(zap);
  startDraw(g);

  if (icon) {
    icon.classList.remove("afx-glitch");
    later(() => icon.classList.add("afx-glitch"), 270);
    later(() => icon.classList.remove("afx-glitch"), 600);
  }
  later(() => zap.classList.add("afx-end"), 950);
  later(() => zap.remove(), AFX_CONFIG.liteTotalMs);
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

export function playAlienFx(
  x: number,
  y: number,
  mode: AlienFxMode = "full",
  iconEl?: Element | null,
): void {
  if (typeof window === "undefined" || prefersReducedMotion()) return;
  if (mode === "full") playFull(x, y);
  else playLite(x, y, iconEl);
}
