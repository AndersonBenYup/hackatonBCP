const limaDate = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Lima',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

/** Fecha yyyy-mm-dd en hora de Peru: en UTC, desde las 19:00 ya seria "manana". */
export const limaIsoDate = (date: Date = new Date()) => limaDate.format(date)
