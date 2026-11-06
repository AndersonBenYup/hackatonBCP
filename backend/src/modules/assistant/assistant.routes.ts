import { Router } from 'express'
import { asyncHandler } from '../../lib/async-handler.js'
import { assistantLimiter } from '../../lib/rate-limit.js'
import { assistantController } from './assistant.controller.js'

export const assistantRouter = Router()

assistantRouter.post('/chat', assistantLimiter, asyncHandler(assistantController.chat))
