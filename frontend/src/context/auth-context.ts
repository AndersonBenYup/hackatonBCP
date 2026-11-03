import { createContext } from 'react'
import type { User } from '@/types/auth'

export interface AuthContextValue {
  user: User | null
  status: 'loading' | 'authenticated' | 'guest'
  login: (input: { email: string; password: string }) => Promise<void>
  register: (input: { name: string; email: string; password: string }) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
