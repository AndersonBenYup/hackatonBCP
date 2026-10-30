import { NavLink } from 'react-router-dom'

const items = [
  { to: '/', label: 'Inicio', icon: '🏠' },
  { to: '/movimientos', label: 'Movimientos', icon: '💸' },
  { to: '/pronostico', label: 'Pronóstico', icon: '📈' },
  { to: '/asistente', label: 'Asistente', icon: '🤖' },
  { to: '/aprende', label: 'Aprende', icon: '🎯' },
]

export default function BottomNav() {
  return (
    <nav className="sticky bottom-0 border-t border-slate-200 bg-white">
      <ul className="grid grid-cols-5">
        {items.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium ${
                  isActive ? 'text-brand-600' : 'text-slate-500'
                }`
              }
            >
              <span aria-hidden className="text-lg">
                {item.icon}
              </span>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
