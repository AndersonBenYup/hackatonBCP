import type { NextFunction, Request, Response } from 'express'
import { HttpError } from '../lib/http-error.js'

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  if (req.user?.role !== 'admin') {
    next(HttpError.forbidden())
    return
  }
  next()
}
