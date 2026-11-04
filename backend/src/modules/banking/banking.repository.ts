import { randomUUID } from 'node:crypto'
import { db } from '../../db/firestore.js'
import type { BankAccountRecord, BankConnectionRecord, RawTransactionRecord } from './banking.types.js'

const connectionsCollection = db.collection('bankConnections')
const accountsCollection = db.collection('bankAccounts')
const transactionsCollection = db.collection('rawTransactions')

export const bankingRepository = {
  async createConnection(input: { userId: string; provider: string }): Promise<BankConnectionRecord> {
    const id = randomUUID()
    const record: BankConnectionRecord = {
      id,
      user_id: input.userId,
      provider: input.provider,
      status: 'active',
      linked_at: new Date().toISOString(),
      revoked_at: null,
    }
    await connectionsCollection.doc(id).set(record)
    return record
  },

  async findConnectionById(id: string): Promise<BankConnectionRecord | undefined> {
    const doc = await connectionsCollection.doc(id).get()
    if (!doc.exists) return undefined
    return doc.data() as BankConnectionRecord
  },

  async listConnectionsByUser(userId: string): Promise<BankConnectionRecord[]> {
    const snapshot = await connectionsCollection
      .where('user_id', '==', userId)
      .where('status', '==', 'active')
      .get()
    const records = snapshot.docs.map((d) => d.data() as BankConnectionRecord)
    return records.sort((a, b) => b.linked_at.localeCompare(a.linked_at))
  },

  async revokeConnection(id: string): Promise<void> {
    await connectionsCollection.doc(id).update({
      status: 'revoked',
      revoked_at: new Date().toISOString(),
    })
  },

  /** userId se denormaliza aqui (y en rawTransactions) para evitar joins en Firestore. */
  async createAccount(input: {
    connectionId: string
    userId: string
    externalAccountId: string
    type: string
    alias: string
    last4: string
  }): Promise<BankAccountRecord> {
    const id = randomUUID()
    const record: BankAccountRecord & { user_id: string } = {
      id,
      connection_id: input.connectionId,
      user_id: input.userId,
      external_account_id: input.externalAccountId,
      type: input.type as BankAccountRecord['type'],
      alias: input.alias,
      last4: input.last4,
    }
    await accountsCollection.doc(id).set(record)
    return record
  },

  async listAccountsByConnection(connectionId: string): Promise<BankAccountRecord[]> {
    const snapshot = await accountsCollection.where('connection_id', '==', connectionId).get()
    return snapshot.docs.map((d) => d.data() as BankAccountRecord)
  },

  async listAccountsByUser(userId: string): Promise<BankAccountRecord[]> {
    const snapshot = await accountsCollection.where('user_id', '==', userId).get()
    return snapshot.docs.map((d) => d.data() as BankAccountRecord)
  },

  /**
   * external_id como ID del documento: repetir un sync nunca duplica un
   * movimiento (equivalente al INSERT OR IGNORE que tenia la version SQLite).
   */
  async insertRawTransaction(input: {
    accountId: string
    userId: string
    externalId: string
    amount: number
    type: string
    category: string
    merchantRaw: string
    date: string
  }): Promise<void> {
    const docRef = transactionsCollection.doc(input.externalId)
    const existing = await docRef.get()
    if (existing.exists) return

    const record: RawTransactionRecord & { user_id: string } = {
      id: input.externalId,
      account_id: input.accountId,
      user_id: input.userId,
      external_id: input.externalId,
      amount: input.amount,
      type: input.type as RawTransactionRecord['type'],
      category: input.category as RawTransactionRecord['category'],
      merchant_raw: input.merchantRaw,
      date: input.date,
      synced_at: new Date().toISOString(),
    }
    await docRef.set(record)
  },

  async listRawTransactionsByUser(userId: string): Promise<RawTransactionRecord[]> {
    const snapshot = await transactionsCollection.where('user_id', '==', userId).get()
    const records = snapshot.docs.map((d) => d.data() as RawTransactionRecord)
    return records.sort((a, b) => b.date.localeCompare(a.date))
  },
}
