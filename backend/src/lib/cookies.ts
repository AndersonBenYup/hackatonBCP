import type { Response } from 'express'
import { isProduction } from '../config/env.js'

export const SESSION_COOKIE = 'session_token'

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

export function setSessionCookie(res: Response, token: string) {
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: SEVEN_DAYS_MS,
    path: '/',
  })
}

export function clearSessionCookie(res: Response) {
  res.clearCookie(SESSION_COOKIE, { path: '/' })
}
