-- ═══════════════════════════════════════════════════════════
-- UFO LABZ – Seed Data (Upsert Mode)
-- ═══════════════════════════════════════════════════════════

BEGIN;

-- ─── SUBSCRIPTION PLANS ───────────────────────────────────────
-- Delete existing plan records first to avoid duplicate entries since no unique index exists
DELETE FROM subscription_plans WHERE name->>'en' IN ('Monthly Delivery', 'Every 2 Months', 'Quarterly Supply', '6-Month Supply', 'Annual Supply');

INSERT INTO subscription_plans (name, interval, interval_count, discount_pct, sort_order) VALUES
  ('{"en":"Monthly Delivery","de":"Monatliche Lieferung"}', 'monthly', 1, 10, 1),
  ('{"en":"Every 2 Months","de":"Alle 2 Monate"}', 'bimonthly', 2, 12, 2),
  ('{"en":"Quarterly Supply","de":"Vierteljährliche Lieferung"}', 'quarterly', 3, 15, 3),
  ('{"en":"6-Month Supply","de":"6-Monats-Lieferung"}', 'biannual', 6, 20, 4),
  ('{"en":"Annual Supply","de":"Jährliche Lieferung"}', 'annual', 12, 25, 5);

-- ─── LOYALTY TIERS ────────────────────────────────────────────
-- Delete existing loyalty tier records to avoid duplicates
DELETE FROM loyalty_tiers WHERE name IN ('Earthling', 'Astronaut', 'Alien', 'Galaxy Elite');

INSERT INTO loyalty_tiers (name, min_points, multiplier, color, sort_order) VALUES
  ('Earthling', 0, 1.0, '#7777AA', 1),
  ('Astronaut', 1000, 1.25, '#00FF88', 2),
  ('Alien', 5000, 1.5, '#00CFFF', 3),
  ('Galaxy Elite', 15000, 2.0, '#9B30FF', 4);

-- ─── CATEGORIES ───────────────────────────────────────────────
INSERT INTO categories (name, slug, sort_order) VALUES
  ('{"en":"Creatine","de":"Kreatin"}', 'creatine', 1),
  ('{"en":"Pre Workout","de":"Pre Workout"}', 'pre-workout', 2),
  ('{"en":"Amino Acids","de":"Aminosäuren"}', 'amino-acids', 3),
  ('{"en":"Special Edition","de":"Spezialedition"}', 'special-edition', 4)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order;

-- ─── PRODUCTS ─────────────────────────────────────────────────
-- 1. Collagen
INSERT INTO products (
  name, slug, tagline, description, short_description,
  category_id, status, featured, product_color, color_name,
  base_price, gst_rate, track_inventory, sort_order, schema_markup
) VALUES (
  '{"en":"Astro Collagen Peptide","de":"Astro Kollagen Peptid"}',
  'astro-collagen',
  '{"en":"Interstellar Skin, Joint, and Bone Rejuvenation","de":"Interstellare Regeneration für Haut, Gelenke und Knochen"}',
  '{"en":"Astro Collagen Peptide is our high-purity, bioavailable grass-fed collagen formula. Engineered to counter the intense physical stress of athletic training and gravity-defying movement, each serving provides 10g of hydrolyzed Type I & III collagen peptides to rebuild cartilage, support joint integrity, and promote glowing skin.","de":"Astro Kollagen Peptid ist unsere hochreine, bioverfügbare Kollagenformel aus Weidehaltung. Entwickelt, um der intensiven körperlichen Belastung durch sportliches Training entgegenzuwirken, liefert jede Portion 10 g hydrolysierte Kollagenpeptide vom Typ I und III, um Knorpel wieder aufzubauen, die Gelenkintegrität zu unterstützen und strahlende Haut zu fördern."}',
  '{"en":"Premium hydrolyzed grass-fed collagen peptides optimized for rapid absorption, joint strength, and skin elasticity.","de":"Premium hydrolysierte Kollagenpeptide aus Weidehaltung, optimiert für schnelle Absorption, Gelenkstärke und Hautelastizität."}',
  (SELECT id FROM categories WHERE slug = 'special-edition'),
  'active', true, '#9B30FF', 'cosmic-purple',
  34.00, 8.1, true, 1,
  '{"key_benefits": ["Rebuilds Joint Cartilage & Connective Tissue", "Promotes Skin Hydration & Youthful Elasticity", "Hydrolyzed Peptides for Near-Instant Absorption", "Swiss Laboratory Quality Assured"]}'::jsonb
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_id = EXCLUDED.category_id,
  status = EXCLUDED.status,
  featured = EXCLUDED.featured,
  product_color = EXCLUDED.product_color,
  color_name = EXCLUDED.color_name,
  base_price = EXCLUDED.base_price,
  gst_rate = EXCLUDED.gst_rate,
  track_inventory = EXCLUDED.track_inventory,
  sort_order = EXCLUDED.sort_order,
  schema_markup = EXCLUDED.schema_markup;

-- 2. Blast Pre workout (energy Drink)
INSERT INTO products (
  name, slug, tagline, description, short_description,
  category_id, status, featured, product_color, color_name,
  base_price, gst_rate, track_inventory, sort_order, schema_markup
) VALUES (
  '{"en":"Blast Pre-Workout (Energy Drink)","de":"Blast Pre-Workout (Energy Drink)"}',
  'blast-pre-workout-energy',
  '{"en":"Ignite Explosive Energy. Destroy Every Set.","de":"Entfache explosive Energie. Zerstöre jeden Satz."}',
  '{"en":"Blast Pre-Workout is the most powerful pre-training formula we have ever created. Loaded with 8g of Citrulline Malate for explosive muscle pumps, 3.2g of Beta-Alanine to delay lactic acid buildup, and 200mg of natural clean caffeine, it is engineered to fuel peak athletic capacity under extreme physical stress.","de":"Blast Pre-Workout ist die stärkste Pre-Training-Formel, die wir je entwickelt haben. Geladen mit 8 g Citrullin-Malat für explosive Muskelpumps, 3,2 g Beta-Alanin zur Verzögerung der Milchsäurebildung und 200 mg natürlichem, reinem Koffein, wurde sie entwickelt, um die maximale sportliche Leistungsfähigkeit unter extremer körperlicher Belastung anzutreiben."}',
  '{"en":"Explosive energy and laser focus formula for extreme pre-workout performance in refreshing citrus energy drink flavor.","de":"Explosive Energie und Laserfokus-Formel für extreme Pre-Workout-Leistung im erfrischenden Zitrus-Energy-Drink-Geschmack."}',
  (SELECT id FROM categories WHERE slug = 'pre-workout'),
  'active', true, '#FF2244', 'electric-red',
  24.00, 8.1, true, 2,
  '{"key_benefits": ["Absolute Nitric Oxide Boost (Muscle Pumps)", "Promotes High-Intensity Endurance & Buffers Acid", "Clean, Sustainable Energy without Crashing", "Swiss Lab Certified Purity"]}'::jsonb
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_id = EXCLUDED.category_id,
  status = EXCLUDED.status,
  featured = EXCLUDED.featured,
  product_color = EXCLUDED.product_color,
  color_name = EXCLUDED.color_name,
  base_price = EXCLUDED.base_price,
  gst_rate = EXCLUDED.gst_rate,
  track_inventory = EXCLUDED.track_inventory,
  sort_order = EXCLUDED.sort_order,
  schema_markup = EXCLUDED.schema_markup;

-- 3. Astro creatine
INSERT INTO products (
  name, slug, tagline, description, short_description,
  category_id, status, featured, product_color, color_name,
  base_price, gst_rate, track_inventory, sort_order, schema_markup
) VALUES (
  '{"en":"Astro Creatine Pure","de":"Astro Kreatin Pur"}',
  'astro-creatine',
  '{"en":"Radioactive Strength From Another World","de":"Radioaktive Stärke aus einer anderen Welt"}',
  '{"en":"Astro Creatine Pure is our flagship alien-grade creatine monohydrate formula. Engineered with ultra-micronized particles (200 mesh) for near-instant solubility and maximum bioavailability, it helps increase ATP regeneration during high-intensity training, maximizing lean muscle mass gains and physical performance.","de":"Astro Kreatin Pur ist unsere Flaggschiff-Kreatin-Monohydrat-Formel der Extraklasse. Entwickelt mit ultra-mikronisierten Partikeln (200 Mesh) für nahezu sofortige Löslichkeit und maximale Bioverfügbarkeit, hilft es, die ATP-Regeneration während des hochintensiven Trainings zu steigern und den Zuwachs an magerer Muskelmasse sowie die körperliche Leistungsfähigkeit zu maximieren."}',
  '{"en":"Premium 100% micronized creatine monohydrate for explosive power, muscle hypertrophy, and cellular recovery.","de":"Premium 100% mikronisiertes Kreatin-Monohydrat für explosive Kraft, Muskelhypertrophie und zelluläre Erholung."}',
  (SELECT id FROM categories WHERE slug = 'creatine'),
  'active', true, '#00FF88', 'alien-green',
  19.00, 8.1, true, 3,
  '{"key_benefits": ["Increases Explosive Strength & Peak Power", "Accelerates Muscle Growth & Hydration", "Promotes Rapid ATP Resynthesis", "Swiss Laboratory Tested for 99.9% Purity"]}'::jsonb
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_id = EXCLUDED.category_id,
  status = EXCLUDED.status,
  featured = EXCLUDED.featured,
  product_color = EXCLUDED.product_color,
  color_name = EXCLUDED.color_name,
  base_price = EXCLUDED.base_price,
  gst_rate = EXCLUDED.gst_rate,
  track_inventory = EXCLUDED.track_inventory,
  sort_order = EXCLUDED.sort_order,
  schema_markup = EXCLUDED.schema_markup;

-- 4. Amino fuel EAA (mango) flavour
INSERT INTO products (
  name, slug, tagline, description, short_description,
  category_id, status, featured, product_color, color_name,
  base_price, gst_rate, track_inventory, sort_order, schema_markup
) VALUES (
  '{"en":"Amino Fuel EAA (Mango)","de":"Amino Fuel EAA (Mango)"}',
  'amino-fuel-mango',
  '{"en":"Tropical Recovery. Liquid Speed.","de":"Tropische Erholung. Flüssige Geschwindigkeit."}',
  '{"en":"Amino Fuel EAA (Mango) delivers a complete spectrum essential amino acid profile including all 9 EAAs (with a 2:1:1 BCAA ratio) alongside key hydration minerals. Formulated to support protein synthesis, combat muscle wastage during workouts, and speed recovery times.","de":"Amino Fuel EAA (Mango) liefert ein vollständiges Profil an essenziellen Aminosäuren, einschließlich aller 9 EAAs (mit einem BCAA-Verhältnis von 2:1:1), zusammen mit wichtigen Hydratationsmineralien. Formuliert, um die Proteinsynthese zu unterstützen, Muskelabbau während des Trainings zu bekämpfen und Erholungszeiten zu beschleunigen."}',
  '{"en":"Complete Essential Amino Acids (EAA) matrix with added hydration electrolytes in delicious mango flavor.","de":"Vollständige Matrix essenzieller Aminosäuren (EAA) mit zusätzlichen Hydratationselektrolyten in köstlichem Mango-Geschmack."}',
  (SELECT id FROM categories WHERE slug = 'amino-acids'),
  'active', true, '#FF8C00', 'mango-orange',
  17.90, 8.1, true, 4,
  '{"key_benefits": ["Triggers Muscle Protein Synthesis & Hypertrophy", "Reduces Muscle Soreness & Accelerates Healing", "Enhances Intra-Workout Hydration with Electrolytes", "100% Vegan Fermented Amino Acids"]}'::jsonb
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_id = EXCLUDED.category_id,
  status = EXCLUDED.status,
  featured = EXCLUDED.featured,
  product_color = EXCLUDED.product_color,
  color_name = EXCLUDED.color_name,
  base_price = EXCLUDED.base_price,
  gst_rate = EXCLUDED.gst_rate,
  track_inventory = EXCLUDED.track_inventory,
  sort_order = EXCLUDED.sort_order,
  schema_markup = EXCLUDED.schema_markup;

-- 5. Blast Pre Workout(blue raspberry) flavour
INSERT INTO products (
  name, slug, tagline, description, short_description,
  category_id, status, featured, product_color, color_name,
  base_price, gst_rate, track_inventory, sort_order, schema_markup
) VALUES (
  '{"en":"Blast Pre-Workout (Blue Raspberry)","de":"Blast Pre-Workout (Blaue Himbeere)"}',
  'blast-pre-workout-blue',
  '{"en":"Ice Cold Energy. Blue Lightning Focus.","de":"Eiskalte Energie. Blauer Blitz-Fokus."}',
  '{"en":"Blast Pre-Workout (Blue Raspberry) is our signature pre-training formula featuring a refreshing blue raspberry taste. Contains L-Citrulline, Beta-Alanine, and clean botanical caffeine to supercharge your training capacity, improve muscular pumps, and enhance mental concentration.","de":"Blast Pre-Workout (Blaue Himbeere) ist unsere typische Pre-Training-Formel mit einem erfrischenden blauen Himbeergeschmack. Enthält L-Citrullin, Beta-Alanin und sauberes botanisches Koffein, um Ihre Trainingskapazität aufzuladen, Muskelpumps zu verbessern und die mentale Konzentration zu steigern."}',
  '{"en":"Extreme pre-workout energy and focus formula featuring an electric blue raspberry flavor profile.","de":"Extreme Pre-Workout-Energie- und Fokusformel mit einem elektrisierenden blauen Himbeer-Geschmacksprofil."}',
  (SELECT id FROM categories WHERE slug = 'pre-workout'),
  'active', true, '#00CFFF', 'neon-blue',
  24.00, 8.1, true, 5,
  '{"key_benefits": ["Massive Nitric Oxide Influx (Vascularity)", "Buffers Muscular Lactic Acid Accumulation", "Heightened Mind-Muscle Connection", "100% Transparent Formula, Swiss Quality"]}'::jsonb
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_id = EXCLUDED.category_id,
  status = EXCLUDED.status,
  featured = EXCLUDED.featured,
  product_color = EXCLUDED.product_color,
  color_name = EXCLUDED.color_name,
  base_price = EXCLUDED.base_price,
  gst_rate = EXCLUDED.gst_rate,
  track_inventory = EXCLUDED.track_inventory,
  sort_order = EXCLUDED.sort_order,
  schema_markup = EXCLUDED.schema_markup;

-- 6. amino fuel eaa (blue raspberry) flavour
INSERT INTO products (
  name, slug, tagline, description, short_description,
  category_id, status, featured, product_color, color_name,
  base_price, gst_rate, track_inventory, sort_order, schema_markup
) VALUES (
  '{"en":"Amino Fuel EAA (Blue Raspberry)","de":"Amino Fuel EAA (Blaue Himbeere)"}',
  'amino-fuel-blue-raspberry',
  '{"en":"Glacial Hydration. Hyper-Speed Muscle Healing.","de":"Gletscherhydratation. Hyper-Geschwindigkeits-Muskelheilung."}',
  '{"en":"Amino Fuel EAA (Blue Raspberry) provides a complete spectrum of all 9 essential amino acids to fuel muscle recovery and prevent catabolism. Includes coconut water extract and essential minerals to replenish lost electrolytes during intense physical activities.","de":"Amino Fuel EAA (Blaue Himbeere) bietet ein vollständiges Spektrum aller 9 essenziellen Aminosäuren, um die Muskelregeneration zu fördern und Katabolismus zu verhindern. Enthält Kokosnusswasserextrakt und essenzielle Mineralien, um verlorene Elektrolyte während intensiver körperlicher Aktivitäten wieder aufzufüllen."}',
  '{"en":"Full essential amino acids matrix paired with advanced electrolytes in a cold blue raspberry flavor.","de":"Vollständige Matrix essenzieller Aminosäuren gepaart mit fortschrittlichen Elektrolyten in erfrischendem blauen Himbeer-Geschmack."}',
  (SELECT id FROM categories WHERE slug = 'amino-acids'),
  'active', true, '#00CFFF', 'neon-blue',
  17.90, 8.1, true, 6,
  '{"key_benefits": ["Maximizes Recovery Rates & Muscle Preservation", "Combats Hydration Depletion & Fatigue", "Formulated with Ultra-Pure Plant-Based Aminos", "Lab Tested at Swiss Scientific Standards"]}'::jsonb
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_id = EXCLUDED.category_id,
  status = EXCLUDED.status,
  featured = EXCLUDED.featured,
  product_color = EXCLUDED.product_color,
  color_name = EXCLUDED.color_name,
  base_price = EXCLUDED.base_price,
  gst_rate = EXCLUDED.gst_rate,
  track_inventory = EXCLUDED.track_inventory,
  sort_order = EXCLUDED.sort_order,
  schema_markup = EXCLUDED.schema_markup;

-- ─── PRODUCT VARIANTS ─────────────────────────────────────────
INSERT INTO product_variants (product_id, name, sku, price, compare_at_price, weight_grams, serving_size, servings, stock, is_default, sort_order)
VALUES 
  ((SELECT id FROM products WHERE slug = 'astro-collagen'), '300g / 30 Servings', 'COL-300G', 34.00, 42.00, 300, '10g', 30, 500, true, 1)
ON CONFLICT (sku) DO UPDATE SET
  price = EXCLUDED.price,
  compare_at_price = EXCLUDED.compare_at_price,
  weight_grams = EXCLUDED.weight_grams,
  serving_size = EXCLUDED.serving_size,
  servings = EXCLUDED.servings,
  stock = EXCLUDED.stock,
  is_default = EXCLUDED.is_default,
  sort_order = EXCLUDED.sort_order;

INSERT INTO product_variants (product_id, name, sku, price, compare_at_price, weight_grams, serving_size, servings, stock, is_default, sort_order)
VALUES 
  ((SELECT id FROM products WHERE slug = 'blast-pre-workout-energy'), '300g / 30 Servings', 'BLAST-ENERGY-300G', 24.00, 29.00, 300, '10g', 30, 400, true, 1)
ON CONFLICT (sku) DO UPDATE SET
  price = EXCLUDED.price,
  compare_at_price = EXCLUDED.compare_at_price,
  weight_grams = EXCLUDED.weight_grams,
  serving_size = EXCLUDED.serving_size,
  servings = EXCLUDED.servings,
  stock = EXCLUDED.stock,
  is_default = EXCLUDED.is_default,
  sort_order = EXCLUDED.sort_order;

INSERT INTO product_variants (product_id, name, sku, price, compare_at_price, weight_grams, serving_size, servings, stock, is_default, sort_order)
VALUES 
  ((SELECT id FROM products WHERE slug = 'astro-creatine'), '500g / 100 Servings', 'ASTRO-500G', 19.00, 24.00, 500, '5g', 100, 600, true, 1)
ON CONFLICT (sku) DO UPDATE SET
  price = EXCLUDED.price,
  compare_at_price = EXCLUDED.compare_at_price,
  weight_grams = EXCLUDED.weight_grams,
  serving_size = EXCLUDED.serving_size,
  servings = EXCLUDED.servings,
  stock = EXCLUDED.stock,
  is_default = EXCLUDED.is_default,
  sort_order = EXCLUDED.sort_order;

INSERT INTO product_variants (product_id, name, sku, price, compare_at_price, weight_grams, serving_size, servings, stock, is_default, sort_order)
VALUES 
  ((SELECT id FROM products WHERE slug = 'amino-fuel-mango'), '300g / 30 Servings', 'AMNO-MANGO-300G', 17.90, 21.90, 300, '10g', 30, 450, true, 1)
ON CONFLICT (sku) DO UPDATE SET
  price = EXCLUDED.price,
  compare_at_price = EXCLUDED.compare_at_price,
  weight_grams = EXCLUDED.weight_grams,
  serving_size = EXCLUDED.serving_size,
  servings = EXCLUDED.servings,
  stock = EXCLUDED.stock,
  is_default = EXCLUDED.is_default,
  sort_order = EXCLUDED.sort_order;

INSERT INTO product_variants (product_id, name, sku, price, compare_at_price, weight_grams, serving_size, servings, stock, is_default, sort_order)
VALUES 
  ((SELECT id FROM products WHERE slug = 'blast-pre-workout-blue'), '300g / 30 Servings', 'BLAST-BLUE-300G', 24.00, 29.00, 300, '10g', 30, 350, true, 1)
ON CONFLICT (sku) DO UPDATE SET
  price = EXCLUDED.price,
  compare_at_price = EXCLUDED.compare_at_price,
  weight_grams = EXCLUDED.weight_grams,
  serving_size = EXCLUDED.serving_size,
  servings = EXCLUDED.servings,
  stock = EXCLUDED.stock,
  is_default = EXCLUDED.is_default,
  sort_order = EXCLUDED.sort_order;

INSERT INTO product_variants (product_id, name, sku, price, compare_at_price, weight_grams, serving_size, servings, stock, is_default, sort_order)
VALUES 
  ((SELECT id FROM products WHERE slug = 'amino-fuel-blue-raspberry'), '300g / 30 Servings', 'AMNO-BLUE-300G', 17.90, 21.90, 300, '10g', 30, 350, true, 1)
ON CONFLICT (sku) DO UPDATE SET
  price = EXCLUDED.price,
  compare_at_price = EXCLUDED.compare_at_price,
  weight_grams = EXCLUDED.weight_grams,
  serving_size = EXCLUDED.serving_size,
  servings = EXCLUDED.servings,
  stock = EXCLUDED.stock,
  is_default = EXCLUDED.is_default,
  sort_order = EXCLUDED.sort_order;

-- ─── DYNAMIC PRICING RULES ────────────────────────────────────
INSERT INTO pricing_rules (name, min_qty, max_qty, discount_type, discount_value, is_active, sort_order) VALUES
  ('Buy 2 – Save 10%', 2, 2, 'percentage', 10, true, 1),
  ('Buy 3 – Save 15%', 3, 3, 'percentage', 15, true, 2),
  ('Buy 4 – Save 20%', 4, 4, 'percentage', 20, true, 3),
  ('Buy 5+ – Save 25%', 5, null, 'percentage', 25, true, 4);

-- ─── SAMPLE COUPONS ───────────────────────────────────────────
INSERT INTO coupons (code, type, value, min_order_amount, max_uses, is_active, description) VALUES
  ('ALIEN10', 'percentage', 10, 999, 1000, true, '10% off for new customers'),
  ('WELCOME500', 'fixed', 500, 2000, 500, true, 'Flat ₹500 off on orders above ₹2000'),
  ('FREESHIP', 'free_shipping', 0, 499, null, true, 'Free shipping on all orders')
ON CONFLICT (code) DO UPDATE SET
  type = EXCLUDED.type,
  value = EXCLUDED.value,
  min_order_amount = EXCLUDED.min_order_amount,
  max_uses = EXCLUDED.max_uses,
  is_active = EXCLUDED.is_active,
  description = EXCLUDED.description;

-- ─── SITE SETTINGS ────────────────────────────────────────────
INSERT INTO site_settings (key, value) VALUES
  ('general', '{"site_name":"UFO LABZ","tagline":"Alien Performance Technology","support_email":"support@ufolabz.com","support_phone":"+41-44-1234567","currency":"CHF","currency_symbol":"CHF","gst_number":"CHE-123.456.789 MWST"}'),
  ('shipping', '{"free_shipping_above":99,"standard_rate":8.90,"express_rate":18.90,"estimated_days_standard":3,"estimated_days_express":1}'),
  ('loyalty', '{"points_per_rupee":1,"rupees_per_point":0.1,"signup_bonus":100,"birthday_bonus":200}'),
  ('social', '{"instagram":"https://instagram.com/ufolabz","youtube":"https://youtube.com/@ufolabz","facebook":"https://facebook.com/ufolabz","twitter":"https://twitter.com/ufolabz","tiktok":"https://tiktok.com/@ufolabz"}'),
  ('seo', '{"default_title":"UFO LABZ – Alien Performance Supplements","default_description":"Premium science-backed supplement brand. 6 elite formulas engineered for peak performance.","og_image":"https://ufolabz.com/og-default.jpg"}')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- ─── PRODUCT IMAGES ───────────────────────────────────────────
-- Clean existing child tables for these specific products first
DELETE FROM nutrition_facts WHERE variant_id IN (
  SELECT id FROM product_variants WHERE product_id IN (
    SELECT id FROM products WHERE slug IN ('astro-collagen', 'blast-pre-workout-energy', 'astro-creatine', 'amino-fuel-mango', 'blast-pre-workout-blue', 'amino-fuel-blue-raspberry')
  )
);
DELETE FROM product_images WHERE product_id IN (SELECT id FROM products WHERE slug IN ('astro-collagen', 'blast-pre-workout-energy', 'astro-creatine', 'amino-fuel-mango', 'blast-pre-workout-blue', 'amino-fuel-blue-raspberry'));
DELETE FROM product_faqs WHERE product_id IN (SELECT id FROM products WHERE slug IN ('astro-collagen', 'blast-pre-workout-energy', 'astro-creatine', 'amino-fuel-mango', 'blast-pre-workout-blue', 'amino-fuel-blue-raspberry'));
DELETE FROM product_ingredients WHERE product_id IN (SELECT id FROM products WHERE slug IN ('astro-collagen', 'blast-pre-workout-energy', 'astro-creatine', 'amino-fuel-mango', 'blast-pre-workout-blue', 'amino-fuel-blue-raspberry'));
DELETE FROM product_stacks WHERE product_id IN (SELECT id FROM products WHERE slug IN ('astro-collagen', 'blast-pre-workout-energy', 'astro-creatine', 'amino-fuel-mango', 'blast-pre-workout-blue', 'amino-fuel-blue-raspberry'));

DELETE FROM ingredients WHERE id IN (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444',
  '55555555-5555-5555-5555-555555555555',
  '66666666-6666-6666-6666-666666666666',
  '77777777-7777-7777-7777-777777777777',
  '88888888-8888-8888-8888-888888888888'
);

-- Re-populate child tables
INSERT INTO product_images (product_id, url, alt, is_primary, sort_order)
SELECT id, 'https://res.cloudinary.com/dm4jfxbcs/image/upload/v1782667545/UFO1_ztlvyz.png', '{"en":"Astro Collagen Peptide Premium Bottle"}', true, 1 FROM products WHERE slug = 'astro-collagen';

INSERT INTO product_images (product_id, url, alt, is_primary, sort_order)
SELECT id, 'https://res.cloudinary.com/dm4jfxbcs/image/upload/v1782667544/UFO3_bfwhlr.png', '{"en":"Blast Pre-Workout Energy Drink"}', true, 1 FROM products WHERE slug = 'blast-pre-workout-energy';

INSERT INTO product_images (product_id, url, alt, is_primary, sort_order)
SELECT id, 'https://res.cloudinary.com/dm4jfxbcs/image/upload/v1782667544/UFO4_nuzyls.png', '{"en":"Astro Creatine Pure Tub"}', true, 1 FROM products WHERE slug = 'astro-creatine';

INSERT INTO product_images (product_id, url, alt, is_primary, sort_order)
SELECT id, 'https://res.cloudinary.com/dm4jfxbcs/image/upload/v1782667544/UFO5_l42elt.png', '{"en":"Amino Fuel Mango EAA Bottle"}', true, 1 FROM products WHERE slug = 'amino-fuel-mango';

INSERT INTO product_images (product_id, url, alt, is_primary, sort_order)
SELECT id, 'https://res.cloudinary.com/dm4jfxbcs/image/upload/v1782667544/UFO2_hnupdu.png', '{"en":"Blast Pre-Workout Blue Raspberry"}', true, 1 FROM products WHERE slug = 'blast-pre-workout-blue';

INSERT INTO product_images (product_id, url, alt, is_primary, sort_order)
SELECT id, 'https://res.cloudinary.com/dm4jfxbcs/image/upload/v1782667544/UFO6_uhxvep.png', '{"en":"Amino Fuel EAA Blue Raspberry"}', true, 1 FROM products WHERE slug = 'amino-fuel-blue-raspberry';

-- ─── INGREDIENTS MATRIX ────────────────────────────────────────
INSERT INTO ingredients (id, name, description, benefits, is_active) VALUES
  ('11111111-1111-1111-1111-111111111111', '{"en":"Hydrolyzed Collagen Peptides (Type I & III)","de":"Hydrolyisierte Kollagenpeptide (Typ I & III)"}', '{"en":"Sourced from grass-fed bovine, optimized for cartilage recovery and youthful skin.","de":"Gewonnen aus Weiderindern, optimiert für Knorpelregeneration und jugendliche Haut."}', '["Supports Joint Health","Increases Skin Elasticity"]', true),
  ('22222222-2222-2222-2222-222222222222', '{"en":"Hyaluronic Acid","de":"Hyaluronsäure"}', '{"en":"Promotes deep cellular hydration and lubrication in joints.","de":"Fördert die tiefe zelluläre Hydratation und Schmierung in den Gelenken."}', '["Joint Lubrication","Skin Hydration"]', true),
  ('33333333-3333-3333-3333-333333333333', '{"en":"Citrulline Malate","de":"Citrullin Malat"}', '{"en":"Muscular performance compound for maximum nitric oxide and blood flow pumps.","de":"Muskelleistungs-Verbindung für maximalen Stickoxid- und Blutfluss-Pump."}', '["Vascular Pumps","Delays Fatigue"]', true),
  ('44444444-4444-4444-4444-444444444444', '{"en":"Beta-Alanine","de":"Beta-Alanin"}', '{"en":"Intra-muscular acid buffer to decrease lactic acid build-up.","de":"Intramuskulärer Säurepuffer zur Reduzierung von Milchsäureansammlungen."}', '["Muscle Endurance","Acid Buffer"]', true),
  ('55555555-5555-5555-5555-555555555555', '{"en":"Natural Caffeine","de":"Natürliches Koffein"}', '{"en":"Clean energy botanical stimulant without cortisol spikes.","de":"Reines pflanzliches Stimulans für Energie ohne Cortisolspitzen."}', '["Alertness","Laser Focus"]', true),
  ('66666666-6666-6666-6666-666666666666', '{"en":"Micronized Creatine Monohydrate","de":"Mikronisiertes Kreatin Monohydrat"}', '{"en":"Premium grade ATP energy recycler to build explosive power.","de":"Premium-ATP-Energierecycler für explosive Kraft."}', '["ATP Generation","Explosive Strength"]', true),
  ('77777777-7777-7777-7777-777777777777', '{"en":"Essential Amino Acids (EAA)","de":"Essenzielle Aminosäuren (EAA)"}', '{"en":"Full-spectrum of all 9 essential aminos for protein synthesis.","de":"Vollständiges Spektrum aller 9 essenziellen Aminosäuren für die Proteinsynthese."}', '["Muscle Synthesis","Anti-Catabolic"]', true),
  ('88888888-8888-8888-8888-888888888888', '{"en":"Coconut Water Powder","de":"Kokosnusswasser-Pulver"}', '{"en":"Mineral-dense hydration recharger rich in key electrolytes.","de":"Mineralstoffreicher Hydratationslader, reich an wichtigen Elektrolyten."}', '["Electrolyte Balance","Intra-workout hydration"]', true);

-- Map Ingredients to Products
INSERT INTO product_ingredients (product_id, ingredient_id, amount, is_key, sort_order)
SELECT id, '11111111-1111-1111-1111-111111111111', '10g', true, 1 FROM products WHERE slug = 'astro-collagen';
INSERT INTO product_ingredients (product_id, ingredient_id, amount, is_key, sort_order)
SELECT id, '22222222-2222-2222-2222-222222222222', '80mg', false, 2 FROM products WHERE slug = 'astro-collagen';

INSERT INTO product_ingredients (product_id, ingredient_id, amount, is_key, sort_order)
SELECT id, '33333333-3333-3333-3333-333333333333', '8g', true, 1 FROM products WHERE slug = 'blast-pre-workout-energy';
INSERT INTO product_ingredients (product_id, ingredient_id, amount, is_key, sort_order)
SELECT id, '44444444-4444-4444-4444-444444444444', '3.2g', true, 2 FROM products WHERE slug = 'blast-pre-workout-energy';
INSERT INTO product_ingredients (product_id, ingredient_id, amount, is_key, sort_order)
SELECT id, '55555555-5555-5555-5555-555555555555', '200mg', false, 3 FROM products WHERE slug = 'blast-pre-workout-energy';

INSERT INTO product_ingredients (product_id, ingredient_id, amount, is_key, sort_order)
SELECT id, '66666666-6666-6666-6666-666666666666', '5g', true, 1 FROM products WHERE slug = 'astro-creatine';

INSERT INTO product_ingredients (product_id, ingredient_id, amount, is_key, sort_order)
SELECT id, '77777777-7777-7777-7777-777777777777', '7g', true, 1 FROM products WHERE slug = 'amino-fuel-mango';
INSERT INTO product_ingredients (product_id, ingredient_id, amount, is_key, sort_order)
SELECT id, '88888888-8888-8888-8888-888888888888', '500mg', false, 2 FROM products WHERE slug = 'amino-fuel-mango';

INSERT INTO product_ingredients (product_id, ingredient_id, amount, is_key, sort_order)
SELECT id, '33333333-3333-3333-3333-333333333333', '6g', true, 1 FROM products WHERE slug = 'blast-pre-workout-blue';
INSERT INTO product_ingredients (product_id, ingredient_id, amount, is_key, sort_order)
SELECT id, '44444444-4444-4444-4444-444444444444', '3.2g', true, 2 FROM products WHERE slug = 'blast-pre-workout-blue';
INSERT INTO product_ingredients (product_id, ingredient_id, amount, is_key, sort_order)
SELECT id, '55555555-5555-5555-5555-555555555555', '200mg', false, 3 FROM products WHERE slug = 'blast-pre-workout-blue';

INSERT INTO product_ingredients (product_id, ingredient_id, amount, is_key, sort_order)
SELECT id, '77777777-7777-7777-7777-777777777777', '7g', true, 1 FROM products WHERE slug = 'amino-fuel-blue-raspberry';
INSERT INTO product_ingredients (product_id, ingredient_id, amount, is_key, sort_order)
SELECT id, '88888888-8888-8888-8888-888888888888', '500mg', false, 2 FROM products WHERE slug = 'amino-fuel-blue-raspberry';

-- ─── INSERT NUTRITION FACTS ───────────────────────────────────
INSERT INTO nutrition_facts (variant_id, serving_size, servings_per_container, calories, total_fat, sodium, total_carbohydrate, protein)
SELECT id, '10.5g', 30, 36, 0.00, 30.00, 0.00, 9.00 FROM product_variants WHERE sku = 'COL-300G';

INSERT INTO nutrition_facts (variant_id, serving_size, servings_per_container, calories, total_fat, sodium, total_carbohydrate, protein)
SELECT id, '10g', 30, 15, 0.00, 120.00, 3.00, 0.00 FROM product_variants WHERE sku = 'BLAST-ENERGY-300G';

INSERT INTO nutrition_facts (variant_id, serving_size, servings_per_container, calories, total_fat, sodium, total_carbohydrate, protein)
SELECT id, '5g', 100, 0, 0.00, 0.00, 0.00, 0.00 FROM product_variants WHERE sku = 'ASTRO-500G';

INSERT INTO nutrition_facts (variant_id, serving_size, servings_per_container, calories, total_fat, sodium, total_carbohydrate, protein)
SELECT id, '10g', 30, 10, 0.00, 180.00, 2.00, 0.00 FROM product_variants WHERE sku = 'AMNO-MANGO-300G';

INSERT INTO nutrition_facts (variant_id, serving_size, servings_per_container, calories, total_fat, sodium, total_carbohydrate, protein)
SELECT id, '10g', 30, 12, 0.00, 110.00, 2.50, 0.00 FROM product_variants WHERE sku = 'BLAST-BLUE-300G';

INSERT INTO nutrition_facts (variant_id, serving_size, servings_per_container, calories, total_fat, sodium, total_carbohydrate, protein)
SELECT id, '10g', 30, 10, 0.00, 170.00, 2.00, 0.00 FROM product_variants WHERE sku = 'AMNO-BLUE-300G';

-- ─── INSERT PRODUCT FAQs ──────────────────────────────────────
INSERT INTO product_faqs (product_id, question, answer, sort_order)
SELECT id, '{"en":"How should I consume Astro Collagen?","de":"Wie sollte ich Astro Kollagen einnehmen?"}', '{"en":"Mix 1 scoop (approx. 10.5g) into 250ml of warm or cold water, juice, coffee, or your post-workout shake daily.","de":"Mischen Sie täglich 1 Messlöffel (ca. 10,5 g) in 250 ml warmes oder kaltes Wasser, Saft, Kaffee oder Ihren Post-Workout-Shake."}', 1 FROM products WHERE slug = 'astro-collagen';
INSERT INTO product_faqs (product_id, question, answer, sort_order)
SELECT id, '{"en":"Is this product grass-fed?","de":"Ist dieses Produkt aus Weidehaltung?"}', '{"en":"Yes, our collagen is 100% sourced from grass-fed, pasture-raised bovine sources.","de":"Ja, unser Kollagen stammt zu 100 % aus Weiderindern aus Weidehaltung."}', 2 FROM products WHERE slug = 'astro-collagen';

INSERT INTO product_faqs (product_id, question, answer, sort_order)
SELECT id, '{"en":"When should I take Blast Pre-Workout?","de":"Wann sollte ich Blast Pre-Workout einnehmen?"}', '{"en":"Consume 1 serving mixed with 300ml of cold water 15 to 30 minutes before your training session.","de":"Nehmen Sie 1 Portion gemischt mit 300 ml kaltem Wasser 15 bis 30 Minuten vor Ihrer Trainingseinheit ein."}', 1 FROM products WHERE slug = 'blast-pre-workout-energy';
INSERT INTO product_faqs (product_id, question, answer, sort_order)
SELECT id, '{"en":"Is there a crash after taking it?","de":"Gibt es nach der Einnahme einen Leistungsabfall?"}', '{"en":"No, our formula includes L-Theanine and clean botanical caffeine to ensure a smooth, crash-free energy curve.","de":"Nein, unsere Formel enthält L-Theanin und reines pflanzliches Koffein, um eine gleichmäßige, absturzfreie Energiekurve zu gewährleisten."}', 2 FROM products WHERE slug = 'blast-pre-workout-energy';

INSERT INTO product_faqs (product_id, question, answer, sort_order)
SELECT id, '{"en":"Do I need to load Astro Creatine?","de":"Muss ich eine Ladephase bei Astro Kreatin machen?"}', '{"en":"A loading phase is not strictly necessary. You can take 5g daily consistently to saturate muscle creatine stores.","de":"Eine Ladephase ist nicht zwingend erforderlich. Sie können täglich 5 g einnehmen, um die Kreatinspeicher der Muskeln zu sättigen."}', 1 FROM products WHERE slug = 'astro-creatine';
INSERT INTO product_faqs (product_id, question, answer, sort_order)
SELECT id, '{"en":"Can I stack Astro Creatine with other products?","de":"Kann ich Astro Kreatin mit anderen Produkten kombinieren?"}', '{"en":"Yes, it is flavorless and mixes perfectly with your pre-workout, protein shake, or EAA formulas.","de":"Ja, es ist geschmacksneutral und lässt sich perfekt mit Pre-Workout-, Eiweißshake- oder EAA-Formeln kombinieren."}', 2 FROM products WHERE slug = 'astro-creatine';

INSERT INTO product_faqs (product_id, question, answer, sort_order)
SELECT id, '{"en":"When should I drink Amino Fuel?","de":"Wann sollte ich Amino Fuel trinken?"}', '{"en":"We recommend consuming it intra-workout (during training) or immediately post-workout to support muscle recovery and hydration.","de":"Wir empfehlen den Verzehr während des Trainings (intra-workout) oder unmittelbar danach, um die Muskelregeneration und Hydratation zu unterstützen."}', 1 FROM products WHERE slug = 'amino-fuel-mango';
INSERT INTO product_faqs (product_id, question, answer, sort_order)
SELECT id, '{"en":"Is this product vegan-friendly?","de":"Ist dieses Produkt vegan?"}', '{"en":"Yes, our amino acids are derived from natural plant fermentation.","de":"Ja, unsere Aminosäuren werden durch natürliche Pflanzenfermentation gewonnen."}', 2 FROM products WHERE slug = 'amino-fuel-mango';

INSERT INTO product_faqs (product_id, question, answer, sort_order)
SELECT id, '{"en":"Does Blast Blue Raspberry contain sugar?","de":"Enthält Blast Blaue Himbeere Zucker?"}', '{"en":"No, our formula is 100% sugar-free, sweetened with premium Sucralose.","de":"Nein, unsere Formel ist zu 100 % zuckerfrei, gesüßt mit Premium-Sucralose."}', 1 FROM products WHERE slug = 'blast-pre-workout-blue';

INSERT INTO product_faqs (product_id, question, answer, sort_order)
SELECT id, '{"en":"Does this contain stimulants or caffeine?","de":"Enthält dies Stimulanzien oder Koffein?"}', '{"en":"No, our EAA formula is 100% stimulant-free and can be consumed day or night.","de":"Nein, unsere EAA-Formel ist zu 100 % frei von Stimulanzien und kann Tag und Nacht eingenommen werden."}', 1 FROM products WHERE slug = 'amino-fuel-blue-raspberry';

-- ─── BUNDLES AND STACKS MAPPING ───────────────────────────────
INSERT INTO product_stacks (product_id, stack_product_id, label, discount_pct, sort_order)
SELECT p1.id, p2.id, '{"en":"Elite Strength Stack","de":"Elite Stärke Stack"}', 10.00, 1
FROM products p1, products p2
WHERE p1.slug = 'astro-creatine' AND p2.slug = 'blast-pre-workout-energy';

INSERT INTO product_stacks (product_id, stack_product_id, label, discount_pct, sort_order)
SELECT p1.id, p2.id, '{"en":"Ultimate Pre & Intra Workout Combo","de":"Ultimative Pre & Intra Workout Kombi"}', 15.00, 1
FROM products p1, products p2
WHERE p1.slug = 'blast-pre-workout-blue' AND p2.slug = 'amino-fuel-blue-raspberry';

COMMIT;
