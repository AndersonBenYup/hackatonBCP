import { motion } from 'motion/react'
import {
  IconBadge,
  IconBank,
  IconBuilding,
  IconChat,
  IconHandCoins,
  IconTarget,
} from '@/components/icons'
import GradientBlob from '@/components/public/GradientBlob'
import { BankLinkIllustration } from '@/components/illustrations'
import PublicHero from '@/components/public/PublicHero'
import Card from '@/components/ui/Card'

const easeConfident = [0.16, 1, 0.3, 1] as const

const today = [
  {
    icon: IconTarget,
    tint: 'var(--color-cat-blue-tint)',
    ink: 'var(--color-cat-blue-ink)',
    title: 'Educación financiera gamificada',
    body: 'Retos con puntos, niveles y racha diaria que enseñan conceptos reales: TCEA, fecha de corte vs. fecha de pago, interés compuesto.',
  },
  {
    icon: IconChat,
    tint: 'var(--color-cat-coral-tint)',
    ink: 'var(--color-cat-coral-ink)',
    title: 'Asistente de IA sobre datos propios',
    body: 'Un asistente conversacional que responde sobre tus movimientos, tus metas y tu presupuesto real, no consejos genéricos.',
  },
  {
    icon: IconBank,
    tint: 'var(--color-cat-teal-tint)',
    ink: 'var(--color-cat-teal-ink)',
    title: 'Vínculo bancario vía agregador',
    body: 'Conectas tu Yape, tu cuenta de ahorros o tu tarjeta a través de un conector intercambiable (hoy en modo simulador de demo, con la misma arquitectura que usaría un agregador real como Prometeo), y tus movimientos se registran solos.',
  },
]

const roadmap = [
  {
    icon: IconBuilding,
    title: 'Hub financiero conectado',
    body: 'El progreso de tus metas se calcula automáticamente a partir de tus movimientos reales, sin que anotes nada a mano.',
  },
  {
    icon: IconHandCoins,
    title: 'Trust Score y modelo B2B2C',
    body: 'Esa misma data, agregada y con tu consentimiento explícito, puede alimentar un puntaje de confianza financiera que bancos aliados consulten para precalificación de crédito — el canal de negocio que conecta a BCP con el usuario joven.',
  },
  {
    icon: IconBadge,
    title: 'Consentimiento siempre explícito',
    body: 'Nunca se comparte un movimiento crudo con un tercero: solo un score agregado, con consentimiento revocable en cualquier momento.',
  },
]

export default function Giro() {
  return (
    <>
      <PublicHero
        eyebrow="Giro"
        icon={IconBuilding}
        title="A qué nos dedicamos"
        description="Educación financiera con inteligencia artificial para jóvenes que recién manejan su propio dinero. No damos créditos, no somos un banco ni una billetera digital."
        illustration={<BankLinkIllustration className="w-full" />}
      />

      <section className="relative mx-auto max-w-[900px] overflow-hidden px-4 py-16 md:px-8">
        <GradientBlob className="-left-24 top-24 size-80" color="var(--color-cat-teal-tint)" opacity={0.6} />

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.4, ease: easeConfident }}
          className="relative max-w-2xl text-[15px] leading-relaxed text-slate-600"
        >
          Ayudamos a entender y organizar la plata que ya tienes, con un agregador de datos bancarios para leer tus
          movimientos reales en vez de que los anotes a mano.
        </motion.p>

        <h2 className="relative mt-10 text-lg font-bold text-slate-900">Lo que ya construimos</h2>
        <div className="relative mt-4 grid gap-5 sm:grid-cols-3">
          {today.map(({ icon: Icon, tint, ink, title, body }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: easeConfident }}
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

        <h2 className="relative mt-12 text-lg font-bold text-slate-900">Hacia dónde vamos</h2>
        <p className="relative mt-1 text-sm text-slate-500">Visión de producto / roadmap — todavía no construido.</p>
        <div className="relative mt-4 grid gap-5 sm:grid-cols-3">
          {roadmap.map(({ icon: Icon, title, body }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: easeConfident }}
            >
              <Card className="h-full border-dashed p-5">
                <div className="flex size-10 items-center justify-center rounded-full bg-accent-50">
                  <Icon className="size-5 text-accent-600" strokeWidth={1.75} />
                </div>
                <h3 className="mt-3 text-sm font-bold text-slate-900">{title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600">{body}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  )
}
