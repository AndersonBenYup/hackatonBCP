import { Router } from 'express'
import { asyncHandler } from '../../lib/async-handler.js'
import { adminController } from './admin.controller.js'

export const adminRouter = Router()

adminRouter.get('/users', asyncHandler(adminController.listUsers))
adminRouter.delete('/users/:userId', asyncHandler(adminController.deleteUser))
