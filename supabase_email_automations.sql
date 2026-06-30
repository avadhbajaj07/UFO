-- ─── EMAIL MARKETING & AUTOMATION SCHEMA CHANGES ──────────────────
-- Deploy this in the Supabase SQL editor to support behavioral lifecycle flows.

-- 1. Generic Event Log Table
CREATE TABLE IF NOT EXISTS public.customer_events (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id  uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  guest_email text, -- For guest browsing or guest cart sessions
  event_type  text NOT NULL, -- e.g. 'cart_add', 'cart_abandon', 'page_view', 'points_earned'
  metadata    jsonb DEFAULT '{}'::jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- RLS: Service Role Only
ALTER TABLE public.customer_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "events_service_role_only" ON public.customer_events 
  USING (false) 
  WITH CHECK (false);

-- 2. Automation History Log Table
CREATE TABLE IF NOT EXISTS public.automation_state (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id   uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  guest_email  text,
  flow_name    text NOT NULL, -- e.g. 'abandoned_cart', 'replenishment', 'winback'
  step_number  integer NOT NULL, -- Step index: 1, 2, 3...
  sent_at      timestamptz NOT NULL DEFAULT now(),
  status       text NOT NULL DEFAULT 'sent' -- 'sent', 'skipped', 'converted'
);

-- RLS: Service Role Only
ALTER TABLE public.automation_state ENABLE ROW LEVEL SECURITY;
CREATE POLICY "state_service_role_only" ON public.automation_state 
  USING (false) 
  WITH CHECK (false);

-- 3. Affiliate Telemetry Activity Log Table
CREATE TABLE IF NOT EXISTS public.affiliate_activity (
  affiliate_id              uuid PRIMARY KEY REFERENCES public.affiliates(id) ON DELETE CASCADE,
  last_click_at             timestamptz,
  last_conversion_at        timestamptz,
  total_clicks              integer NOT NULL DEFAULT 0,
  total_conversions         integer NOT NULL DEFAULT 0,
  unpaid_commission_balance numeric(10,2) NOT NULL DEFAULT 0.00
);

-- RLS: Service Role Only
ALTER TABLE public.affiliate_activity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "activity_service_role_only" ON public.affiliate_activity 
  USING (false) 
  WITH CHECK (false);

-- 4. Extend Profiles table with timestamps
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS signup_at timestamptz DEFAULT now();
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS first_purchase_at timestamptz;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_order_at timestamptz;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_active_at timestamptz DEFAULT now();

-- 5. Database Trigger to Auto-Update Profile Purchase Timestamps
CREATE OR REPLACE FUNCTION public.on_order_placed_update_profile()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.profile_id IS NOT NULL THEN
    UPDATE public.profiles
    SET 
      last_order_at = NEW.created_at,
      first_purchase_at = COALESCE(first_purchase_at, NEW.created_at)
    WHERE id = NEW.profile_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER tr_order_placed_update_profile
  AFTER INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.on_order_placed_update_profile();
