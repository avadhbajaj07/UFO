-- Add Marine Collagen category if it doesn't exist
INSERT INTO categories (name, slug, sort_order)
VALUES ('{"en":"Marine Collagen","de":"Marines Kollagen"}', 'marine-collagen', 5)
ON CONFLICT (slug) DO NOTHING;

-- Also add a fallback for the typo in the URL
INSERT INTO categories (name, slug, sort_order)
VALUES ('{"en":"Marine Collagen","de":"Marines Kollagen"}', 'marin-collagen', 6)
ON CONFLICT (slug) DO NOTHING;

-- Map the collagen product to the new category
UPDATE products
SET category_id = (SELECT id FROM categories WHERE slug = 'marine-collagen')
WHERE slug = 'astro-collagen' OR slug = 'astro-collagen-peptide';
