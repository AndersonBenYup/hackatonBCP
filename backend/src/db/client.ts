import { mkdirSync } from 'node:fs'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { env } from '../config/env.js'
import { runMigrations } from './migrate.js'

const dbPath = path.resolve(process.cwd(), env.DATABASE_PATH)

mkdirSync(path.dirname(dbPath), { recursive: true })

export const db = new DatabaseSync(dbPath)

db.exec('PRAGMA journal_mode = WAL;')

// Se ejecuta aqui, no en index.ts: los repositorios preparan sus statements
// al importar este modulo, antes de que corra cualquier codigo de arranque.
runMigrations(db)
