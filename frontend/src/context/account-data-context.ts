import { createContext } from 'react'
import type { Challenge, ChatMessage, Goal, Transaction, UpcomingPayment } from '@/types'

export interface AccountDataContextValue {
  isDemo: boolean
  transactions: Transaction[]
  goals: Goal[]
  challenges: Challenge[]
  upcomingPayments: UpcomingPayment[]
  welcome: ChatMessage[]
  streakDays: number
  budget: number
  balance: number
  income: number
  expense: number
  addTransaction: (input: Omit<Transaction, 'id'>) => void
  completeChallenge: (id: string) => void
  refreshBankTransactions: () => Promise<void>
}

export const AccountDataContext = createContext<AccountDataContextValue | null>(null)
