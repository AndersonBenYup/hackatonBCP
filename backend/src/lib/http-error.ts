export class HttpError extends Error {
  readonly status: number
  readonly details?: unknown

  constructor(status: number, message: string, details?: unknown) {
    super(message)
    this.status = status
    this.details = details
  }

  static badRequest(message: string, details?: unknown) {
    return new HttpError(400, message, details)
  }

  static unauthorized(message = 'No autorizado') {
    return new HttpError(401, message)
  }

  static forbidden(message = 'Acceso restringido a administradores') {
    return new HttpError(403, message)
  }

  static conflict(message: string) {
    return new HttpError(409, message)
  }

  static notFound(message = 'No encontrado') {
    return new HttpError(404, message)
  }
}
