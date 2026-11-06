import { IconBank, IconChat, IconHome, IconSwap, IconTarget, IconTrendingUp } from '@/components/icons'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
}

export const navItems: NavItem[] = [
  { to: '/app', label: 'Inicio', icon: IconHome, end: true },
  { to: '/app/movimientos', label: 'Movimientos', icon: IconSwap },
  { to: '/app/cuentas', label: 'Cuentas', icon: IconBank },
  { to: '/app/pronostico', label: 'Pronóstico', icon: IconTrendingUp },
  { to: '/app/asistente', label: 'Asistente', icon: IconChat },
  { to: '/app/aprende', label: 'Aprende', icon: IconTarget },
]

/** Los mismos destinos en el teléfono; seis columnas no dan para "Movimientos" completo. */
export const bottomNavItems: NavItem[] = navItems.map((item) =>
  item.to === '/app/movimientos' ? { ...item, label: 'Movim.' } : item,
)
