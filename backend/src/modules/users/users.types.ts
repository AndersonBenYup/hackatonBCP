export type UserRole = 'user' | 'admin'

export interface UserRecord {
  id: string
  name: string
  email: string
  password_hash: string
  role: UserRole
  created_at: string
}

export interface PublicUser {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: string
}

export const toPublicUser = (user: UserRecord): PublicUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  // Cuentas creadas antes de agregar roles no tienen el campo en Firestore.
  role: user.role ?? 'user',
  createdAt: user.created_at,
})
