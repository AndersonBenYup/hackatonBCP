import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

const variants: Record<Variant, string> = {
  primary: 'bg-brand-700 text-white hover:bg-brand-800',
  secondary: 'bg-white text-brand-700 border border-control hover:border-brand-300 hover:bg-brand-50',
  ghost: 'text-slate-600 hover:bg-slate-100',
  danger: 'bg-white text-danger-500 border border-control hover:border-danger-500 hover:bg-danger-50',
}

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

export default function Button({ variant = 'primary', className = '', ...props }: Props) {
  return (
    <button
      className={cn(
        'inline-flex h-10 items-center justify-center gap-1.5 rounded-full px-4 text-sm font-semibold transition-[transform,background-color,border-color] duration-200 ease-out',
        'hover:-translate-y-px active:translate-y-0 active:scale-[0.97] active:duration-100 active:ease-out-confident',
        'disabled:pointer-events-none disabled:opacity-50 disabled:active:scale-100',
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}
