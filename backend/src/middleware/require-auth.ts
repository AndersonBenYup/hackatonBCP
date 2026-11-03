import type { NextFunction, Request, Response } from 'express'
import { SESSION_COOKIE } from '../lib/cookies.js'
import { HttpError } from '../lib/http-error.js'
import { verifySession } from '../lib/jwt.js'
import { authService } from '../modules/auth/auth.service.js'

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.[SESSION_COOKIE]
    if (!token) {
      throw HttpError.unauthorized()
    }

    const payload = verifySession(token)
    req.user = authService.me(payload.sub)
    next()
  } catch {
    next(HttpError.unauthorized('Sesion invalida o expirada'))
  }
}
