import type { Challenge, ChatMessage, Goal, Transaction, UpcomingPayment } from '@/types'

export interface CategoryStyle {
  tint: string
  ink: string
  label: string
}

/* Tinta pálida + tinta oscura del mismo matiz por categoría (estilo pastel-consumer). */
export const categoryStyles: Record<Transaction['category'], CategoryStyle> = {
  comida: { tint: 'var(--color-cat-coral-tint)', ink: 'var(--color-cat-coral-ink)', label: 'Comida' },
  transporte: { tint: 'var(--color-cat-blue-tint)', ink: 'var(--color-cat-blue-ink)', label: 'Transporte' },
  entretenimiento: { tint: 'var(--color-cat-teal-tint)', ink: 'var(--color-cat-teal-ink)', label: 'Entretenimiento' },
  educacion: { tint: 'var(--color-cat-amber-tint)', ink: 'var(--color-cat-amber-ink)', label: 'Educación' },
  servicios: { tint: 'var(--color-cat-slate-tint)', ink: 'var(--color-cat-slate-ink)', label: 'Servicios' },
  salario: { tint: 'var(--color-cat-green-tint)', ink: 'var(--color-cat-green-ink)', label: 'Salario' },
  otros: { tint: 'var(--color-cat-slate-tint)', ink: 'var(--color-cat-slate-ink)', label: 'Otros' },
}

/*
 * Dataset del mes en curso. Los totales se calculan desde las filas;
 * octubre 2026: días 1 a 15 transcurridos, mes de 31 días.
 */
export const mockTransactions: Transaction[] = [
  { id: 't1', type: 'income', amount: 1300, category: 'salario', description: 'Pago de prácticas', date: '2026-10-01' },
  { id: 't2', type: 'income', amount: 320, category: 'otros', description: 'Reembolso de comisión', date: '2026-10-06' },
  { id: 't3', type: 'expense', amount: 38.5, category: 'comida', description: 'Menú de la semana', date: '2026-10-02' },
  { id: 't4', type: 'expense', amount: 60, category: 'transporte', description: 'Recarga de tarjeta', date: '2026-10-03' },
  { id: 't5', type: 'expense', amount: 39.9, category: 'entretenimiento', description: 'Streaming', date: '2026-10-08' },
  { id: 't6', type: 'expense', amount: 21.4, category: 'comida', description: 'Café y pan', date: '2026-10-09' },
  { id: 't7', type: 'expense', amount: 120, category: 'educacion', description: 'Curso online', date: '2026-10-12' },
  { id: 't8', type: 'expense', amount: 85, category: 'servicios', description: 'Plan móvil', date: '2026-10-15' },
]

/** Presupuesto mensual de gastos. */
export const mockBudget = 900

/** Fecha del último registro (día transcurrido). */
export const mockToday = '2026-10-15'

/** Serie diaria acumulada de gastos: { day, spent } en soles. */
export function cumulativeSpending(transactions: Transaction[]): Array<{ day: number; spent: number; budget: number }> {
  const sorted = [...transactions].filter((t) => t.type === 'expense').sort((a, b) => a.date.localeCompare(b.date))
  const series: Array<{ day: number; spent: number; budget: number }> = []
  let acc = 0
  let cursor = 1
  const lastDay = Math.max(new Date(`${mockToday}T00:00:00`).getDate(), ...sorted.map((t) => new Date(`${t.date}T00:00:00`).getDate()))
  for (const t of sorted) {
    if (!t.date) continue
    const day = new Date(`${t.date}T00:00:00`).getDate()
    while (cursor < day) {
      series.push({ day: cursor, spent: acc, budget: (mockBudget / 31) * cursor })
      cursor += 1
    }
    acc += t.amount
    series.push({ day, spent: acc, budget: (mockBudget / 31) * day })
    cursor = day + 1
  }
  while (cursor <= lastDay) {
    series.push({ day: cursor, spent: acc, budget: (mockBudget / 31) * cursor })
    cursor += 1
  }
  return series
}

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
  { id: 'm1', role: 'user', content: '¿En qué gasto más?' },
  {
    id: 'm2',
    role: 'assistant',
    content:
      'De tus S/ 364.80 gastados en octubre, lo más fuerte fue Educación (S/ 120.00), que es el 13% de tu presupuesto. Si mantienes este ritmo, cierras el mes dentro del plan.',
  },
]

export const mockStreakDays = 4

/* Pagos recurrentes próximos (datos de ejemplo del hackathon). */
export const mockUpcomingPayments: UpcomingPayment[] = [
  { id: 'u1', name: 'Cuota del curso', date: '20 oct', amount: 120 },
  { id: 'u2', name: 'Streaming', date: '8 nov', amount: 39.9 },
  { id: 'u3', name: 'Plan móvil', date: '15 nov', amount: 85 },
  { id: 'u4', name: 'Recarga de tarjeta', date: '17 nov', amount: 60 },
]

/* Consistencia: ingresos - gastos = saldo total mostrado en toda la app. */
const income = mockTransactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
const expense = mockTransactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
export const mockBalance = Math.round((income - expense) * 100) / 100
export const mockIncome = income
export const mockExpense = expense
