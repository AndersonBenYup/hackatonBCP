const currency = new Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'PEN',
})

const shortDate = new Intl.DateTimeFormat('es-PE', {
  day: '2-digit',
  month: 'short',
})

export const formatMoney = (value: number) => currency.format(value)

export const formatDate = (iso: string) => shortDate.format(new Date(`${iso}T00:00:00`))

export const uid = () => crypto.randomUUID()
