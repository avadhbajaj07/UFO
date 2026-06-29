import { create } from 'zustand'

interface User {
  id: string
  email: string
  full_name?: string
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
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isLoading: false,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  logout: async () => {
    set({ isLoading: true })
    await new Promise((resolve) => setTimeout(resolve, 500))
    set({ user: null, profile: null, isLoading: false })
  },
}))
