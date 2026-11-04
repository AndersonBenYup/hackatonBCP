export type AccountType = 'yape' | 'ahorros' | 'tarjeta'
export type TransactionDirection = 'income' | 'expense'

/** Mismo set de categorias que usa el frontend (frontend/src/types/index.ts). */
export type Category = 'comida' | 'transporte' | 'entretenimiento' | 'educacion' | 'servicios' | 'salario' | 'otros'

export interface LinkSession {
  connectionId: string
  status: 'linked'
}

export interface ConnectorAccount {
  externalAccountId: string
  type: AccountType
  alias: string
  last4: string
}

export interface ConnectorTransaction {
  externalId: string
  externalAccountId: string
  amount: number
  type: TransactionDirection
  merchantRaw: string
  date: string // ISO yyyy-mm-dd
}

/**
 * Interfaz unica para leer movimientos bancarios, sin importar el origen.
 * El simulador y un futuro PrometeoConnector implementan esto mismo.
 */
export interface BankConnector {
  readonly provider: string
  startLinkFlow(userId: string): LinkSession
  listAccounts(connectionId: string): ConnectorAccount[]
  syncTransactions(connectionId: string, since?: string): ConnectorTransaction[]
  revoke(connectionId: string): void
}

export interface BankConnectionRecord {
  id: string
  user_id: string
  provider: string
  status: 'active' | 'revoked'
  linked_at: string
  revoked_at: string | null
}

export interface BankAccountRecord {
  id: string
  connection_id: string
  external_account_id: string
  type: AccountType
  alias: string
  last4: string
}

export interface RawTransactionRecord {
  id: string
  account_id: string
  external_id: string
  amount: number
  type: TransactionDirection
  category: Category
  merchant_raw: string
  date: string
  synced_at: string
}

export interface BankConnectionSummary {
  id: string
  provider: string
  status: BankConnectionRecord['status']
  linkedAt: string
  accounts: Array<{ id: string; type: AccountType; alias: string; last4: string }>
}

/** Forma que consume el frontend en Movimientos/Inicio/Pronostico (@/types Transaction). */
export interface TransactionDTO {
  id: string
  type: TransactionDirection
  amount: number
  category: Category
  description: string
  date: string
}
