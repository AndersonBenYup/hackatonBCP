import { useEffect, useRef, useState } from 'react'
import { animate } from 'motion/react'

interface Props {
  value: number
  format?: (v: number) => string
  duration?: number
  className?: string
}

/**
 * Cifra que cuenta hasta su valor. Es feedback de datos que llegan,
 * no una entrada decorada: el número final siempre es el real.
 */
export default function CountUp({ value, format, duration = 0.9, className = '' }: Props) {
  const fmt = format ?? ((v: number) => v.toLocaleString('es-PE'))
  const [display, setDisplay] = useState(value)
  const previous = useRef(0)

  useEffect(() => {
    const controls = animate(previous.current, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    })
    previous.current = value
    return () => controls.stop()
  }, [value, duration])

  return (
    <span className={`tabular ${className}`} aria-live="off">
      {fmt(display)}
    </span>
  )
}
