-- ═══════════════════════════════════════════════════════════
-- UFO LABZ – Row Level Security Policies
-- ═══════════════════════════════════════════════════════════

-- Enable RLS on all tables
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

-- Check if current user is admin or super_admin
create or replace function is_admin()
returns boolean language sql security definer as $$
  select exists(
    select 1 from profiles
    where id = auth.uid()
    and role in ('admin','super_admin')
  );
$$;

-- Check if current user is a POS operator+
create or replace function is_pos_operator()
returns boolean language sql security definer as $$
  select exists(
    select 1 from profiles
    where id = auth.uid()
    and role in ('pos_operator','admin','super_admin')
  );
$$;

-- Check if current user is an approved affiliate
create or replace function is_affiliate()
returns boolean language sql security definer as $$
  select exists(
    select 1 from affiliates
    where profile_id = auth.uid()
    and status = 'approved'
  );
$$;

-- ─── PROFILES ─────────────────────────────────────────────────
create policy "profiles: own read" on profiles for select using (id = auth.uid() or is_admin());
create policy "profiles: own update" on profiles for update using (id = auth.uid() or is_admin());
create policy "profiles: public insert" on profiles for insert with check (true);
create policy "profiles: admin delete" on profiles for delete using (is_admin());

-- ─── ADDRESSES ────────────────────────────────────────────────
create policy "addresses: own crud" on addresses for all using (profile_id = auth.uid() or is_admin());

-- ─── PRODUCTS (public read, admin write) ──────────────────────
create policy "products: public read active" on products for select using (status = 'active' or is_admin());
create policy "products: admin write" on products for insert with check (is_admin());
create policy "products: admin update" on products for update using (is_admin());
create policy "products: admin delete" on products for delete using (is_admin());

-- ─── PRODUCT RELATED (public read) ───────────────────────────
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

-- ─── COUPONS (users validate, admin full) ─────────────────────
create policy "coupons: public read active" on coupons for select using (is_active = true or is_admin());
create policy "coupons: admin write" on coupons for all using (is_admin());
create policy "coupon_usage: own read" on coupon_usage for select using (profile_id = auth.uid() or is_admin());
create policy "coupon_usage: system insert" on coupon_usage for insert with check (true);

-- ─── ORDERS ───────────────────────────────────────────────────
create policy "orders: own read" on orders for select using (profile_id = auth.uid() or is_admin() or is_pos_operator());
create policy "orders: insert" on orders for insert with check (true);
create policy "orders: admin update" on orders for update using (is_admin() or is_pos_operator());

create policy "order_items: own read" on order_items for select
  using (exists(select 1 from orders o where o.id = order_id and (o.profile_id = auth.uid() or is_admin() or is_pos_operator())));
create policy "order_items: insert" on order_items for insert with check (true);

create policy "order_history: own read" on order_status_history for select
  using (exists(select 1 from orders o where o.id = order_id and (o.profile_id = auth.uid() or is_admin())));
create policy "order_history: admin insert" on order_status_history for insert with check (is_admin() or is_pos_operator());

-- ─── CART ─────────────────────────────────────────────────────
create policy "cart: own crud" on cart_sessions for all using (
  profile_id = auth.uid() or session_token is not null or is_admin()
);
create policy "cart_items: own crud" on cart_items for all using (
  exists(select 1 from cart_sessions c where c.id = cart_id and (c.profile_id = auth.uid() or c.session_token is not null))
  or is_admin()
);

-- ─── SUBSCRIPTIONS ────────────────────────────────────────────
create policy "sub_plans: public read" on subscription_plans for select using (is_active = true or is_admin());
create policy "sub_plans: admin write" on subscription_plans for all using (is_admin());

create policy "subscriptions: own read" on subscriptions for select using (profile_id = auth.uid() or is_admin());
create policy "subscriptions: own insert" on subscriptions for insert with check (profile_id = auth.uid() or is_admin());
create policy "subscriptions: own update" on subscriptions for update using (profile_id = auth.uid() or is_admin());

create policy "sub_items: own read" on subscription_items for select
  using (exists(select 1 from subscriptions s where s.id = subscription_id and (s.profile_id = auth.uid() or is_admin())));
create policy "sub_items: own write" on subscription_items for all
  using (exists(select 1 from subscriptions s where s.id = subscription_id and (s.profile_id = auth.uid() or is_admin())));

-- ─── AFFILIATES ───────────────────────────────────────────────
create policy "affiliates: own read" on affiliates for select using (profile_id = auth.uid() or is_admin());
create policy "affiliates: own update" on affiliates for update using (profile_id = auth.uid() or is_admin());
create policy "affiliates: public update" on affiliates for update using (true);
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
create policy "aff_commissions: public insert" on affiliate_commissions for insert with check (true);

create policy "aff_payouts: own read" on affiliate_payouts for select using (
  exists(select 1 from affiliates a where a.id = affiliate_id and (a.profile_id = auth.uid() or is_admin()))
);
create policy "aff_payouts: admin write" on affiliate_payouts for all using (is_admin());

-- ─── REVIEWS ──────────────────────────────────────────────────
create policy "reviews: public read approved" on reviews for select using (status = 'approved' or profile_id = auth.uid() or is_admin());
create policy "reviews: auth insert" on reviews for insert with check (auth.uid() is not null or true);
create policy "reviews: own update" on reviews for update using (profile_id = auth.uid() or is_admin());
create policy "reviews: admin delete" on reviews for delete using (is_admin());

create policy "review_images: public read" on review_images for select using (true);
create policy "review_images: auth write" on review_images for all using (
  exists(select 1 from reviews r where r.id = review_id and (r.profile_id = auth.uid() or is_admin()))
);

-- ─── WISHLIST ─────────────────────────────────────────────────
create policy "wishlists: own read" on wishlists for select using (profile_id = auth.uid() or is_admin());
create policy "wishlists: public insert" on wishlists for insert with check (true);
create policy "wishlist_items: own crud" on wishlist_items for all using (
  exists(select 1 from wishlists w where w.id = wishlist_id and (w.profile_id = auth.uid() or is_admin()))
);

-- ─── LOYALTY ──────────────────────────────────────────────────
create policy "loyalty_tiers: public read" on loyalty_tiers for select using (true);
create policy "loyalty_tiers: admin write" on loyalty_tiers for all using (is_admin());

create policy "loyalty_accounts: own read" on loyalty_accounts for select using (profile_id = auth.uid() or is_admin());
create policy "loyalty_accounts: public insert" on loyalty_accounts for insert with check (true);
create policy "loyalty_accounts: admin update" on loyalty_accounts for update using (is_admin());
create policy "loyalty_transactions: own read" on loyalty_transactions for select using (
  exists(select 1 from loyalty_accounts la where la.id = account_id and (la.profile_id = auth.uid() or is_admin()))
);
create policy "loyalty_transactions: public insert" on loyalty_transactions for insert with check (true);

-- ─── GIFT CARDS ───────────────────────────────────────────────
create policy "gift_cards: own read" on gift_cards for select using (
  purchased_by = auth.uid() or recipient_email = (select email from profiles where id = auth.uid()) or is_admin()
);
create policy "gift_cards: insert" on gift_cards for insert with check (true);
create policy "gift_cards: admin update" on gift_cards for update using (is_admin());

-- ─── POS ──────────────────────────────────────────────────────
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

-- ─── BLOG ─────────────────────────────────────────────────────
create policy "blog_categories: public read" on blog_categories for select using (true);
create policy "blog_categories: admin write" on blog_categories for all using (is_admin());
create policy "blog_posts: public read published" on blog_posts for select using (status = 'published' or is_admin());
create policy "blog_posts: admin write" on blog_posts for all using (is_admin());

-- ─── SETTINGS / META ──────────────────────────────────────────
create policy "seo: public read" on seo_settings for select using (true);
create policy "seo: admin write" on seo_settings for all using (is_admin());

create policy "site_settings: public read" on site_settings for select using (true);
create policy "site_settings: admin write" on site_settings for all using (is_admin());

create policy "email_templates: admin all" on email_templates for all using (is_admin());

create policy "push_subs: own crud" on push_subscriptions for all using (profile_id = auth.uid() or is_admin());

create policy "inventory: admin read" on inventory_adjustments for select using (is_admin() or is_pos_operator());
create policy "inventory: system write" on inventory_adjustments for insert with check (true);

-- ─── FLAVORS ──────────────────────────────────────────────────
create policy "flavors: public read" on flavors for select using (true);
create policy "flavors: admin write" on flavors for all using (is_admin());
