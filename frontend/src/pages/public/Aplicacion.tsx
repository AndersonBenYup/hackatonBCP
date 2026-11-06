import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import {
  IconArrowRight,
  IconBank,
  IconChat,
  IconFlame,
  IconSmartphone,
  IconTarget,
  IconTrendingUp,
  IconTrophy,
} from '@/components/icons'
import GradientBlob from '@/components/public/GradientBlob'
import { TrophyIllustration } from '@/components/illustrations'
import PublicHero from '@/components/public/PublicHero'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import ProgressBar from '@/components/ui/ProgressBar'
import Ring from '@/components/charts/Ring'

const easeConfident = [0.16, 1, 0.3, 1] as const

const tour = [
  {
    icon: IconTarget,
    tint: 'var(--color-cat-blue-tint)',
    ink: 'var(--color-cat-blue-ink)',
    title: 'Inicio',
    body: 'Tu saldo, tu plan del mes y tu gasto por categoría, todo en una pantalla.',
  },
  {
    icon: IconTrendingUp,
    tint: 'var(--color-cat-coral-tint)',
    ink: 'var(--color-cat-coral-ink)',
    title: 'Movimientos y pronóstico',
    body: 'Historial por categoría y una proyección simple de fin de mes para saber cuánto te queda por día.',
  },
  {
    icon: IconBank,
    tint: 'var(--color-cat-teal-tint)',
    ink: 'var(--color-cat-teal-ink)',
    title: 'Cuentas',
    body: 'Vincula Yape, tu cuenta de ahorros o tu tarjeta vía un agregador de datos bancarios: tus movimientos llegan solos.',
  },
  {
    icon: IconChat,
    tint: 'var(--color-cat-amber-tint)',
    ink: 'var(--color-cat-amber-ink)',
    title: 'Asistente IA',
    body: 'Pregúntale sobre tus propios números: cuánto gastaste, cómo vas con tu meta, qué significa la TCEA.',
  },
  {
    icon: IconTrophy,
    tint: 'var(--color-cat-green-tint)',
    ink: 'var(--color-cat-green-ink)',
    title: 'Retos',
    body: 'Aprende conceptos financieros reales jugando: puntos, niveles y racha diaria.',
  },
]

export default function Aplicacion() {
  return (
    <>
      <PublicHero
        eyebrow="Aplicación"
        icon={IconSmartphone}
        title="Un recorrido rápido por Finza"
        description="Así se ve la app por dentro, apenas creas tu cuenta."
        illustration={<TrophyIllustration className="w-full" />}
      />

      <section className="relative mx-auto max-w-[1100px] overflow-hidden px-4 py-16 md:px-8">
        <GradientBlob className="-left-20 top-40 size-72" color="var(--color-brand-200)" opacity={0.4} />

        <div className="relative grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
          <div className="grid gap-4 sm:grid-cols-2">
            {tour.map(({ icon: Icon, tint, ink, title, body }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: i * 0.06, ease: easeConfident }}
              >
                <Card className="h-full p-5 transition-transform duration-200 ease-out hover:-translate-y-0.5">
                  <div className="flex size-10 items-center justify-center rounded-full" style={{ backgroundColor: tint }}>
                    <Icon className="size-5" style={{ color: ink }} strokeWidth={1.75} />
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-slate-900">{title}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600">{body}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45, ease: easeConfident }}
          >
            <Card className="p-5">
              <p className="text-sm font-medium text-slate-500">Vista previa · Inicio</p>
              <div className="mt-3 flex items-center gap-3 rounded-[14px] bg-accent-50 px-4 py-3">
                <IconFlame className="size-6 shrink-0 text-accent-600" strokeWidth={2} />
                <p className="text-sm font-bold text-accent-800">4 días de racha</p>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <Ring ratio={0.62} />
                <div>
                  <p className="text-lg font-bold text-slate-900">62% del presupuesto</p>
                  <p className="text-xs text-slate-500">S/ 15.50/día para los 16 días que restan</p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="space-y-1.5">
                  <p className="text-sm font-medium text-slate-800">Laptop nueva</p>
                  <ProgressBar value={1800} max={3000} className="h-1.5" />
                </div>
                <div className="space-y-1.5">
                  <p className="text-sm font-medium text-slate-800">Fondo de emergencia</p>
                  <ProgressBar value={450} max={1000} className="h-1.5" />
                </div>
              </div>
              <p className="mt-4 text-[11px] text-slate-400">Vista ilustrativa, no son datos de un usuario real.</p>
            </Card>
          </motion.div>
        </div>

        <Card className="relative mt-10 flex flex-col items-center gap-4 bg-brand-50/60 border-brand-100 p-8 text-center md:p-12">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">¿Lo probamos?</h2>
          <p className="max-w-md text-sm text-slate-600">Crea tu cuenta gratis y entra directo a tu propio Inicio.</p>
          <Link to="/registro">
            <Button variant="primary" className="h-11 px-6">
              Crear cuenta gratis
              <IconArrowRight className="size-4" />
            </Button>
          </Link>
        </Card>
      </section>
    </>
  )
}
