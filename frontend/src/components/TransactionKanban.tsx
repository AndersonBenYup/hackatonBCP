import { useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { IconX } from '@/components/icons'
import { categoryStyles } from '@/data/mock'
import { formatDate, formatMoney } from '@/lib/format'
import type { Category, Transaction } from '@/types'

const CATEGORY_ORDER: Category[] = [
  'salario',
  'comida',
  'transporte',
  'servicios',
  'entretenimiento',
  'educacion',
  'otros',
]

interface Props {
  open: boolean
  transactions: Transaction[]
  onClose: () => void
}

export default function TransactionKanban({ open, transactions, onClose }: Props) {
  const columns = useMemo(() => {
    return CATEGORY_ORDER.map((category) => {
      const items = [...transactions]
        .filter((t) => t.category === category)
        .sort((a, b) => b.date.localeCompare(a.date))
      const net = items.reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0)
      return { category, items, net }
    }).filter((col) => col.items.length > 0)
  }, [transactions])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Clasificación de movimientos por categoría"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="flex max-h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-[24px] border border-line bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-rule px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Clasificación por categoría</h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  {transactions.length} {transactions.length === 1 ? 'movimiento' : 'movimientos'} agrupados en{' '}
                  {columns.length} {columns.length === 1 ? 'categoría' : 'categorías'}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className="flex size-9 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-600"
              >
                <IconX className="size-4.5" strokeWidth={2} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-x-auto overflow-y-hidden px-6 py-5">
              {columns.length === 0 ? (
                <p className="py-10 text-center text-sm text-slate-500">No hay movimientos para clasificar.</p>
              ) : (
                <div className="flex h-full gap-4">
                  {columns.map((col) => {
                    const style = categoryStyles[col.category]
                    return (
                      <div
                        key={col.category}
                        className="flex h-full w-64 shrink-0 flex-col rounded-[18px] p-3"
                        style={{ backgroundColor: style.tint }}
                      >
                        <div className="flex items-center justify-between px-1 pb-2">
                          <p className="text-sm font-bold" style={{ color: style.ink }}>
                            {style.label}
                          </p>
                          <span
                            className="rounded-full bg-white/70 px-2 py-0.5 text-[11px] font-bold"
                            style={{ color: style.ink }}
                          >
                            {col.items.length}
                          </span>
                        </div>
                        <p className="tabular px-1 pb-3 text-sm font-extrabold" style={{ color: style.ink }}>
                          {col.net >= 0 ? '+' : '−'}
                          {formatMoney(Math.abs(col.net))}
                        </p>

                        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-0.5">
                          <AnimatePresence initial={false}>
                            {col.items.map((t) => (
                              <motion.div
                                key={t.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.16 }}
                                className="rounded-[14px] bg-white p-3 shadow-sm"
                              >
                                <p className="truncate text-sm font-semibold text-slate-900">{t.description}</p>
                                <div className="mt-1.5 flex items-center justify-between gap-2">
                                  <span className="text-xs text-slate-500">{formatDate(t.date)}</span>
                                  <span
                                    className={`tabular shrink-0 whitespace-nowrap text-xs font-bold ${
                                      t.type === 'income' ? 'text-success-500' : 'text-slate-900'
                                    }`}
                                  >
                                    {t.type === 'income' ? '+' : '−'}
                                    {formatMoney(t.amount)}
                                  </span>
                                </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
