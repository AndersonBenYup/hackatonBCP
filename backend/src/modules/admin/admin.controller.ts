import type { Request, Response } from 'express'
import { HttpError } from '../../lib/http-error.js'
import { adminService } from './admin.service.js'

export const adminController = {
  async listUsers(req: Request, res: Response) {
    if (!req.user) throw HttpError.unauthorized()
    res.json({ users: await adminService.listUsers() })
  },

  async deleteUser(req: Request, res: Response) {
    if (!req.user) throw HttpError.unauthorized()
    await adminService.deleteUser(req.user.id, req.params.userId as string)
    res.status(204).send()
  },
}
