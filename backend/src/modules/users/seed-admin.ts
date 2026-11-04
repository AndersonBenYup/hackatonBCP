import { hashPassword } from '../../lib/password.js'
import { usersRepository } from './users.repository.js'

const ADMIN_EMAIL = 'admin@finza.app'
const ADMIN_PASSWORD = 'admin123'
const ADMIN_NAME = 'Administrador'

/**
 * Garantiza que exista una cuenta admin al arrancar el backend (local y en
 * Render): se crea una sola vez y las siguientes veces no hace nada, salvo
 * reparar el rol si esa cuenta ya existía como usuario normal.
 */
export async function ensureAdminSeed(): Promise<void> {
  const existing = await usersRepository.findByEmail(ADMIN_EMAIL)

  if (existing) {
    if (existing.role !== 'admin') {
      await usersRepository.updateRole(existing.id, 'admin')
      console.log(`Rol admin asignado a cuenta existente: ${ADMIN_EMAIL}`)
    }
    return
  }

  const passwordHash = await hashPassword(ADMIN_PASSWORD)
  await usersRepository.create({ name: ADMIN_NAME, email: ADMIN_EMAIL, passwordHash, role: 'admin' })
  console.log(`Cuenta admin creada: ${ADMIN_EMAIL}`)
}
