-- Migration: 20261109_update_pricing_remove_pickup_discount.sql
-- Description: Update UFO LABZ product pricing and remove 50% discount on second unit for store pickup.

-- 1. Update Product Retail Base Prices
-- Creatine 300g: 23.27
UPDATE products
SET base_price = 23.27,
    status = 'active',
    featured = true
WHERE slug = 'astro-creatine';

-- EAA 300g: 32.37
UPDATE products
SET base_price = 32.37,
    status = 'active',
    featured = true
WHERE slug IN ('amino-fuel-mango', 'amino-fuel-blue-raspberry', 'amino-fuel-blue');

-- BLAST Pre-workout 300g: 38.87
UPDATE products
SET base_price = 38.87,
    status = 'active',
    featured = true
WHERE slug IN ('blast-pre-workout-energy', 'blast-pre-workout-blue');

-- Marine Collagen 300g: 38.87
UPDATE products
SET base_price = 38.87,
    status = 'active',
    featured = true
WHERE slug IN ('astro-collagen-peptide', 'astro-collagen');

-- Magnesium 90 capsules: 19.37
UPDATE products
SET base_price = 19.37,
    status = 'active',
    featured = true
WHERE slug = 'magnesium';

-- 2. Update Product Variant Prices & Defaults
-- Creatine 300g
UPDATE product_variants
SET price = 23.27,
    is_default = true,
    status = 'active'
WHERE sku = 'ASTRO-300G';

-- EAA 300g (Mango & Blue Raspberry)
UPDATE product_variants
SET price = 32.37,
    is_default = true,
    status = 'active'
WHERE sku IN ('AMNO-MANGO-300G', 'AMNO-BLUE-300G', 'AMINO-MANGO', 'var-ab1');

-- BLAST Pre-workout 300g (Energy & Blue Raspberry)
UPDATE product_variants
SET price = 38.87,
    is_default = true,
    status = 'active'
WHERE sku IN ('BLAST-ENERGY-300G', 'BLAST-BLUE-300G');

-- Marine Collagen 300g
UPDATE product_variants
SET price = 38.87,
    is_default = true,
    status = 'active'
WHERE sku = 'COL-300G';

-- Magnesium 90 capsules
UPDATE product_variants
SET price = 19.37,
    is_default = true,
    status = 'active'
WHERE sku = 'SKU-MAGNESIUM-960';
