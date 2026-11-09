-- Migration: 20261109_build_your_stack.sql
-- Description: Tables, RLS policies, and seed data for the "Build Your Stack" feature.

-- 1. Create stack_tiers table (Configurable discount tiers)
CREATE TABLE IF NOT EXISTS public.stack_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  min_units INT NOT NULL UNIQUE,
  discount_percent INT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed default stack tiers
INSERT INTO public.stack_tiers (min_units, discount_percent, is_active, sort_order)
VALUES 
  (2, 10, true, 1),
  (3, 15, true, 2)
ON CONFLICT (min_units) DO UPDATE SET
  discount_percent = EXCLUDED.discount_percent,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();

-- 2. Create preset_stacks table (Curated presets)
CREATE TABLE IF NOT EXISTS public.preset_stacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  badge TEXT,
  discount_percent INT NOT NULL DEFAULT 10,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Create preset_stack_items table
CREATE TABLE IF NOT EXISTS public.preset_stack_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  preset_id UUID NOT NULL REFERENCES public.preset_stacks(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  product_slug TEXT NOT NULL,
  variant_sku TEXT,
  quantity INT NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed curated preset stacks
-- Preset 1: Strength Duo (Creatine 300g + Amino Fuel EAA 300g)
INSERT INTO public.preset_stacks (slug, name, tagline, description, badge, discount_percent, is_active, sort_order)
VALUES (
  'strength-duo',
  'Strength Duo',
  'ATP Regeneration & Lean Muscle Synthesis',
  'Pure micronized creatine monohydrate combined with fermented full-spectrum EAAs for explosive power and intra-workout stamina.',
  'Strength & Power',
  10,
  true,
  1
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  badge = EXCLUDED.badge,
  discount_percent = EXCLUDED.discount_percent,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();

-- Preset 2: Recovery Duo (Magnesium 90 Caps + Marine Collagen 300g)
INSERT INTO public.preset_stacks (slug, name, tagline, description, badge, discount_percent, is_active, sort_order)
VALUES (
  'recovery-duo',
  'Recovery Duo',
  'Cellular Rest, Tendon & Joint Longevity',
  'Chelated magnesium bisglycinate paired with hydrolyzed bioactive marine collagen peptides to optimize neuromuscular recovery and joint integrity.',
  'Deep Recovery',
  10,
  true,
  2
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  badge = EXCLUDED.badge,
  discount_percent = EXCLUDED.discount_percent,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();

-- Preset 3: Full Orbit Stack (BLAST Pre-Workout + Creatine + EAA)
INSERT INTO public.preset_stacks (slug, name, tagline, description, badge, discount_percent, is_active, sort_order)
VALUES (
  'full-orbit-stack',
  'Full Orbit Stack',
  'The Complete High-Performance Protocol',
  'Laser pre-workout focus, cellular ATP saturation, and complete intra-workout muscle preservation. The ultimate three-pillar Swiss protocol.',
  'Top Value · 15% Off',
  15,
  true,
  3
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  badge = EXCLUDED.badge,
  discount_percent = EXCLUDED.discount_percent,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();

-- Seed preset items
DELETE FROM public.preset_stack_items WHERE preset_id IN (SELECT id FROM public.preset_stacks WHERE slug IN ('strength-duo', 'recovery-duo', 'full-orbit-stack'));

-- Items for Strength Duo
INSERT INTO public.preset_stack_items (preset_id, product_id, variant_id, product_slug, variant_sku, quantity, sort_order)
SELECT 
  (SELECT id FROM public.preset_stacks WHERE slug = 'strength-duo'),
  '5ccc0296-df9c-4560-ba43-496e79665aac',
  '41e83bf4-2c4b-4f87-9019-aca3960f268c',
  'astro-creatine',
  'ASTRO-300G',
  1,
  1;

INSERT INTO public.preset_stack_items (preset_id, product_id, variant_id, product_slug, variant_sku, quantity, sort_order)
SELECT 
  (SELECT id FROM public.preset_stacks WHERE slug = 'strength-duo'),
  'adbb6060-0125-4d38-871f-d9808d01c048',
  'e36a0dc0-9d4f-4d57-81b7-12cb7e61d43a',
  'amino-fuel-mango',
  'AMNO-MANGO-300G',
  1,
  2;

-- Items for Recovery Duo
INSERT INTO public.preset_stack_items (preset_id, product_id, variant_id, product_slug, variant_sku, quantity, sort_order)
SELECT 
  (SELECT id FROM public.preset_stacks WHERE slug = 'recovery-duo'),
  '5cd5033d-002b-4f89-a135-d14c0a019625',
  'b08be57c-17b4-49d3-a2bc-df41cb88ad4b',
  'magnesium',
  'SKU-MAGNESIUM-960',
  1,
  1;

INSERT INTO public.preset_stack_items (preset_id, product_id, variant_id, product_slug, variant_sku, quantity, sort_order)
SELECT 
  (SELECT id FROM public.preset_stacks WHERE slug = 'recovery-duo'),
  '850b8ebc-caf4-4a18-83e9-4a7f2d6a0412',
  '4ecb2866-9067-45cc-bddf-1e79b549c64d',
  'astro-collagen-peptide',
  'COL-300G',
  1,
  2;

-- Items for Full Orbit Stack
INSERT INTO public.preset_stack_items (preset_id, product_id, variant_id, product_slug, variant_sku, quantity, sort_order)
SELECT 
  (SELECT id FROM public.preset_stacks WHERE slug = 'full-orbit-stack'),
  '66dd3409-e2f7-4015-8a39-d3aaa1f9941a',
  'd17fe515-1b23-47f5-a017-898d03ab7ccc',
  'blast-pre-workout-energy',
  'BLAST-ENERGY-300G',
  1,
  1;

INSERT INTO public.preset_stack_items (preset_id, product_id, variant_id, product_slug, variant_sku, quantity, sort_order)
SELECT 
  (SELECT id FROM public.preset_stacks WHERE slug = 'full-orbit-stack'),
  '5ccc0296-df9c-4560-ba43-496e79665aac',
  '41e83bf4-2c4b-4f87-9019-aca3960f268c',
  'astro-creatine',
  'ASTRO-300G',
  1,
  2;

INSERT INTO public.preset_stack_items (preset_id, product_id, variant_id, product_slug, variant_sku, quantity, sort_order)
SELECT 
  (SELECT id FROM public.preset_stacks WHERE slug = 'full-orbit-stack'),
  'adbb6060-0125-4d38-871f-d9808d01c048',
  'e36a0dc0-9d4f-4d57-81b7-12cb7e61d43a',
  'amino-fuel-mango',
  'AMNO-MANGO-300G',
  1,
  3;

-- 4. Create email_signups table (with Swiss nDSG & GDPR consent)
CREATE TABLE IF NOT EXISTS public.email_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'build_your_stack',
  consent_given BOOLEAN NOT NULL DEFAULT true,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. RLS Policies
ALTER TABLE public.stack_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.preset_stacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.preset_stack_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_signups ENABLE ROW LEVEL SECURITY;

-- Public read for active tiers and presets
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'stack_tiers' AND policyname = 'Allow public read active stack_tiers') THEN
    CREATE POLICY "Allow public read active stack_tiers" ON public.stack_tiers FOR SELECT USING (is_active = true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'preset_stacks' AND policyname = 'Allow public read active preset_stacks') THEN
    CREATE POLICY "Allow public read active preset_stacks" ON public.preset_stacks FOR SELECT USING (is_active = true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'preset_stack_items' AND policyname = 'Allow public read preset_stack_items') THEN
    CREATE POLICY "Allow public read preset_stack_items" ON public.preset_stack_items FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'email_signups' AND policyname = 'Allow insert email_signups') THEN
    CREATE POLICY "Allow insert email_signups" ON public.email_signups FOR INSERT WITH CHECK (true);
  END IF;
END $$;
