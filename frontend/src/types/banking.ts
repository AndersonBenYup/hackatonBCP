export type AccountType = 'yape' | 'ahorros' | 'tarjeta'

export interface BankAccount {
  id: string
  type: AccountType
  alias: string
  last4: string
}

export interface BankConnection {
  id: string
  provider: string
  status: 'active' | 'revoked'
  linkedAt: string
  accounts: BankAccount[]
}
