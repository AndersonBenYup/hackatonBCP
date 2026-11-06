import { app } from './app.js'
import { env } from './config/env.js'
import { ensureSeedAccounts } from './modules/users/seed-accounts.js'

await ensureSeedAccounts()

app.listen(env.PORT, () => {
  console.log(`API escuchando en http://localhost:${env.PORT}`)
})
