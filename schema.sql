-- ═══════════════════════════════════════════════════════════
-- UFO LABZ – Complete Database Schema
-- Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════

-- ─── EXTENSIONS ──────────────────────────────────────────────
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";
create extension if not exists "unaccent";

-- ─── ENUMS ────────────────────────────────────────────────────
create type order_status as enum (
  'pending','payment_pending','confirmed','processing',
  'shipped','out_for_delivery','delivered','cancelled','refunded','partially_refunded'
);
create type subscription_status as enum (
  'active','paused','cancelled','past_due','trialing','expired'
);
create type subscription_interval as enum ('monthly','bimonthly','quarterly','biannual','annual');
create type affiliate_status as enum ('pending','approved','suspended','rejected');
create type commission_status as enum ('pending','approved','paid','cancelled');
create type payout_status as enum ('pending','processing','paid','failed');
create type coupon_type as enum ('percentage','fixed','free_shipping','buy_x_get_y');
create type coupon_applies_to as enum ('all','products','categories','variants');
create type loyalty_event as enum (
  'purchase','review','referral','birthday','signup','social_share','redemption','adjustment'
);
create type pos_payment_method as enum ('cash','card','upi','gift_card','mixed');
create type user_role as enum ('customer','affiliate','pos_operator','admin','super_admin');
create type review_status as enum ('pending','approved','rejected','flagged');
create type product_status as enum ('draft','active','archived');
create type variant_status as enum ('active','out_of_stock','discontinued');
create type gift_card_status as enum ('active','redeemed','expired','cancelled');
create type blog_status as enum ('draft','published','archived');
create type email_template_type as enum (
  'order_confirmation','invoice','shipping','delivery','refund',
  'welcome','password_reset','subscription_reminder','subscription_renewal',
  'abandoned_cart','affiliate_approval','affiliate_payment','coupon',
  'newsletter','birthday','review_request','win_back','low_stock'
);

-- ─── PROFILES ─────────────────────────────────────────────────
create table profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  email           text not null,
  full_name       text,
  phone           text,
  avatar_url      text,
  date_of_birth   date,
  gender          text,
  role            user_role not null default 'customer',
  stripe_customer_id text unique,
  preferred_locale text not null default 'en',
  newsletter_opt_in boolean not null default false,
  sms_opt_in      boolean not null default false,
  marketing_opt_in boolean not null default false,
  notes           text,
  total_orders    integer not null default 0,
  total_spent     numeric(12,2) not null default 0,
  last_order_at   timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ─── ADDRESSES ────────────────────────────────────────────────
create table addresses (
  id           uuid primary key default uuid_generate_v4(),
  profile_id   uuid not null references profiles(id) on delete cascade,
  label        text,               -- "Home", "Work", etc.
  full_name    text not null,
  phone        text,
  line1        text not null,
  line2        text,
  city         text not null,
  state        text not null,
  postal_code  text not null,
  country      text not null default 'IN',
  is_default   boolean not null default false,
  created_at   timestamptz not null default now()
);

-- ─── CATEGORIES ───────────────────────────────────────────────
create table categories (
  id          uuid primary key default uuid_generate_v4(),
  name        jsonb not null default '{}',   -- {"en":"Creatine","de":"Kreatin"}
  slug        text not null unique,
  description jsonb default '{}',
  image_url   text,
  parent_id   uuid references categories(id),
  sort_order  integer not null default 0,
  seo_title   jsonb default '{}',
  seo_desc    jsonb default '{}',
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ─── TAGS ─────────────────────────────────────────────────────
create table tags (
  id    uuid primary key default uuid_generate_v4(),
  name  text not null unique,
  slug  text not null unique
);

-- ─── PRODUCTS ─────────────────────────────────────────────────
create table products (
  id                  uuid primary key default uuid_generate_v4(),
  name                jsonb not null default '{}',
  slug                text not null unique,
  tagline             jsonb default '{}',
  description         jsonb default '{}',
  short_description   jsonb default '{}',
  category_id         uuid references categories(id),
  status              product_status not null default 'draft',
  featured            boolean not null default false,
  is_new              boolean not null default false,
  is_best_seller      boolean not null default false,
  product_color       text,    -- hex: '#00FF88'
  color_name          text,    -- 'alien-green'
  sort_order          integer not null default 0,
  -- pricing (base, variants override)
  base_price          numeric(10,2) not null default 0,
  compare_at_price    numeric(10,2),
  cost_price          numeric(10,2),
  -- tax
  tax_class           text not null default 'standard',
  hsn_code            text,
  gst_rate            numeric(5,2) not null default 18,
  -- seo
  seo_title           jsonb default '{}',
  seo_description     jsonb default '{}',
  og_image_url        text,
  schema_markup       jsonb default '{}',
  -- inventory
  track_inventory     boolean not null default true,
  allow_backorder     boolean not null default false,
  low_stock_threshold integer not null default 10,
  -- meta
  total_reviews       integer not null default 0,
  avg_rating          numeric(3,2) not null default 0,
  total_sold          integer not null default 0,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- ─── PRODUCT VARIANTS ─────────────────────────────────────────
create table product_variants (
  id              uuid primary key default uuid_generate_v4(),
  product_id      uuid not null references products(id) on delete cascade,
  name            text not null,          -- "300g", "600g / 30 servings"
  sku             text not null unique,
  barcode         text,
  price           numeric(10,2) not null,
  compare_at_price numeric(10,2),
  cost_price      numeric(10,2),
  weight_grams    integer,
  serving_size    text,
  servings        integer,
  stock           integer not null default 0,
  status          variant_status not null default 'active',
  is_default      boolean not null default false,
  sort_order      integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ─── PRODUCT IMAGES ───────────────────────────────────────────
create table product_images (
  id          uuid primary key default uuid_generate_v4(),
  product_id  uuid not null references products(id) on delete cascade,
  url         text not null,
  alt         jsonb default '{}',
  is_primary  boolean not null default false,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

-- ─── PRODUCT VIDEOS ───────────────────────────────────────────
create table product_videos (
  id          uuid primary key default uuid_generate_v4(),
  product_id  uuid not null references products(id) on delete cascade,
  url         text not null,
  thumbnail   text,
  title       jsonb default '{}',
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

-- ─── PRODUCT TAGS ─────────────────────────────────────────────
create table product_tags (
  product_id uuid not null references products(id) on delete cascade,
  tag_id     uuid not null references tags(id) on delete cascade,
  primary key (product_id, tag_id)
);

-- ─── INGREDIENTS ──────────────────────────────────────────────
create table ingredients (
  id          uuid primary key default uuid_generate_v4(),
  name        jsonb not null default '{}',
  description jsonb default '{}',
  benefits    jsonb default '[]',  -- array of benefit strings
  icon_url    text,
  is_active   boolean not null default true
);

create table product_ingredients (
  id            uuid primary key default uuid_generate_v4(),
  product_id    uuid not null references products(id) on delete cascade,
  ingredient_id uuid not null references ingredients(id),
  amount        text,              -- "5g", "200mg"
  is_key        boolean not null default false,
  sort_order    integer not null default 0
);

-- ─── NUTRITION FACTS ──────────────────────────────────────────
create table nutrition_facts (
  id                  uuid primary key default uuid_generate_v4(),
  variant_id          uuid not null unique references product_variants(id) on delete cascade,
  serving_size        text,
  servings_per_container integer,
  calories            integer,
  total_fat           numeric(8,2),
  saturated_fat       numeric(8,2),
  trans_fat           numeric(8,2),
  cholesterol         numeric(8,2),
  sodium              numeric(8,2),
  total_carbohydrate  numeric(8,2),
  dietary_fiber       numeric(8,2),
  total_sugars        numeric(8,2),
  added_sugars        numeric(8,2),
  protein             numeric(8,2),
  vitamin_d           numeric(8,2),
  calcium             numeric(8,2),
  iron                numeric(8,2),
  potassium           numeric(8,2),
  custom_nutrients    jsonb default '[]',  -- [{name,amount,unit,dv_percent}]
  updated_at          timestamptz not null default now()
);

-- ─── PRODUCT FAQs ─────────────────────────────────────────────
create table product_faqs (
  id          uuid primary key default uuid_generate_v4(),
  product_id  uuid not null references products(id) on delete cascade,
  question    jsonb not null default '{}',
  answer      jsonb not null default '{}',
  sort_order  integer not null default 0
);

-- ─── DYNAMIC PRICING RULES ────────────────────────────────────
create table pricing_rules (
  id          uuid primary key default uuid_generate_v4(),
  product_id  uuid references products(id) on delete cascade,
  name        text not null,        -- "Buy 3, Save 15%"
  min_qty     integer not null,
  max_qty     integer,
  discount_type text not null,      -- 'percentage' | 'fixed'
  discount_value numeric(10,2) not null,
  is_active   boolean not null default true,
  sort_order  integer not null default 0
);

-- ─── STACK / BUNDLE SUGGESTIONS ───────────────────────────────
create table product_stacks (
  id          uuid primary key default uuid_generate_v4(),
  product_id  uuid not null references products(id) on delete cascade,
  stack_product_id uuid not null references products(id) on delete cascade,
  label       jsonb default '{}',   -- "Pairs great with"
  discount_pct numeric(5,2),
  sort_order  integer not null default 0
);

-- ─── LAB REPORTS / CERTIFICATES ───────────────────────────────
create table product_certificates (
  id          uuid primary key default uuid_generate_v4(),
  product_id  uuid not null references products(id) on delete cascade,
  name        text not null,
  file_url    text not null,
  issued_at   date,
  expires_at  date,
  sort_order  integer not null default 0
);

-- ─── COUPONS ──────────────────────────────────────────────────
create table coupons (
  id                uuid primary key default uuid_generate_v4(),
  code              text not null unique,
  type              coupon_type not null,
  value             numeric(10,2) not null,
  applies_to        coupon_applies_to not null default 'all',
  applies_to_ids    uuid[] default '{}',
  min_order_amount  numeric(10,2),
  max_uses          integer,
  max_uses_per_user integer not null default 1,
  uses_count        integer not null default 0,
  is_active         boolean not null default true,
  affiliate_id      uuid,   -- if coupon belongs to affiliate
  starts_at         timestamptz,
  expires_at        timestamptz,
  description       text,
  created_by        uuid references profiles(id),
  created_at        timestamptz not null default now()
);

create table coupon_usage (
  id          uuid primary key default uuid_generate_v4(),
  coupon_id   uuid not null references coupons(id),
  profile_id  uuid not null references profiles(id),
  order_id    uuid,
  discount    numeric(10,2) not null,
  used_at     timestamptz not null default now()
);

-- ─── ORDERS ───────────────────────────────────────────────────
create table orders (
  id                  uuid primary key default uuid_generate_v4(),
  order_number        text not null unique,  -- 'UFO-2025-00001'
  profile_id          uuid references profiles(id),
  guest_email         text,
  status              order_status not null default 'pending',
  -- address snapshot
  shipping_address    jsonb not null default '{}',
  billing_address     jsonb default '{}',
  -- amounts
  subtotal            numeric(12,2) not null default 0,
  discount_amount     numeric(12,2) not null default 0,
  shipping_amount     numeric(12,2) not null default 0,
  tax_amount          numeric(12,2) not null default 0,
  gift_card_amount    numeric(12,2) not null default 0,
  loyalty_discount    numeric(12,2) not null default 0,
  total               numeric(12,2) not null default 0,
  -- payment
  stripe_payment_intent_id text,
  stripe_charge_id    text,
  payment_method      text,
  paid_at             timestamptz,
  -- discounts
  coupon_id           uuid references coupons(id),
  coupon_code         text,
  affiliate_id        uuid,
  affiliate_link_id   uuid,
  -- shipping
  shipping_method     text,
  tracking_number     text,
  tracking_url        text,
  shipped_at          timestamptz,
  delivered_at        timestamptz,
  estimated_delivery  date,
  -- loyalty
  loyalty_points_earned integer not null default 0,
  loyalty_points_used   integer not null default 0,
  -- notes
  customer_note       text,
  internal_note       text,
  -- subscription
  subscription_id     uuid,
  is_subscription_order boolean not null default false,
  -- locale
  currency            text not null default 'INR',
  locale              text not null default 'en',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create table order_items (
  id              uuid primary key default uuid_generate_v4(),
  order_id        uuid not null references orders(id) on delete cascade,
  product_id      uuid not null references products(id),
  variant_id      uuid not null references product_variants(id),
  product_name    jsonb not null default '{}',
  variant_name    text not null,
  sku             text not null,
  quantity        integer not null,
  unit_price      numeric(10,2) not null,
  discount_amount numeric(10,2) not null default 0,
  tax_amount      numeric(10,2) not null default 0,
  total           numeric(10,2) not null,
  image_url       text
);

create table order_status_history (
  id          uuid primary key default uuid_generate_v4(),
  order_id    uuid not null references orders(id) on delete cascade,
  status      order_status not null,
  note        text,
  created_by  uuid references profiles(id),
  created_at  timestamptz not null default now()
);

-- ─── CART SESSIONS ────────────────────────────────────────────
create table cart_sessions (
  id            uuid primary key default uuid_generate_v4(),
  profile_id    uuid references profiles(id) on delete cascade,
  session_token text unique,  -- for guests
  coupon_id     uuid references coupons(id),
  gift_card_id  uuid,
  expires_at    timestamptz not null default (now() + interval '30 days'),
  updated_at    timestamptz not null default now()
);

create table cart_items (
  id          uuid primary key default uuid_generate_v4(),
  cart_id     uuid not null references cart_sessions(id) on delete cascade,
  variant_id  uuid not null references product_variants(id) on delete cascade,
  quantity    integer not null default 1,
  added_at    timestamptz not null default now(),
  unique(cart_id, variant_id)
);

-- ─── SUBSCRIPTIONS ────────────────────────────────────────────
create table subscription_plans (
  id              uuid primary key default uuid_generate_v4(),
  name            jsonb not null default '{}',
  interval        subscription_interval not null,
  interval_count  integer not null default 1,  -- every N intervals
  discount_pct    numeric(5,2) not null default 0,
  stripe_price_id text,
  is_active       boolean not null default true,
  sort_order      integer not null default 0
);

create table subscriptions (
  id                      uuid primary key default uuid_generate_v4(),
  profile_id              uuid not null references profiles(id) on delete cascade,
  plan_id                 uuid not null references subscription_plans(id),
  status                  subscription_status not null default 'active',
  stripe_subscription_id  text unique,
  shipping_address_id     uuid references addresses(id),
  coupon_id               uuid references coupons(id),
  -- billing
  subtotal                numeric(12,2) not null default 0,
  discount_amount         numeric(12,2) not null default 0,
  total                   numeric(12,2) not null default 0,
  -- schedule
  current_period_start    timestamptz,
  current_period_end      timestamptz,
  next_billing_date       timestamptz,
  cancelled_at            timestamptz,
  pause_until             timestamptz,
  skip_next               boolean not null default false,
  -- meta
  notes                   text,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create table subscription_items (
  id              uuid primary key default uuid_generate_v4(),
  subscription_id uuid not null references subscriptions(id) on delete cascade,
  variant_id      uuid not null references product_variants(id),
  quantity        integer not null default 1,
  unit_price      numeric(10,2) not null
);

-- ─── AFFILIATES ───────────────────────────────────────────────
create table affiliates (
  id                  uuid primary key default uuid_generate_v4(),
  profile_id          uuid not null unique references profiles(id) on delete cascade,
  status              affiliate_status not null default 'pending',
  code                text not null unique,    -- their unique referral code
  -- commission
  commission_rate     numeric(5,2) not null default 10,  -- default 10%
  commission_tier     text not null default 'standard',
  -- bank / payout
  payout_method       text,     -- 'bank', 'upi', 'paypal'
  payout_details      jsonb default '{}',
  min_payout_amount   numeric(10,2) not null default 500,
  -- stats (denormalised for speed)
  total_clicks        integer not null default 0,
  total_orders        integer not null default 0,
  total_revenue       numeric(12,2) not null default 0,
  total_commission    numeric(12,2) not null default 0,
  pending_commission  numeric(12,2) not null default 0,
  paid_commission     numeric(12,2) not null default 0,
  balance             numeric(12,2) not null default 0,
  -- notes
  bio                 text,
  social_links        jsonb default '{}',
  notes               text,
  approved_at         timestamptz,
  approved_by         uuid references profiles(id),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create table affiliate_links (
  id            uuid primary key default uuid_generate_v4(),
  affiliate_id  uuid not null references affiliates(id) on delete cascade,
  name          text not null default 'Default',
  slug          text not null unique,  -- /ref/SLUG
  destination   text not null default '/',
  clicks        integer not null default 0,
  conversions   integer not null default 0,
  qr_code_url   text,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);

create table affiliate_commissions (
  id            uuid primary key default uuid_generate_v4(),
  affiliate_id  uuid not null references affiliates(id) on delete cascade,
  order_id      uuid not null references orders(id),
  link_id       uuid references affiliate_links(id),
  status        commission_status not null default 'pending',
  order_total   numeric(12,2) not null,
  rate          numeric(5,2) not null,
  amount        numeric(12,2) not null,
  approved_at   timestamptz,
  paid_at       timestamptz,
  payout_id     uuid,
  created_at    timestamptz not null default now()
);

create table affiliate_payouts (
  id            uuid primary key default uuid_generate_v4(),
  affiliate_id  uuid not null references affiliates(id) on delete cascade,
  status        payout_status not null default 'pending',
  amount        numeric(12,2) not null,
  method        text not null,
  reference     text,
  notes         text,
  processed_at  timestamptz,
  created_at    timestamptz not null default now()
);

-- ─── REVIEWS ──────────────────────────────────────────────────
create table reviews (
  id            uuid primary key default uuid_generate_v4(),
  product_id    uuid not null references products(id) on delete cascade,
  profile_id    uuid references profiles(id) on delete set null,
  order_id      uuid references orders(id),
  author_name   text not null,
  author_email  text,
  rating        integer not null check (rating between 1 and 5),
  title         text,
  body          text,
  status        review_status not null default 'pending',
  verified_purchase boolean not null default false,
  helpful_votes integer not null default 0,
  not_helpful_votes integer not null default 0,
  admin_reply   text,
  admin_replied_at timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table review_images (
  id          uuid primary key default uuid_generate_v4(),
  review_id   uuid not null references reviews(id) on delete cascade,
  url         text not null,
  sort_order  integer not null default 0
);

-- ─── WISHLISTS ────────────────────────────────────────────────
create table wishlists (
  id          uuid primary key default uuid_generate_v4(),
  profile_id  uuid not null unique references profiles(id) on delete cascade,
  created_at  timestamptz not null default now()
);

create table wishlist_items (
  id          uuid primary key default uuid_generate_v4(),
  wishlist_id uuid not null references wishlists(id) on delete cascade,
  product_id  uuid not null references products(id) on delete cascade,
  variant_id  uuid references product_variants(id),
  added_at    timestamptz not null default now(),
  unique(wishlist_id, product_id)
);

-- ─── LOYALTY ──────────────────────────────────────────────────
create table loyalty_tiers (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null,     -- 'Bronze', 'Silver', 'Gold', 'Platinum'
  min_points      integer not null,
  multiplier      numeric(4,2) not null default 1,
  perks           jsonb default '[]',
  color           text,
  sort_order      integer not null default 0
);

create table loyalty_accounts (
  id          uuid primary key default uuid_generate_v4(),
  profile_id  uuid not null unique references profiles(id) on delete cascade,
  tier_id     uuid references loyalty_tiers(id),
  points      integer not null default 0,
  lifetime_points integer not null default 0,
  updated_at  timestamptz not null default now()
);

create table loyalty_transactions (
  id          uuid primary key default uuid_generate_v4(),
  account_id  uuid not null references loyalty_accounts(id) on delete cascade,
  event       loyalty_event not null,
  points      integer not null,  -- positive = earned, negative = spent
  reference_id uuid,            -- order_id, etc.
  description text,
  expires_at  timestamptz,
  created_at  timestamptz not null default now()
);

-- ─── GIFT CARDS ───────────────────────────────────────────────
create table gift_cards (
  id              uuid primary key default uuid_generate_v4(),
  code            text not null unique,
  status          gift_card_status not null default 'active',
  initial_amount  numeric(10,2) not null,
  balance         numeric(10,2) not null,
  purchased_by    uuid references profiles(id),
  order_id        uuid references orders(id),
  recipient_email text,
  recipient_name  text,
  message         text,
  expires_at      timestamptz,
  created_at      timestamptz not null default now()
);

create table gift_card_usage (
  id          uuid primary key default uuid_generate_v4(),
  gift_card_id uuid not null references gift_cards(id) on delete cascade,
  order_id    uuid not null references orders(id),
  amount      numeric(10,2) not null,
  used_at     timestamptz not null default now()
);

-- ─── POS ──────────────────────────────────────────────────────
create table pos_locations (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  address     jsonb default '{}',
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

create table pos_sessions (
  id              uuid primary key default uuid_generate_v4(),
  location_id     uuid references pos_locations(id),
  operator_id     uuid not null references profiles(id),
  opening_cash    numeric(10,2) not null default 0,
  closing_cash    numeric(10,2),
  total_sales     numeric(12,2) not null default 0,
  total_cash      numeric(12,2) not null default 0,
  total_card      numeric(12,2) not null default 0,
  total_upi       numeric(12,2) not null default 0,
  total_gift_card numeric(12,2) not null default 0,
  transaction_count integer not null default 0,
  notes           text,
  opened_at       timestamptz not null default now(),
  closed_at       timestamptz
);

create table pos_transactions (
  id              uuid primary key default uuid_generate_v4(),
  session_id      uuid not null references pos_sessions(id) on delete cascade,
  order_id        uuid references orders(id),
  receipt_number  text not null,
  customer_id     uuid references profiles(id),
  customer_name   text,
  subtotal        numeric(12,2) not null default 0,
  discount_amount numeric(12,2) not null default 0,
  tax_amount      numeric(12,2) not null default 0,
  total           numeric(12,2) not null default 0,
  payment_method  pos_payment_method not null,
  cash_given      numeric(12,2),
  cash_change     numeric(12,2),
  coupon_id       uuid references coupons(id),
  gift_card_id    uuid references gift_cards(id),
  gift_card_amount numeric(12,2) not null default 0,
  is_refunded     boolean not null default false,
  refunded_at     timestamptz,
  created_at      timestamptz not null default now()
);

create table pos_transaction_items (
  id              uuid primary key default uuid_generate_v4(),
  transaction_id  uuid not null references pos_transactions(id) on delete cascade,
  variant_id      uuid not null references product_variants(id),
  product_name    text not null,
  variant_name    text not null,
  sku             text not null,
  quantity        integer not null,
  unit_price      numeric(10,2) not null,
  discount_amount numeric(10,2) not null default 0,
  tax_amount      numeric(10,2) not null default 0,
  total           numeric(10,2) not null
);

-- ─── BLOG ─────────────────────────────────────────────────────
create table blog_categories (
  id      uuid primary key default uuid_generate_v4(),
  name    jsonb not null default '{}',
  slug    text not null unique,
  is_active boolean not null default true
);

create table blog_posts (
  id              uuid primary key default uuid_generate_v4(),
  title           jsonb not null default '{}',
  slug            text not null unique,
  excerpt         jsonb default '{}',
  content         jsonb default '{}',   -- rich text / MDX per locale
  category_id     uuid references blog_categories(id),
  author_id       uuid references profiles(id),
  status          blog_status not null default 'draft',
  featured_image  text,
  seo_title       jsonb default '{}',
  seo_description jsonb default '{}',
  published_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ─── SEO SETTINGS ─────────────────────────────────────────────
create table seo_settings (
  id          uuid primary key default uuid_generate_v4(),
  page        text not null unique,  -- 'home', 'products', '/products/astro-creatine', etc.
  title       jsonb default '{}',
  description jsonb default '{}',
  og_title    jsonb default '{}',
  og_desc     jsonb default '{}',
  og_image    text,
  keywords    text[],
  robots      text not null default 'index,follow',
  canonical   text,
  schema      jsonb default '{}',
  updated_at  timestamptz not null default now()
);

-- ─── SITE SETTINGS ────────────────────────────────────────────
create table site_settings (
  key     text primary key,
  value   jsonb not null,
  updated_at timestamptz not null default now()
);

-- ─── EMAIL TEMPLATES ──────────────────────────────────────────
create table email_templates (
  id          uuid primary key default uuid_generate_v4(),
  type        email_template_type not null unique,
  subject     jsonb not null default '{}',
  html_body   jsonb not null default '{}',
  is_active   boolean not null default true,
  updated_at  timestamptz not null default now()
);

-- ─── PUSH SUBSCRIPTIONS ───────────────────────────────────────
create table push_subscriptions (
  id          uuid primary key default uuid_generate_v4(),
  profile_id  uuid references profiles(id) on delete cascade,
  endpoint    text not null unique,
  p256dh      text not null,
  auth_key    text not null,
  created_at  timestamptz not null default now()
);

-- ─── INVENTORY ADJUSTMENTS ────────────────────────────────────
create table inventory_adjustments (
  id          uuid primary key default uuid_generate_v4(),
  variant_id  uuid not null references product_variants(id) on delete cascade,
  quantity    integer not null,   -- positive = add, negative = remove
  reason      text not null,      -- 'sale','purchase','damage','correction','pos_sale'
  reference_id uuid,              -- order_id or pos_transaction_id
  created_by  uuid references profiles(id),
  created_at  timestamptz not null default now()
);

-- ─── ANALYTICS EVENTS ─────────────────────────────────────────
create table analytics_events (
  id          uuid primary key default uuid_generate_v4(),
  session_id  text,
  profile_id  uuid references profiles(id),
  event       text not null,
  properties  jsonb default '{}',
  page        text,
  referrer    text,
  user_agent  text,
  ip_hash     text,
  created_at  timestamptz not null default now()
);

-- ─── INDEXES ──────────────────────────────────────────────────
create index on products(slug);
create index on products(status);
create index on products(category_id);
create index on products(featured) where featured = true;
create index on product_variants(product_id);
create index on product_variants(sku);
create index on orders(profile_id);
create index on orders(status);
create index on orders(created_at desc);
create index on orders(order_number);
create index on order_items(order_id);
create index on affiliates(code);
create index on affiliates(profile_id);
create index on affiliate_links(slug);
create index on affiliate_commissions(affiliate_id);
create index on affiliate_commissions(status);
create index on coupons(code);
create index on cart_sessions(profile_id);
create index on cart_sessions(session_token);
create index on reviews(product_id);
create index on reviews(status);
create index on loyalty_accounts(profile_id);
create index on loyalty_transactions(account_id);
create index on pos_sessions(operator_id);
create index on pos_transactions(session_id);
create index on blog_posts(slug);
create index on blog_posts(status);
create index on subscriptions(profile_id);
create index on subscriptions(status);
create index on analytics_events(created_at desc);
create index on analytics_events(event);

-- ─── FUNCTIONS ────────────────────────────────────────────────

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger trg_profiles_updated before update on profiles for each row execute function update_updated_at();
create trigger trg_products_updated before update on products for each row execute function update_updated_at();
create trigger trg_variants_updated before update on product_variants for each row execute function update_updated_at();
create trigger trg_orders_updated before update on orders for each row execute function update_updated_at();
create trigger trg_subscriptions_updated before update on subscriptions for each row execute function update_updated_at();
create trigger trg_affiliates_updated before update on affiliates for each row execute function update_updated_at();
create trigger trg_reviews_updated before update on reviews for each row execute function update_updated_at();

-- Generate order number
create or replace function generate_order_number()
returns text language plpgsql as $$
declare
  year text := to_char(now(), 'YYYY');
  seq  bigint;
begin
  seq := nextval('order_seq');
  return 'UFO-' || year || '-' || lpad(seq::text, 5, '0');
end;
$$;

create sequence if not exists order_seq start 1;

-- Auto-assign order number
create or replace function set_order_number()
returns trigger language plpgsql as $$
begin
  if new.order_number is null or new.order_number = '' then
    new.order_number := generate_order_number();
  end if;
  return new;
end;
$$;

create trigger trg_order_number before insert on orders
  for each row execute function set_order_number();

-- Update product rating on review change
create or replace function update_product_rating()
returns trigger language plpgsql as $$
begin
  update products set
    avg_rating = (select coalesce(avg(rating), 0) from reviews where product_id = coalesce(new.product_id, old.product_id) and status = 'approved'),
    total_reviews = (select count(*) from reviews where product_id = coalesce(new.product_id, old.product_id) and status = 'approved')
  where id = coalesce(new.product_id, old.product_id);
  return coalesce(new, old);
end;
$$;

create trigger trg_review_rating after insert or update or delete on reviews
  for each row execute function update_product_rating();

-- Decrement inventory on order
create or replace function decrement_inventory()
returns trigger language plpgsql as $$
begin
  -- Called after order_items insert
  update product_variants
    set stock = stock - new.quantity
  where id = new.variant_id and stock >= new.quantity;

  insert into inventory_adjustments(variant_id, quantity, reason, reference_id)
  values (new.variant_id, -new.quantity, 'sale', new.order_id);

  return new;
end;
$$;

-- Handle new user signup → create profile + loyalty account + wishlist
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
declare
  wid uuid;
  lid uuid;
begin
  insert into profiles(id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');

  insert into wishlists(profile_id) values (new.id);

  insert into loyalty_accounts(profile_id) values (new.id);

  return new;
end;
$$;

create trigger trg_new_user after insert on auth.users
  for each row execute function handle_new_user();

-- Affiliate click tracker
create or replace function track_affiliate_click(p_slug text)
returns void language plpgsql as $$
begin
  update affiliate_links set clicks = clicks + 1 where slug = p_slug;
  update affiliates a
    set total_clicks = total_clicks + 1
  from affiliate_links l
  where l.slug = p_slug and l.affiliate_id = a.id;
end;
$$;
