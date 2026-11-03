import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/useAuth'

/** Evita que un usuario ya autenticado vea las pantallas de login/registro. */
export default function GuestRoute() {
  const { status } = useAuth()

  if (status === 'loading') {
    return <div className="flex min-h-dvh items-center justify-center text-sm text-slate-500">Cargando...</div>
  }

  if (status === 'authenticated') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
