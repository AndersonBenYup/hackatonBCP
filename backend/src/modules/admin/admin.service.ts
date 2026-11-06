import { HttpError } from '../../lib/http-error.js'
import { bankingRepository } from '../banking/banking.repository.js'
import { usersRepository } from '../users/users.repository.js'
import { toPublicUser, type PublicUser } from '../users/users.types.js'

export const adminService = {
  async listUsers(): Promise<PublicUser[]> {
    const users = await usersRepository.listAll()
    return users.map(toPublicUser).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  },

  async deleteUser(requesterId: string, targetId: string): Promise<void> {
    if (requesterId === targetId) {
      throw HttpError.badRequest('No puedes eliminar tu propia cuenta de administrador')
    }
    const target = await usersRepository.findById(targetId)
    if (!target) {
      throw HttpError.notFound('Usuario no encontrado')
    }
    // Primero sus datos: si esto falla, el usuario sigue existiendo y se puede reintentar.
    await bankingRepository.deleteAllByUser(targetId)
    await usersRepository.deleteById(targetId)
  },
}
