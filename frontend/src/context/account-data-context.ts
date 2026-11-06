import { createContext } from 'react'
import type { Challenge, ChatMessage, Goal, Transaction, UpcomingPayment } from '@/types'

export interface AccountDataContextValue {
  isDemo: boolean
  /** Fecha de referencia YYYY-MM-DD: la real, o la fija del dataset en la cuenta demo. */
  today: string
  /** Todos los movimientos: manuales y de cuentas vinculadas. */
  transactions: Transaction[]
  /** Los anotados a mano: viven en este navegador, el backend no los conoce. */
  manualTransactions: Transaction[]
  /** Los del mes de `today`, hasta `today`. De aquí salen income, expense y el plan del mes. */
  monthTransactions: Transaction[]
  goals: Goal[]
  challenges: Challenge[]
  upcomingPayments: UpcomingPayment[]
  welcome: ChatMessage[]
  streakDays: number
  budget: number
  /** Saldo histórico: ingresos menos gastos de todos los movimientos. */
  balance: number
  /** Ingresos del mes. */
  income: number
  /** Gastos del mes. */
  expense: number
  addTransaction: (input: Omit<Transaction, 'id'>) => void
  completeChallenge: (id: string) => void
  refreshBankTransactions: () => Promise<void>
}

export const AccountDataContext = createContext<AccountDataContextValue | null>(null)
