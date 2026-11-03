export interface User {
  id: string
  name: string
  email: string
  createdAt: string
}

export interface ApiError {
  error: string
  details?: Record<string, string[]>
}
