import { mockChallenges } from '@/data/mock'
import type { Challenge, ChatMessage, Goal, UpcomingPayment } from '@/types'

/**
 * Dataset de una cuenta recien creada: sin metas, sin pagos proximos. El
 * catalogo de retos se mantiene (es contenido de la app, no datos del
 * usuario) pero todos arrancan sin completar. Movimientos y retos completados
 * se inicializan en AccountDataContext (desde localStorage, ver lib/account-storage.ts).
 */
export const emptyGoals: Goal[] = []

export const emptyUpcomingPayments: UpcomingPayment[] = []

export const emptyChallenges: Challenge[] = mockChallenges.map((c) => ({ ...c, completed: false }))

export const emptyWelcome: ChatMessage[] = [
  {
    id: 'm0',
    role: 'assistant',
    content: 'Hola, soy tu asistente financiero. Vincula una cuenta o registra tu primer movimiento y pregúntame lo que quieras sobre tu plata.',
  },
]
