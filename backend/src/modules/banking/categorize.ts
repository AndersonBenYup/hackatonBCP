import type { Category, TransactionDirection } from './banking.types.js'

/**
 * Clasificador por reglas + palabras clave del comercio (Fase 0 del motor de
 * categorizacion descrito en Arquitectura Conexion Bancaria y Trust Score.md).
 * Cubre los comercios que genera el simulador; un LLM puede reemplazar esto
 * despues para los casos ambiguos, sin tocar el resto del flujo de sync.
 */
const EXPENSE_KEYWORDS: Array<[string, Category]> = [
  ['plaza vea', 'comida'],
  ['metro', 'comida'],
  ['rappi', 'comida'],
  ['inka farma', 'servicios'],
  ['cineplanet', 'entretenimiento'],
  ['netflix', 'entretenimiento'],
  ['spotify', 'entretenimiento'],
  ['claro', 'servicios'],
  ['uber', 'transporte'],
]

const INCOME_KEYWORDS: Array<[string, Category]> = [
  ['haberes', 'salario'],
  ['sueldo', 'salario'],
  ['planilla', 'salario'],
]

export function categorizeMerchant(merchantRaw: string, type: TransactionDirection): Category {
  const normalized = merchantRaw.toLowerCase()
  const table = type === 'income' ? INCOME_KEYWORDS : EXPENSE_KEYWORDS
  for (const [keyword, category] of table) {
    if (normalized.includes(keyword)) return category
  }
  return 'otros'
}
