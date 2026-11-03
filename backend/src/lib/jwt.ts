import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

export interface SessionPayload {
  sub: string
}

export const signSession = (payload: SessionPayload) =>
  jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  })

export const verifySession = (token: string): SessionPayload => {
  const decoded = jwt.verify(token, env.JWT_SECRET)
  if (typeof decoded === 'string' || typeof decoded.sub !== 'string') {
    throw new Error('Token invalido')
  }
  return { sub: decoded.sub }
}
