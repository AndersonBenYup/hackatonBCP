import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import BottomNav from '@/components/BottomNav'
import { IconLogout } from '@/components/icons'
import Sidebar from '@/components/Sidebar'
import { useAuth } from '@/context/useAuth'

const appName = import.meta.env.VITE_APP_NAME ?? 'Finza'

const phoneTitles: Record<string, string> = {
  '/app': 'Inicio',
  '/app/movimientos': 'Movimientos',
  '/app/cuentas': 'Cuentas',
  '/app/pronostico': 'Pronóstico',
  '/app/asistente': 'Asistente',
  '/app/aprende': 'Aprende',
  '/app/admin': 'Administración',
}

export default function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-dvh bg-canvas">
      <Sidebar />

      <div className="flex min-h-dvh flex-col md:pl-60">
        {/* Barra superior del teléfono: el pliegue del sidebar. Sólida, sin cristal. */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-canvas px-4 py-2.5 md:hidden">
          <div className="flex items-center gap-2.5">
            <LogoMark className="size-7" />
            <div>
              <p className="text-sm font-bold leading-tight text-brand-900">{phoneTitles[location.pathname] ?? appName}</p>
              <p className="text-[11px] leading-tight text-slate-500">Hola, {user?.name.split(' ')[0]}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Cerrar sesión"
            className="flex size-9 items-center justify-center rounded-full text-slate-500 transition-colors duration-150 hover:bg-white hover:text-brand-700"
          >
            <IconLogout className="size-4.5" />
          </button>
        </header>

        {/* El canvas: una gutter, un borde derecho compartido. */}
        <main className="flex-1 px-4 py-5 md:px-8 md:py-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              className="mx-auto w-full max-w-[1200px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        <BottomNav />
      </div>
    </div>
  )
}

/** Marca del producto: el isotipo de Finza. */
export function LogoMark({ className = '' }: { className?: string }) {
  return <img src="/finzalogo.png" alt="" aria-hidden className={`rounded-[22%] object-cover ${className}`} />
}
