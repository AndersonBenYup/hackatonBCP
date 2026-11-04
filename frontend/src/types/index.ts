export type TransactionType = 'income' | 'expense'

export type Category =
  | 'comida'
  | 'transporte'
  | 'entretenimiento'
  | 'educacion'
  | 'servicios'
  | 'salario'
  | 'otros'

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  category: Category
  description: string
  date: string // ISO yyyy-mm-dd
}

export interface Goal {
  id: string
  name: string
  target: number
  saved: number
}

export interface Challenge {
  id: string
  title: string
  description: string
  points: number
  completed: boolean
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export interface UpcomingPayment {
  id: string
  name: string
  date: string
  amount: number
}
