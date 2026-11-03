import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(4000),
  CORS_ORIGIN: z.string().min(1).default('http://localhost:5173'),
  DATABASE_PATH: z.string().min(1).default('./data/app.sqlite'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET debe tener al menos 16 caracteres'),
  JWT_EXPIRES_IN: z.string().min(1).default('7d'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('Variables de entorno invalidas:', parsed.error.flatten().fieldErrors)
  throw new Error('Configuracion de entorno invalida. Revisa backend/.env (copia .env.example).')
}

export const env = parsed.data
export const isProduction = env.NODE_ENV === 'production'
