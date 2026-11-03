import type { Request, Response } from 'express'
import { HttpError } from '../../lib/http-error.js'
import { bankingService } from './banking.service.js'
import { linkAccountSchema } from './banking.schemas.js'

export const bankingController = {
  listConnections(req: Request, res: Response) {
    if (!req.user) throw HttpError.unauthorized()
    res.json({ connections: bankingService.listConnections(req.user.id) })
  },

  linkAccount(req: Request, res: Response) {
    if (!req.user) throw HttpError.unauthorized()
    const input = linkAccountSchema.parse(req.body ?? {})
    const connection = bankingService.linkAccount(req.user.id, input.provider)
    res.status(201).json({ connection })
  },

  syncConnection(req: Request, res: Response) {
    if (!req.user) throw HttpError.unauthorized()
    const result = bankingService.syncConnection(req.user.id, req.params.connectionId)
    res.json(result)
  },

  revokeConnection(req: Request, res: Response) {
    if (!req.user) throw HttpError.unauthorized()
    bankingService.revokeConnection(req.user.id, req.params.connectionId)
    res.status(204).send()
  },
}
