import { useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import EmptyState from '@/components/EmptyState'
import { IconKanban, IconSearch } from '@/components/icons'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import TransactionKanban from '@/components/TransactionKanban'
import { categoryStyles } from '@/data/mock'
import { useAccountData } from '@/hooks/useAccountData'
import { formatMoney, relativeDate } from '@/lib/format'
import type { Category, TransactionType } from '@/types'

const categories: Category[] = ['comida', 'transporte', 'entretenimiento', 'educacion', 'servicios', 'salario', 'otros']

type Filter = 'all' | 'expense' | 'income'

export default function Transactions() {
  const { today, transactions, addTransaction } = useAccountData()
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const [kanbanOpen, setKanbanOpen] = useState(false)
  const [type, setType] = useState<TransactionType>('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<Category>('comida')
  const [description, setDescription] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return [...transactions]
      .filter((t) => (filter === 'all' ? true : t.type === filter))
      .filter((t) => (!q ? true : `${t.description} ${t.category}`.toLowerCase().includes(q)))
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [transactions, filter, query])

  const viewIncome = filtered.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const viewExpense = filtered.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const viewBalance = viewIncome - viewExpense

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const value = Number(amount)
    if (!value || value <= 0) return
    addTransaction({ type, amount: value, category, description: description || categoryStyles[category].label, date: today })
    setAmount('')
    setDescription('')
  }

  return (
    <>
      <header className="pb-6 pt-1">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-[28px]">Movimientos</h1>
        <p className="mt-1 text-sm text-slate-500">
          {transactions.length} {transactions.length === 1 ? 'registro' : 'registros'} en total
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[21rem_1fr] lg:items-start">
        {/* El trabajo frecuente: registrar un movimiento, arriba y a un lado */}
        <div className="space-y-6 lg:sticky lg:top-8">
          <Card className="p-5">
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <h2 className="text-lg font-bold text-slate-900">Registrar movimiento</h2>
            <div
              className="grid grid-cols-2 gap-1 rounded-full bg-rule p-1"
              role="group"
              aria-label="Tipo de movimiento"
            >
              {(['expense', 'income'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  aria-pressed={type === t}
                  className={`h-8 rounded-full text-sm font-semibold ring-1 transition-colors duration-150 ${
                    type === t
                      ? 'bg-white text-brand-800 ring-line'
                      : 'ring-transparent text-slate-600 hover:text-slate-700'
                  }`}
                >
                  {t === 'expense' ? 'Gasto' : 'Ingreso'}
                </button>
              ))}
            </div>
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">S/</span>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                aria-label="Monto en soles"
                className="tabular h-11 w-full rounded-xl border border-control bg-white pl-9 pr-3.5 text-sm outline-none transition-colors duration-150 placeholder:text-neutral-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              aria-label="Categoría"
              className="h-11 w-full rounded-xl border border-control bg-white px-3 text-sm text-slate-700 outline-none transition-colors duration-150 focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {categoryStyles[c].label}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Descripción (opcional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              aria-label="Descripción"
              className="h-11 w-full rounded-xl border border-control bg-white px-3.5 text-sm outline-none transition-colors duration-150 placeholder:text-neutral-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            />
            <Button type="submit" className="w-full">
              Agregar movimiento
            </Button>
          </form>
        </Card>

        {/* Resumen del tramo visible: una fila por cifra, para que un monto largo nunca se parta */}
        <div className="divide-y divide-line rounded-[20px] border border-line bg-white">
          <div className="flex items-baseline justify-between gap-3 px-5 py-3">
            <p className="text-xs text-slate-500">Ingresos</p>
            <p className="tabular whitespace-nowrap text-base font-bold text-success-500">+{formatMoney(viewIncome)}</p>
          </div>
          <div className="flex items-baseline justify-between gap-3 px-5 py-3">
            <p className="text-xs text-slate-500">Gastos</p>
            <p className="tabular whitespace-nowrap text-base font-bold text-slate-900">{formatMoney(viewExpense)}</p>
          </div>
          <div className="flex items-baseline justify-between gap-3 px-5 py-3">
            <p className="text-xs text-slate-500">Balance</p>
            <p className="tabular whitespace-nowrap text-base font-bold text-slate-900">{formatMoney(viewBalance)}</p>
          </div>
        </div>

        {/* Puente con Cuentas: registro que llega solo */}
        <Card className="border-dashed p-5">
          <p className="text-[13px] leading-relaxed text-slate-600">
            Los movimientos nuevos quedan con la fecha de hoy. Para que se registren solos,
            vincula tu cuenta en <Link to="/app/cuentas" className="font-semibold text-brand-700 underline-offset-2 hover:underline">Cuentas</Link>.
          </p>
        </Card>
        </div>

        {/* Lista: filtros y filas */}
        <section className="min-w-0 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex gap-0.5 rounded-full border border-line bg-white p-1">
              {(
                [
                  ['all', 'Todos'],
                  ['expense', 'Gastos'],
                  ['income', 'Ingresos'],
                ] as Array<[Filter, string]>
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilter(key)}
                  aria-pressed={filter === key}
                  className={`relative h-7 rounded-full px-3 text-xs font-semibold transition-colors duration-150 ${
                    filter === key ? 'text-brand-800' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {filter === key && (
                    <motion.span
                      layoutId="tx-filter"
                      className="absolute inset-0 rounded-full bg-brand-100/70"
                      transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                      aria-hidden
                    />
                  )}
                  <span className="relative">{label}</span>
                </button>
              ))}
            </div>
            <div className="relative min-w-44 flex-1 sm:max-w-xs">
              <IconSearch className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar movimiento"
                aria-label="Buscar movimientos"
                className="h-9 w-full rounded-full border border-control bg-white pl-9 pr-3 text-sm outline-none transition-colors duration-150 placeholder:text-neutral-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              />
            </div>
            <button
              type="button"
              onClick={() => setKanbanOpen(true)}
              className="flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-control bg-white px-3.5 text-xs font-semibold text-brand-700 transition-colors duration-150 hover:border-brand-300 hover:bg-brand-50"
            >
              <IconKanban className="size-4" strokeWidth={2} />
              Vista Kanban
            </button>
          </div>

          <Card className="divide-y divide-rule">
            <div className="flex items-center justify-between px-5 pb-1 pt-4">
              <p className="text-xs text-slate-500">Movimiento</p>
              <p className="text-xs text-slate-500">Monto (S/)</p>
            </div>
            <AnimatePresence initial={false}>
              {filtered.map((t) => (
                <motion.div
                  key={t.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between gap-3 px-5 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">{t.description}</p>
                    <p className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
                      <span
                        className="shrink-0 whitespace-nowrap rounded-full px-1.5 py-0.5 text-[11px] font-semibold"
                        style={{ backgroundColor: categoryStyles[t.category].tint, color: categoryStyles[t.category].ink }}
                      >
                        {categoryStyles[t.category].label}
                      </span>
                      {relativeDate(t.date, today)}
                    </p>
                  </div>
                  <p
                    className={`tabular shrink-0 whitespace-nowrap text-sm font-semibold ${
                      t.type === 'income' ? 'text-success-500' : 'text-slate-900'
                    }`}
                  >
                    {t.type === 'income' ? '+' : '−'}
                    {formatMoney(t.amount)}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
            {filtered.length === 0 &&
              (transactions.length === 0 ? (
                <EmptyState
                  title="Todavía no tienes movimientos"
                  body="Registra el primero a la izquierda o vincula tu cuenta en Cuentas para que lleguen solos."
                />
              ) : (
                <p className="px-5 py-8 text-center text-sm text-slate-500">Ningún movimiento coincide con el filtro.</p>
              ))}
          </Card>
        </section>
      </div>

      <TransactionKanban open={kanbanOpen} transactions={filtered} onClose={() => setKanbanOpen(false)} />
    </>
  )
}
