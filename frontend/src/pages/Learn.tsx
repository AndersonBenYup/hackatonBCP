import { motion } from 'motion/react'
import { IconCheckCircle, IconTarget, IconZap } from '@/components/icons'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import ProgressBar from '@/components/ui/ProgressBar'
import CountUp from '@/components/ui/CountUp'
import { useAccountData } from '@/hooks/useAccountData'

const POINTS_PER_LEVEL = 200

export default function Learn() {
  const { challenges, streakDays, completeChallenge: complete } = useAccountData()

  const done = challenges.filter((c) => c.completed)
  const points = done.reduce((sum, c) => sum + c.points, 0)
  const level = Math.floor(points / POINTS_PER_LEVEL) + 1
  const levelProgress = points % POINTS_PER_LEVEL

  return (
    <>
      <header className="pb-6 pt-1">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-[28px]">Aprende</h1>
        <p className="mt-1 text-sm text-slate-500">
          {done.length} de {challenges.length} retos completados · racha de {streakDays} días
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr] lg:items-start">
        {/* Tu progreso: la tarjeta de juego */}
        <div className="space-y-6 lg:sticky lg:top-8">
          <Card className="overflow-hidden p-5">
            <div className="flex items-baseline justify-between">
              <p className="text-xs text-slate-500">Tu nivel</p>
              <p className="tabular text-sm font-bold text-accent-700">
                <CountUp value={points} format={(v) => `${Math.round(v)} pts`} />
              </p>
            </div>
            <p className="tabular mt-1 text-3xl font-bold leading-tight text-slate-900">
              <CountUp value={level} format={(v) => String(Math.round(v))} />
            </p>
            <div className="mt-4 space-y-1.5">
              <ProgressBar value={levelProgress} max={POINTS_PER_LEVEL} colorClassName="bg-accent-500" />
              <p className="text-xs text-slate-500">
                {POINTS_PER_LEVEL - levelProgress} pts más y subes al nivel {level + 1}
              </p>
            </div>
          </Card>

          <Card className="flex items-start gap-3 border-accent-100 bg-accent-50 p-5">
            <IconZap className="mt-0.5 size-6 shrink-0 text-accent-600" strokeWidth={2} />
            <div>
              <p className="text-sm font-bold text-accent-800">Racha de {streakDays} días</p>
              <p className="mt-0.5 text-[13px] text-accent-800/80">
                Registra un movimiento hoy para no romper la cadena y ganar +10 pts extra.
              </p>
            </div>
          </Card>

          {/* Historial de la semana: la racha se ve, no solo se cuenta */}
          <Card className="p-5">
            <h2 className="text-sm font-bold text-slate-900">Tu racha esta semana</h2>
            <div className="mt-3 flex items-center justify-between px-0.5">
              {(['L', 'M', 'M', 'J', 'V', 'S', 'D'] as const).map((day, i) => {
                const active = i < Math.min(streakDays, 7)
                return (
                  <div key={i} className="flex flex-col items-center gap-1.5">
                    <span
                      className={`size-4 rounded-full ${active ? 'bg-accent-500' : 'border-2 border-dashed border-control bg-transparent'} flex items-center justify-center`}
                      aria-hidden
                    >
                      {active && <span className="size-1.5 rounded-full bg-white" />}
                    </span>
                    <span className="text-[11px] text-slate-400">{day}</span>
                  </div>
                )
              })}
            </div>
            <p className="mt-2.5 border-t border-rule pt-2.5 text-[13px] text-slate-500">
              {streakDays > 0
                ? `${Math.min(streakDays, 7)} de 7 días con al menos un registro. Hoy va contando para ${streakDays + 1}.`
                : 'Todavía no registras días seguidos. Registra un movimiento hoy para empezar tu racha.'}
            </p>
          </Card>
        </div>

        {/* Retos: cada uno con su estado, un dato: tácito tap the sign */}
        <section className="min-w-0 space-y-3">
          <div className="grid gap-3">
            {challenges.map((c) => (
              <Card
                key={c.id}
                className={`flex items-center justify-between gap-4 p-4 transition-colors duration-200 ${
                  c.completed ? 'bg-success-50/60 border-success-100' : 'hover:border-brand-300'
                }`}
              >
                <div className="flex min-w-0 items-start gap-3">
                  {c.completed ? (
                    <motion.span
                      className="mt-0.5 shrink-0"
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                    >
                      <IconCheckCircle className="size-5 text-success-500" strokeWidth={2} />
                    </motion.span>
                  ) : (
                    <IconTarget className="mt-0.5 size-5 shrink-0 text-slate-400" strokeWidth={1.75} />
                  )}
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold ${c.completed ? 'text-slate-500' : 'text-slate-900'}`}>
                      {c.title}
                    </p>
                    <p className="mt-0.5 text-[13px] text-slate-500">{c.description}</p>
                  </div>
                </div>
                {c.completed ? (
                  <span className="tabular shrink-0 rounded-full bg-success-100 px-2.5 py-1 text-xs font-bold text-success-600">
                    +{c.points} pts
                  </span>
                ) : (
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <Button variant="secondary" className="h-8 px-3 text-xs" onClick={() => complete(c.id)}>
                      Completar
                    </Button>
                    <span className="tabular text-xs font-semibold text-accent-700">+{c.points} pts</span>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Micro-lección IA */}
          <Card className="border-brand-100 bg-brand-50/50 p-5">
            <h2 className="flex items-center gap-2 text-base font-bold text-brand-900">
              <IconZap className="size-4.5 text-accent-600" strokeWidth={2} />
              Micro-lección del día
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              La <strong>TCEA</strong> te dice cuánto cuesta un crédito realmente al año, con todos los cargos
              incluidos. Antes de pedir un préstamo, compara siempre este número, no la cuota mensual.
            </p>
          </Card>
        </section>
      </div>
    </>
  )
}
