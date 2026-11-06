import { randomUUID } from 'node:crypto'
import { db } from '../../db/firestore.js'
import type { UserRecord, UserRole } from './users.types.js'

const usersCollection = db.collection('users')

export const usersRepository = {
  async create(input: { name: string; email: string; passwordHash: string; role?: UserRole }): Promise<UserRecord> {
    const id = randomUUID()
    const record: UserRecord = {
      id,
      name: input.name,
      email: input.email,
      password_hash: input.passwordHash,
      role: input.role ?? 'user',
      created_at: new Date().toISOString(),
    }
    await usersCollection.doc(id).set(record)
    return record
  },

  async findByEmail(email: string): Promise<UserRecord | undefined> {
    const snapshot = await usersCollection.where('email', '==', email).limit(1).get()
    if (snapshot.empty) return undefined
    return snapshot.docs[0]!.data() as UserRecord
  },

  async findById(id: string): Promise<UserRecord | undefined> {
    const doc = await usersCollection.doc(id).get()
    if (!doc.exists) return undefined
    return doc.data() as UserRecord
  },

  async listAll(): Promise<UserRecord[]> {
    const snapshot = await usersCollection.get()
    return snapshot.docs.map((d) => d.data() as UserRecord)
  },

  async deleteById(id: string): Promise<void> {
    await usersCollection.doc(id).delete()
  },

  async updateRole(id: string, role: UserRole): Promise<void> {
    await usersCollection.doc(id).update({ role })
  },

  async updatePasswordHash(id: string, passwordHash: string): Promise<void> {
    await usersCollection.doc(id).update({ password_hash: passwordHash })
  },
}
