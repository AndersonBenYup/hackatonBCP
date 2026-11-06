import type { CookieOptions, Response } from 'express'
import { isProduction } from '../config/env.js'

export const SESSION_COOKIE = 'session_token'

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

/**
 * El navegador solo reemplaza la cookie si los atributos coinciden: limpiarla
 * sin `secure`/`sameSite: 'none'` se ignora cuando el frontend y el backend
 * estan en sitios distintos, y la sesion reaparecia al recargar.
 */
const sessionCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  path: '/',
}

export function setSessionCookie(res: Response, token: string) {
  res.cookie(SESSION_COOKIE, token, { ...sessionCookieOptions, maxAge: SEVEN_DAYS_MS })
}

export function clearSessionCookie(res: Response) {
  res.clearCookie(SESSION_COOKIE, sessionCookieOptions)
}
