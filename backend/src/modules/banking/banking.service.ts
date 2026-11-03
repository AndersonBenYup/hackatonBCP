import { HttpError } from '../../lib/http-error.js'
import { simulatorConnector } from './connectors/simulator-connector.js'
import { bankingRepository } from './banking.repository.js'
import type { BankConnectionSummary, BankConnector } from './banking.types.js'

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

function toSummary(connectionId: string): BankConnectionSummary {
  const connection = bankingRepository.findConnectionById(connectionId)
  if (!connection) {
    throw HttpError.notFound('Conexion bancaria no encontrada')
  }
  const accounts = bankingRepository.listAccountsByConnection(connectionId)
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
  linkAccount(userId: string, provider: string): BankConnectionSummary {
    const connector = getConnector(provider)
    const session = connector.startLinkFlow(userId)

    const connection = bankingRepository.createConnection({ userId, provider: connector.provider })
    const accounts = connector.listAccounts(session.connectionId)

    for (const account of accounts) {
      bankingRepository.createAccount({
        connectionId: connection.id,
        externalAccountId: account.externalAccountId,
        type: account.type,
        alias: account.alias,
        last4: account.last4,
      })
    }

    return toSummary(connection.id)
  },

  listConnections(userId: string): BankConnectionSummary[] {
    return bankingRepository.listConnectionsByUser(userId).map((c) => toSummary(c.id))
  },

  /** Sincroniza movimientos nuevos de todas las cuentas de una conexion del usuario. */
  syncConnection(userId: string, connectionId: string): { synced: number } {
    const connection = bankingRepository.findConnectionById(connectionId)
    if (!connection || connection.user_id !== userId || connection.status !== 'active') {
      throw HttpError.notFound('Conexion bancaria no encontrada')
    }

    const connector = getConnector(connection.provider)
    const accounts = bankingRepository.listAccountsByConnection(connectionId)
    const accountByExternalId = new Map(accounts.map((a) => [a.external_account_id, a]))

    const transactions = connector.syncTransactions(connectionId)
    let synced = 0
    for (const tx of transactions) {
      const account = accountByExternalId.get(tx.externalAccountId)
      if (!account) continue
      bankingRepository.insertRawTransaction({
        accountId: account.id,
        externalId: tx.externalId,
        amount: tx.amount,
        type: tx.type,
        merchantRaw: tx.merchantRaw,
        date: tx.date,
      })
      synced += 1
    }

    return { synced }
  },

  revokeConnection(userId: string, connectionId: string): void {
    const connection = bankingRepository.findConnectionById(connectionId)
    if (!connection || connection.user_id !== userId) {
      throw HttpError.notFound('Conexion bancaria no encontrada')
    }
    const connector = getConnector(connection.provider)
    connector.revoke(connectionId)
    bankingRepository.revokeConnection(connectionId)
  },
}
