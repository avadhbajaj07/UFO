-- Migration: 20261113_tool_leads.sql
-- Description: Creates the tool_leads table for capturing leads from free nutrition calculators.
-- Run this in Supabase SQL Editor or via: supabase db push

CREATE TABLE IF NOT EXISTS public.tool_leads (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  email       text NOT NULL,
  tool        text NOT NULL CHECK (tool IN ('protein','tdee','macro','bmi','bodyfat','lbm','orm','water','deficit','creatine')),
  locale      text NOT NULL CHECK (locale IN ('en','fr','de')),
  consent     boolean NOT NULL DEFAULT false,
  result      jsonb,
  source_site text
);

CREATE INDEX IF NOT EXISTS tool_leads_created_idx ON public.tool_leads (created_at DESC);
CREATE INDEX IF NOT EXISTS tool_leads_email_idx ON public.tool_leads (lower(email));

-- Only the server (service role key) can read or write — no public access
ALTER TABLE public.tool_leads ENABLE ROW LEVEL SECURITY;
