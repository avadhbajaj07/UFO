# SKILLS_REQUIRED.md
# What Claude Code Must Know to Build This Project
# Reference guide for onboarding AI agents and developers

---

## 🤖 SKILLS THIS PROJECT REQUIRES FROM CLAUDE CODE

### 1. Next.js 14 App Router
**Must know:**
- App Router directory conventions (`app/`, route groups `(name)/`, layouts, `page.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`)
- Server Components vs Client Components — when to use each
- `"use client"` directive — only add when needed (hooks, event handlers, browser APIs)
- Nested layouts and template files
- Dynamic routes (`[slug]`, `[...slug]`, `[[...slug]]`)
- `generateStaticParams()` for SSG
- `generateMetadata()` for SEO per page
- `revalidatePath()` and `revalidateTag()` for ISR
- Route Handlers (`app/api/*/route.ts`) with `NextRequest` / `NextResponse`
- `next.config.js` — image domains, redirects, rewrites, headers
- Middleware (`middleware.ts`) — edge runtime, matcher patterns
- Loading UI with React Suspense
- Error boundaries with `error.tsx`

**Patterns we use:**
```typescript
// Server Component (default — no "use client")
export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug); // direct DB call
  return <ProductDetail product={product} />;
}

// Client Component (only when needed)
"use client";
export function AddToCartButton({ variant }: { variant: ProductVariant }) {
  const { addItem } = useCartStore();
  return <button onClick={() => addItem(variant)}>Add to cart</button>;
}
```

---

### 2. TypeScript (Strict Mode)
**Must know:**
- Strict mode is ON — no `any`, no implicit `any`
- Utility types: `Partial<T>`, `Required<T>`, `Pick<T, K>`, `Omit<T, K>`, `Record<K, V>`
- Discriminated unions for status types
- Generic functions and components
- `as const` for config objects
- Type guards (`is`, `instanceof`)
- Template literal types

**Our rules:**
- Every function has explicit return type
- Every component has typed props
- No `// @ts-ignore` or `// @ts-nocheck`

---

### 3. Supabase (PostgreSQL + Auth + RLS)
**Must know:**
- `createBrowserClient` vs `createServerClient` (@supabase/ssr)
- Query builder: `.select()`, `.insert()`, `.update()`, `.upsert()`, `.delete()`
- Filters: `.eq()`, `.in()`, `.gte()`, `.ilike()`, `.textSearch()`
- `.order()`, `.range()` for pagination
- Joins: `.select('*, category:categories(*), variants:product_variants(*)')`
- RLS: every table has policies — queries automatically respect them
- Auth: `supabase.auth.getUser()` — not `getSession()` (for server-side)
- Realtime subscriptions (used for stock updates)
- Supabase Storage for user-uploaded content
- TypeScript types: always use generated `Database` type from `types/database.ts`

**Critical:** Run `npm run gen:types` after any schema change:
```bash
supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.ts
```

---

### 4. Stripe (Payments)
**Must know:**
- PaymentIntent flow (not legacy Charges)
- Stripe Elements / Payment Element (not custom card forms — PCI DSS)
- `stripe.paymentIntents.create()` server-side only
- `stripe.webhooks.constructEvent()` for webhook verification
- Webhook events: `payment_intent.succeeded`, `payment_intent.payment_failed`
- Idempotency keys to prevent duplicate orders
- EU payment methods: SEPA, iDEAL, Bancontact, Klarna
- Test card numbers for development

---

### 5. Tailwind CSS v3
**Must know:**
- Mobile-first responsive: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- Custom design tokens in `tailwind.config.ts`
- `cn()` utility for conditional classes (clsx + tailwind-merge)
- `@apply` for component extraction (use sparingly)
- Dark mode with `dark:` prefix
- Container queries with `@container`
- Arbitrary values: `w-[342px]`, `bg-[#1a1a1a]`

**Our `cn()` utility:**
```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
```

---

### 6. Zustand (State Management)
**Must know:**
- `create()` with immer middleware for complex state
- `persist` middleware with `createJSONStorage`
- `partialize` to control what gets persisted
- Computed values as functions (not stored state)
- Selectors to prevent unnecessary re-renders

---

### 7. EU E-Commerce Law
**Must know:**
- VAT rules: B2C destination principle (charge buyer's country rate)
- VAT OSS: report multi-country sales to home authority
- B2B reverse charge: valid EU VAT number = zero VAT, buyer self-accounts
- GDPR: explicit consent before tracking, right to erasure, data portability
- Distance selling: 14-day cooling-off period, clear return policy
- Price display: always show VAT-inclusive for B2C in EU
- Consumer rights: pre-contractual information, order confirmation

---

### 8. Performance & SEO
**Must know:**
- `next/image` for all images (automatic WebP, responsive srcsets, lazy load)
- `next/font` for font loading (no FOUT, optimal CLS)
- Dynamic imports `next/dynamic` for heavy client components
- `generateMetadata()` with proper OG tags, structured data (JSON-LD)
- ISR with `revalidate` for product pages
- Suspense boundaries for progressive loading
- Core Web Vitals: LCP, FID/INP, CLS targets

---

### 9. Internationalization (i18n)
**Must know:**
- Locale-aware routing (middleware-based)
- `Intl.NumberFormat` for currency/number formatting
- `Intl.DateTimeFormat` for date formatting
- RTL support considerations
- JSONB localized fields in DB: `{ "en": "...", "de": "..." }`
- `getLocalizedField(field, locale, fallback)` pattern

---

### 10. Accessibility (WCAG 2.1 AA)
**Must know:**
- Semantic HTML: `<nav>`, `<main>`, `<article>`, `<button>` (not `<div onClick>`)
- ARIA labels for icon-only buttons
- Focus management in modals and drawers
- Keyboard navigation for all interactive elements
- Color contrast ratios (4.5:1 for text)
- Skip navigation link
- Form labels and error messages

---

## 📦 KEY PACKAGES

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "@supabase/ssr": "^0.5.0",
    "@supabase/supabase-js": "^2.45.0",
    "stripe": "^16.0.0",
    "@stripe/stripe-js": "^4.0.0",
    "@stripe/react-stripe-js": "^2.8.0",
    "zustand": "^4.5.0",
    "react-hook-form": "^7.53.0",
    "zod": "^3.23.0",
    "@hookform/resolvers": "^3.9.0",
    "resend": "^4.0.0",
    "react-email": "^3.0.0",
    "cloudinary": "^2.5.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.5.0",
    "lucide-react": "^0.460.0"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "tailwindcss": "^3.4.0",
    "supabase": "^1.200.0"
  }
}
```

---

## 🧪 TESTING CARDS (Stripe)

| Scenario | Card Number |
|---|---|
| Successful payment | 4242 4242 4242 4242 |
| Requires 3DS auth | 4000 0027 6000 3184 |
| Payment declined | 4000 0000 0000 9995 |
| Insufficient funds | 4000 0000 0000 0069 |
| Use any future expiry date and any 3-digit CVC |

---

## 🚨 COMMON MISTAKES TO AVOID

1. **Using `supabase.auth.getSession()` server-side** — Use `getUser()` instead (more secure)
2. **Importing `config/env.ts` in Client Components** — Will expose secrets, use `config/client.ts`
3. **Formatting prices manually** — Always use `formatPrice()` from `lib/utils/currency.ts`
4. **Showing prices ex-VAT to B2C** — EU law requires VAT-inclusive prices
5. **Firing analytics without consent check** — Always check `useConsent().canUseAnalytics`
6. **Using `<div onClick>` for interactive elements** — Always use `<button>` for accessibility
7. **Skipping RLS** — Never use admin client for user-facing queries
8. **Storing full card data** — Never handle raw card numbers, let Stripe Elements handle it
9. **Missing `loading.tsx`** — Every data-fetching page needs a loading state
10. **Not updating TASKS.md** — Always update task status after completing work

---

_This file is agent-readable context. Update when patterns change._
