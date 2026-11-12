import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const supabase = createAdminClient()
    const { data: custs, error } = await supabase
      .from('profiles')
      .select(`
        *,
        loyalty:loyalty_accounts(points)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[ADMIN CUSTOMERS API] Error fetching customers:', error)
      return NextResponse.json({ success: false, error: error.message, customers: [] }, { status: 500 })
    }

    return NextResponse.json({ success: true, customers: custs || [] })
  } catch (err: any) {
    console.error('[ADMIN CUSTOMERS API] GET error:', err)
    return NextResponse.json({ success: false, error: err.message, customers: [] }, { status: 500 })
  }
}
