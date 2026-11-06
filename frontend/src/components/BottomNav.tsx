import { NavLink } from 'react-router-dom'
import { motion } from 'motion/react'
import { bottomNavItems } from '@/components/nav-items'

/* Barra inferior del teléfono: seis destinos con etiquetas cortas. */
export default function BottomNav() {
  return (
    <nav className="sticky bottom-0 z-20 border-t border-line bg-canvas md:hidden" aria-label="Navegación del teléfono">
      <ul className="grid grid-cols-6">
        {bottomNavItems.map(({ to, label, icon: Icon, end }) => (
          <li key={to} className="min-w-0">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `relative flex h-14 flex-col items-center justify-center gap-0.5 text-[10.5px] transition-colors duration-150 ${
                  isActive ? 'font-semibold text-brand-700' : 'text-slate-500'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="bottom-pill"
                      className="absolute inset-x-1.5 top-1 bottom-1 rounded-xl bg-brand-100/70"
                      transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                      aria-hidden
                    />
                  )}
                  <Icon className="relative size-5" strokeWidth={isActive ? 2.1 : 1.75} />
                  <span className="relative">{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
