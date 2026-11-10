-- Migration: Update UFO LABZ Catalog Pricing & Images
-- Amino: 39.90 CHF / 43.35 EUR
-- Blast: 39.90 CHF / 43.35 EUR
-- Creatine: 29.90 CHF / 32.49 EUR
-- Magnesium: 34.90 CHF / 37.92 EUR
-- Collagen: 39.90 CHF / 43.35 EUR
-- Free delivery threshold: 75.0 CHF / EUR

-- 1. Products Base Price Update
UPDATE products SET base_price = 29.90, updated_at = NOW() WHERE slug = 'astro-creatine';
UPDATE products SET base_price = 39.90, updated_at = NOW() WHERE slug IN ('amino-fuel-mango', 'amino-fuel-blue-raspberry', 'amino-fuel-blue');
UPDATE products SET base_price = 39.90, updated_at = NOW() WHERE slug IN ('blast-pre-workout-energy', 'blast-pre-workout-blue');
UPDATE products SET base_price = 39.90, updated_at = NOW() WHERE slug IN ('astro-collagen-peptide', 'astro-collagen');
UPDATE products SET base_price = 34.90, updated_at = NOW() WHERE slug = 'magnesium';

-- 2. Variants Price Update
UPDATE product_variants SET price = 29.90, updated_at = NOW() WHERE sku = 'ASTRO-300G';
UPDATE product_variants SET price = 39.90, updated_at = NOW() WHERE sku IN ('AMNO-MANGO-300G', 'AMNO-BLUE-300G', 'AMINO-MANGO');
UPDATE product_variants SET price = 39.90, updated_at = NOW() WHERE sku IN ('BLAST-ENERGY-300G', 'BLAST-BLUE-300G');
UPDATE product_variants SET price = 39.90, updated_at = NOW() WHERE sku = 'COL-300G';
UPDATE product_variants SET price = 34.90, updated_at = NOW() WHERE sku = 'SKU-MAGNESIUM-960';

-- 3. Ensure Cloudinary product images are synced
UPDATE product_images 
SET url = 'https://res.cloudinary.com/dm4jfxbcs/image/upload/v1794316727/NEW_NOVA_COLLAGEN_1_y4eyr2.png',
    updated_at = NOW()
WHERE product_id IN (SELECT id FROM products WHERE slug IN ('astro-collagen', 'astro-collagen-peptide')) AND is_primary = true;

UPDATE product_images 
SET url = 'https://res.cloudinary.com/dm4jfxbcs/image/upload/v1794316725/Flacon_de_magne%CC%81sium_au_design_extraterrestre_1_oo2r28.png',
    updated_at = NOW()
WHERE product_id IN (SELECT id FROM products WHERE slug = 'magnesium') AND is_primary = true;
