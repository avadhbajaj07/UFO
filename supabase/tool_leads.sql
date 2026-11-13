-- Run once in the Supabase SQL editor.
create table if not exists public.tool_leads (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  email       text not null,
  tool        text not null check (tool in ('protein','tdee','macro')),
  locale      text not null check (locale in ('en','fr','de')),
  consent     boolean not null default false,
  result      jsonb,
  source_site text
);

create index if not exists tool_leads_created_idx on public.tool_leads (created_at desc);
create index if not exists tool_leads_email_idx on public.tool_leads (lower(email));

-- No public access. Only the server (service role key) can read or write.
alter table public.tool_leads enable row level security;
