-- ═══════════════════════════════════════════════════════════
-- UFO LABZ – Combined Supabase Database Setup
-- Contains Schema, Row Level Security Policies, and Swiss Seed Data
-- Run this in your Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════
-- ─── DROP EXISTING TABLES (FOR RE-RUN SAFETY) ─────────────────
drop table if exists
  analytics_events,
  inventory_adjustments,
  push_subscriptions,
  email_templates,
  site_settings,
  seo_settings,
  blog_posts,
  blog_categories,
  pos_transaction_items,
  pos_transactions,
  pos_sessions,
  pos_locations,
  gift_card_usage,
  gift_cards,
  loyalty_transactions,
  loyalty_accounts,
  loyalty_tiers,
  wishlist_items,
  wishlists,
  review_images,
  reviews,
  affiliate_payouts,
  affiliate_commissions,
  affiliate_links,
  affiliates,
  subscription_items,
  subscriptions,
  subscription_plans,
  cart_items,
  cart_sessions,
  order_status_history,
  order_items,
  orders,
  coupon_usage,
  coupons,
  product_certificates,
  product_stacks,
  pricing_rules,
  product_faqs,
  nutrition_facts,
  product_ingredients,
  ingredients,
  product_tags,
  product_videos,
  product_images,
  product_variants,
  products,
  tags,
  categories,
  flavors,
  addresses,
  profiles
cascade;

-- ─── EXTENSIONS ──────────────────────────────────────────────
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";
create extension if not exists "unaccent";


-- ─── ENUMS ────────────────────────────────────────────────────
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
    CREATE TYPE order_status AS ENUM (
      'pending','payment_pending','confirmed','processing',
      'shipped','out_for_delivery','delivered','cancelled','refunded','partially_refunded'
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_status') THEN
    CREATE TYPE subscription_status AS ENUM (
      'active','paused','cancelled','past_due','trialing','expired'
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_interval') THEN
    CREATE TYPE subscription_interval AS ENUM ('monthly','bimonthly','quarterly','biannual','annual');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'affiliate_status') THEN
    CREATE TYPE affiliate_status AS ENUM ('pending','approved','suspended','rejected');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'commission_status') THEN
    CREATE TYPE commission_status AS ENUM ('pending','approved','paid','cancelled');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payout_status') THEN
    CREATE TYPE payout_status AS ENUM ('pending','processing','paid','failed');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'coupon_type') THEN
    CREATE TYPE coupon_type AS ENUM ('percentage','fixed','free_shipping','buy_x_get_y');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'coupon_applies_to') THEN
    CREATE TYPE coupon_applies_to AS ENUM ('all','products','categories','variants');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'loyalty_event') THEN
    CREATE TYPE loyalty_event AS ENUM (
      'purchase','review','referral','birthday','signup','social_share','redemption','adjustment'
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'pos_payment_method') THEN
    CREATE TYPE pos_payment_method AS ENUM ('cash','card','upi','gift_card','mixed');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('customer','affiliate','pos_operator','admin','super_admin');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'review_status') THEN
    CREATE TYPE review_status AS ENUM ('pending','approved','rejected','flagged');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'product_status') THEN
    CREATE TYPE product_status AS ENUM ('draft','active','archived');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'variant_status') THEN
    CREATE TYPE variant_status AS ENUM ('active','out_of_stock','discontinued');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'gift_card_status') THEN
    CREATE TYPE gift_card_status AS ENUM ('active','redeemed','expired','cancelled');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'blog_status') THEN
    CREATE TYPE blog_status AS ENUM ('draft','published','archived');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'email_template_type') THEN
    CREATE TYPE email_template_type AS ENUM (
      'order_confirmation','invoice','shipping','delivery','refund',
      'welcome','password_reset','subscription_reminder','subscription_renewal',
      'abandoned_cart','affiliate_approval','affiliate_payment','coupon',
      'newsletter','birthday','review_request','win_back','low_stock'
    );
  END IF;
END $$;


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
  country      text not null default 'CH',
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

-- ─── FLAVORS ──────────────────────────────────────────────────
create table flavors (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null unique,
  slug        text not null unique,
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
  base_price          numeric(10,2) not null default 0,
  compare_at_price    numeric(10,2),
  cost_price          numeric(10,2),
  tax_class           text not null default 'standard',
  hsn_code            text,
  gst_rate            numeric(5,2) not null default 8.1,
  seo_title           jsonb default '{}',
  seo_description     jsonb default '{}',
  og_image_url        text,
  schema_markup       jsonb default '{}',
  track_inventory     boolean not null default true,
  allow_backorder     boolean not null default false,
  low_stock_threshold integer not null default 10,
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
  flavor_id       uuid references flavors(id) on delete set null,
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
  shipping_address    jsonb not null default '{}',
  billing_address     jsonb default '{}',
  subtotal            numeric(12,2) not null default 0,
  discount_amount     numeric(12,2) not null default 0,
  shipping_amount     numeric(12,2) not null default 0,
  tax_amount          numeric(12,2) not null default 0,
  gift_card_amount    numeric(12,2) not null default 0,
  loyalty_discount    numeric(12,2) not null default 0,
  total               numeric(12,2) not null default 0,
  stripe_payment_intent_id text,
  stripe_charge_id    text,
  payment_method      text,
  paid_at             timestamptz,
  coupon_id           uuid references coupons(id),
  coupon_code         text,
  affiliate_id        uuid,
  affiliate_link_id   uuid,
  shipping_method     text,
  tracking_number     text,
  tracking_url        text,
  shipped_at          timestamptz,
  delivered_at        timestamptz,
  estimated_delivery  date,
  loyalty_points_earned integer not null default 0,
  loyalty_points_used   integer not null default 0,
  customer_note       text,
  internal_note       text,
  subscription_id     uuid,
  is_subscription_order boolean not null default false,
  currency            text not null default 'CHF',
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
  subtotal                numeric(12,2) not null default 0,
  discount_amount         numeric(12,2) not null default 0,
  total                   numeric(12,2) not null default 0,
  current_period_start    timestamptz,
  current_period_end      timestamptz,
  next_billing_date       timestamptz,
  cancelled_at            timestamptz,
  pause_until             timestamptz,
  skip_next               boolean not null default false,
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
  code                text not null unique,    -- referral code
  commission_rate     numeric(5,2) not null default 10,
  commission_tier     text not null default 'standard',
  payout_method       text,     -- 'bank', 'upi', 'paypal'
  payout_details      jsonb default '{}',
  min_payout_amount   numeric(10,2) not null default 50,
  total_clicks        integer not null default 0,
  total_orders        integer not null default 0,
  total_revenue       numeric(12,2) not null default 0,
  total_commission    numeric(12,2) not null default 0,
  pending_commission  numeric(12,2) not null default 0,
  paid_commission     numeric(12,2) not null default 0,
  balance             numeric(12,2) not null default 0,
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
  name            text not null,
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
  points      integer not null,
  reference_id uuid,
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
  content         jsonb default '{}',
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
  page        text not null unique,
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
  quantity    integer not null,
  reason      text not null,
  reference_id uuid,
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

-- ═══════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY POLICIES
-- ═══════════════════════════════════════════════════════════
alter table profiles enable row level security;
alter table addresses enable row level security;
alter table products enable row level security;
alter table product_variants enable row level security;
alter table product_images enable row level security;
alter table product_videos enable row level security;
alter table product_ingredients enable row level security;
alter table nutrition_facts enable row level security;
alter table product_faqs enable row level security;
alter table product_certificates enable row level security;
alter table product_stacks enable row level security;
alter table pricing_rules enable row level security;
alter table categories enable row level security;
alter table tags enable row level security;
alter table product_tags enable row level security;
alter table ingredients enable row level security;
alter table coupons enable row level security;
alter table coupon_usage enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table order_status_history enable row level security;
alter table cart_sessions enable row level security;
alter table cart_items enable row level security;
alter table subscription_plans enable row level security;
alter table subscriptions enable row level security;
alter table subscription_items enable row level security;
alter table affiliates enable row level security;
alter table affiliate_links enable row level security;
alter table affiliate_commissions enable row level security;
alter table affiliate_payouts enable row level security;
alter table reviews enable row level security;
alter table review_images enable row level security;
alter table wishlists enable row level security;
alter table wishlist_items enable row level security;
alter table loyalty_tiers enable row level security;
alter table loyalty_accounts enable row level security;
alter table loyalty_transactions enable row level security;
alter table gift_cards enable row level security;
alter table gift_card_usage enable row level security;
alter table pos_locations enable row level security;
alter table pos_sessions enable row level security;
alter table pos_transactions enable row level security;
alter table pos_transaction_items enable row level security;
alter table blog_posts enable row level security;
alter table blog_categories enable row level security;
alter table seo_settings enable row level security;
alter table site_settings enable row level security;
alter table email_templates enable row level security;
alter table push_subscriptions enable row level security;
alter table inventory_adjustments enable row level security;

-- ─── HELPER FUNCTIONS ─────────────────────────────────────────
create or replace function is_admin()
returns boolean language sql security definer as $$
  select exists(
    select 1 from profiles
    where id = auth.uid()
    and role in ('admin','super_admin')
  );
$$;

create or replace function is_pos_operator()
returns boolean language sql security definer as $$
  select exists(
    select 1 from profiles
    where id = auth.uid()
    and role in ('pos_operator','admin','super_admin')
  );
$$;

create or replace function is_affiliate()
returns boolean language sql security definer as $$
  select exists(
    select 1 from affiliates
    where profile_id = auth.uid()
    and status = 'approved'
  );
$$;

-- ─── POLICIES ─────────────────────────────────────────────────
create policy "profiles: own read" on profiles for select using (id = auth.uid() or is_admin());
create policy "profiles: own update" on profiles for update using (id = auth.uid() or is_admin());
create policy "profiles: admin insert" on profiles for insert with check (is_admin() or id = auth.uid());
create policy "profiles: admin delete" on profiles for delete using (is_admin());

create policy "addresses: own crud" on addresses for all using (profile_id = auth.uid() or is_admin());

create policy "products: public read active" on products for select using (status = 'active' or is_admin());
create policy "products: admin write" on products for insert with check (is_admin());
create policy "products: admin update" on products for update using (is_admin());
create policy "products: admin delete" on products for delete using (is_admin());

create policy "variants: public read" on product_variants for select using (true);
create policy "variants: admin write" on product_variants for all using (is_admin());

create policy "images: public read" on product_images for select using (true);
create policy "images: admin write" on product_images for all using (is_admin());

create policy "videos: public read" on product_videos for select using (true);
create policy "videos: admin write" on product_videos for all using (is_admin());

create policy "p_ingredients: public read" on product_ingredients for select using (true);
create policy "p_ingredients: admin write" on product_ingredients for all using (is_admin());

create policy "nutrition: public read" on nutrition_facts for select using (true);
create policy "nutrition: admin write" on nutrition_facts for all using (is_admin());

create policy "faqs: public read" on product_faqs for select using (true);
create policy "faqs: admin write" on product_faqs for all using (is_admin());

create policy "certs: public read" on product_certificates for select using (true);
create policy "certs: admin write" on product_certificates for all using (is_admin());

create policy "stacks: public read" on product_stacks for select using (true);
create policy "stacks: admin write" on product_stacks for all using (is_admin());

create policy "pricing: public read" on pricing_rules for select using (is_active = true or is_admin());
create policy "pricing: admin write" on pricing_rules for all using (is_admin());

create policy "categories: public read" on categories for select using (is_active = true or is_admin());
create policy "categories: admin write" on categories for all using (is_admin());

create policy "tags: public read" on tags for select using (true);
create policy "tags: admin write" on tags for all using (is_admin());

create policy "product_tags: public read" on product_tags for select using (true);
create policy "product_tags: admin write" on product_tags for all using (is_admin());

create policy "ingredients: public read" on ingredients for select using (is_active = true or is_admin());
create policy "ingredients: admin write" on ingredients for all using (is_admin());

create policy "coupons: public read active" on coupons for select using (is_active = true or is_admin());
create policy "coupons: admin write" on coupons for all using (is_admin());
create policy "coupon_usage: own read" on coupon_usage for select using (profile_id = auth.uid() or is_admin());
create policy "coupon_usage: system insert" on coupon_usage for insert with check (true);

create policy "orders: own read" on orders for select using (profile_id = auth.uid() or is_admin() or is_pos_operator());
create policy "orders: insert" on orders for insert with check (true);
create policy "orders: admin update" on orders for update using (is_admin() or is_pos_operator());

create policy "order_items: own read" on order_items for select
  using (exists(select 1 from orders o where o.id = order_id and (o.profile_id = auth.uid() or is_admin() or is_pos_operator())));
create policy "order_items: insert" on order_items for insert with check (true);

create policy "order_history: own read" on order_status_history for select
  using (exists(select 1 from orders o where o.id = order_id and (o.profile_id = auth.uid() or is_admin())));
create policy "order_history: admin insert" on order_status_history for insert with check (is_admin() or is_pos_operator());

create policy "cart: own crud" on cart_sessions for all using (
  profile_id = auth.uid() or session_token is not null or is_admin()
);
create policy "cart_items: own crud" on cart_items for all using (
  exists(select 1 from cart_sessions c where c.id = cart_id and (c.profile_id = auth.uid() or c.session_token is not null))
  or is_admin()
);

create policy "sub_plans: public read" on subscription_plans for select using (is_active = true or is_admin());
create policy "sub_plans: admin write" on subscription_plans for all using (is_admin());

create policy "subscriptions: own read" on subscriptions for select using (profile_id = auth.uid() or is_admin());
create policy "subscriptions: own insert" on subscriptions for insert with check (profile_id = auth.uid() or is_admin());
create policy "subscriptions: own update" on subscriptions for update using (profile_id = auth.uid() or is_admin());

create policy "sub_items: own read" on subscription_items for select
  using (exists(select 1 from subscriptions s where s.id = subscription_id and (s.profile_id = auth.uid() or is_admin())));
create policy "sub_items: own write" on subscription_items for all
  using (exists(select 1 from subscriptions s where s.id = subscription_id and (s.profile_id = auth.uid() or is_admin())));

create policy "affiliates: own read" on affiliates for select using (profile_id = auth.uid() or is_admin());
create policy "affiliates: own update" on affiliates for update using (profile_id = auth.uid() or is_admin());
create policy "affiliates: insert" on affiliates for insert with check (profile_id = auth.uid() or is_admin());
create policy "affiliates: admin delete" on affiliates for delete using (is_admin());

create policy "aff_links: own read" on affiliate_links for select using (
  exists(select 1 from affiliates a where a.id = affiliate_id and (a.profile_id = auth.uid() or is_admin()))
);
create policy "aff_links: own write" on affiliate_links for all using (
  exists(select 1 from affiliates a where a.id = affiliate_id and (a.profile_id = auth.uid() or is_admin()))
);

create policy "aff_commissions: own read" on affiliate_commissions for select using (
  exists(select 1 from affiliates a where a.id = affiliate_id and (a.profile_id = auth.uid() or is_admin()))
);
create policy "aff_commissions: admin write" on affiliate_commissions for all using (is_admin());

create policy "aff_payouts: own read" on affiliate_payouts for select using (
  exists(select 1 from affiliates a where a.id = affiliate_id and (a.profile_id = auth.uid() or is_admin()))
);
create policy "aff_payouts: admin write" on affiliate_payouts for all using (is_admin());

create policy "reviews: public read approved" on reviews for select using (status = 'approved' or profile_id = auth.uid() or is_admin());
create policy "reviews: auth insert" on reviews for insert with check (auth.uid() is not null or true);
create policy "reviews: own update" on reviews for update using (profile_id = auth.uid() or is_admin());
create policy "reviews: admin delete" on reviews for delete using (is_admin());

create policy "review_images: public read" on review_images for select using (true);
create policy "review_images: auth write" on review_images for all using (
  exists(select 1 from reviews r where r.id = review_id and (r.profile_id = auth.uid() or is_admin()))
);

create policy "wishlists: own read" on wishlists for select using (profile_id = auth.uid() or is_admin());
create policy "wishlist_items: own crud" on wishlist_items for all using (
  exists(select 1 from wishlists w where w.id = wishlist_id and (w.profile_id = auth.uid() or is_admin()))
);

create policy "loyalty_tiers: public read" on loyalty_tiers for select using (true);
create policy "loyalty_tiers: admin write" on loyalty_tiers for all using (is_admin());

create policy "loyalty_accounts: own read" on loyalty_accounts for select using (profile_id = auth.uid() or is_admin());
create policy "loyalty_accounts: admin update" on loyalty_accounts for update using (is_admin());
create policy "loyalty_transactions: own read" on loyalty_transactions for select using (
  exists(select 1 from loyalty_accounts la where la.id = account_id and (la.profile_id = auth.uid() or is_admin()))
);
create policy "loyalty_transactions: system write" on loyalty_transactions for insert with check (is_admin());

create policy "gift_cards: own read" on gift_cards for select using (
  purchased_by = auth.uid() or recipient_email = (select email from profiles where id = auth.uid()) or is_admin()
);
create policy "gift_cards: insert" on gift_cards for insert with check (true);
create policy "gift_cards: admin update" on gift_cards for update using (is_admin());

create policy "pos_locations: all read" on pos_locations for select using (is_pos_operator() or is_admin());
create policy "pos_locations: admin write" on pos_locations for all using (is_admin());

create policy "pos_sessions: operator read" on pos_sessions for select using (operator_id = auth.uid() or is_admin());
create policy "pos_sessions: operator insert" on pos_sessions for insert with check (is_pos_operator());
create policy "pos_sessions: operator update" on pos_sessions for update using (operator_id = auth.uid() or is_admin());

create policy "pos_transactions: operator read" on pos_transactions for select
  using (exists(select 1 from pos_sessions s where s.id = session_id and (s.operator_id = auth.uid() or is_admin())));
create policy "pos_transactions: operator insert" on pos_transactions for insert with check (is_pos_operator());

create policy "pos_tx_items: operator read" on pos_transaction_items for select
  using (exists(
    select 1 from pos_transactions t join pos_sessions s on s.id = t.session_id
    where t.id = transaction_id and (s.operator_id = auth.uid() or is_admin())
  ));
create policy "pos_tx_items: operator insert" on pos_transaction_items for insert with check (is_pos_operator());

create policy "blog_categories: public read" on blog_categories for select using (true);
create policy "blog_categories: admin write" on blog_categories for all using (is_admin());
create policy "blog_posts: public read published" on blog_posts for select using (status = 'published' or is_admin());
create policy "blog_posts: admin write" on blog_posts for all using (is_admin());

create policy "seo: public read" on seo_settings for select using (true);
create policy "seo: admin write" on seo_settings for all using (is_admin());

create policy "site_settings: public read" on site_settings for select using (true);
create policy "site_settings: admin write" on site_settings for all using (is_admin());

create policy "email_templates: admin all" on email_templates for all using (is_admin());

create policy "push_subs: own crud" on push_subscriptions for all using (profile_id = auth.uid() or is_admin());

create policy "inventory: admin read" on inventory_adjustments for select using (is_admin() or is_pos_operator());
create policy "inventory: system write" on inventory_adjustments for insert with check (true);

-- ─── DB FUNCTION: handle_new_user ─────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  default_tier_id uuid;
  new_account_id uuid;
  new_wishlist_id uuid;
begin
  -- 1. Create Profile
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    'customer'
  );

  -- 2. Create Wishlist
  insert into public.wishlists (profile_id)
  values (new.id)
  returning id into new_wishlist_id;

  -- 3. Get Default Loyalty Tier
  select id into default_tier_id from public.loyalty_tiers order by sort_order asc limit 1;

  -- 4. Create Loyalty Account
  insert into public.loyalty_accounts (profile_id, tier_id, points, lifetime_points)
  values (new.id, default_tier_id, 100, 100) -- 100 points signup bonus
  returning id into new_account_id;

  -- 5. Track Signup Loyalty Transaction
  insert into public.loyalty_transactions (account_id, event, points, description)
  values (new_account_id, 'signup', 100, 'Signup Bonus Points');

  return new;
end;
$$;

-- Trigger on auth.users for auto profile/loyalty creation
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ═══════════════════════════════════════════════════════════
-- SEED DATA (SWISS ACCENTED CHF)
-- ═══════════════════════════════════════════════════════════

-- ─── SUBSCRIPTION PLANS ───────────────────────────────────────
insert into subscription_plans (name, interval, interval_count, discount_pct, sort_order) values
  ('{"en":"Monthly Delivery","de":"Monatliche Lieferung"}', 'monthly', 1, 10, 1),
  ('{"en":"Every 2 Months","de":"Alle 2 Monate"}', 'bimonthly', 2, 12, 2),
  ('{"en":"Quarterly Supply","de":"Quartalsweise Lieferung"}', 'quarterly', 3, 15, 3);

-- ─── LOYALTY TIERS ────────────────────────────────────────────
insert into loyalty_tiers (name, min_points, multiplier, color, sort_order) values
  ('Earthling', 0, 1.0, '#7777AA', 1),
  ('Astronaut', 1000, 1.25, '#00FF88', 2),
  ('Alien', 5000, 1.5, '#00CFFF', 3),
  ('Galaxy Elite', 15000, 2.0, '#9B30FF', 4);

-- ─── CATEGORIES ───────────────────────────────────────────────
insert into categories (name, slug, sort_order) values
  ('{"en":"Creatine","de":"Kreatin"}', 'creatine', 1),
  ('{"en":"Pre Workout","de":"Pre-Workout"}', 'pre-workout', 2),
  ('{"en":"Amino Acids","de":"Aminosäuren"}', 'amino-acids', 3),
  ('{"en":"Special Edition","de":"Sonderedition"}', 'special-edition', 4);

-- ─── PRODUCTS ─────────────────────────────────────────────────
insert into products (
  name, slug, tagline, description, short_description,
  category_id, status, featured, product_color, color_name,
  base_price, gst_rate, track_inventory, sort_order
) values
(
  '{"en":"Astro Creatine","de":"Astro Kreatin"}',
  'astro-creatine',
  '{"en":"Micronized strength from another world","de":"Mikronisierte Kraft aus einer anderen Welt"}',
  '{"en":"Astro Creatine is our flagship alien-grade creatine monohydrate formula. Engineered in Switzerland, each serving delivers a precise 5g dose of ultra-micronised creatine to maximise muscle synthesis, increase strength, and fuel your performance."}',
  '{"en":"Alien-grade creatine monohydrate for muscle synthesis and strength."}',
  (select id from categories where slug = 'creatine'),
  'active', true, '#00FF88', 'alien-green',
  39.00, 8.1, true, 1
),
(
  '{"en":"Blast Pre Workout","de":"Blast Pre-Workout"}',
  'blast-pre-workout',
  '{"en":"Ignite explosive energy and focus","de":"Entfache explosive Energie und Fokus"}',
  '{"en":"Blast Pre Workout is the most powerful pre-training formula we have ever created. Featuring natural caffeine, citrulline malate, beta-alanine, and focus enhancers, it will take your training out of this galaxy."}',
  '{"en":"Explosive energy and laser focus formula for extreme pre-workout performance."}',
  (select id from categories where slug = 'pre-workout'),
  'active', true, '#FF2244', 'electric-red',
  49.00, 8.1, true, 2
),
(
  '{"en":"Amino Fuel Mango","de":"Amino Fuel Mango"}',
  'amino-fuel-mango',
  '{"en":"Tropical recovery catalyst","de":"Tropischer Erholungskatalysator"}',
  '{"en":"Amino Fuel Mango delivers a complete EAA & BCAA matrix with added electrolytes. The orange blend supports rapid muscle recovery, reduces soreness, and keeps you hydrated during workouts."}',
  '{"en":"Complete BCAA recovery formula with electrolytes in mango flavor."}',
  (select id from categories where slug = 'amino-acids'),
  'active', true, '#FF8C00', 'mango-orange',
  45.00, 8.1, true, 3
),
(
  '{"en":"Amino Fuel Blue","de":"Amino Fuel Blue"}',
  'amino-fuel-blue',
  '{"en":"Refreshing cosmic blue raspberry","de":"Erfrischende kosmische blaue Himbeere"}',
  '{"en":"Amino Fuel Blue Raspberry is the blue variant of our best-selling amino acid recovery formula. Features full EAA/BCAA matrix and hydration complex for interstellar recovery."}',
  '{"en":"Blue raspberry BCAA recovery formula with electrolytes."}',
  (select id from categories where slug = 'amino-acids'),
  'active', true, '#00CFFF', 'neon-blue',
  45.00, 8.1, true, 4
),
(
  '{"en":"Special Edition","de":"Sonderedition"}',
  'special-edition',
  '{"en":"The cosmic formula reserved for the elite","de":"Die kosmische Formel für die Elite"}',
  '{"en":"Special Edition is our most advanced formula, combining physical performance enhancers with advanced cognitive nootropics like alpha-GPC and lion''s mane."}',
  '{"en":"Galaxy-powered advanced formula combining cognitive and physical performance enhancement."}',
  (select id from categories where slug = 'special-edition'),
  'active', true, '#9B30FF', 'cosmic-purple',
  69.00, 8.1, true, 5
);

-- ─── PRODUCT VARIANTS ─────────────────────────────────────────
insert into product_variants (product_id, name, sku, price, compare_at_price, weight_grams, serving_size, servings, stock, is_default, sort_order)
select id, '300g (60 Servings)', 'ASTRO-300G', 39.00, 49.00, 300, '5g', 60, 500, true, 1 from products where slug = 'astro-creatine';
insert into product_variants (product_id, name, sku, price, compare_at_price, weight_grams, serving_size, servings, stock, is_default, sort_order)
select id, '500g (100 Servings)', 'ASTRO-500G', 59.00, 69.00, 500, '5g', 100, 300, false, 2 from products where slug = 'astro-creatine';

insert into product_variants (product_id, name, sku, price, compare_at_price, weight_grams, serving_size, servings, stock, is_default, sort_order)
select id, '400g (30 Servings) - Sour Cherry', 'BLAST-CHERRY', 49.00, 59.00, 400, '13g', 30, 400, true, 1 from products where slug = 'blast-pre-workout';
insert into product_variants (product_id, name, sku, price, compare_at_price, weight_grams, serving_size, servings, stock, is_default, sort_order)
select id, '400g (30 Servings) - Acid Apple', 'BLAST-APPLE', 49.00, 59.00, 400, '13g', 30, 200, false, 2 from products where slug = 'blast-pre-workout';

insert into product_variants (product_id, name, sku, price, compare_at_price, weight_grams, serving_size, servings, stock, is_default, sort_order)
select id, '390g (30 Servings)', 'AMINO-MANGO', 45.00, null, 390, '13g', 30, 450, true, 1 from products where slug = 'amino-fuel-mango';

insert into product_variants (product_id, name, sku, price, compare_at_price, weight_grams, serving_size, servings, stock, is_default, sort_order)
select id, '390g (30 Servings)', 'AMINO-BLUE', 45.00, null, 390, '13g', 30, 350, true, 1 from products where slug = 'amino-fuel-blue';

insert into product_variants (product_id, name, sku, price, compare_at_price, weight_grams, serving_size, servings, stock, is_default, sort_order)
select id, '360g (30 Servings) - Cosmic Grape', 'SPECIAL-GRAPE', 69.00, 79.00, 360, '12g', 30, 150, true, 1 from products where slug = 'special-edition';

-- ─── DYNAMIC PRICING RULES ────────────────────────────────────
insert into pricing_rules (product_id, name, min_qty, max_qty, discount_type, discount_value, is_active, sort_order)
select id, 'Buy 2 – Save 10%', 2, 4, 'percentage', 10.00, true, 1 from products where slug = 'astro-creatine';
insert into pricing_rules (product_id, name, min_qty, max_qty, discount_type, discount_value, is_active, sort_order)
select id, 'Buy 5+ – Save 15%', 5, null, 'percentage', 15.00, true, 2 from products where slug = 'astro-creatine';

-- ─── SAMPLE COUPONS ───────────────────────────────────────────
insert into coupons (code, type, value, min_order_amount, max_uses, is_active, description) values
  ('ALIEN10', 'percentage', 10, 50.00, 1000, true, '10% off for new space crew members'),
  ('WELCOME10', 'fixed', 10, 60.00, 500, true, 'CHF 10 off on orders above CHF 60'),
  ('FREESHIP', 'free_shipping', 0, 49.00, null, true, 'Free shipping on orders');

-- ─── SITE SETTINGS ────────────────────────────────────────────
insert into site_settings (key, value) values
  ('general', '{"site_name":"UFO LABZ","tagline":"Alien Performance Technology","support_email":"support@ufolabz.com","currency":"CHF","currency_symbol":"CHF"}'),
  ('shipping', '{"free_shipping_above":99,"standard_rate":9,"express_rate":18,"estimated_days_standard":3,"estimated_days_express":1}'),
  ('loyalty', '{"points_per_chf":10,"chf_per_point":0.01,"signup_bonus":100}'),
  ('seo', '{"default_title":"UFO LABZ – Alien Performance Supplements","default_description":"Premium science-backed supplement brand. 5 elite formulas engineered for peak performance.","og_image":"https://ufolabz.com/og-default.jpg"}');

-- ─── PRODUCT FAQs ─────────────────────────────────────────────
insert into product_faqs (product_id, question, answer, sort_order)
select id, '{"en":"How should I consume Astro Creatine?","de":"Wie soll ich Astro Kreatin konsumieren?"}', '{"en":"Mix 1 scoop (5g) with 200ml of water or your favorite beverage daily. No loading phase required, but consistency is key.","de":"Täglich 1 Messlöffel (5g) mit 200ml Wasser oder deinem Lieblingsgetränk mischen. Keine Ladephase erforderlich, aber Kontinuität ist entscheidend."}', 1 from products where slug = 'astro-creatine';

insert into product_faqs (product_id, question, answer, sort_order)
select id, '{"en":"Is Astro Creatine third-party tested?","de":"Wird Astro Kreatin von Dritten getestet?"}', '{"en":"Yes, every single batch is certified by independent Swiss laboratories to be free from heavy metals, contaminants, and banned substances.","de":"Ja, jede einzelne Charge wird von unabhängigen Schweizer Labors zertifiziert, um frei von Schwermetallen, Verunreinigungen und verbotenen Substanzen zu sein."}', 2 from products where slug = 'astro-creatine';
