import { HttpError } from '../../lib/http-error.js'
import { categorizeMerchant } from './categorize.js'
import { simulatorConnector } from './connectors/simulator-connector.js'
import { bankingRepository } from './banking.repository.js'
import type { BankConnectionSummary, BankConnector, TransactionDTO } from './banking.types.js'

/**
 * Registro de conectores disponibles. Agregar un banco nuevo (ej. Prometeo)
 * es sumar una entrada aqui, sin tocar el resto del modulo.
 */
const connectors: Record<string, BankConnector> = {
  [simulatorConnector.provider]: simulatorConnector,
}

function getConnector(provider: string): BankConnector {
  const connector = connectors[provider]
  if (!connector) {
    throw HttpError.badRequest(`Proveedor bancario desconocido: ${provider}`)
  }
  return connector
}

async function toSummary(connectionId: string): Promise<BankConnectionSummary> {
  const connection = await bankingRepository.findConnectionById(connectionId)
  if (!connection) {
    throw HttpError.notFound('Conexion bancaria no encontrada')
  }
  const accounts = await bankingRepository.listAccountsByConnection(connectionId)
  return {
    id: connection.id,
    provider: connection.provider,
    status: connection.status,
    linkedAt: connection.linked_at,
    accounts: accounts.map((a) => ({ id: a.id, type: a.type, alias: a.alias, last4: a.last4 })),
  }
}

export const bankingService = {
  /** Vincula una cuenta: corre el flujo del conector y persiste conexion + cuentas. */
  async linkAccount(userId: string, provider: string): Promise<BankConnectionSummary> {
    const connector = getConnector(provider)
    const session = connector.startLinkFlow(userId)

    const connection = await bankingRepository.createConnection({ userId, provider: connector.provider })
    const accounts = connector.listAccounts(session.connectionId)

    for (const account of accounts) {
      await bankingRepository.createAccount({
        connectionId: connection.id,
        userId,
        externalAccountId: account.externalAccountId,
        type: account.type,
        alias: account.alias,
        last4: account.last4,
      })
    }

    return toSummary(connection.id)
  },

  async listConnections(userId: string): Promise<BankConnectionSummary[]> {
    const connections = await bankingRepository.listConnectionsByUser(userId)
    return Promise.all(connections.map((c) => toSummary(c.id)))
  },

  /** Sincroniza movimientos nuevos de todas las cuentas de una conexion del usuario. */
  async syncConnection(userId: string, connectionId: string): Promise<{ synced: number }> {
    const connection = await bankingRepository.findConnectionById(connectionId)
    if (!connection || connection.user_id !== userId || connection.status !== 'active') {
      throw HttpError.notFound('Conexion bancaria no encontrada')
    }

    const connector = getConnector(connection.provider)
    const accounts = await bankingRepository.listAccountsByConnection(connectionId)
    const accountByExternalId = new Map(accounts.map((a) => [a.external_account_id, a]))

    const transactions = connector.syncTransactions(connectionId)
    let synced = 0
    for (const tx of transactions) {
      const account = accountByExternalId.get(tx.externalAccountId)
      if (!account) continue
      await bankingRepository.insertRawTransaction({
        accountId: account.id,
        userId,
        externalId: tx.externalId,
        amount: tx.amount,
        type: tx.type,
        category: categorizeMerchant(tx.merchantRaw, tx.type),
        merchantRaw: tx.merchantRaw,
        date: tx.date,
      })
      synced += 1
    }

    return { synced }
  },

  /**
   * Movimientos normalizados al mismo formato que usa el frontend
   * (Movimientos/Inicio/Pronostico), para que vincular+sincronizar una
   * cuenta afecte de verdad lo que el usuario ve, no solo el prompt del
   * asistente. Solo cuentas de conexiones activas: al desvincular, sus
   * movimientos dejan de contar (igual que se espera de una cuenta real).
   */
  async listTransactions(userId: string): Promise<TransactionDTO[]> {
    const [records, activeConnections, accounts] = await Promise.all([
      bankingRepository.listRawTransactionsByUser(userId),
      bankingRepository.listConnectionsByUser(userId),
      bankingRepository.listAccountsByUser(userId),
    ])
    const activeConnectionIds = new Set(activeConnections.map((c) => c.id))
    const activeAccountIds = new Set(
      accounts.filter((a) => activeConnectionIds.has(a.connection_id)).map((a) => a.id),
    )
    return records
      .filter((r) => activeAccountIds.has(r.account_id))
      .map((r) => ({
        id: r.id,
        type: r.type,
        amount: r.amount,
        category: r.category ?? 'otros',
        description: r.merchant_raw,
        date: r.date,
      }))
  },

  async revokeConnection(userId: string, connectionId: string): Promise<void> {
    const connection = await bankingRepository.findConnectionById(connectionId)
    if (!connection || connection.user_id !== userId) {
      throw HttpError.notFound('Conexion bancaria no encontrada')
    }
    const connector = getConnector(connection.provider)
    connector.revoke(connectionId)
    await bankingRepository.revokeConnection(connectionId)
  },
}
