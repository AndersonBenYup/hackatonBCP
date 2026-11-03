import { HttpError } from '../../lib/http-error.js'
import { hashPassword, verifyPassword } from '../../lib/password.js'
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
    const user = usersRepository.findByEmail(input.email)
    if (!user) {
      throw HttpError.unauthorized('Correo o contrasena incorrectos')
    }

    const valid = await verifyPassword(input.password, user.password_hash)
    if (!valid) {
      throw HttpError.unauthorized('Correo o contrasena incorrectos')
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
