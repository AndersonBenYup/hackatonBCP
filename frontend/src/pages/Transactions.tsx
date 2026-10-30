import { useState, type FormEvent } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { mockTransactions } from '@/data/mock'
import { formatDate, formatMoney, uid } from '@/lib/format'
import type { Category, Transaction, TransactionType } from '@/types'

const categories: Category[] = ['comida', 'transporte', 'entretenimiento', 'educacion', 'servicios', 'salario', 'otros']

const today = () => new Date().toISOString().slice(0, 10)

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)
  const [type, setType] = useState<TransactionType>('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<Category>('comida')
  const [description, setDescription] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const value = Number(amount)
    if (!value || value <= 0) return
    setTransactions((prev) => [
      { id: uid(), type, amount: value, category, description: description || category, date: today() },
      ...prev,
    ])
    setAmount('')
    setDescription('')
  }

  return (
    <>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-3">
          <h2 className="font-semibold">Nuevo movimiento</h2>
          <div className="grid grid-cols-2 gap-2">
            {(['expense', 'income'] as const).map((t) => (
              <Button key={t} type="button" variant={type === t ? 'primary' : 'secondary'} onClick={() => setType(t)}>
                {t === 'expense' ? 'Gasto' : 'Ingreso'}
              </Button>
            ))}
          </div>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            placeholder="Monto (S/)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm capitalize outline-none focus:border-brand-500"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Descripción (opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
          />
          <Button type="submit" className="w-full">
            Agregar
          </Button>
        </form>
      </Card>

      <section className="space-y-2">
        <h2 className="font-semibold">Historial</h2>
        <Card className="divide-y divide-slate-100 p-0">
          {transactions.map((t) => (
            <div key={t.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-medium">{t.description}</p>
                <p className="text-xs capitalize text-slate-500">
                  {t.category} · {formatDate(t.date)}
                </p>
              </div>
              <span className={`text-sm font-semibold ${t.type === 'income' ? 'text-success-500' : 'text-danger-500'}`}>
                {t.type === 'income' ? '+' : '-'}
                {formatMoney(t.amount)}
              </span>
            </div>
          ))}
        </Card>
      </section>
    </>
  )
}
