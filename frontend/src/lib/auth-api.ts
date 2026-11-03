import { api } from '@/lib/api'
import type { User } from '@/types/auth'

interface UserResponse {
  user: User
}

export const authApi = {
  register: (input: { name: string; email: string; password: string }) =>
    api.post<UserResponse>('/api/auth/register', input).then((r) => r.user),
  login: (input: { email: string; password: string }) =>
    api.post<UserResponse>('/api/auth/login', input).then((r) => r.user),
  logout: () => api.post<void>('/api/auth/logout'),
  me: () => api.get<UserResponse>('/api/auth/me').then((r) => r.user),
}
