import type { ApiError } from '@/types/auth'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

export class ApiRequestError extends Error {
  readonly status: number
  readonly details?: Record<string, string[]>

  constructor(status: number, body: ApiError) {
    super(body.error)
    this.status = status
    this.details = body.details
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })

  if (response.status === 204) {
    return undefined as T
  }

  const body = (await response.json().catch(() => ({ error: 'Respuesta invalida del servidor' }))) as T & ApiError

  if (!response.ok) {
    throw new ApiRequestError(response.status, body)
  }

  return body
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: 'POST', body: data === undefined ? undefined : JSON.stringify(data) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}
