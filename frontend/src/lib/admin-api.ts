import { api } from '@/lib/api'
import type { User } from '@/types/auth'

export const adminApi = {
  listUsers: () => api.get<{ users: User[] }>('/api/admin/users').then((r) => r.users),
  deleteUser: (userId: string) => api.delete<void>(`/api/admin/users/${userId}`),
}
