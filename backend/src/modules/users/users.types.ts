export interface UserRecord {
  id: string
  name: string
  email: string
  password_hash: string
  created_at: string
}

export interface PublicUser {
  id: string
  name: string
  email: string
  createdAt: string
}

export const toPublicUser = (user: UserRecord): PublicUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  createdAt: user.created_at,
})
