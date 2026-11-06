import type { Request, Response } from 'express'
import { HttpError } from '../../lib/http-error.js'
import { bankingService } from './banking.service.js'
import { linkAccountSchema } from './banking.schemas.js'

export const bankingController = {
  async listConnections(req: Request, res: Response) {
    if (!req.user) throw HttpError.unauthorized()
    res.json({ connections: await bankingService.listConnections(req.user.id) })
  },

  async linkAccount(req: Request, res: Response) {
    if (!req.user) throw HttpError.unauthorized()
    const input = linkAccountSchema.parse(req.body ?? {})
    const connection = await bankingService.linkAccount(req.user.id, input.provider, input.institution ?? null)
    res.status(201).json({ connection })
  },

  async syncConnection(req: Request, res: Response) {
    if (!req.user) throw HttpError.unauthorized()
    const result = await bankingService.syncConnection(req.user.id, req.params.connectionId)
    res.json(result)
  },

  async listTransactions(req: Request, res: Response) {
    if (!req.user) throw HttpError.unauthorized()
    res.json({ transactions: await bankingService.listTransactions(req.user.id) })
  },

  async revokeConnection(req: Request, res: Response) {
    if (!req.user) throw HttpError.unauthorized()
    await bankingService.revokeConnection(req.user.id, req.params.connectionId)
    res.status(204).send()
  },
}
