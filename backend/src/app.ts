import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { env } from './config/env.js'
import { errorHandler, notFoundHandler } from './middleware/error-handler.js'
import { requireAdmin } from './middleware/require-admin.js'
import { requireAuth } from './middleware/require-auth.js'
import { adminRouter } from './modules/admin/admin.routes.js'
import { assistantRouter } from './modules/assistant/assistant.routes.js'
import { authRouter } from './modules/auth/auth.routes.js'
import { bankingRouter } from './modules/banking/banking.routes.js'

export const app = express()

// Render pone un proxy delante: sin esto, los limites por IP verian a todos como uno solo.
app.set('trust proxy', 1)

app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }))
app.use(express.json())
app.use(cookieParser())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/auth', authRouter)
app.use('/api/banking', requireAuth, bankingRouter)
app.use('/api/assistant', requireAuth, assistantRouter)
app.use('/api/admin', requireAuth, requireAdmin, adminRouter)

app.use(notFoundHandler)
app.use(errorHandler)
