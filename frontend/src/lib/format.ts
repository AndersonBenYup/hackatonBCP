const currency = new Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'PEN',
})

const shortDate = new Intl.DateTimeFormat('es-PE', {
  day: '2-digit',
  month: 'short',
})

const shortDateTime = new Intl.DateTimeFormat('es-PE', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

export const formatMoney = (value: number) => currency.format(value)

/** Para fechas sin hora (YYYY-MM-DD), como las de una transacción. */
export const formatDate = (iso: string) => shortDate.format(new Date(`${iso}T00:00:00`))

/** Para timestamps ISO completos, como un `createdAt` de usuario. */
export const formatDateTime = (iso: string) => shortDateTime.format(new Date(iso))

/** Fecha local (no UTC) como YYYY-MM-DD: de noche en Perú, UTC ya sería mañana. */
export const toIsoDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

const localDate = (iso: string) => new Date(`${iso}T00:00:00`)

const longMonth = new Intl.DateTimeFormat('es-PE', { month: 'long' })

export const dayOfMonth = (iso: string) => localDate(iso).getDate()

export const daysInMonth = (iso: string) => {
  const date = localDate(iso)
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

/** "noviembre" (en es-PE, Intl lo devuelve con mayúscula). */
export const monthName = (iso: string) => longMonth.format(localDate(iso)).toLowerCase()

/** "nov" */
export const monthShort = (iso: string) => monthName(iso).slice(0, 3)

/** "hoy", "ayer" o la fecha corta, respecto de `today`. */
export const relativeDate = (iso: string, today: string) => {
  if (iso === today) return 'hoy'
  const yesterday = localDate(today)
  yesterday.setDate(yesterday.getDate() - 1)
  return iso === toIsoDate(yesterday) ? 'ayer' : formatDate(iso)
}

export const uid = () => crypto.randomUUID()
