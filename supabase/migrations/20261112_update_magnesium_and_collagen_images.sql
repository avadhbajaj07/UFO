-- Migration: Update Magnesium and Marine Collagen product images
-- Magnesium: https://qhwbmniqplygipszkhcb.supabase.co/storage/v1/object/public/product-images/magnesium.png
-- Nova Marine Collagen: https://qhwbmniqplygipszkhcb.supabase.co/storage/v1/object/public/product-images/nova-marine-collagen.png

UPDATE public.product_images
SET url = 'https://qhwbmniqplygipszkhcb.supabase.co/storage/v1/object/public/product-images/magnesium.png'
WHERE product_id IN (SELECT id FROM public.products WHERE slug = 'magnesium')
  AND is_primary = true;

UPDATE public.product_images
SET url = 'https://qhwbmniqplygipszkhcb.supabase.co/storage/v1/object/public/product-images/nova-marine-collagen.png'
WHERE product_id IN (SELECT id FROM public.products WHERE slug IN ('astro-collagen', 'astro-collagen-peptide'))
  AND is_primary = true;
