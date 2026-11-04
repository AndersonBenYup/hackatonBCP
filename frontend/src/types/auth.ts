export interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
  createdAt: string
}

export interface ApiError {
  error: string
  details?: Record<string, string[]>
}
