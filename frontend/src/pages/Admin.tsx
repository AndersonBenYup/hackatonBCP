import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { IconShield, IconUser } from '@/components/icons'
import { useAuth } from '@/context/useAuth'
import { adminApi } from '@/lib/admin-api'
import { ApiRequestError } from '@/lib/api'
import { formatDateTime } from '@/lib/format'
import type { User } from '@/types/auth'

export default function Admin() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [confirmingId, setConfirmingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    adminApi
      .listUsers()
      .then(setUsers)
      .catch((err) => {
        setError(err instanceof ApiRequestError ? err.message : 'No se pudo cargar la lista de usuarios.')
      })
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: string) => {
    if (confirmingId !== id) {
      setConfirmingId(id)
      return
    }
    setDeletingId(id)
    setError('')
    try {
      await adminApi.deleteUser(id)
      setUsers((prev) => prev.filter((u) => u.id !== id))
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'No se pudo eliminar al usuario.')
    } finally {
      setDeletingId(null)
      setConfirmingId(null)
    }
  }

  return (
    <>
      <header className="pb-6 pt-1">
        <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-slate-900 md:text-[28px]">
          <IconShield className="size-6 text-accent-600" strokeWidth={2} />
          Administración
        </h1>
        <p className="mt-1 text-sm text-slate-500">{users.length} usuarios registrados en Finza.</p>
      </header>

      {error && <Card className="mb-4 border-danger-500/30 bg-danger-50 p-4 text-sm text-danger-500">{error}</Card>}

      <Card className="divide-y divide-rule">
        <div className="hidden items-center justify-between px-5 pb-1 pt-4 sm:flex">
          <p className="text-xs text-slate-500">Usuario</p>
          <p className="text-xs text-slate-500">Acciones</p>
        </div>

        {loading ? (
          <p className="px-5 py-8 text-center text-sm text-slate-500">Cargando usuarios...</p>
        ) : (
          users.map((u) => (
            <div key={u.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                  <IconUser className="size-4.5" strokeWidth={1.75} />
                </span>
                <div className="min-w-0">
                  <p className="flex items-center gap-2 truncate text-sm font-semibold text-slate-900">
                    {u.name}
                    {u.role === 'admin' && (
                      <span className="shrink-0 rounded-full bg-accent-100 px-2 py-0.5 text-[11px] font-bold text-accent-700">
                        Admin
                      </span>
                    )}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {u.email} · desde {formatDateTime(u.createdAt)}
                  </p>
                </div>
              </div>

              {u.id !== currentUser?.id && (
                <Button
                  type="button"
                  variant="danger"
                  onClick={() => handleDelete(u.id)}
                  disabled={deletingId === u.id}
                  className="h-8 shrink-0 px-3 text-xs"
                >
                  {deletingId === u.id ? 'Eliminando...' : confirmingId === u.id ? 'Confirmar' : 'Eliminar'}
                </Button>
              )}
            </div>
          ))
        )}

        {!loading && users.length === 0 && (
          <p className="px-5 py-8 text-center text-sm text-slate-500">No hay usuarios registrados todavía.</p>
        )}
      </Card>
    </>
  )
}
