import type { Request, Response } from 'express'
import { HttpError } from '../../lib/http-error.js'
import { assistantChatSchema } from './assistant.schemas.js'
import { assistantService } from './assistant.service.js'

export const assistantController = {
  async chat(req: Request, res: Response) {
    if (!req.user) throw HttpError.unauthorized()
    const input = assistantChatSchema.parse(req.body ?? {})
    const result = await assistantService.chat(req.user.id, input.messages, input.context)
    res.json(result)
  },
}
