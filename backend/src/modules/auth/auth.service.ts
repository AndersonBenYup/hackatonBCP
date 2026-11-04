import { HttpError } from '../../lib/http-error.js'
import { hashPassword, verifyPassword } from '../../lib/password.js'
import { usersRepository } from '../users/users.repository.js'
import { toPublicUser, type PublicUser } from '../users/users.types.js'
import type { LoginInput, RegisterInput } from './auth.schemas.js'

export const authService = {
  async register(input: RegisterInput): Promise<PublicUser> {
    const existing = await usersRepository.findByEmail(input.email)
    if (existing) {
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

    // Primer login con un correo nuevo: se crea la cuenta al vuelo (onboarding
    // sin friccion, deliberado para la demo del hackathon). A partir de aqui
    // la contrasena de esa cuenta SI se exige en cada login siguiente.
    if (!existing) {
      const emailLocal = input.email.split('@')[0] ?? input.email
      const user = await usersRepository.create({
        name: emailLocal.charAt(0).toUpperCase() + emailLocal.slice(1),
        email: input.email,
        passwordHash: await hashPassword(input.password),
      })
      return toPublicUser(user)
    }

    const validPassword = await verifyPassword(input.password, existing.password_hash)
    if (!validPassword) {
      throw HttpError.unauthorized('Correo o contraseña incorrectos')
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
