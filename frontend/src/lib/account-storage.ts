import type { Transaction } from '@/types'

/**
 * Persistencia local (por navegador) de los datos que el propio usuario
 * genera en una cuenta nueva: movimientos registrados a mano y retos
 * completados. No hay backend para esto todavía (ver PRODUCT.md), pero sin
 * esto los datos se perdían al navegar a otra pantalla, lo cual se sentía
 * como un bug. Queda namespaced por userId para no mezclar cuentas.
 */
const PREFIX = 'finza:account'

function storageKey(userId: string, part: string) {
  return `${PREFIX}:${userId}:${part}`
}

function readJSON<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function writeJSON(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Almacenamiento no disponible (modo privado, cuota llena, etc.): se pierde
    // la persistencia pero la app sigue funcionando en memoria.
  }
}

export function loadTransactions(userId: string): Transaction[] {
  return readJSON<Transaction[]>(storageKey(userId, 'transactions')) ?? []
}

export function saveTransactions(userId: string, transactions: Transaction[]) {
  writeJSON(storageKey(userId, 'transactions'), transactions)
}

export function loadCompletedChallengeIds(userId: string): string[] {
  return readJSON<string[]>(storageKey(userId, 'completedChallenges')) ?? []
}

export function saveCompletedChallengeIds(userId: string, ids: string[]) {
  writeJSON(storageKey(userId, 'completedChallenges'), ids)
}
