import type { InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export default function Input({ label, error, id, className = '', ...props }: Props) {
  const inputId = id ?? props.name
  return (
    <label className="block space-y-1" htmlFor={inputId}>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        id={inputId}
        className={`w-full rounded-xl border px-3 py-2 text-sm outline-none transition duration-150 focus:ring-2 focus:ring-brand-500 ${
          error ? 'border-danger-500' : 'border-slate-200'
        } ${className}`}
        aria-invalid={Boolean(error)}
        {...props}
      />
      {error && <p className="text-xs text-danger-500">{error}</p>}
    </label>
  )
}
