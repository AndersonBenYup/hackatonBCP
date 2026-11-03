/** Lista ordenada de barras: una sola tinta, el mayor primero. */
export default function BarList({
  rows,
  formatValue,
}: {
  rows: Array<{ label: string; value: number }>
  formatValue: (v: number) => string
}) {
  const max = Math.max(...rows.map((r) => r.value), 1)
  return (
    <ul className="space-y-4">
      {rows.map((row, i) => (
        <li key={row.label} className="space-y-1.5">
          <div className="flex items-baseline justify-between text-sm">
            <span className={`font-medium ${i === 0 ? 'text-slate-900' : 'text-slate-600'}`}>{row.label}</span>
            <span className="tabular text-sm font-semibold text-slate-900">{formatValue(row.value)}</span>
          </div>
          <div
            className="h-2.5 rounded-full"
            style={{
              width: `${row.value === 0 ? 0 : Math.max(4, (row.value / max) * 88)}%`,
              backgroundColor: i === 0 ? 'var(--color-accent-500)' : 'var(--color-brand-200)',
            }}
          />
        </li>
      ))}
    </ul>
  )
}
