import { Outlet, useNavigate } from 'react-router-dom'
import BottomNav from '@/components/BottomNav'
import { useAuth } from '@/context/useAuth'

const appName = import.meta.env.VITE_APP_NAME ?? 'Finanzas IA'

export default function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-slate-50 shadow-xl">
      <header className="flex items-start justify-between bg-brand-900 px-4 py-4 text-white">
        <div>
          <h1 className="text-lg font-bold">{appName}</h1>
          <p className="text-xs text-brand-100">Hola, {user?.name.split(' ')[0]} 👋</p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg px-2 py-1 text-xs font-medium text-brand-100 transition-colors duration-150 hover:bg-brand-500/30"
        >
          Salir
        </button>
      </header>
      <main className="flex-1 space-y-4 p-4">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
