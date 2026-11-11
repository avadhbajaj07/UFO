'use client'
import React, { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/auth'

export function Providers({ children }: { children: React.ReactNode }) {
  const { setUser, setProfile, setIsLoading } = useAuthStore()

  useEffect(() => {
    const supabase = createClient()

    // Fetch initial session
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session.user as any)
          setProfile({
            id: session.user.id,
            email: session.user.email!,
            full_name:
              session.user.user_metadata?.full_name ||
              session.user.user_metadata?.name ||
              '',
            avatar_url: session.user.user_metadata?.avatar_url || '',
          })
        } else {
          setUser(null)
          setProfile(null)
        }
        setIsLoading(false)
      })
      .catch(() => {
        setIsLoading(false)
      })

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user as any)
        setProfile({
          id: session.user.id,
          email: session.user.email!,
          full_name:
            session.user.user_metadata?.full_name ||
            session.user.user_metadata?.name ||
            '',
          avatar_url: session.user.user_metadata?.avatar_url || '',
        })
      } else {
        setUser(null)
        setProfile(null)
      }
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [setUser, setProfile, setIsLoading])

  return <>{children}</>
}
