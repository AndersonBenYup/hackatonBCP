import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/useAuth'

export default function ProtectedRoute() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return <div className="flex min-h-dvh items-center justify-center text-sm text-slate-500">Cargando...</div>
  }

  if (status === 'guest') {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
