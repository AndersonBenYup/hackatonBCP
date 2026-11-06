import 'dotenv/config'
import { z } from 'zod'

/** Una variable vacia en .env (`FOO=`) cuenta como no definida. */
const optionalString = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((value) => (value === '' ? undefined : value), schema.optional())

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(4000),
  CORS_ORIGIN: z.string().min(1).default('http://localhost:5173'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET debe tener al menos 16 caracteres'),
  JWT_EXPIRES_IN: z.string().min(1).default('7d'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  // Sin esta clave la API arranca igual; solo el asistente responde 503.
  OPENROUTER_API_KEY: optionalString(z.string()),
  // Credenciales de Firestore: en Render se pega el JSON del service account aqui.
  // En local se deja vacio y se usa GOOGLE_APPLICATION_CREDENTIALS (ver db/firestore.ts).
  FIREBASE_SERVICE_ACCOUNT: z.string().optional(),
  // Claves de las cuentas sembradas al arrancar (ver modules/users/seed-accounts.ts).
  ADMIN_PASSWORD: optionalString(z.string().min(8, 'ADMIN_PASSWORD debe tener al menos 8 caracteres')),
  // Clave publica a proposito: la cuenta demo solo muestra datos ficticios y no es admin.
  DEMO_PASSWORD: z.preprocess((value) => (value === '' ? undefined : value), z.string().default('demo123')),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('Variables de entorno invalidas:', parsed.error.flatten().fieldErrors)
  throw new Error('Configuracion de entorno invalida. Revisa backend/.env (copia .env.example).')
}

export const env = parsed.data
export const isProduction = env.NODE_ENV === 'production'
