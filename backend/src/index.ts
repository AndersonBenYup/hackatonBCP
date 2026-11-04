import { app } from './app.js'
import { env } from './config/env.js'
import { ensureAdminSeed } from './modules/users/seed-admin.js'

await ensureAdminSeed()

app.listen(env.PORT, () => {
  console.log(`API escuchando en http://localhost:${env.PORT}`)
})
