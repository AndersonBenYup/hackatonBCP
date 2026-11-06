import { api } from '@/lib/api'
import type { Transaction } from '@/types'
import type { BankConnection, Institution } from '@/types/banking'

interface ConnectionsResponse {
  connections: BankConnection[]
}

interface ConnectionResponse {
  connection: BankConnection
}

interface SyncResponse {
  synced: number
}

interface TransactionsResponse {
  transactions: Transaction[]
}

export const bankingApi = {
  list: () => api.get<ConnectionsResponse>('/api/banking/connections').then((r) => r.connections),
  link: (institution: Institution, provider = 'simulator') =>
    api.post<ConnectionResponse>('/api/banking/connections', { provider, institution }).then((r) => r.connection),
  sync: (connectionId: string) => api.post<SyncResponse>(`/api/banking/connections/${connectionId}/sync`),
  revoke: (connectionId: string) => api.delete<void>(`/api/banking/connections/${connectionId}`),
  transactions: () => api.get<TransactionsResponse>('/api/banking/transactions').then((r) => r.transactions),
}
