import type { ReactNode } from 'react'
import { EmptyStateIllustration } from '@/components/illustrations'

interface Props {
  title: string
  body: string
  action?: ReactNode
  className?: string
  illustrationClassName?: string
}

/** Estado vacío ilustrado, reutilizado donde antes había solo un ícono + una línea de texto. */
export default function EmptyState({ title, body, action, className = '', illustrationClassName = 'h-20 w-auto' }: Props) {
  return (
    <div className={`flex flex-col items-center gap-1.5 px-4 py-6 text-center ${className}`}>
      <EmptyStateIllustration className={illustrationClassName} />
      <p className="mt-1 text-sm font-semibold text-slate-700">{title}</p>
      <p className="max-w-[260px] text-[13px] leading-relaxed text-slate-500">{body}</p>
      {action}
    </div>
  )
}
