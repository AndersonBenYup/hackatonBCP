import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(4000),
  CORS_ORIGIN: z.string().min(1).default('http://localhost:5173'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET debe tener al menos 16 caracteres'),
  JWT_EXPIRES_IN: z.string().min(1).default('7d'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  OPENROUTER_API_KEY: z.string().min(1, 'OPENROUTER_API_KEY es requerido'),
  // Credenciales de Firestore: en Render se pega el JSON del service account aqui.
  // En local se deja vacio y se usa GOOGLE_APPLICATION_CREDENTIALS (ver db/firestore.ts).
  FIREBASE_SERVICE_ACCOUNT: z.string().optional(),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('Variables de entorno invalidas:', parsed.error.flatten().fieldErrors)
  throw new Error('Configuracion de entorno invalida. Revisa backend/.env (copia .env.example).')
}

export const env = parsed.data
export const isProduction = env.NODE_ENV === 'production'
