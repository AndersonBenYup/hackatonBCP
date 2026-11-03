import { useEffect, useState } from 'react'

interface Props {
  value: number
  max: number
  className?: string
  colorClassName?: string
}

export default function ProgressBar({ value, max, className = '', colorClassName = 'bg-brand-500' }: Props) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setWidth(pct))
    return () => cancelAnimationFrame(frame)
  }, [pct])

  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-rule ${className}`}>
      <div
        className={`h-full rounded-full transition-[width] duration-700 ease-out-confident ${colorClassName}`}
        style={{ width: `${width}%` }}
      />
    </div>
  )
}
