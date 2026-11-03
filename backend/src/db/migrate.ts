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

  db.exec(`
    CREATE TABLE IF NOT EXISTS bank_connections (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users (id),
      provider TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      linked_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
      revoked_at TEXT
    );
  `)
  db.exec(`CREATE INDEX IF NOT EXISTS idx_bank_connections_user ON bank_connections (user_id);`)

  db.exec(`
    CREATE TABLE IF NOT EXISTS bank_accounts (
      id TEXT PRIMARY KEY,
      connection_id TEXT NOT NULL REFERENCES bank_connections (id),
      external_account_id TEXT NOT NULL,
      type TEXT NOT NULL,
      alias TEXT NOT NULL,
      last4 TEXT NOT NULL
    );
  `)
  db.exec(`CREATE INDEX IF NOT EXISTS idx_bank_accounts_connection ON bank_accounts (connection_id);`)

  db.exec(`
    CREATE TABLE IF NOT EXISTS raw_transactions (
      id TEXT PRIMARY KEY,
      account_id TEXT NOT NULL REFERENCES bank_accounts (id),
      external_id TEXT NOT NULL UNIQUE,
      amount REAL NOT NULL,
      type TEXT NOT NULL,
      merchant_raw TEXT NOT NULL,
      date TEXT NOT NULL,
      synced_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    );
  `)
  db.exec(`CREATE INDEX IF NOT EXISTS idx_raw_transactions_account ON raw_transactions (account_id);`)
}
