import { api } from '@/lib/api'
import type { BankConnection } from '@/types/banking'

interface ConnectionsResponse {
  connections: BankConnection[]
}

interface ConnectionResponse {
  connection: BankConnection
}

interface SyncResponse {
  synced: number
}

export const bankingApi = {
  list: () => api.get<ConnectionsResponse>('/api/banking/connections').then((r) => r.connections),
  link: (provider = 'simulator') =>
    api.post<ConnectionResponse>('/api/banking/connections', { provider }).then((r) => r.connection),
  sync: (connectionId: string) => api.post<SyncResponse>(`/api/banking/connections/${connectionId}/sync`),
  revoke: (connectionId: string) => api.delete<void>(`/api/banking/connections/${connectionId}`),
}
