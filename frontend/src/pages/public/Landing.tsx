import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import BrandChevrons from '@/components/BrandChevrons'
import {
  IconArrowRight,
  IconBank,
  IconFlame,
  IconShield,
  IconSparkles,
  IconTrophy,
  IconZap,
} from '@/components/icons'
import GradientBlob from '@/components/public/GradientBlob'
import { ChatAIIllustration, GrowthIllustration, TrophyIllustration } from '@/components/illustrations'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import ProgressBar from '@/components/ui/ProgressBar'

const easeConfident = [0.16, 1, 0.3, 1] as const

const scenes = [
  {
    Illustration: GrowthIllustration,
    title: 'Aprendes jugando',
    body: 'Retos reales de TCEA, interés compuesto y fecha de corte que te suben de nivel, no un PDF para leer.',
  },
  {
    Illustration: ChatAIIllustration,
    title: 'Preguntas y te responde',
    body: 'Con tus propios números: "¿en qué gasto más?", "¿me alcanza para mi meta?" — no consejos genéricos.',
  },
  {
    Illustration: TrophyIllustration,
    title: 'Ahorras en racha',
    body: 'Cada día que registras suma a tu racha y a tus puntos: el hábito se siente como un juego, no una tarea.',
  },
]

const steps = [
  { icon: IconBank, title: 'Vincula tu cuenta', body: 'Yape, ahorros o tarjeta, vía un agregador — tú decides qué compartir.' },
  { icon: IconZap, title: 'Tus movimientos llegan solos', body: 'Se categorizan automáticamente, sin que anotes nada a mano.' },
  { icon: IconTrophy, title: 'Aprende y ahorra en racha', body: 'Retos con puntos y un asistente IA que conoce tus propios números.' },
]

export default function Landing() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-900">
        <BrandChevrons className="pointer-events-none absolute -right-8 top-1/2 size-64 -translate-y-1/2 md:size-96" />
        <GradientBlob className="-left-24 top-0 size-80" color="var(--color-accent-500)" opacity={0.3} />
        <GradientBlob className="bottom-0 left-1/3 size-72" color="var(--color-brand-500)" opacity={0.35} />

        <div className="relative mx-auto max-w-[1200px] px-4 py-16 md:px-8 md:py-24">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: easeConfident }}
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-accent-200">
                <IconSparkles className="size-3.5" />
                Innovathon BCP · educación financiera
              </span>
              <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-white md:text-5xl">
                Tu primer sueldo, tus primeras decisiones de plata.
              </h1>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-brand-100">
                Finza te ayuda a entender y organizar tu dinero: registra tus movimientos, proyecta tu fin de mes,
                aprende con retos gamificados y pregúntale a un asistente de IA sobre tus propios números.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/registro">
                  <Button variant="primary" className="h-11 px-5">
                    Crear cuenta gratis
                    <IconArrowRight className="size-4" />
                  </Button>
                </Link>
                <Link to="/aplicacion">
                  <Button variant="secondary" className="h-11 bg-transparent px-5 text-white hover:bg-white/10">
                    Ver cómo funciona
                  </Button>
                </Link>
              </div>
              <p className="mt-5 flex items-center gap-1.5 text-xs text-brand-200">
                <IconShield className="size-3.5" />
                Pensado para jóvenes de 18 a 25 años en Perú, en soles, en español.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: easeConfident }}
              className="relative"
            >
              {/* Chips flotantes: la señal de vida alrededor de la tarjeta */}
              <motion.span
                aria-hidden
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -left-4 -top-5 z-10 hidden items-center gap-1.5 rounded-full bg-white px-3 py-2 text-xs font-bold text-accent-700 shadow-lg sm:flex"
              >
                <IconFlame className="size-4 text-accent-500" strokeWidth={2} />4 días de racha
              </motion.span>
              <motion.span
                aria-hidden
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                className="absolute -bottom-4 -right-3 z-10 hidden items-center gap-1.5 rounded-full bg-white px-3 py-2 text-xs font-bold text-brand-700 shadow-lg sm:flex"
              >
                <IconTrophy className="size-4 text-accent-500" strokeWidth={2} />
                +50 pts
              </motion.span>

              <Card className="relative p-5">
                <p className="text-sm font-medium text-slate-500">Plan del mes</p>
                <div className="mt-3 flex items-center gap-3 rounded-[14px] bg-accent-50 px-4 py-3">
                  <IconFlame className="size-6 shrink-0 text-accent-600" strokeWidth={2} />
                  <p className="text-sm font-bold text-accent-800">4 días de racha registrando</p>
                </div>
                <div className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-800">Laptop nueva</p>
                    <ProgressBar value={1800} max={3000} className="h-1.5" />
                    <p className="tabular text-xs text-slate-500">S/ 1,800 de S/ 3,000</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-800">Fondo de emergencia</p>
                    <ProgressBar value={450} max={1000} className="h-1.5" />
                    <p className="tabular text-xs text-slate-500">S/ 450 de S/ 1,000</p>
                  </div>
                </div>
                <Link
                  to="/aplicacion"
                  className="group mt-5 flex items-center justify-between rounded-[14px] border border-line px-4 py-3 text-sm font-semibold text-brand-800 transition-colors duration-150 hover:border-brand-300 hover:bg-brand-50"
                >
                  <span className="flex items-center gap-2">
                    <IconTrophy className="size-4.5 text-accent-600" />
                    Así se ve dentro de la app
                  </span>
                  <IconArrowRight className="size-4 text-slate-400 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
                </Link>
                <p className="mt-3 text-[11px] text-slate-400">Vista ilustrativa, no son datos de un usuario real.</p>
              </Card>
            </motion.div>
          </div>

          {/* Tres escenas ilustradas en vez de cifras sueltas: lo que de verdad vives en la app */}
          <div className="relative mt-14 grid gap-5 border-t border-white/10 pt-10 sm:grid-cols-3">
            {scenes.map(({ Illustration, title, body }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.1, ease: easeConfident }}
                className="rounded-[20px] bg-white/[0.06] p-4"
              >
                <div className="overflow-hidden rounded-[14px] bg-white/95">
                  <Illustration className="h-24 w-full" />
                </div>
                <h3 className="mt-3 text-sm font-bold text-white">{title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-brand-200">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo funciona: 3 pasos con línea conectora */}
      <section className="relative overflow-hidden px-4 py-16 md:px-8">
        <GradientBlob className="right-0 top-1/2 size-72 -translate-y-1/2" color="var(--color-cat-blue-tint)" opacity={0.7} />
        <div className="relative mx-auto max-w-[1000px]">
          <h2 className="text-center text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
            Así funciona, de punta a punta
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-center text-sm text-slate-600">
            No es un tracker de gastos genérico: combina educación financiera gamificada con un asistente de IA que
            responde sobre tu situación, no consejos desconectados de tus números.
          </p>
          <div className="relative mt-10 grid gap-8 md:grid-cols-3">
            <div className="absolute left-0 right-0 top-6 hidden border-t border-dashed border-line md:block" aria-hidden />
            {steps.map(({ icon: Icon, title, body }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: i * 0.12, ease: easeConfident }}
                className="relative flex flex-col items-center text-center"
              >
                <span className="relative flex size-12 items-center justify-center rounded-full bg-brand-700 text-white shadow-md">
                  <Icon className="size-5" strokeWidth={1.75} />
                  <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-accent-500 text-[10px] font-bold text-white">
                    {i + 1}
                  </span>
                </span>
                <h3 className="mt-4 text-base font-bold text-slate-900">{title}</h3>
                <p className="mt-1.5 max-w-[240px] text-sm leading-relaxed text-slate-600">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="mx-auto max-w-[1200px] px-4 pb-20 md:px-8">
        <Card className="relative overflow-hidden flex flex-col items-center gap-4 bg-brand-50/60 border-brand-100 p-8 text-center md:p-12">
          <GradientBlob className="-right-10 -top-10 size-48" color="var(--color-accent-200)" opacity={0.5} />
          <h2 className="relative text-2xl font-extrabold tracking-tight text-slate-900">
            Empieza a entender tu plata hoy
          </h2>
          <p className="relative max-w-md text-sm text-slate-600">
            Crear tu cuenta toma un minuto. Sin tarjeta, sin compromiso: es gratis para ti.
          </p>
          <Link to="/registro" className="relative">
            <Button variant="primary" className="h-11 px-6">
              Crear cuenta gratis
            </Button>
          </Link>
        </Card>
      </section>
    </>
  )
}
