import { useEffect, useState } from 'react'

interface Props {
  value: number
  max: number
  className?: string
}

export default function ProgressBar({ value, max, className = '' }: Props) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setWidth(pct))
    return () => cancelAnimationFrame(frame)
  }, [pct])

  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-slate-200 ${className}`}>
      <div
        className="h-full rounded-full bg-brand-500 transition-[width] duration-700 ease-out-confident"
        style={{ width: `${width}%` }}
      />
    </div>
  )
}
