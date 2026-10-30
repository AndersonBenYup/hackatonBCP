import { Link } from 'react-router-dom'
import Card from '@/components/ui/Card'
import ProgressBar from '@/components/ui/ProgressBar'
import { mockGoals, mockStreakDays, mockTransactions } from '@/data/mock'
import { formatMoney } from '@/lib/format'

export default function Home() {
  const income = mockTransactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  const expenses = mockTransactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  const balance = income - expenses

  return (
    <>
      <Card className="bg-brand-500 text-white">
        <p className="text-sm text-brand-100">Saldo disponible</p>
        <p className="text-3xl font-bold">{formatMoney(balance)}</p>
        <div className="mt-3 flex justify-between text-sm">
          <span>Ingresos: {formatMoney(income)}</span>
          <span>Gastos: {formatMoney(expenses)}</span>
        </div>
      </Card>

      <Card className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Racha de registro</p>
          <p className="text-xl font-bold">🔥 {mockStreakDays} días</p>
        </div>
        <Link to="/aprende" className="text-sm font-semibold text-brand-600">
          Ver retos →
        </Link>
      </Card>

      <section className="space-y-2">
        <h2 className="font-semibold">Mis metas</h2>
        {mockGoals.map((goal) => (
          <Card key={goal.id} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{goal.name}</span>
              <span className="text-slate-500">
                {formatMoney(goal.saved)} / {formatMoney(goal.target)}
              </span>
            </div>
            <ProgressBar value={goal.saved} max={goal.target} />
          </Card>
        ))}
      </section>
    </>
  )
}
