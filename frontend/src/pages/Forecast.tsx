import Card from '@/components/ui/Card'
import ProgressBar from '@/components/ui/ProgressBar'
import { mockTransactions } from '@/data/mock'
import { formatMoney } from '@/lib/format'

// Proyección simple: gasto diario promedio x días del mes. Se reemplazará por el modelo real.
const DAYS_IN_MONTH = 31
const DAYS_ELAPSED = 15

export default function Forecast() {
  const income = mockTransactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  const spent = mockTransactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  const projected = (spent / DAYS_ELAPSED) * DAYS_IN_MONTH
  const willOverspend = projected > income

  return (
    <>
      <Card className="space-y-3">
        <h2 className="font-semibold">Proyección de fin de mes</h2>
        <p className="text-3xl font-bold">{formatMoney(projected)}</p>
        <ProgressBar value={projected} max={income} />
        <p className="text-sm text-slate-500">
          Ingresos del mes: {formatMoney(income)} · Gastado hasta hoy: {formatMoney(spent)}
        </p>
      </Card>

      <Card
        className={`animate-fade-up border transition-colors duration-300 ${willOverspend ? 'border-danger-500' : 'border-success-500'}`}
      >
        <p className="text-sm">
          {willOverspend
            ? '⚠️ A este ritmo gastarás más de lo que ingresas. Revisa tus gastos de entretenimiento.'
            : `✅ Vas bien. Podrías ahorrar alrededor de ${formatMoney(income - projected)} este mes.`}
        </p>
      </Card>

      <Card className="text-sm text-slate-500">
        Próximamente: pronósticos por categoría y alertas de gastos recurrentes.
      </Card>
    </>
  )
}
