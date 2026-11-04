import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { IconMenu, IconX } from '@/components/icons'
import Button from '@/components/ui/Button'
import { LogoMark } from '@/layouts/AppLayout'

const appName = import.meta.env.VITE_APP_NAME ?? 'Finza'

const publicNavItems = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/giro', label: 'Giro' },
  { to: '/planes', label: 'Planes' },
  { to: '/aplicacion', label: 'Aplicación' },
]

export default function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <header className="sticky top-0 z-30 border-b border-line bg-canvas/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 md:px-8">
          <Link to="/" className="flex items-center gap-2.5" onClick={() => setMenuOpen(false)}>
            <LogoMark className="size-8" />
            <span className="text-base font-extrabold tracking-tight text-brand-900">{appName}</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Navegación pública">
            {publicNavItems.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `rounded-full px-3.5 py-2 text-sm font-semibold transition-colors duration-150 ${
                    isActive ? 'bg-brand-100/70 text-brand-800' : 'text-slate-600 hover:text-brand-800'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Link to="/login">
              <Button variant="ghost">Iniciar sesión</Button>
            </Link>
            <Link to="/registro">
              <Button variant="primary">Crear cuenta gratis</Button>
            </Link>
          </div>

          <button
            type="button"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setMenuOpen((open) => !open)}
            className="flex size-9 items-center justify-center rounded-full text-slate-600 hover:bg-white md:hidden"
          >
            {menuOpen ? <IconX className="size-5" /> : <IconMenu className="size-5" />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="overflow-hidden border-t border-line md:hidden"
            >
              <nav className="flex flex-col gap-1 px-4 py-3" aria-label="Navegación pública móvil">
                {publicNavItems.map(({ to, label, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `rounded-lg px-3 py-2.5 text-sm font-semibold ${
                        isActive ? 'bg-brand-100/70 text-brand-800' : 'text-slate-600'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                ))}
                <div className="mt-2 flex gap-2 border-t border-line pt-3">
                  <Link to="/login" className="flex-1" onClick={() => setMenuOpen(false)}>
                    <Button variant="secondary" className="w-full">
                      Iniciar sesión
                    </Button>
                  </Link>
                  <Link to="/registro" className="flex-1" onClick={() => setMenuOpen(false)}>
                    <Button variant="primary" className="w-full">
                      Crear cuenta
                    </Button>
                  </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-line bg-white">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="flex items-center gap-2.5">
            <LogoMark className="size-7" />
            <div>
              <p className="text-sm font-bold text-brand-900">{appName}</p>
              <p className="text-xs text-slate-500">Educación financiera para tu primer sueldo</p>
            </div>
          </div>
          <p className="text-xs text-slate-500">
            Proyecto construido para el Innovathon BCP · demo de hackathon, no es un producto bancario ni sustituye servicios financieros regulados.
          </p>
        </div>
      </footer>
    </div>
  )
}
