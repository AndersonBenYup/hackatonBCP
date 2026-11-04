import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import BrandChevrons from '@/components/BrandChevrons'
import type { LucideIcon } from 'lucide-react'
import GradientBlob from '@/components/public/GradientBlob'
import Card from '@/components/ui/Card'

const easeConfident = [0.16, 1, 0.3, 1] as const

interface Props {
  eyebrow: string
  title: string
  description: string
  icon: LucideIcon
  illustration: ReactNode
}

/**
 * Banner reutilizado en Nosotros/Giro/Planes/Aplicacion: misma energia del
 * hero del landing, pero cada pagina trae su propia ilustracion (prop
 * `illustration`) para que las cuatro no se vean como copias de la misma
 * plantilla.
 */
export default function PublicHero({ eyebrow, title, description, icon: Icon, illustration }: Props) {
  return (
    <section className="relative overflow-hidden bg-brand-900">
      <BrandChevrons className="pointer-events-none absolute -right-10 top-1/3 size-56 -translate-y-1/2 opacity-70 md:size-72" />
      <GradientBlob className="-left-16 -top-16 size-64" color="var(--color-accent-500)" opacity={0.25} />

      <div className="relative mx-auto grid max-w-[1000px] gap-8 px-4 py-14 md:grid-cols-[1fr_210px] md:items-center md:gap-10 md:px-8 md:py-16">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: easeConfident }}>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-accent-200">
            <Icon className="size-3.5" strokeWidth={2} />
            {eyebrow}
          </span>
          <h1 className="mt-4 max-w-xl text-[28px] font-extrabold leading-tight tracking-tight text-white sm:text-3xl md:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-brand-100">{description}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: easeConfident }}
          className="mx-auto w-full max-w-[220px] md:mx-0"
        >
          <Card className="border-white/10 bg-white/95 p-3">{illustration}</Card>
        </motion.div>
      </div>
    </section>
  )
}
