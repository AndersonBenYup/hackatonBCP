import type { DatabaseSync } from 'node:sqlite'

/**
 * Migraciones idempotentes: se ejecutan en cada arranque y solo crean
 * lo que falte. Para un hackathon esto evita depender de una herramienta
 * de migraciones externa sin perder trazabilidad del esquema.
 */
export function runMigrations(db: DatabaseSync) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    );
  `)

  db.exec(`CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);`)
}
