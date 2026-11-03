import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { env } from './config/env.js'
import { errorHandler, notFoundHandler } from './middleware/error-handler.js'
import { authRouter } from './modules/auth/auth.routes.js'

export const app = express()

app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }))
app.use(express.json())
app.use(cookieParser())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/auth', authRouter)

app.use(notFoundHandler)
app.use(errorHandler)
