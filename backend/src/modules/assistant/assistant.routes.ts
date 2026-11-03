import { Router } from 'express'
import { asyncHandler } from '../../lib/async-handler.js'
import { assistantController } from './assistant.controller.js'

export const assistantRouter = Router()

assistantRouter.post('/chat', asyncHandler(assistantController.chat))
