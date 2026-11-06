import { randomUUID } from 'node:crypto'
import { limaIsoDate } from '../../../lib/dates.js'
import type { BankConnector, ConnectorAccount, ConnectorTransaction, Institution, LinkSession } from '../banking.types.js'

const SIMULATED_ACCOUNTS: ConnectorAccount[] = [
  { externalAccountId: 'yape', type: 'yape', alias: 'Yape', last4: '4821' },
  { externalAccountId: 'ahorros', type: 'ahorros', alias: 'Cuenta de ahorros', last4: '0157' },
  { externalAccountId: 'tarjeta', type: 'tarjeta', alias: 'Tarjeta de credito', last4: '9034' },
]

const EXPENSE_MERCHANTS = ['Plaza Vea', 'Rappi', 'Cineplanet', 'Claro', 'Metro', 'Uber', 'Spotify', 'Netflix', 'Inka Farma']
const INCOME_MERCHANTS = ['Transferencia de haberes', 'Abono Yape', 'Deposito en cuenta']

const DAYS_OF_HISTORY = 30
const TRANSACTIONS_PER_ACCOUNT = 10

/** PRNG determinista (mulberry32): mismo connectionId siempre genera el mismo historial. */
function createSeededRandom(seed: string) {
  let h = 1779033703 ^ seed.length
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  let state = h >>> 0
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pick<T>(items: T[], random: () => number): T {
  return items[Math.floor(random() * items.length)]
}

function isoDateDaysAgo(days: number): string {
  const d = new Date(`${limaIsoDate()}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() - days)
  return d.toISOString().slice(0, 10)
}

function generateAccountTransactions(connectionId: string, account: ConnectorAccount): ConnectorTransaction[] {
  const random = createSeededRandom(`${connectionId}:${account.externalAccountId}`)
  const transactions: ConnectorTransaction[] = []

  for (let i = 0; i < TRANSACTIONS_PER_ACCOUNT; i++) {
    const daysAgo = Math.floor(random() * DAYS_OF_HISTORY)
    const isIncome = account.type !== 'tarjeta' && random() < 0.2
    const type = isIncome ? 'income' : 'expense'
    const merchantRaw = isIncome ? pick(INCOME_MERCHANTS, random) : pick(EXPENSE_MERCHANTS, random)
    const amount = isIncome ? Math.round((300 + random() * 1200) * 100) / 100 : Math.round((8 + random() * 180) * 100) / 100

    transactions.push({
      externalId: `sim-${connectionId}-${account.externalAccountId}-${i}`,
      externalAccountId: account.externalAccountId,
      amount,
      type,
      merchantRaw,
      date: isoDateDaysAgo(daysAgo),
    })
  }

  return transactions.sort((a, b) => a.date.localeCompare(b.date))
}

/**
 * Conector de demo: genera movimientos sinteticos pero realistas para Yape,
 * cuenta de ahorros y tarjeta, sin depender de ningun proveedor externo.
 * Mismo connectionId -> mismo historial (determinista), para que repetir un
 * sync nunca invente movimientos nuevos fuera de los que ya existen.
 */
export const simulatorConnector: BankConnector = {
  provider: 'simulator',

  startLinkFlow(_userId: string): LinkSession {
    return { connectionId: randomUUID(), status: 'linked' }
  },

  /** Yape es de BCP: las otras entidades solo tienen ahorros y tarjeta. Sin banco elegido, todas. */
  listAccounts(_connectionId: string, institution?: Institution | null): ConnectorAccount[] {
    if (!institution || institution === 'bcp') return SIMULATED_ACCOUNTS
    return SIMULATED_ACCOUNTS.filter((account) => account.type !== 'yape')
  },

  syncTransactions(connectionId: string, since?: string): ConnectorTransaction[] {
    const all = SIMULATED_ACCOUNTS.flatMap((account) => generateAccountTransactions(connectionId, account))
    if (!since) return all
    return all.filter((t) => t.date >= since)
  },

  revoke(_connectionId: string): void {
    // El simulador no mantiene estado externo que revocar.
  },
}
