import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { AccountDataContext } from '@/context/account-data-context'
import { useAuth } from '@/context/useAuth'
import {
  emptyChallenges,
  emptyGoals,
  emptyUpcomingPayments,
  emptyWelcome,
} from '@/data/empty'
import {
  mockBudget,
  mockChallenges,
  mockGoals,
  mockStreakDays,
  mockToday,
  mockTransactions,
  mockUpcomingPayments,
  mockWelcome,
} from '@/data/mock'
import { bankingApi } from '@/lib/banking-api'
import {
  loadCompletedChallengeIds,
  loadTransactions,
  saveCompletedChallengeIds,
  saveTransactions,
} from '@/lib/account-storage'
import { toIsoDate, uid } from '@/lib/format'
import type { Challenge, Transaction } from '@/types'

/**
 * Cuenta que muestra el dataset completo de ejemplo del hackathon, para que
 * siempre haya una cuenta con datos que mostrar (demos, jurado, capturas). El
 * backend la siembra con DEMO_PASSWORD; nadie puede registrar este correo.
 * Cualquier otra cuenta arranca en 0 y lo que el usuario registra se guarda en
 * este navegador (ver lib/account-storage.ts).
 */
const DEMO_EMAIL = 'demo@finza.app'

/**
 * Este provider solo vive dentro de las rutas protegidas (ver App.tsx), asi
 * que por el momento en que monta, ProtectedRoute ya resolvio la sesion:
 * `user` esta disponible desde el primer render y no cambia mientras el
 * provider sigue montado (salir de /app desmonta el provider por completo).
 * Por eso el dataset inicial se carga una sola vez, de forma perezosa, en
 * vez de sincronizarlo en un efecto.
 */
export function AccountDataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const isDemo = user?.email.trim().toLowerCase() === DEMO_EMAIL
  const userId = user?.id ?? null
  const [today] = useState(() => (isDemo ? mockToday : toIsoDate(new Date())))

  // Movimientos anotados a mano (persisten en localStorage, ver lib/account-storage.ts).
  const [manualTransactions, setManualTransactions] = useState<Transaction[]>(() => {
    if (!userId) return []
    if (isDemo) return mockTransactions
    return loadTransactions(userId)
  })
  // Movimientos que llegaron de una cuenta bancaria vinculada (GET /api/banking/transactions).
  // La demo no los trae: su dataset ya viene completo y fijo en manualTransactions.
  const [bankTransactions, setBankTransactions] = useState<Transaction[]>([])

  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    if (!userId) return emptyChallenges
    if (isDemo) return mockChallenges
    const completedIds = new Set(loadCompletedChallengeIds(userId))
    return emptyChallenges.map((c) => (completedIds.has(c.id) ? { ...c, completed: true } : c))
  })

  const refreshBankTransactions = useCallback(async () => {
    if (!userId || isDemo) return
    const fetched = await bankingApi.transactions()
    setBankTransactions(fetched)
  }, [userId, isDemo])

  // Al entrar a la app, si la cuenta tiene bancos vinculados, trae sus movimientos.
  useEffect(() => {
    void refreshBankTransactions()
  }, [refreshBankTransactions])

  const transactions = useMemo(
    () => [...manualTransactions, ...bankTransactions],
    [manualTransactions, bankTransactions],
  )

  const addTransaction = useCallback(
    (input: Omit<Transaction, 'id'>) => {
      setManualTransactions((prev) => {
        const next = [{ ...input, id: uid() }, ...prev]
        if (userId && !isDemo) saveTransactions(userId, next)
        return next
      })
    },
    [userId, isDemo],
  )

  const completeChallenge = useCallback(
    (id: string) => {
      setChallenges((prev) => {
        const next = prev.map((c) => (c.id === id ? { ...c, completed: true } : c))
        if (userId && !isDemo) {
          saveCompletedChallengeIds(userId, next.filter((c) => c.completed).map((c) => c.id))
        }
        return next
      })
    },
    [userId, isDemo],
  )

  const value = useMemo(() => {
    const sumOf = (rows: Transaction[], type: Transaction['type']) =>
      rows.filter((t) => t.type === type).reduce((s, t) => s + t.amount, 0)

    const monthPrefix = today.slice(0, 7)
    const monthTransactions = transactions.filter((t) => t.date.startsWith(monthPrefix) && t.date <= today)
    const income = sumOf(monthTransactions, 'income')
    const expense = sumOf(monthTransactions, 'expense')
    const balance = sumOf(transactions, 'income') - sumOf(transactions, 'expense')
    return {
      isDemo,
      today,
      transactions,
      manualTransactions,
      monthTransactions,
      goals: isDemo ? mockGoals : emptyGoals,
      challenges,
      upcomingPayments: isDemo ? mockUpcomingPayments : emptyUpcomingPayments,
      welcome: isDemo ? mockWelcome : emptyWelcome,
      streakDays: isDemo ? mockStreakDays : 0,
      // La demo usa un presupuesto fijo (el guion del dataset de ejemplo). Una
      // cuenta nueva todavia no tiene forma de fijar un presupuesto propio, asi
      // que usamos su ingreso real como techo del mes: "Disponible" y "Ritmo
      // diario" quedan consistentes con "Saldo disponible" en vez de quedarse
      // fijos en un numero que nunca se mueve con tus movimientos reales.
      budget: isDemo ? mockBudget : income,
      balance: Math.round(balance * 100) / 100,
      income,
      expense,
      addTransaction,
      completeChallenge,
      refreshBankTransactions,
    }
  }, [isDemo, today, transactions, manualTransactions, challenges, addTransaction, completeChallenge, refreshBankTransactions])

  return <AccountDataContext.Provider value={value}>{children}</AccountDataContext.Provider>
}
