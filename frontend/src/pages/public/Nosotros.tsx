import { motion } from 'motion/react'
import { IconGraduation, IconRocket, IconShield, IconSparkles, IconTarget } from '@/components/icons'
import { ChatAIIllustration } from '@/components/illustrations'
import GradientBlob from '@/components/public/GradientBlob'
import PublicHero from '@/components/public/PublicHero'
import Card from '@/components/ui/Card'

const principles = [
  {
    icon: IconGraduation,
    tint: 'var(--color-cat-blue-tint)',
    ink: 'var(--color-cat-blue-ink)',
    title: 'Enseñar haciendo, no exponiendo',
    body: 'Los conceptos financieros aterrizan a través de retos gamificados y un tracking que se siente real, no de contenido estático para leer.',
  },
  {
    icon: IconTarget,
    tint: 'var(--color-cat-coral-tint)',
    ink: 'var(--color-cat-coral-ink)',
    title: 'IA que habla de tu plata, no de la plata en general',
    body: 'El asistente responde sobre tus propios datos: tus movimientos, tus metas, tu presupuesto — nunca consejos genéricos desconectados de tu situación.',
  },
  {
    icon: IconShield,
    tint: 'var(--color-cat-teal-tint)',
    ink: 'var(--color-cat-teal-ink)',
    title: 'Diseñado para tu primer sueldo',
    body: 'Sin asumir que ya sabes de finanzas, en español, en soles, pensado para usarse desde el celular.',
  },
  {
    icon: IconRocket,
    tint: 'var(--color-cat-amber-tint)',
    ink: 'var(--color-cat-amber-ink)',
    title: 'La confianza de BCP, sin ser un banco',
    body: 'Tomamos prestada la identidad visual e institucional de BCP, el auspiciador del hackathon, pero Finza sigue siendo una app complementaria enfocada en educación, no una réplica de banca en línea.',
  },
]

const easeConfident = [0.16, 1, 0.3, 1] as const

export default function Nosotros() {
  return (
    <>
      <PublicHero
        eyebrow="Nosotros"
        icon={IconSparkles}
        title="Hecho para jóvenes que recién empiezan a manejar su propio dinero"
        description="Estudiantes universitarios y personas en su primer empleo en Perú: primer sueldo, primera tarjeta, primeras decisiones de ahorro que nunca tuvieron que tomar antes."
        illustration={<ChatAIIllustration className="w-full" />}
      />

      <section className="relative mx-auto max-w-[900px] overflow-hidden px-4 py-16 md:px-8">
        <GradientBlob className="-right-20 top-10 size-72" color="var(--color-brand-200)" opacity={0.4} />

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.4, ease: easeConfident }}
          className="relative max-w-2xl text-[15px] leading-relaxed text-slate-600"
        >
          Construimos este producto durante el <strong className="font-semibold text-slate-800">Innovathon BCP</strong>,
          un hackathon de 24 horas del Banco de Crédito del Perú enfocado en IA y educación financiera para jóvenes de
          LatAm. Nuestra meta: que alguien sin experiencia financiera previa termine entendiendo sus propios números y
          tomando mejores decisiones de ahorro y gasto — no por leer teoría, sino por usar la app con su propia plata.
        </motion.p>

        <div className="relative mt-10 grid gap-5 sm:grid-cols-2">
          {principles.map(({ icon: Icon, tint, ink, title, body }, i) => (
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
                <h2 className="mt-3 text-base font-bold text-slate-900">{title}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{body}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="relative mt-8 bg-brand-50/60 border-brand-100 p-5">
          <p className="text-[13px] leading-relaxed text-slate-600">
            Esta es una entrega de hackathon: el contexto inmediato de uso es la evaluación del jurado del Innovathon
            BCP, y el usuario final declarado (jóvenes de 18 a 25 años) es la audiencia de producto a largo plazo. No
            usamos testimonios, cifras de prensa ni casos de estudio inventados — lo que ves aquí es exactamente lo que
            construimos.
          </p>
        </Card>
      </section>
    </>
  )
}
