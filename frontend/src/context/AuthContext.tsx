import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { AuthContext } from '@/context/auth-context'
import { authApi } from '@/lib/auth-api'
import type { User } from '@/types/auth'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'guest'>('loading')

  useEffect(() => {
    authApi
      .me()
      .then((me) => {
        setUser(me)
        setStatus('authenticated')
      })
      .catch(() => {
        setUser(null)
        setStatus('guest')
      })
  }, [])

  const login = useCallback(async (input: { email: string; password: string }) => {
    const me = await authApi.login(input)
    setUser(me)
    setStatus('authenticated')
  }, [])

  const register = useCallback(async (input: { name: string; email: string; password: string }) => {
    const me = await authApi.register(input)
    setUser(me)
    setStatus('authenticated')
  }, [])

  const logout = useCallback(async () => {
    await authApi.logout()
    setUser(null)
    setStatus('guest')
  }, [])

  return (
    <AuthContext.Provider value={{ user, status, login, register, logout }}>{children}</AuthContext.Provider>
  )
}
