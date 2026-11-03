import { randomUUID } from 'node:crypto'
import { db } from '../../db/client.js'
import type { BankAccountRecord, BankConnectionRecord, RawTransactionRecord } from './banking.types.js'

const insertConnectionStmt = db.prepare(`
  INSERT INTO bank_connections (id, user_id, provider)
  VALUES (@id, @userId, @provider)
`)

const findConnectionByIdStmt = db.prepare(`
  SELECT * FROM bank_connections WHERE id = @id
`)

const listConnectionsByUserStmt = db.prepare(`
  SELECT * FROM bank_connections WHERE user_id = @userId AND status = 'active' ORDER BY linked_at DESC
`)

const revokeConnectionStmt = db.prepare(`
  UPDATE bank_connections SET status = 'revoked', revoked_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = @id
`)

const insertAccountStmt = db.prepare(`
  INSERT INTO bank_accounts (id, connection_id, external_account_id, type, alias, last4)
  VALUES (@id, @connectionId, @externalAccountId, @type, @alias, @last4)
`)

const listAccountsByConnectionStmt = db.prepare(`
  SELECT * FROM bank_accounts WHERE connection_id = @connectionId
`)

const listAccountsByUserStmt = db.prepare(`
  SELECT bank_accounts.*
  FROM bank_accounts
  JOIN bank_connections ON bank_connections.id = bank_accounts.connection_id
  WHERE bank_connections.user_id = @userId AND bank_connections.status = 'active'
`)

const insertRawTransactionStmt = db.prepare(`
  INSERT OR IGNORE INTO raw_transactions (id, account_id, external_id, amount, type, merchant_raw, date)
  VALUES (@id, @accountId, @externalId, @amount, @type, @merchantRaw, @date)
`)

const listRawTransactionsByUserStmt = db.prepare(`
  SELECT raw_transactions.*
  FROM raw_transactions
  JOIN bank_accounts ON bank_accounts.id = raw_transactions.account_id
  JOIN bank_connections ON bank_connections.id = bank_accounts.connection_id
  WHERE bank_connections.user_id = @userId
  ORDER BY raw_transactions.date DESC
`)

export const bankingRepository = {
  createConnection(input: { userId: string; provider: string }): BankConnectionRecord {
    const id = randomUUID()
    insertConnectionStmt.run({ id, userId: input.userId, provider: input.provider })
    return findConnectionByIdStmt.get({ id }) as unknown as BankConnectionRecord
  },

  findConnectionById(id: string): BankConnectionRecord | undefined {
    return findConnectionByIdStmt.get({ id }) as unknown as BankConnectionRecord | undefined
  },

  listConnectionsByUser(userId: string): BankConnectionRecord[] {
    return listConnectionsByUserStmt.all({ userId }) as unknown as BankConnectionRecord[]
  },

  revokeConnection(id: string): void {
    revokeConnectionStmt.run({ id })
  },

  createAccount(input: {
    connectionId: string
    externalAccountId: string
    type: string
    alias: string
    last4: string
  }): BankAccountRecord {
    const id = randomUUID()
    insertAccountStmt.run({ id, ...input })
    return { id, connection_id: input.connectionId, external_account_id: input.externalAccountId, type: input.type as BankAccountRecord['type'], alias: input.alias, last4: input.last4 }
  },

  listAccountsByConnection(connectionId: string): BankAccountRecord[] {
    return listAccountsByConnectionStmt.all({ connectionId }) as unknown as BankAccountRecord[]
  },

  listAccountsByUser(userId: string): BankAccountRecord[] {
    return listAccountsByUserStmt.all({ userId }) as unknown as BankAccountRecord[]
  },

  /** INSERT OR IGNORE sobre external_id: repetir un sync nunca duplica un movimiento. */
  insertRawTransaction(input: {
    accountId: string
    externalId: string
    amount: number
    type: string
    merchantRaw: string
    date: string
  }): void {
    const id = randomUUID()
    insertRawTransactionStmt.run({ id, ...input })
  },

  listRawTransactionsByUser(userId: string): RawTransactionRecord[] {
    return listRawTransactionsByUserStmt.all({ userId }) as unknown as RawTransactionRecord[]
  },
}
