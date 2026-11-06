import { HttpError } from '../../lib/http-error.js'
import { hashPassword, verifyPassword } from '../../lib/password.js'
import { RESERVED_EMAILS } from '../users/seed-accounts.js'
import { usersRepository } from '../users/users.repository.js'
import { toPublicUser, type PublicUser } from '../users/users.types.js'
import type { LoginInput, RegisterInput } from './auth.schemas.js'

const INVALID_CREDENTIALS = 'Correo o contraseña incorrectos. Si aún no tienes cuenta, regístrate primero.'

export const authService = {
  async register(input: RegisterInput): Promise<PublicUser> {
    const existing = await usersRepository.findByEmail(input.email)
    if (existing || RESERVED_EMAILS.has(input.email)) {
      throw HttpError.conflict('Ya existe una cuenta con ese correo')
    }

    const passwordHash = await hashPassword(input.password)
    const user = await usersRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
    })

    return toPublicUser(user)
  },

  async login(input: LoginInput): Promise<PublicUser> {
    const existing = await usersRepository.findByEmail(input.email)
    if (!existing) {
      throw HttpError.unauthorized(INVALID_CREDENTIALS)
    }

    const validPassword = await verifyPassword(input.password, existing.password_hash)
    if (!validPassword) {
      throw HttpError.unauthorized(INVALID_CREDENTIALS)
    }

    return toPublicUser(existing)
  },

  async me(userId: string): Promise<PublicUser> {
    const user = await usersRepository.findById(userId)
    if (!user) {
      throw HttpError.unauthorized()
    }
    return toPublicUser(user)
  },
}
