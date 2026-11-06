import { rateLimit } from 'express-rate-limit'

const limiter = (windowMinutes: number, limit: number, message: string, skipSuccessfulRequests = false) =>
  rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    limit,
    skipSuccessfulRequests,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: message },
  })

/** Solo cuenta intentos fallidos: un login correcto no consume el cupo. */
export const loginLimiter = limiter(15, 20, 'Demasiados intentos fallidos. Espera unos minutos e intenta de nuevo.', true)

export const registerLimiter = limiter(60, 20, 'Demasiados registros desde esta conexion. Intenta mas tarde.')

export const assistantLimiter = limiter(1, 20, 'Estas enviando muchos mensajes. Espera un momento e intenta de nuevo.')
