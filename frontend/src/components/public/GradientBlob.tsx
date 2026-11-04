/** Mancha de color difuminada, puramente decorativa: le da profundidad al fondo sin usar fotos. */
export default function GradientBlob({
  className = '',
  color = 'var(--color-accent-300)',
  opacity = 0.35,
}: {
  className?: string
  color?: string
  opacity?: number
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute rounded-full blur-3xl ${className}`}
      style={{ backgroundColor: color, opacity }}
    />
  )
}
