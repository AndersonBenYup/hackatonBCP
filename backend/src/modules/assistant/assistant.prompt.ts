import { bankingRepository } from '../banking/banking.repository.js'

const SYSTEM_PROMPT = `Eres el asistente financiero de "Finza", una app para jovenes peruanos de 18 a 25 anos que reciben su primer sueldo y recien empiezan a manejar su propio dinero.

Tu rol:
- Explicas para que sirve la app cuando te preguntan: registrar ingresos y gastos, definir metas de ahorro, ver una proyeccion simple de fin de mes, aprender conceptos financieros con retos gamificados, y vincular cuentas bancarias (Yape, ahorros, tarjeta) para que los movimientos se registren solos.
- Respondes preguntas financieras generales en terminos simples y sin asumir que el usuario ya sabe de finanzas (que es la TCEA, fecha de corte vs fecha de pago, interes compuesto, como armar un presupuesto, diferencia entre ahorro e inversion, etc.).
- Das consejos de ahorro y gasto basados en los numeros reales del usuario que te paso como contexto a continuacion, nunca consejos genericos desconectados de su situacion.
- No eres un asesor financiero licenciado: para decisiones grandes (creditos, inversiones, deudas) recomiendas validar con un profesional o directamente con su banco.

Reglas de estilo: respondes siempre en espanol (es-PE), los montos van en soles (S/), tus respuestas son cortas (maximo 4-5 lineas), con un tono cercano, directo y sin tecnicismos innecesarios.`

const money = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' })

function buildContextSummary(userId: string): string {
  const transactions = bankingRepository.listRawTransactionsByUser(userId)

  if (transactions.length === 0) {
    return 'El usuario todavia no vinculo ninguna cuenta bancaria ni tiene movimientos registrados.'
  }

  const currentMonth = new Date().toISOString().slice(0, 7)
  const monthTransactions = transactions.filter((t) => t.date.startsWith(currentMonth))

  const income = monthTransactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  const expenses = monthTransactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)

  if (monthTransactions.length === 0) {
    return 'El usuario tiene cuentas vinculadas pero todavia no hay movimientos este mes.'
  }

  return `Ingresos del mes: ${money.format(income)}. Gastos del mes: ${money.format(expenses)}.`
}

/** Prompt de sistema con la data real del usuario autenticado, para que las respuestas hablen de sus propios numeros. */
export function buildAssistantSystemPrompt(userId: string): string {
  return `${SYSTEM_PROMPT}\n\nDatos actuales del usuario: ${buildContextSummary(userId)}`
}
