import { useEffect, useState } from 'react'

interface Point {
  day: number
  spent: number
}

/**
 * Gráfico de línea acumulada: pasado sólido (una serie, una tinta),
 * proyección punteada tras hoy con su cifra al final, línea de presupuesto
 * de referencia y punto de hoy. Reglas del capítulo 6: sin leyenda de una
 * serie, ticks pares (4-6), sin marcadores excepto hoy.
 */
export default function CumulativeChart({
  past,
  totalDays,
  today,
  monthlyBudget,
  projectionEnd,
  monthLabel,
  formatMoney,
}: {
  past: Point[]
  totalDays: number
  today: number
  monthlyBudget: number
  projectionEnd: number
  monthLabel: string
  formatMoney: (v: number) => string
}) {
  const H = 280
  const W = 760
  const padL = 64
  const padR = 16
  const padT = 18
  const padB = 30
  const [drawn, setDrawn] = useState(false)

  const spentToday = past.length ? past[past.length - 1].spent : 0

  // Escala vertical: ticks pares por encima del máximo de las tres series.
  const rawMax = Math.max(monthlyBudget, projectionEnd, spentToday)
  const step = rawMax > 1600 ? 500 : rawMax > 800 ? 250 : rawMax > 400 ? 200 : 100
  const yMax = Math.max(step, Math.ceil(rawMax / step) * step)
  const ticks = Array.from({ length: Math.floor(yMax / step) + 1 }, (_, i) => i * step)

  const x = (day: number) => padL + ((day - 1) / (totalDays - 1)) * (W - padL - padR)
  const y = (v: number) => padT + (1 - v / yMax) * (H - padT - padB)

  // Pasado: valor acumulado a cada día.
  let acc = 0
  let index = 0
  const pastPathPts: string[] = []
  for (let day = 1; day <= today; day++) {
    while (index < past.length && past[index].day <= day) {
      acc = past[index].spent
      index += 1
    }
    if (day === 1 || acc !== lastAcc(pastPathPts)) {
      pastPathPts.push(`${x(day).toFixed(1)} ${y(acc).toFixed(1)}`)
    }
  }
  function lastAcc(pts: string[]): number {
    const last = pts[pts.length - 1]
    return last ? Number(last.split(' ')[1]) : -1
  }
  if (!pastPathPts.length) pastPathPts.push(`${x(1).toFixed(1)} ${y(0).toFixed(1)}`)

  const p0 = `${x(today).toFixed(1)} ${y(spentToday).toFixed(1)}`
  const p1 = `${x(totalDays).toFixed(1)} ${y(projectionEnd).toFixed(1)}`

  const pastPath = `M ${pastPathPts.join(' L ')}`
  const forecastPath = `M ${p0} L ${p1}`

  useEffect(() => {
    const id = requestAnimationFrame(() => setDrawn(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const xLabels = [1, 8, 15, 22, totalDays]

  return (
    <div className="relative">
      <div className="relative h-[260px] w-full md:h-[280px]">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          {/* Gridlines horizontales */}
          {ticks.slice(1).map((t) => (
            <line key={t} x1={padL} x2={W - padR} y1={y(t)} y2={y(t)} stroke="var(--color-rule)" strokeWidth={1} vectorEffect="non-scaling-stroke" />
          ))}
          {/* Presupuesto: referencia */}
          <line
 x1={x(1)} x2={x(totalDays)} y1={y(monthlyBudget / totalDays)} y2={y(monthlyBudget)}
            stroke="var(--color-cat-slate-ink)" strokeWidth={1} strokeDasharray="3 3" opacity={0.55} vectorEffect="non-scaling-stroke"
          />
          {/* Pasado sólido */}
          <path
            d={pastPath}
            fill="none"
            stroke="var(--color-accent-500)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            pathLength={drawn ? 1 : 0.0001}
            style={{
              strokeDasharray: 1,
              strokeDashoffset: drawn ? 0 : 1,
              transition: 'stroke-dashoffset 1100ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
          {/* Proyección punteada tras hoy */}
          <path
            d={forecastPath}
            fill="none"
            stroke="var(--color-accent-500)"
            strokeWidth={2}
            strokeDasharray="6 5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            opacity={drawn ? 0.75 : 0}
            style={{ transition: 'opacity 400ms ease 900ms' }}
          />
        </svg>

        {/* Punto de hoy */}
        <span
          className="absolute z-10 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4 ring-white"
          style={{
            left: `${(x(today) / W) * 100}%`,
            top: `${(y(spentToday) / H) * 100}%`,
            backgroundColor: 'var(--color-accent-600)',
            transition: 'left 900ms ease, top 900ms ease',
          }}
          aria-hidden
        />

        {/* Etiqueta de proyección (fin del mes) */}
        <span
          className="tabular pointer-events-none absolute rounded-lg bg-accent-50 px-2 py-1 text-xs font-semibold text-accent-800"
          style={{ right: 4, top: `${Math.min(94, Math.max(2, (y(projectionEnd) / H) * 100))}%` }}
        >
          fin · {formatMoney(projectionEnd)}
        </span>
      </div>

      {/* Etiquetas eje Y (HTML, fuera del SVG escalado) */}
      <div className="pointer-events-none absolute left-0 top-0 hidden h-[260px] w-full sm:block md:h-[280px]">
        {ticks.map((t) => (
          <span
            key={t}
            className="tabular absolute left-0 -translate-y-1/2 text-[11px] text-slate-500"
            style={{ top: `${(y(t) / H) * 100}%` }}
          >
            {t}
          </span>
        ))}
      </div>

      {/* Etiquetas eje X */}
      <div className="pointer-events-none relative mt-1 h-5">
        {xLabels.map((d) => (
          <span
            key={d}
            className="tabular absolute whitespace-nowrap text-[11px] text-slate-500"
            style={{
              left: `${((x(d) / W) * 100).toFixed(1)}%`,
              transform: `translateX(${d === 1 ? 0 : d === totalDays ? '-100%' : '-50%'})`,
            }}
          >
            {d === totalDays ? `${totalDays} · fin` : `${d} ${monthLabel}`}
          </span>
        ))}
      </div>
    </div>
  )
}
