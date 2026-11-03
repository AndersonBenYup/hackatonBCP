import { ApiRequestError } from '@/lib/api'

export function getErrorMessage(err: unknown): string {
  if (err instanceof ApiRequestError) {
    return err.message
  }
  return 'Ocurrio un error inesperado. Intenta de nuevo.'
}
