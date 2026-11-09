-- Migration: 20261109_preorder_pricing.sql
-- Description: Update UFO LABZ to Pre-Order-Only Store with central pricing and preorder_confirmed status.

-- 1. Add 'preorder_confirmed' to order_status enum if not present
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum
    JOIN pg_type ON pg_type.oid = pg_enum.enumtypid
    WHERE pg_type.typname = 'order_status' AND pg_enum.enumlabel = 'preorder_confirmed'
  ) THEN
    ALTER TYPE order_status ADD VALUE 'preorder_confirmed';
  END IF;
END $$;

-- 2. Update Product Retail Base Prices
-- Creatine 300g: 32.37
UPDATE products
SET base_price = 32.37,
    status = 'active',
    featured = true
WHERE slug = 'astro-creatine';

-- EAA 300g: 45.37
UPDATE products
SET base_price = 45.37,
    status = 'active',
    featured = true
WHERE slug IN ('amino-fuel-mango', 'amino-fuel-blue-raspberry', 'amino-fuel-blue');

-- BLAST Pre-workout 300g: 51.87
UPDATE products
SET base_price = 51.87,
    status = 'active',
    featured = true
WHERE slug IN ('blast-pre-workout-energy', 'blast-pre-workout-blue');

-- Marine Collagen 300g: 51.87
UPDATE products
SET base_price = 51.87,
    status = 'active',
    featured = true
WHERE slug IN ('astro-collagen-peptide', 'astro-collagen');

-- Magnesium 90 capsules: 25.87
UPDATE products
SET base_price = 25.87,
    status = 'active',
    featured = true
WHERE slug = 'magnesium';

-- 3. Update Product Variant Prices & Defaults
-- Creatine 300g
UPDATE product_variants
SET price = 32.37,
    is_default = true,
    status = 'active'
WHERE sku = 'ASTRO-300G';

UPDATE product_variants
SET is_default = false
WHERE sku = 'ASTRO-500G';

-- EAA 300g (Mango & Blue Raspberry)
UPDATE product_variants
SET price = 45.37,
    is_default = true,
    status = 'active'
WHERE sku IN ('AMNO-MANGO-300G', 'AMNO-BLUE-300G', 'AMINO-MANGO', 'var-ab1');

-- BLAST Pre-workout 300g (Energy & Blue Raspberry)
UPDATE product_variants
SET price = 51.87,
    is_default = true,
    status = 'active'
WHERE sku IN ('BLAST-ENERGY-300G', 'BLAST-BLUE-300G');

-- Marine Collagen 300g
UPDATE product_variants
SET price = 51.87,
    is_default = true,
    status = 'active'
WHERE sku = 'COL-300G';

-- Magnesium 90 capsules
UPDATE product_variants
SET price = 25.87,
    is_default = true,
    status = 'active'
WHERE sku = 'SKU-MAGNESIUM-960';

-- 4. Set Pre-Order site setting
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'site_settings') THEN
    INSERT INTO site_settings (key, value)
    VALUES 
      ('preorder_mode', 'true'::jsonb),
      ('estimated_ship_date', '"Late March 2027 (Batch 01)"'::jsonb)
    ON CONFLICT (key) DO UPDATE SET
      value = EXCLUDED.value,
      updated_at = now();
  END IF;
END $$;
