/**
 * Ring para la pregunta "¿cuánto del presupuesto se usó?".
 * Anillo fino (5px sobre 120px), sin etiquetas en el arco,
 * la cifra va fuera según el patrón del sheet.
 */
export default function Ring({
  ratio,
  size = 120,
  stroke = 5,
  color = 'var(--color-accent-500)',
}: {
  ratio: number
  size?: number
  stroke?: number
  color?: string
}) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const clamped = Math.min(1, Math.max(0, ratio))
  const filled = clamped * c
  const track = stroke * 0.4

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${Math.round(clamped * 100)}% del presupuesto usado`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-rule)" strokeWidth={track} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${filled} ${c - filled}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dasharray 900ms cubic-bezier(0.16, 1, 0.3, 1)' }}
      />
    </svg>
  )
}
