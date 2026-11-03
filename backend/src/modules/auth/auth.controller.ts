import type { Request, Response } from 'express'
import { clearSessionCookie, setSessionCookie } from '../../lib/cookies.js'
import { signSession } from '../../lib/jwt.js'
import { HttpError } from '../../lib/http-error.js'
import { authService } from './auth.service.js'
import { loginSchema, registerSchema } from './auth.schemas.js'

export const authController = {
  async register(req: Request, res: Response) {
    const input = registerSchema.parse(req.body)
    const user = await authService.register(input)
    setSessionCookie(res, signSession({ sub: user.id }))
    res.status(201).json({ user })
  },

  async login(req: Request, res: Response) {
    const input = loginSchema.parse(req.body)
    const user = await authService.login(input)
    setSessionCookie(res, signSession({ sub: user.id }))
    res.json({ user })
  },

  logout(_req: Request, res: Response) {
    clearSessionCookie(res)
    res.status(204).send()
  },

  me(req: Request, res: Response) {
    if (!req.user) {
      throw HttpError.unauthorized()
    }
    res.json({ user: req.user })
  },
}
