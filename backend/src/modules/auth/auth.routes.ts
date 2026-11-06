import { Router } from 'express'
import { asyncHandler } from '../../lib/async-handler.js'
import { loginLimiter, registerLimiter } from '../../lib/rate-limit.js'
import { requireAuth } from '../../middleware/require-auth.js'
import { authController } from './auth.controller.js'

export const authRouter = Router()

authRouter.post('/register', registerLimiter, asyncHandler(authController.register))
authRouter.post('/login', loginLimiter, asyncHandler(authController.login))
authRouter.post('/logout', authController.logout)
authRouter.get('/me', requireAuth, authController.me)
