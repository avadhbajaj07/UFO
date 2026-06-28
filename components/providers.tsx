'use client'
import React, { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/auth'

export function Providers({ children }: { children: React.ReactNode }) {
  const { setUser, setProfile } = useAuthStore()
  const supabase = createClient()

  useEffect(() => {
    // Fetch initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user as any)
        setProfile({
          id: session.user.id,
          email: session.user.email!,
          full_name: session.user.user_metadata?.full_name || '',
        })
      } else {
        setUser(null)
        setProfile(null)
      }
    })

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user as any)
        setProfile({
          id: session.user.id,
          email: session.user.email!,
          full_name: session.user.user_metadata?.full_name || '',
        })
      } else {
        setUser(null)
        setProfile(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [setUser, setProfile, supabase])

  return <>{children}</>
}
