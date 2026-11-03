import { IconBank, IconChat, IconHome, IconSwap, IconTarget, IconTrendingUp } from '@/components/icons'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
}

export const navItems: NavItem[] = [
  { to: '/', label: 'Inicio', icon: IconHome, end: true },
  { to: '/movimientos', label: 'Movimientos', icon: IconSwap },
  { to: '/cuentas', label: 'Cuentas', icon: IconBank },
  { to: '/pronostico', label: 'Pronóstico', icon: IconTrendingUp },
  { to: '/asistente', label: 'Asistente', icon: IconChat },
  { to: '/aprende', label: 'Aprende', icon: IconTarget },
]

export const bottomNavItems: NavItem[] = [
  { to: '/', label: 'Inicio', icon: IconHome, end: true },
  { to: '/movimientos', label: 'Movimientos', icon: IconSwap },
  { to: '/pronostico', label: 'Pronóstico', icon: IconTrendingUp },
  { to: '/asistente', label: 'Asistente', icon: IconChat },
  { to: '/aprende', label: 'Aprende', icon: IconTarget },
]
