import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const secret = searchParams.get('secret')

  if (secret !== 'UFOLabzAdmin2026!') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  // Check if table already exists
  const { data: existing, error: checkErr } = await supabase
    .from('tool_leads')
    .select('id')
    .limit(1)

  if (!checkErr) {
    return NextResponse.json({ success: true, message: 'tool_leads table already exists ✅' })
  }

  // Table doesn't exist — create it via multiple individual operations
  // Supabase JS SDK doesn't support raw DDL, so we use the REST API with service key
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!

  const ddlStatements = [
    `CREATE TABLE IF NOT EXISTS public.tool_leads (
      id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      created_at  timestamptz NOT NULL DEFAULT now(),
      email       text NOT NULL,
      tool        text NOT NULL CHECK (tool IN ('protein','tdee','macro')),
      locale      text NOT NULL CHECK (locale IN ('en','fr','de')),
      consent     boolean NOT NULL DEFAULT false,
      result      jsonb,
      source_site text
    )`,
    `CREATE INDEX IF NOT EXISTS tool_leads_created_idx ON public.tool_leads (created_at DESC)`,
    `CREATE INDEX IF NOT EXISTS tool_leads_email_idx ON public.tool_leads (lower(email))`,
    `ALTER TABLE public.tool_leads ENABLE ROW LEVEL SECURITY`,
  ]

  const results: { sql: string; ok: boolean; error?: string }[] = []

  for (const sql of ddlStatements) {
    try {
      const res = await fetch(`${url}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sql }),
      })
      const body = await res.json().catch(() => ({}))
      results.push({ sql: sql.slice(0, 60) + '...', ok: res.ok, error: body?.message })
    } catch (e: any) {
      results.push({ sql: sql.slice(0, 60) + '...', ok: false, error: e?.message })
    }
  }

  // Final check
  const { error: finalErr } = await supabase.from('tool_leads').select('id').limit(1)
  if (!finalErr) {
    return NextResponse.json({ success: true, message: 'tool_leads table created ✅', results })
  }

  return NextResponse.json({
    success: false,
    message: 'Could not verify table creation — please run the SQL manually in Supabase SQL Editor',
    sql: `CREATE TABLE IF NOT EXISTS public.tool_leads (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  email       text NOT NULL,
  tool        text NOT NULL CHECK (tool IN ('protein','tdee','macro')),
  locale      text NOT NULL CHECK (locale IN ('en','fr','de')),
  consent     boolean NOT NULL DEFAULT false,
  result      jsonb,
  source_site text
);
CREATE INDEX IF NOT EXISTS tool_leads_created_idx ON public.tool_leads (created_at DESC);
CREATE INDEX IF NOT EXISTS tool_leads_email_idx ON public.tool_leads (lower(email));
ALTER TABLE public.tool_leads ENABLE ROW LEVEL SECURITY;`,
    results,
  })
}
