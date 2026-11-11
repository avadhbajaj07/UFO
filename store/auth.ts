import { create } from 'zustand'

interface User {
  id: string
  email: string
  full_name?: string
  user_metadata?: Record<string, any>
}

interface Profile {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  role?: string
}

interface AuthState {
  user: User | null
  profile: Profile | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setProfile: (profile: Profile | null) => void
  setIsLoading: (isLoading: boolean) => void
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isLoading: true, // starts true until initial session checks complete
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setIsLoading: (isLoading) => set({ isLoading }),
  logout: async () => {
    set({ isLoading: true })
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      await supabase.auth.signOut()
    } catch (e) {
      console.warn('[useAuthStore] signOut error:', e)
    }
    set({ user: null, profile: null, isLoading: false })
  },
}))
