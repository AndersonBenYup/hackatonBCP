import type { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export default function Input({ label, error, id, className = '', ...props }: Props) {
  const inputId = id ?? props.name
  return (
    <label className="block space-y-1.5" htmlFor={inputId}>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        id={inputId}
        className={cn(
          'h-11 w-full rounded-xl border bg-white px-3.5 text-sm outline-none transition-colors duration-150',
          'placeholder:text-neutral-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100',
          error ? 'border-danger-500' : 'border-control hover:border-neutral-300',
          className,
        )}
        aria-invalid={Boolean(error)}
        {...props}
      />
      {error && <p className="animate-fade-up text-xs font-medium text-danger-500">{error}</p>}
    </label>
  )
}
