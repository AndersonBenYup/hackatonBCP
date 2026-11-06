export type AccountType = 'yape' | 'ahorros' | 'tarjeta'

export type Institution = 'bcp' | 'interbank' | 'bbva' | 'scotiabank'

export interface BankAccount {
  id: string
  type: AccountType
  alias: string
  last4: string
}

export interface BankConnection {
  id: string
  provider: string
  institution: Institution | null
  status: 'active' | 'revoked'
  linkedAt: string
  accounts: BankAccount[]
}
