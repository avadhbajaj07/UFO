-- ==============================================================================
-- UFO LABZ Email Marketing & Calculator Leads Migration
-- Idempotent schema for Mailchimp-style newsletter engine & lead capture
-- ==============================================================================

-- 1. Subscribers table
CREATE TABLE IF NOT EXISTS public.subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    locale TEXT NOT NULL DEFAULT 'fr',
    currency TEXT NOT NULL DEFAULT 'CHF',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'subscribed', 'unsubscribed', 'bounced', 'complained', 'transactional_only')),
    source TEXT NOT NULL DEFAULT 'calculator',
    consent_at TIMESTAMPTZ,
    consent_ip TEXT,
    confirmed_at TIMESTAMPTZ,
    unsubscribed_at TIMESTAMPTZ,
    double_optin_token TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_subscribers_email ON public.subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_status ON public.subscribers(status);
CREATE INDEX IF NOT EXISTS idx_subscribers_locale ON public.subscribers(locale);

-- 2. Tags & Subscriber Tags
CREATE TABLE IF NOT EXISTS public.tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    color TEXT DEFAULT '#1FFFB3',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.subscriber_tags (
    subscriber_id UUID REFERENCES public.subscribers(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (subscriber_id, tag_id)
);

-- 3. Calculator Leads table
CREATE TABLE IF NOT EXISTS public.calculator_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscriber_id UUID REFERENCES public.subscribers(id) ON DELETE SET NULL,
    calculator_slug TEXT NOT NULL,
    locale TEXT NOT NULL DEFAULT 'fr',
    inputs JSONB NOT NULL DEFAULT '{}'::jsonb,
    results JSONB NOT NULL DEFAULT '{}'::jsonb,
    utm JSONB NOT NULL DEFAULT '{}'::jsonb,
    referrer TEXT,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_calculator_leads_slug ON public.calculator_leads(calculator_slug);
CREATE INDEX IF NOT EXISTS idx_calculator_leads_subscriber ON public.calculator_leads(subscriber_id);

-- 4. Dynamic Segments
CREATE TABLE IF NOT EXISTS public.segments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    filter_rules JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Email Templates
CREATE TABLE IF NOT EXISTS public.email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    preheader TEXT,
    blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
    html_cache TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Campaigns & Recipients
CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    preheader TEXT,
    template_id UUID REFERENCES public.email_templates(id) ON DELETE SET NULL,
    segment_id UUID REFERENCES public.segments(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'failed')),
    scheduled_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    stats JSONB NOT NULL DEFAULT '{"sent": 0, "delivered": 0, "opened": 0, "clicked": 0, "bounced": 0, "unsubscribed": 0}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.campaign_recipients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
    subscriber_id UUID REFERENCES public.subscribers(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'delivered', 'bounced')),
    resend_id TEXT,
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_campaign_recipients_camp ON public.campaign_recipients(campaign_id);

-- 7. Automations & Steps
CREATE TABLE IF NOT EXISTS public.automations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    trigger_type TEXT NOT NULL DEFAULT 'calculator_used',
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.automation_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    automation_id UUID REFERENCES public.automations(id) ON DELETE CASCADE,
    step_order INT NOT NULL DEFAULT 1,
    delay_hours INT NOT NULL DEFAULT 0,
    template_id UUID REFERENCES public.email_templates(id) ON DELETE SET NULL,
    condition JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.automation_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    automation_id UUID REFERENCES public.automations(id) ON DELETE CASCADE,
    subscriber_id UUID REFERENCES public.subscribers(id) ON DELETE CASCADE,
    current_step_order INT NOT NULL DEFAULT 1,
    next_run_at TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. Email Webhook Events & Suppressions
CREATE TABLE IF NOT EXISTS public.email_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resend_id TEXT,
    subscriber_id UUID REFERENCES public.subscribers(id) ON DELETE SET NULL,
    type TEXT NOT NULL CHECK (type IN ('delivered', 'opened', 'clicked', 'bounced', 'complained', 'unsubscribed')),
    url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.suppressions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    reason TEXT NOT NULL CHECK (reason IN ('bounce', 'complaint', 'manual', 'unsubscribe')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_suppressions_email ON public.suppressions(email);

-- Enable RLS
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calculator_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriber_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppressions ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS for backend API operations
CREATE POLICY "Service role full access on subscribers" ON public.subscribers FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access on calculator_leads" ON public.calculator_leads FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access on tags" ON public.tags FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access on subscriber_tags" ON public.subscriber_tags FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access on segments" ON public.segments FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access on email_templates" ON public.email_templates FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access on campaigns" ON public.campaigns FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access on campaign_recipients" ON public.campaign_recipients FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access on automations" ON public.automations FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access on automation_steps" ON public.automation_steps FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access on automation_runs" ON public.automation_runs FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access on email_events" ON public.email_events FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access on suppressions" ON public.suppressions FOR ALL TO service_role USING (true);
