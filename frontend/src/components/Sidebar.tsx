import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { IconLogout, IconShield } from '@/components/icons'
import { navItems } from '@/components/nav-items'
import { LogoMark } from '@/layouts/AppLayout'
import { useAuth } from '@/context/useAuth'

const appName = import.meta.env.VITE_APP_NAME ?? 'Finza'

function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase()
}

/*
 * Open plane: el sidebar sobre el mismo ground del canvas, una línea
 * de 1px entre medias, sin barra superior. Fila activa como píldora
 * de tinta pálida (la misma lengua de tiles del sistema).
 */
export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const items =
    user?.role === 'admin' ? [...navItems, { to: '/app/admin', label: 'Administración', icon: IconShield }] : navItems

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 shrink-0 flex-col justify-between border-r border-line bg-canvas md:flex">
      <div>
        <div className="flex items-center gap-2.5 px-5 pb-6 pt-7">
          <LogoMark className="size-8" />
          <div>
            <p className="text-base font-extrabold tracking-tight text-brand-900">{appName}</p>
            <p className="text-xs text-slate-500">Aprende y decide mejor</p>
          </div>
        </div>

        <nav className="px-3" aria-label="Navegación principal">
          <ul className="space-y-0.5">
            {items.map(({ to, label, icon: Icon, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `group relative flex h-9 items-center gap-3 rounded-lg px-3 text-sm transition-colors duration-150 ${
                      isActive ? 'font-semibold text-brand-800' : 'text-slate-600 hover:text-slate-900'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-lg bg-brand-100/70"
                          transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                          aria-hidden
                        />
                      )}
                      <Icon
                        className={`relative size-[18px] shrink-0 transition-colors duration-150 group-hover:text-brand-700 ${
                          isActive ? 'text-brand-700' : 'text-slate-400'
                        }`}
                        strokeWidth={1.75}
                      />
                      <span className="relative">{label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="p-3">
        <div className="mb-1 flex items-center gap-3 rounded-lg px-3 py-1.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
            {initials(user?.name ?? '')}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">{user?.name}</p>
            <p className="truncate text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex h-9 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-slate-600 transition-colors duration-150 hover:bg-white hover:text-brand-700"
        >
          <IconLogout className="size-[18px] shrink-0 text-slate-400" strokeWidth={1.75} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
