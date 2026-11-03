import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

/**
 * Panel del sistema pastel-consumer: superficie blanca, radio 20px,
 * borde 1px claro equivalent a un tono sobre el canvas. Sin sombra en reposo.
 */
export default function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-[20px] border border-line bg-white', className)} {...props} />
}
