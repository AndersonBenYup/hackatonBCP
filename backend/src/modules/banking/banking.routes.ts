import { Router } from 'express'
import { asyncHandler } from '../../lib/async-handler.js'
import { bankingController } from './banking.controller.js'

export const bankingRouter = Router()

bankingRouter.get('/connections', asyncHandler(bankingController.listConnections))
bankingRouter.get('/transactions', asyncHandler(bankingController.listTransactions))
bankingRouter.post('/connections', asyncHandler(bankingController.linkAccount))
bankingRouter.post('/connections/:connectionId/sync', asyncHandler(bankingController.syncConnection))
bankingRouter.delete('/connections/:connectionId', asyncHandler(bankingController.revokeConnection))
