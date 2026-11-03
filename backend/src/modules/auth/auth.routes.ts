import { Router } from 'express'
import { asyncHandler } from '../../lib/async-handler.js'
import { requireAuth } from '../../middleware/require-auth.js'
import { authController } from './auth.controller.js'

export const authRouter = Router()

authRouter.post('/register', asyncHandler(authController.register))
authRouter.post('/login', asyncHandler(authController.login))
authRouter.post('/logout', authController.logout)
authRouter.get('/me', requireAuth, authController.me)
