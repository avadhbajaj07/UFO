-- ═══════════════════════════════════════════════════════════
-- UFO LABZ – Seed Data
-- ═══════════════════════════════════════════════════════════

-- ─── SUBSCRIPTION PLANS ───────────────────────────────────────
insert into subscription_plans (name, interval, interval_count, discount_pct, sort_order) values
  ('{"en":"Monthly Delivery","hi":"मासिक डिलीवरी"}', 'monthly', 1, 10, 1),
  ('{"en":"Every 2 Months","hi":"हर 2 महीने"}', 'bimonthly', 2, 12, 2),
  ('{"en":"Quarterly Supply","hi":"त्रैमासिक आपूर्ति"}', 'quarterly', 3, 15, 3),
  ('{"en":"6-Month Supply","hi":"6-माह आपूर्ति"}', 'biannual', 6, 20, 4),
  ('{"en":"Annual Supply","hi":"वार्षिक आपूर्ति"}', 'annual', 12, 25, 5);

-- ─── LOYALTY TIERS ────────────────────────────────────────────
insert into loyalty_tiers (name, min_points, multiplier, color, sort_order) values
  ('Earthling', 0, 1.0, '#7777AA', 1),
  ('Astronaut', 1000, 1.25, '#00FF88', 2),
  ('Alien', 5000, 1.5, '#00CFFF', 3),
  ('Galaxy Elite', 15000, 2.0, '#9B30FF', 4);

-- ─── CATEGORIES ───────────────────────────────────────────────
insert into categories (name, slug, sort_order) values
  ('{"en":"Creatine","hi":"क्रिएटिन"}', 'creatine', 1),
  ('{"en":"Pre Workout","hi":"प्री वर्कआउट"}', 'pre-workout', 2),
  ('{"en":"Amino Acids","hi":"अमीनो एसिड"}', 'amino-acids', 3),
  ('{"en":"Special Edition","hi":"विशेष संस्करण"}', 'special-edition', 4);

-- ─── PRODUCTS ─────────────────────────────────────────────────
insert into products (
  name, slug, tagline, description, short_description,
  category_id, status, featured, product_color, color_name,
  base_price, gst_rate, track_inventory, sort_order
) values
(
  '{"en":"Astro Creatine","hi":"एस्ट्रो क्रिएटिन"}',
  'astro-creatine',
  '{"en":"Radioactive Strength From Another World"}',
  '{"en":"Astro Creatine is our flagship alien-grade creatine monohydrate formula. Engineered in the galaxy''s most advanced laboratory, each serving delivers a precise 5g dose of ultra-micronised creatine to maximise muscle synthesis, increase strength, and fuel your alien potential."}',
  '{"en":"Alien-grade creatine monohydrate for maximum muscle synthesis and explosive strength."}',
  (select id from categories where slug = 'creatine'),
  'active', true, '#00FF88', 'alien-green',
  1999.00, 18, true, 1
),
(
  '{"en":"Blast Pre Workout","hi":"ब्लास्ट प्री वर्कआउट"}',
  'blast-pre-workout',
  '{"en":"Ignite Explosive Energy. Destroy Every Set."}',
  '{"en":"Blast Pre Workout is the most powerful pre-training formula we have ever created. With 200mg of natural caffeine, 8g of citrulline malate, 3.2g of beta-alanine, and a full suite of focus enhancers, Blast will have you training like a creature from another dimension."}',
  '{"en":"Explosive energy and laser focus formula for extreme pre-workout performance."}',
  (select id from categories where slug = 'pre-workout'),
  'active', true, '#FF2244', 'electric-red',
  2499.00, 18, true, 2
),
(
  '{"en":"Amino Fuel Mango","hi":"अमीनो फ्यूल मैंगो"}',
  'amino-fuel-mango',
  '{"en":"Tropical Recovery. Liquid Speed."}',
  '{"en":"Amino Fuel Mango delivers a complete 2:1:1 BCAA matrix with added electrolytes and L-Glutamine. The orange plasma formula supports rapid muscle recovery, reduces soreness, and keeps you hydrated during the most gruelling training sessions."}',
  '{"en":"Complete BCAA recovery formula with electrolytes in explosive mango flavour."}',
  (select id from categories where slug = 'amino-acids'),
  'active', true, '#FF8C00', 'mango-orange',
  1799.00, 18, true, 3
),
(
  '{"en":"Amino Fuel Blue Raspberry","hi":"अमीनो फ्यूल ब्लू रास्पबेरी"}',
  'amino-fuel-blue-raspberry',
  '{"en":"Ice Cold Performance. Electric Recovery."}',
  '{"en":"Amino Fuel Blue Raspberry is the frozen energy variant of our best-selling amino acid formula. The blue lightning flavour profile hits your senses like an electric current while the 2:1:1 BCAA matrix and electrolyte complex get to work repairing and rebuilding muscle."}',
  '{"en":"Blue lightning BCAA recovery formula with electrolytes and refreshing blue raspberry flavour."}',
  (select id from categories where slug = 'amino-acids'),
  'active', false, '#00CFFF', 'neon-blue',
  1799.00, 18, true, 4
),
(
  '{"en":"Special Edition","hi":"स्पेशल एडिशन"}',
  'special-edition',
  '{"en":"The Cosmic Formula. Reserved for the Elite."}',
  '{"en":"Special Edition is our most advanced formula, engineered for the athletes who demand more than Earth can offer. This purple nebula blend combines creatine HCl, peak ATP, lion''s mane extract, and our proprietary AlienFlow cognitive matrix to take your mind and body beyond the limits of human performance."}',
  '{"en":"Galaxy-powered advanced formula combining cognitive and physical performance enhancement."}',
  (select id from categories where slug = 'special-edition'),
  'active', true, '#9B30FF', 'cosmic-purple',
  3499.00, 18, true, 5
);

-- ─── PRODUCT VARIANTS ─────────────────────────────────────────
insert into product_variants (product_id, name, sku, price, compare_at_price, weight_grams, serving_size, servings, stock, is_default, sort_order)
select id, '200g / 40 Servings', 'ASTRO-200G', 1999.00, 2499.00, 200, '5g', 40, 500, true, 1 from products where slug = 'astro-creatine';
insert into product_variants (product_id, name, sku, price, compare_at_price, weight_grams, serving_size, servings, stock, is_default, sort_order)
select id, '500g / 100 Servings', 'ASTRO-500G', 3999.00, 4999.00, 500, '5g', 100, 300, false, 2 from products where slug = 'astro-creatine';

insert into product_variants (product_id, name, sku, price, compare_at_price, weight_grams, serving_size, servings, stock, is_default, sort_order)
select id, '300g / 30 Servings', 'BLAST-300G', 2499.00, 2999.00, 300, '10g', 30, 400, true, 1 from products where slug = 'blast-pre-workout';
insert into product_variants (product_id, name, sku, price, compare_at_price, weight_grams, serving_size, servings, stock, is_default, sort_order)
select id, '600g / 60 Servings', 'BLAST-600G', 4499.00, 5499.00, 600, '10g', 60, 200, false, 2 from products where slug = 'blast-pre-workout';

insert into product_variants (product_id, name, sku, price, compare_at_price, weight_grams, serving_size, servings, stock, is_default, sort_order)
select id, '300g / 30 Servings', 'AMNO-MANGO-300G', 1799.00, 2199.00, 300, '10g', 30, 450, true, 1 from products where slug = 'amino-fuel-mango';

insert into product_variants (product_id, name, sku, price, compare_at_price, weight_grams, serving_size, servings, stock, is_default, sort_order)
select id, '300g / 30 Servings', 'AMNO-BLUE-300G', 1799.00, 2199.00, 300, '10g', 30, 350, true, 1 from products where slug = 'amino-fuel-blue-raspberry';

insert into product_variants (product_id, name, sku, price, compare_at_price, weight_grams, serving_size, servings, stock, is_default, sort_order)
select id, '250g / 25 Servings', 'SPEC-250G', 3499.00, 4299.00, 250, '10g', 25, 150, true, 1 from products where slug = 'special-edition';

-- ─── DYNAMIC PRICING RULES ────────────────────────────────────
insert into pricing_rules (name, min_qty, max_qty, discount_type, discount_value, is_active, sort_order) values
  ('Buy 2 – Save 10%', 2, 2, 'percentage', 10, true, 1),
  ('Buy 3 – Save 15%', 3, 3, 'percentage', 15, true, 2),
  ('Buy 4 – Save 20%', 4, 4, 'percentage', 20, true, 3),
  ('Buy 5+ – Save 25%', 5, null, 'percentage', 25, true, 4);

-- ─── SAMPLE COUPONS ───────────────────────────────────────────
insert into coupons (code, type, value, min_order_amount, max_uses, is_active, description) values
  ('ALIEN10', 'percentage', 10, 999, 1000, true, '10% off for new customers'),
  ('WELCOME500', 'fixed', 500, 2000, 500, true, 'Flat ₹500 off on orders above ₹2000'),
  ('FREESHIP', 'free_shipping', 0, 499, null, true, 'Free shipping on all orders');

-- ─── SITE SETTINGS ────────────────────────────────────────────
insert into site_settings (key, value) values
  ('general', '{"site_name":"UFO LABZ","tagline":"Alien Performance Technology","support_email":"support@ufolabz.com","support_phone":"+91-9999999999","currency":"INR","currency_symbol":"₹","gst_number":"27AABCU9603R1ZX"}'),
  ('shipping', '{"free_shipping_above":999,"standard_rate":99,"express_rate":199,"estimated_days_standard":5,"estimated_days_express":2}'),
  ('loyalty', '{"points_per_rupee":1,"rupees_per_point":0.1,"signup_bonus":100,"birthday_bonus":200}'),
  ('social', '{"instagram":"https://instagram.com/ufolabz","youtube":"https://youtube.com/@ufolabz","facebook":"https://facebook.com/ufolabz","twitter":"https://twitter.com/ufolabz","tiktok":"https://tiktok.com/@ufolabz"}'),
  ('seo', '{"default_title":"UFO LABZ – Alien Performance Supplements","default_description":"Premium science-backed supplement brand. 5 elite formulas engineered for peak performance.","og_image":"https://ufolabz.com/og-default.jpg"}');
