import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

export const createClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co'
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-key'
  
  return createBrowserClient<Database>(url, key)
}
