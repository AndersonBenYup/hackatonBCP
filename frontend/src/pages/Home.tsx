import { Link } from 'react-router-dom'
import {
  IconArrowRight,
  IconBarChart,
  IconChat,
  IconFlame,
  IconTarget,
  IconWallet,
  IconTrophy,
} from '@/components/icons'
import Ring from '@/components/charts/Ring'
import Card from '@/components/ui/Card'
import CountUp from '@/components/ui/CountUp'
import ProgressBar from '@/components/ui/ProgressBar'
import {
  categoryStyles,
  mockBalance,
  mockBudget,
  mockExpense,
  mockGoals,
  mockIncome,
  mockStreakDays,
  mockTransactions,
} from '@/data/mock'
import { formatMoney } from '@/lib/format'

const DAYS_IN_MONTH = 31
const DAY_TODAY = 15
const DAYS_LEFT = DAYS_IN_MONTH - DAY_TODAY

const quickActions = [
  { to: '/movimientos', label: 'Nuevo movimiento', icon: IconWallet },
  { to: '/pronostico', label: 'Pronóstico', icon: IconBarChart },
  { to: '/aprende', label: 'Retos', icon: IconTarget },
  { to: '/asistente', label: 'Asistente IA', icon: IconChat },
]

/* Próximos pagos recurrentes (datos de ejemplo del hackathon). */
const upcoming = [
  { id: 'u1', name: 'Cuota del curso', date: '20 oct', amount: 120 },
  { id: 'u2', name: 'Streaming', date: '8 nov', amount: 39.9 },
  { id: 'u3', name: 'Plan móvil', date: '15 nov', amount: 85 },
  { id: 'u4', name: 'Recarga de tarjeta', date: '17 nov', amount: 60 },
]

export default function Home() {
  const remaining = mockBudget - mockExpense
  const perDay = remaining / DAYS_LEFT
  const categoryTotals = Object.entries(categoryStyles)
    .map(([key, style]) => ({
      key,
      label: style.label,
      tint: style.tint,
      ink: style.ink,
      value: mockTransactions
        .filter((t) => t.type === 'expense' && t.category === key)
        .reduce((sum, t) => sum + t.amount, 0),
    }))
    .filter((c) => c.value > 0)
    .sort((a, b) => b.value - a.value)

  const recent = [...mockTransactions]
    .filter((t) => t.type === 'expense')
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 4)
  const topCategory = categoryTotals[0]

  return (
    <>
      <header className="pb-6 pt-1">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-[28px]">Hola, Camila</h1>
        <p className="mt-1 text-sm text-slate-600">
          Vas en {Math.round((mockExpense / mockBudget) * 100)}% de tu presupuesto ·{' '}
          {formatMoney(perDay)}/día para los {DAYS_LEFT} días que restan
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[306px_1fr] lg:items-start">
        {/* Columna fija: la cuenta completa */}
        <Card className="p-5 lg:sticky lg:top-8">
          <div>
            <p className="text-sm font-medium text-slate-500">Saldo disponible</p>
            <p className="tabular mt-1 text-[32px] font-bold leading-none text-slate-900">
              <CountUp value={mockBalance} format={formatMoney} />
            </p>
            <p className="tabular mt-3 text-sm">
              <span className="font-semibold text-success-500">+{formatMoney(mockIncome)}</span>{' '}
              <span className="text-slate-500">de ingresos</span>
            </p>
            <p className="tabular text-sm">
              {formatMoney(mockExpense)} <span className="text-slate-500">gastado en octubre</span>
            </p>
          </div>

          {/* Racha: la señal de juego, en coral */}
          <div className="mt-4 flex items-center gap-3 rounded-[14px] bg-accent-50 px-4 py-3">
            <IconFlame className="size-6 shrink-0 text-accent-600" strokeWidth={2} />
            <div className="min-w-0">
              <p className="text-sm font-bold text-accent-800">
                {mockStreakDays} días de racha
              </p>
              <Link to="/aprende" className="text-xs font-semibold text-accent-700 underline-offset-2 hover:underline">
                Completa un reto y llegas a 5
              </Link>
            </div>
          </div>

          <div className="pt-5">
            <h2 className="text-sm font-semibold text-slate-900">Metas</h2>
            <ul className="mt-3 space-y-4">
              {mockGoals.map((goal) => (
                <li key={goal.id} className="space-y-2">
                  <p className="text-sm font-medium text-slate-800">{goal.name}</p>
                  <ProgressBar value={goal.saved} max={goal.target} className="h-1.5" />
                  <p className="tabular text-xs text-slate-500">
                    {formatMoney(goal.saved)} de {formatMoney(goal.target)}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <Link
            to="/aprende"
            className="group mt-5 flex items-center justify-between rounded-[14px] border border-line px-4 py-3 transition-colors duration-150 hover:border-brand-300 hover:bg-brand-50"
          >
            <span className="flex items-center gap-2 text-sm font-semibold text-brand-800">
              <IconTrophy className="size-4.5 text-accent-600" />
              Ver mis retos
            </span>
            <IconArrowRight className="size-4 text-slate-400 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:text-brand-700" />
          </Link>
        </Card>

        {/* Grid del mes */}
        <div className="grid min-w-0 gap-6 md:grid-cols-2 md:gap-x-6 md:gap-y-6">
          {/* Acciones del mes a un clic: 4 tiles iguales */}
          <div className="md:col-span-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {quickActions.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} className="group">
                <div className="flex h-full flex-col justify-between gap-3 rounded-[20px] bg-cat-blue-tint px-4 py-4 transition-[transform,background-color] duration-200 ease-out group-hover:-translate-y-0.5 group-hover:bg-brand-200/70 group-active:translate-y-0">
                  <Icon className="size-5 text-cat-blue-ink" strokeWidth={1.75} />
                  <span className="text-[13px] font-semibold leading-tight text-cat-blue-ink">{label}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* El plan del mes */}
          <Card className="md:col-span-2 flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
            <div className="relative shrink-0">
              <Ring ratio={mockExpense / mockBudget} />
              <p className="tabular absolute inset-0 flex flex-col items-center justify-center text-xl font-bold text-slate-900">
                {Math.round((mockExpense / mockBudget) * 100)}%
                <span className="text-[11px] font-medium text-slate-500">del presupuesto</span>
              </p>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between">
                <h2 className="text-lg font-bold text-slate-900">Plan de octubre</h2>
                <span className="text-xs text-slate-500">1 – 15 oct</span>
              </div>
              <div className="mt-3 flex items-start gap-x-6 gap-y-2">
                <div>
                  <p className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: 'var(--color-accent-500)' }} />
                    Gastado
                  </p>
                  <p className="tabular mt-0.5 text-lg font-bold text-slate-900">{formatMoney(mockExpense)}</p>
                </div>
                <div>
                  <p className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="size-2 shrink-0 rounded-full bg-rule" />
                    Disponible
                  </p>
                  <p className="tabular mt-0.5 text-lg font-bold text-slate-900">{formatMoney(remaining)}</p>
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs text-slate-500">Ritmo diario</p>
                  <p className="tabular mt-0.5 text-lg font-bold text-slate-900">{formatMoney(perDay)}</p>
                </div>
              </div>
              <p className="mt-3 hidden text-xs text-slate-500 sm:block">
                {mockStreakDays} días continuos registrando · buen ritmo para cerrar dentro del plan
              </p>
            </div>
          </Card>

          {/* La firma pastel: cada categoría su tile */}
          <Card className="p-5 md:col-span-2">
            <div className="flex items-baseline justify-between">
              <h2 className="text-lg font-bold text-slate-900">Gasto por categoría</h2>
              <Link to="/pronostico" className="text-sm font-semibold text-brand-700 hover:underline underline-offset-2">
                Ver detalle
              </Link>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {categoryTotals.map((cat) => {
                const transactions = mockTransactions.filter((t) => t.type === 'expense' && t.category === cat.key)
                return (
                  <Card
                    key={cat.key}
                    className="rounded-[14px] border-none p-4"
                    style={{ backgroundColor: cat.tint }}
                  >
                    <p className="text-xs font-semibold" style={{ color: cat.ink }}>
                      {cat.label}
                    </p>
                    <p className="tabular mt-1 text-lg font-bold" style={{ color: cat.ink }}>
                      {formatMoney(cat.value)}
                    </p>
                    <div className="mt-2 flex items-baseline justify-between text-[11px]" style={{ color: cat.ink }}>
                      <span>{transactions.length} mov.</span>
                      {cat.key === topCategory.key && <span className="font-semibold">lo más alto</span>}
                    </div>
                  </Card>
                )
              })}
            </div>
          </Card>

          {/* Gastado recientemente y Próximos pagos: cada tarjeta a su altura */}
          <Card className="p-5 md:col-span-1 self-start">
            <div className="flex items-baseline justify-between">
              <h2 className="text-lg font-bold text-slate-900">Gastado recientemente</h2>
              <Link to="/movimientos" className="text-sm font-semibold text-brand-700 hover:underline underline-offset-2">
                Ver todo
              </Link>
            </div>
            <ul className="mt-2 divide-y divide-rule">
              {recent.map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">{t.description}</p>
                    <p className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
                      <span
                        className="rounded-full px-1.5 py-0.5 text-[11px] font-semibold"
                        style={{
                          backgroundColor: categoryStyles[t.category].tint,
                          color: categoryStyles[t.category].ink,
                        }}
                      >
                        {categoryStyles[t.category].label}
                      </span>
                      {formatDate(t.date)}
                    </p>
                  </div>
                  <p className="tabular shrink-0 text-sm font-semibold text-slate-900">−{formatMoney(t.amount)}</p>
                </li>
              ))}
            </ul>
          </Card>

          {/* Próximos pagos */}
          <Card className="p-5 self-start">
            <h2 className="text-lg font-bold text-slate-900">Próximos pagos</h2>
            <ul className="mt-2 divide-y divide-rule">
              {upcoming.map((u) => (
                <li key={u.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{u.name}</p>
                    <p className="mt-0.5 text-xs text-slate-500">vence el {u.date}</p>
                  </div>
                  <p className="tabular shrink-0 text-sm font-semibold text-slate-900">{formatMoney(u.amount)}</p>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </>
  )
}

function formatDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`)
  return `${d.getDate()} oct`
}
