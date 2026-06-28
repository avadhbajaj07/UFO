# UFO LABZ — Design System & Visual Direction

This document defines the official design system, visual direction, and styling tokens for the **UFO LABZ** ecommerce platform. All developers, designers, and AI models contributing to this codebase should adhere strictly to these guidelines to maintain a unified, high-end experience.

> **Visual Mission Statement:**
> *"Apple designed a premium supplement brand for SpaceX astronauts."*

---

## 🌌 Primary Style: Futuristic Sci-Fi Luxury Ecommerce

The brand fuses high-end luxury sports nutrition with space exploration technology and neo-futurism. The user experience must prioritize immersive, high-contrast interfaces, rich typography, smooth micro-animations, and cinematic product presentation.

### Visual Pillars
- **Space Exploration & Cyberpunk:** Deep space backdrops layered with glowing neon accents and orbital paths.
- **Glassmorphism UI:** Frosted glass panels with thin border strokes to convey clinical transparency and clean lab-engineered precision.
- **Minimalist Swiss Layout:** Clean alignment, generous whitespace, and structured editorial hierarchies inspired by Swiss design principles.
- **Aurora Glow Lighting:** Rich atmospheric backlighting (gradients of cosmic purple and alien green) that makes components feel alive and interactive.

---

## 🎨 Color Palette & Mood

### 1. Base Backgrounds (Deep Space)
The interface avoids flat solid blacks in favor of multi-dimensional deep space navy and near-black hues to simulate infinite cosmic depth:
- **Deep Space Black (`space-950`):** `#06060F` (Body background)
- **Galaxy Navy (`space-900`):** `#0A0A1A` (Structural sections, main layouts)
- **Cosmic Indigo (`space-800`):** `#0E0E24` (Cards, panels, modal backdrops)
- **Stellar Blue (`space-700`):** `#12122E` (Dropdown borders, interactive hovers)

### 2. Accent Lighting (Aurora & Neon)
Accent colors are used strictly for visual energy, focus states, badge categories, and primary call-to-actions:
- **Alien Green (`#00FF88`):** Primary action buttons, success states, and high-performance highlights.
- **Cosmic Purple (`#9B30FF` / `nebula-400` `#C850FF`):** Brand color gradients, premium membership highlights, and secondary highlights.
- **Neon Blue / Electric Cyan (`#00CFFF`):** Hydration, purity, and cooling formulas indicators.
- **Electric Red (`#FF2244`):** High-energy, pre-workout, and warning indicators.
- **Mango Orange (`#FF8C00`):** Citric/fruit formulas, energy boost highlights.
- **Cosmic Muted (`#8888BB`):** Secondary text, descriptions, and labels.

---

## ✍️ Typography & Font Scale

We utilize a three-font system that contrasts futuristic technicality with bold editorial headers and readable body copies:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Display: Bebas Neue (Cursive/Impactful)                  │
│    - Used for massive hero titles, section headlines, caps. │
├─────────────────────────────────────────────────────────────┤
│ 2. Monospace: Orbitron (Futuristic/Tech)                    │
│    - Used for data readouts, countdowns, badges, tags.       │
├─────────────────────────────────────────────────────────────┤
│ 3. Sans-Serif: Inter (Clean/Accessible)                    │
│    - Used for readable body text, paragraphs, form labels.  │
└─────────────────────────────────────────────────────────────┘
```

---

## 💠 UI Component Patterns

### 1. Floating Glass Cards
All product cards, feedback cards, and informational blocks must implement the frosted glass style:
- **CSS Class:** `.card-glass`
- **Tailwind equivalent:** `bg-space-800/60 border border-white/[0.06] backdrop-blur-sm`
- **Hover behavior:** Apply `hover:shadow-card-hover hover:border-nebula-600/30 hover:scale-[1.01] transition-all duration-300`

### 2. Neon Borders & Glows
Use glowing text shadows and shadows sparingly to draw focus to premium elements:
- **Green Glow:** `.text-glow-green` (`text-shadow: 0 0 15px rgba(0, 255, 136, 0.4)`)
- **Purple Glow:** `.text-glow-purple` (`text-shadow: 0 0 20px rgba(155, 48, 255, 0.5)`)
- **Glow Shadow:** `shadow-glow-green` / `shadow-glow-purple`

### 3. UFO Beam Lighting (Gradients)
Use absolute-positioned divs with huge blur values (`blur-[100px]` or `blur-[120px]`) and low opacities to simulate ambient space nebulas:
```tsx
{/* Ambient Purple Nebula Glow */}
<div className="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full bg-nebula-500/10 blur-[120px] pointer-events-none" />
```

---

## 🛸 Interactive Experience & Micro-Animations

To generate the **"Wow Factor"**, all interactions must feel exceptionally fluid:
- **Buttons (`.btn-primary`, `.btn-outline`):** Must scale slightly up on hover (`hover:scale-[1.02]`) and shrink on active tap (`active:scale-[0.98]`).
- **Floating Objects:** Subtle vertical floats to suggest zero-gravity (`animate-float`).
- **Staggered Page Entrances:** Use `animate-fade-in-up` with staggered delay styles (`animation-delay: 100ms`, `200ms`, etc.) on load.
- **Interactive States:** Changes in hover states (e.g. flavor selector dropdowns, cart additions) should slide/fade smoothly using standard cubic-bezier transitions (`transition-all duration-300`).

---

## ⚡ Design References & Inspiration
For any new page mockups or custom components, draw inspiration directly from:
1. **Apple & Tesla:** Premium product presentation, ultra-clean product detailed spec highlights, generous padding.
2. **SpaceX:** Geometric precision, dark industrial UI, functional telemetry indicators.
3. **Nothing.tech:** Retro-futuristic dot-matrix branding accents, transparent materials, clean grids.
4. **Razer & Alienware:** Immersive neon RGB accents against dark carbon-black structures.
5. **Linear & Stripe:** Ultra-clean layouts, premium gradients, and glass navigation menus.
