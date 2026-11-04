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

export const uid = () => crypto.randomUUID()
