import { env } from '../../config/env.js'
import { hashPassword, verifyPassword } from '../../lib/password.js'
import { usersRepository } from './users.repository.js'
import type { UserRole } from './users.types.js'

export const ADMIN_EMAIL = 'admin@finza.app'
export const DEMO_EMAIL = 'demo@finza.app'

/** Estos correos solo existen por siembra: nadie puede registrarlos desde la web. */
export const RESERVED_EMAILS = new Set([ADMIN_EMAIL, DEMO_EMAIL])

interface SeedAccount {
  email: string
  name: string
  role: UserRole
  password: string | undefined
  passwordVar: string
}

/**
 * Crea la cuenta si no existe y, si ya existe, alinea su rol y su clave con la
 * variable de entorno: asi cambiar la clave es cambiar la variable y reiniciar.
 * Sin variable no se toca nada, para no otorgar un rol a quien ya tenga la
 * cuenta con una clave desconocida.
 */
async function ensureAccount({ email, name, role, password, passwordVar }: SeedAccount): Promise<void> {
  if (!password) {
    console.warn(`${passwordVar} no esta definida: no se crea ni se actualiza ${email}.`)
    return
  }

  const existing = await usersRepository.findByEmail(email)
  if (!existing) {
    await usersRepository.create({ name, email, passwordHash: await hashPassword(password), role })
    console.log(`Cuenta creada: ${email}`)
    return
  }

  if (existing.role !== role) {
    await usersRepository.updateRole(existing.id, role)
  }
  if (!(await verifyPassword(password, existing.password_hash))) {
    await usersRepository.updatePasswordHash(existing.id, await hashPassword(password))
    console.log(`Clave actualizada desde ${passwordVar}: ${email}`)
  }
}

export async function ensureSeedAccounts(): Promise<void> {
  await ensureAccount({
    email: ADMIN_EMAIL,
    name: 'Administrador',
    role: 'admin',
    password: env.ADMIN_PASSWORD,
    passwordVar: 'ADMIN_PASSWORD',
  })
  await ensureAccount({
    email: DEMO_EMAIL,
    name: 'Camila Demo',
    role: 'user',
    password: env.DEMO_PASSWORD,
    passwordVar: 'DEMO_PASSWORD',
  })
}
