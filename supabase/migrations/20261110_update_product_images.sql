-- Migration: 20261110_update_product_images.sql
-- Description: Update primary product images for Magnesium, Marine Collagen, and Astro Creatine

-- 1. Astro Creatine Pure: UFO4_nuzyls.png
UPDATE public.product_images
SET url = 'https://res.cloudinary.com/dm4jfxbcs/image/upload/v1782667544/UFO4_nuzyls.png',
    updated_at = now()
WHERE product_id IN (SELECT id FROM public.products WHERE slug = 'astro-creatine')
  AND is_primary = true;

-- If no primary image exists, insert one
INSERT INTO public.product_images (product_id, url, alt, is_primary, sort_order)
SELECT id, 'https://res.cloudinary.com/dm4jfxbcs/image/upload/v1782667544/UFO4_nuzyls.png', '{"en":"Astro Creatine Pure Tub"}', true, 1
FROM public.products
WHERE slug = 'astro-creatine'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_images WHERE product_id = products.id AND is_primary = true
  );

-- 2. Nova Marine Collagen: NEW_NOVA_COLLAGEN_1_y4eyr2.png
UPDATE public.product_images
SET url = 'https://res.cloudinary.com/dm4jfxbcs/image/upload/v1794316727/NEW_NOVA_COLLAGEN_1_y4eyr2.png',
    updated_at = now()
WHERE product_id IN (SELECT id FROM public.products WHERE slug IN ('astro-collagen', 'astro-collagen-peptide'))
  AND is_primary = true;

INSERT INTO public.product_images (product_id, url, alt, is_primary, sort_order)
SELECT id, 'https://res.cloudinary.com/dm4jfxbcs/image/upload/v1794316727/NEW_NOVA_COLLAGEN_1_y4eyr2.png', '{"en":"Nova Marine Collagen Peptide"}', true, 1
FROM public.products
WHERE slug IN ('astro-collagen', 'astro-collagen-peptide')
  AND NOT EXISTS (
    SELECT 1 FROM public.product_images WHERE product_id = products.id AND is_primary = true
  );

-- 3. Magnesium: Flacon_de_magne%CC%81sium_au_design_extraterrestre_1_oo2r28.png
UPDATE public.product_images
SET url = 'https://res.cloudinary.com/dm4jfxbcs/image/upload/v1794316725/Flacon_de_magne%CC%81sium_au_design_extraterrestre_1_oo2r28.png',
    updated_at = now()
WHERE product_id IN (SELECT id FROM public.products WHERE slug = 'magnesium')
  AND is_primary = true;

INSERT INTO public.product_images (product_id, url, alt, is_primary, sort_order)
SELECT id, 'https://res.cloudinary.com/dm4jfxbcs/image/upload/v1794316725/Flacon_de_magne%CC%81sium_au_design_extraterrestre_1_oo2r28.png', '{"en":"Magnesium 90 Capsules"}', true, 1
FROM public.products
WHERE slug = 'magnesium'
  AND NOT EXISTS (
    SELECT 1 FROM public.product_images WHERE product_id = products.id AND is_primary = true
  );
