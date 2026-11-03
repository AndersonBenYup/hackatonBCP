import { HttpError } from '../../lib/http-error.js'
import { hashPassword } from '../../lib/password.js'
import { usersRepository } from '../users/users.repository.js'
import { toPublicUser, type PublicUser } from '../users/users.types.js'
import type { LoginInput, RegisterInput } from './auth.schemas.js'

export const authService = {
  async register(input: RegisterInput): Promise<PublicUser> {
    const existing = usersRepository.findByEmail(input.email)
    if (existing) {
      throw HttpError.conflict('Ya existe una cuenta con ese correo')
    }

    const passwordHash = await hashPassword(input.password)
    const user = usersRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
    })

    return toPublicUser(user)
  },

  async login(input: LoginInput): Promise<PublicUser> {
    let user = usersRepository.findByEmail(input.email)

    // ⚠️ TEMPORAL (hackathon): acepta cualquier contrasena y auto-registra
    // emails nuevos al vuelo. TODO(hackathon): revertir antes de produccion.
    if (!user) {
      const emailLocal = input.email.split('@')[0] ?? input.email
      user = usersRepository.create({
        name: emailLocal.charAt(0).toUpperCase() + emailLocal.slice(1),
        email: input.email,
        passwordHash: await hashPassword(input.password),
      })
    }

    return toPublicUser(user)
  },

  me(userId: string): PublicUser {
    const user = usersRepository.findById(userId)
    if (!user) {
      throw HttpError.unauthorized()
    }
    return toPublicUser(user)
  },
}
