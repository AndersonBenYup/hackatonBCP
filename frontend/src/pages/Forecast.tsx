import EmptyState from '@/components/EmptyState'
import { IconCheckCircle, IconAlertTriangle } from '@/components/icons'
import CumulativeChart from '@/components/charts/CumulativeChart'
import BarList from '@/components/charts/BarList'
import Card from '@/components/ui/Card'
import { categoryStyles, cumulativeSpending, mockToday } from '@/data/mock'
import { useAccountData } from '@/hooks/useAccountData'
import { formatMoney } from '@/lib/format'

const DAYS_IN_MONTH = 31

export default function Forecast() {
  const { transactions, budget, balance, income, expense } = useAccountData()
  const today = new Date(`${mockToday}T00:00:00`).getDate()
  const past = cumulativeSpending(transactions)
  const spent = expense
  const projected = spent / today * DAYS_IN_MONTH
  const remaining = budget - spent
  const perDay = remaining / (DAYS_IN_MONTH - today)
  const willOverspend = projected > income

  const byCategory = Object.entries(categoryStyles)
    .map(([key, style]) => ({
      label: style.label,
      value: transactions.filter((t) => t.type === 'expense' && t.category === key).reduce((s, t) => s + t.amount, 0),
    }))
    .filter((r) => r.value > 0)
    .sort((a, b) => b.value - a.value)

  return (
    <>
      <header className="pb-6 pt-1">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-[28px]">Pronóstico</h1>
        <p className="mt-1 text-sm text-slate-600">
          {willOverspend
            ? 'A este ritmo cierras octubre gastando más de lo que ingresa.'
            : `A este ritmo cierras octubre en ${formatMoney(projected)}, ${remaining >= 0 ? 'dentro' : 'fuera'} del presupuesto.`}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
        <div className="grid min-w-0 gap-6">
          <Card className="p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-lg font-bold text-slate-900">Trayectoria del gasto</h2>
              <span className="text-xs text-slate-500">1 – 31 oct · acumulado</span>
            </div>
          <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="h-[3px] w-4 rounded-full" style={{ backgroundColor: 'var(--color-accent-500)' }} />
                Tu gasto real
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-[3px] w-4 rounded-full" style={{ backgroundColor: 'var(--color-cat-slate-ink)', opacity: 0.55 }} />
                Presupuesto
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-[3px] w-4 rounded-full" style={{ backgroundColor: 'var(--color-accent-300)' }} />
                Proyección
              </span>
            </p>
            <div className="mt-3">
              <CumulativeChart
                past={past}
                totalDays={DAYS_IN_MONTH}
                today={today}
                monthlyBudget={budget}
                projectionEnd={projected}
                formatMoney={formatMoney}
              />
            </div>
          </Card>

          {/* Las cifras que acompañan al gráfico, cada una en su tarjeta */}
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
            <Card className="p-5">
              <p className="text-[13px] text-slate-500">Proyección del mes</p>
              <p className="tabular mt-1 text-2xl font-bold text-slate-900">{formatMoney(projected)}</p>
            </Card>
            <Card className="p-5">
              <p className="text-[13px] text-slate-500">Presupuesto</p>
              <p className="tabular mt-1 text-2xl font-bold text-slate-900">{formatMoney(budget)}</p>
            </Card>
            <Card className="col-span-2 p-5 sm:col-span-1">
              <p className="text-[13px] text-slate-500">Restan por día</p>
              <p className="tabular mt-1 text-2xl font-bold text-slate-900">{formatMoney(perDay)}</p>
            </Card>
          </div>

          <Card className={`flex gap-3 ${willOverspend ? 'bg-danger-50 border-danger-100' : 'bg-success-50 border-success-100'} border p-5`}>
            {willOverspend ? (
              <IconAlertTriangle className="size-5 shrink-0 text-danger-500" strokeWidth={2} />
            ) : (
              <IconCheckCircle className="size-5 shrink-0 text-success-500" strokeWidth={2} />
            )}
            <p className="text-sm text-slate-700">
              {willOverspend
                ? 'A este ritmo gastarás más de lo que ingresas. Revisa tus gastos de entretenimiento.'
                : `Vas bien. Con tu ritmo actual podrías ahorrar cerca de ${formatMoney(Math.max(0, income - projected))} este mes.`}
            </p>
          </Card>
        </div>

        {/* ¿Dónde va el dinero? ranking con barras delgadas */}
        <Card className="p-5 self-start">
          <h2 className="text-lg font-bold text-slate-900">Dónde va el dinero</h2>
          <p className="mt-1 text-[13px] text-slate-500">{formatMoney(spent)} de {formatMoney(budget)} usados</p>
          {byCategory.length > 0 ? (
            <>
              <div className="mt-5">
                <BarList rows={byCategory} formatValue={formatMoney} />
              </div>
              <p className="mt-5 border-t border-rule pt-4 text-[13px] leading-relaxed text-slate-500">
                Tu mayor gasto fue en {byCategory[0]!.label.toLowerCase()}. {formatMoney(byCategory[0]!.value)}
                {budget > 0 && <> es el {Math.round((byCategory[0]!.value / budget) * 100)}% de tu presupuesto mensual</>}; revisa si ese
                gasto lo puedes repartir en el resto del mes.
              </p>
            </>
          ) : (
            <EmptyState
              className="py-4"
              title="Todavía no hay gastos categorizados"
              body="En cuanto registres movimientos o sincronices tu cuenta, verás aquí a dónde se va tu plata."
            />
          )}
          <div className="mt-4 rounded-[14px] bg-rule/60 p-4">
            <p className="text-[13px] text-slate-500">Tu saldo hoy</p>
            <p className="tabular mt-0.5 text-lg font-bold text-slate-900">{formatMoney(balance)}</p>
            <p className="tabular mt-1 text-[13px] text-slate-500">
              <span className="font-semibold text-success-500">+{formatMoney(income)}</span> de ingresos en octubre
            </p>
          </div>
        </Card>
      </div>
    </>
  )
}
