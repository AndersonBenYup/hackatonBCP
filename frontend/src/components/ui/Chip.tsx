import type { CSSProperties } from 'react'

/**
 * Chip del sistema pastel: píldora con tinta pálida de la categoría
 * y texto en el oscuro del mismo matiz.
 */
export default function Chip({
  tint,
  ink,
  className = '',
  style,
  children,
}: {
  tint: string
  ink: string
  className?: string
  style?: CSSProperties
  children: React.ReactNode
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold leading-5 ${className}`}
      style={{ backgroundColor: tint, color: ink, ...style }}
    >
      {children}
    </span>
  )
}
