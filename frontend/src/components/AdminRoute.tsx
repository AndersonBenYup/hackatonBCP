import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/useAuth'

/** Protege /app/admin: solo cuentas con role 'admin' pasan, el resto vuelve a Inicio. */
export default function AdminRoute() {
  const { user } = useAuth()

  if (user?.role !== 'admin') {
    return <Navigate to="/app" replace />
  }

  return <Outlet />
}
