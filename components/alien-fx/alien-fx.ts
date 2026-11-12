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

const ALIEN_FULL =
  '<svg viewBox="0 0 54 54"><g class="afx-bob">' +
  '<ellipse cx="29" cy="46" rx="9" ry="6" fill="#4fc23f"/>' +
  '<ellipse cx="29" cy="22" rx="15" ry="16" fill="#7cff6b"/>' +
  '<ellipse cx="23" cy="24" rx="5" ry="7.5" fill="#05050a" transform="rotate(18 23 24)"/>' +
  '<ellipse cx="35" cy="24" rx="5" ry="7.5" fill="#05050a" transform="rotate(-18 35 24)"/>' +
  '<circle cx="21.5" cy="21.5" r="1.4" fill="#fff"/><circle cx="33.5" cy="21.5" r="1.4" fill="#fff"/>' +
  '<line x1="22" y1="8" x2="19" y2="1" stroke="#7cff6b" stroke-width="2"/><circle cx="19" cy="1.5" r="2" fill="#fff36b"/>' +
  '<line x1="36" y1="8" x2="39" y2="1" stroke="#7cff6b" stroke-width="2"/><circle cx="39" cy="1.5" r="2" fill="#fff36b"/>' +
  '<path d="M22 44 L12 36" stroke="#4fc23f" stroke-width="3.5" stroke-linecap="round"/>' +
  '<rect x="2" y="30" width="14" height="7" rx="2" fill="#2b2f4a" stroke="#a6a9ff" stroke-width="1" transform="rotate(-30 9 33)"/>' +
  '<circle cx="3" cy="29" r="2.2" fill="#8dff7a"/></g></svg>';

const ALIEN_LITE =
  '<svg viewBox="0 0 28 34"><ellipse cx="14" cy="28" rx="5" ry="4" fill="#3fbf6f"/>' +
  '<ellipse cx="14" cy="13" rx="9" ry="10" fill="#7cff6b"/>' +
  '<ellipse cx="10.5" cy="14.5" rx="2.8" ry="4.3" fill="#05050a" transform="rotate(18 10.5 14.5)"/>' +
  '<ellipse cx="17.5" cy="14.5" rx="2.8" ry="4.3" fill="#05050a" transform="rotate(-18 17.5 14.5)"/>' +
  '<circle cx="10" cy="13" r=".9" fill="#fff"/><circle cx="17" cy="13" r=".9" fill="#fff"/>' +
  '<line x1="10" y1="4" x2="8" y2="0.5" stroke="#7cff6b" stroke-width="1.2"/>' +
  '<line x1="18" y1="4" x2="20" y2="0.5" stroke="#7cff6b" stroke-width="1.2"/>' +
  '<rect x="13" y="26" width="3" height="8" rx="1" fill="#2b2f4a" stroke="#a6a9ff" stroke-width=".6"/></svg>';

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
  alien.innerHTML = ALIEN_FULL;
  alien.style.top = `${y - 14}px`;
  alien.style.left = `${side > 0 ? x + 26 : x - 26 - 54}px`;
  if (side < 0) (alien.firstElementChild as SVGElement).style.transform = "scaleX(-1)";

  document.body.append(overlay, flash, alien);

  const shakeEl = AFX_CONFIG.shakeSelector
    ? document.querySelector<HTMLElement>(AFX_CONFIG.shakeSelector)
    : null;

  const tx = side > 0 ? x + 29 : x - 29;
  const ty = y + 15;
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

  const beam = document.createElement("div");
  beam.className = "afx-beam-lite";
  const alien = document.createElement("div");
  alien.className = "afx-al";
  alien.innerHTML = ALIEN_LITE;

  zap.append(svg, beam, alien);
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
