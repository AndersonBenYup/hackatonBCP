import { randomUUID } from 'node:crypto'
import { db } from '../../db/client.js'
import type { UserRecord } from './users.types.js'

const insertStmt = db.prepare(`
  INSERT INTO users (id, name, email, password_hash)
  VALUES (@id, @name, @email, @passwordHash)
`)

const findByEmailStmt = db.prepare(`
  SELECT * FROM users WHERE email = @email
`)

const findByIdStmt = db.prepare(`
  SELECT * FROM users WHERE id = @id
`)

export const usersRepository = {
  create(input: { name: string; email: string; passwordHash: string }): UserRecord {
    const id = randomUUID()
    insertStmt.run({ id, ...input })
    return findByIdStmt.get({ id }) as unknown as UserRecord
  },

  findByEmail(email: string): UserRecord | undefined {
    return findByEmailStmt.get({ email }) as unknown as UserRecord | undefined
  },

  findById(id: string): UserRecord | undefined {
    return findByIdStmt.get({ id }) as unknown as UserRecord | undefined
  },
}
