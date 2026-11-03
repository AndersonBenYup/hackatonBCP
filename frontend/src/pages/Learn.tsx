import { useState } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import ProgressBar from '@/components/ui/ProgressBar'
import { mockChallenges } from '@/data/mock'
import type { Challenge } from '@/types'

const POINTS_PER_LEVEL = 200

export default function Learn() {
  const [challenges, setChallenges] = useState<Challenge[]>(mockChallenges)

  const points = challenges.filter((c) => c.completed).reduce((sum, c) => sum + c.points, 0)
  const level = Math.floor(points / POINTS_PER_LEVEL) + 1

  const complete = (id: string) =>
    setChallenges((prev) => prev.map((c) => (c.id === id ? { ...c, completed: true } : c)))

  return (
    <>
      <Card className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Nivel</p>
            <p className="text-2xl font-bold">⭐ {level}</p>
          </div>
          <p className="text-sm font-semibold text-accent-500">{points} pts</p>
        </div>
        <ProgressBar value={points % POINTS_PER_LEVEL} max={POINTS_PER_LEVEL} />
        <p className="text-xs text-slate-500">
          {POINTS_PER_LEVEL - (points % POINTS_PER_LEVEL)} pts para el siguiente nivel
        </p>
      </Card>

      <section className="space-y-2">
        <h2 className="font-semibold">Retos</h2>
        {challenges.map((c, index) => (
          <Card
            key={c.id}
            className="animate-fade-up flex items-center justify-between gap-3"
            style={{ animationDelay: `${Math.min(index * 60, 240)}ms` }}
          >
            <div>
              <p
                className={`text-sm font-medium transition-colors duration-300 ${c.completed ? 'text-slate-400 line-through' : ''}`}
              >
                {c.title}
              </p>
              <p className="text-xs text-slate-500">{c.description}</p>
            </div>
            {c.completed ? (
              <span key={`${c.id}-done`} className="animate-pop text-sm text-success-500">
                ✓
              </span>
            ) : (
              <Button variant="secondary" className="shrink-0 text-xs" onClick={() => complete(c.id)}>
                +{c.points}
              </Button>
            )}
          </Card>
        ))}
      </section>
    </>
  )
}
