-- Migration: Update all products to high-resolution PNG renders on Supabase Storage CDN
-- 1. Astro Creatine Pure
UPDATE public.product_images
SET url = 'https://qhwbmniqplygipszkhcb.supabase.co/storage/v1/object/public/product-images/astro-creatine.png'
WHERE product_id IN (SELECT id FROM public.products WHERE slug = 'astro-creatine')
  AND is_primary = true;

-- 2. Amino Fuel EAA (Mango)
UPDATE public.product_images
SET url = 'https://qhwbmniqplygipszkhcb.supabase.co/storage/v1/object/public/product-images/amino-fuel-mango.png'
WHERE product_id IN (SELECT id FROM public.products WHERE slug = 'amino-fuel-mango')
  AND is_primary = true;

-- 3. Amino Fuel EAA (Blue Raspberry)
UPDATE public.product_images
SET url = 'https://qhwbmniqplygipszkhcb.supabase.co/storage/v1/object/public/product-images/amino-fuel-blue-raspberry.png'
WHERE product_id IN (SELECT id FROM public.products WHERE slug = 'amino-fuel-blue-raspberry')
  AND is_primary = true;

-- 4. Blast Pre-Workout (Energy Drink)
UPDATE public.product_images
SET url = 'https://qhwbmniqplygipszkhcb.supabase.co/storage/v1/object/public/product-images/blast-pre-workout-energy.png'
WHERE product_id IN (SELECT id FROM public.products WHERE slug = 'blast-pre-workout-energy')
  AND is_primary = true;

-- 5. Blast Pre-Workout (Blue Raspberry)
UPDATE public.product_images
SET url = 'https://qhwbmniqplygipszkhcb.supabase.co/storage/v1/object/public/product-images/blast-pre-workout-blue.png'
WHERE product_id IN (SELECT id FROM public.products WHERE slug = 'blast-pre-workout-blue')
  AND is_primary = true;
