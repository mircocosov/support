import { create } from 'zustand'
import { User } from '@/type/auth'

interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setAuthData: (user: User, token: string) => void
  clearAuthData: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setAuthData: (user, token) => set({ user, token, isAuthenticated: true }),
  clearAuthData: () => set({ user: null, token: null, isAuthenticated: false }),
}))
