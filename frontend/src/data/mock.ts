import type { Challenge, ChatMessage, Goal, Transaction } from '@/types'

export const mockTransactions: Transaction[] = [
  { id: 't1', type: 'income', amount: 1500, category: 'salario', description: 'Pago de prácticas', date: '2026-10-01' },
  { id: 't2', type: 'expense', amount: 45.5, category: 'comida', description: 'Menú de la semana', date: '2026-10-03' },
  { id: 't3', type: 'expense', amount: 60, category: 'transporte', description: 'Recarga de tarjeta', date: '2026-10-05' },
  { id: 't4', type: 'expense', amount: 39.9, category: 'entretenimiento', description: 'Streaming', date: '2026-10-08' },
  { id: 't5', type: 'expense', amount: 120, category: 'educacion', description: 'Curso online', date: '2026-10-12' },
  { id: 't6', type: 'expense', amount: 85, category: 'servicios', description: 'Plan móvil', date: '2026-10-15' },
]

export const mockGoals: Goal[] = [
  { id: 'g1', name: 'Laptop nueva', target: 3000, saved: 1150 },
  { id: 'g2', name: 'Fondo de emergencia', target: 1000, saved: 420 },
]

export const mockChallenges: Challenge[] = [
  { id: 'c1', title: 'Registra 5 gastos', description: 'Anota tus gastos durante la semana.', points: 50, completed: true },
  { id: 'c2', title: '¿Qué es la TCEA?', description: 'Aprende a comparar el costo real de un crédito.', points: 80, completed: false },
  { id: 'c3', title: 'Ahorra el 10%', description: 'Separa el 10% de tu ingreso este mes.', points: 120, completed: false },
  { id: 'c4', title: 'Tarjeta de crédito 101', description: 'Fecha de corte vs. fecha de pago.', points: 80, completed: false },
]

export const mockWelcome: ChatMessage[] = [
  {
    id: 'm0',
    role: 'assistant',
    content: 'Hola, soy tu asistente financiero. Pregúntame sobre tus gastos, ahorro o cómo usar tu tarjeta.',
  },
]

export const mockStreakDays = 4
