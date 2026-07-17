import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function AffiliateLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login?redirect=/affiliate')

  return children
}
