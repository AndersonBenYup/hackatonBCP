export type AccountType = 'yape' | 'ahorros' | 'tarjeta'
export type TransactionDirection = 'income' | 'expense'

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
