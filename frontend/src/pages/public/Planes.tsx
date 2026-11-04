import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import {
  IconArrowRight,
  IconBadge,
  IconBank,
  IconChat,
  IconHandCoins,
  IconSparkles,
  IconSwap,
  IconTarget,
  IconTrophy,
} from '@/components/icons'
import GradientBlob from '@/components/public/GradientBlob'
import { SavingsIllustration } from '@/components/illustrations'
import PublicHero from '@/components/public/PublicHero'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

const easeConfident = [0.16, 1, 0.3, 1] as const

const included = [
  { icon: IconSwap, tint: 'var(--color-cat-blue-tint)', ink: 'var(--color-cat-blue-ink)', text: 'Registro de movimientos y categorías ilimitado' },
  { icon: IconTarget, tint: 'var(--color-cat-coral-tint)', ink: 'var(--color-cat-coral-ink)', text: 'Metas de ahorro con progreso automático al vincular tu cuenta' },
  { icon: IconTrophy, tint: 'var(--color-cat-amber-tint)', ink: 'var(--color-cat-amber-ink)', text: 'Retos gamificados con puntos, niveles y racha' },
  { icon: IconChat, tint: 'var(--color-cat-teal-tint)', ink: 'var(--color-cat-teal-ink)', text: 'Asistente de IA sobre tus propios datos' },
  { icon: IconBank, tint: 'var(--color-cat-green-tint)', ink: 'var(--color-cat-green-ink)', text: 'Vínculo bancario vía agregador (Yape, ahorros, tarjeta)' },
]

export default function Planes() {
  return (
    <>
      <PublicHero
        eyebrow="Planes"
        icon={IconSparkles}
        title="Gratis para ti, siempre"
        description="Finza no te cobra por entender tu plata. Nuestro modelo de negocio es B2B2C: el valor está en el banco aliado, no en tu bolsillo."
        illustration={<SavingsIllustration className="w-full" />}
      />

      <section className="relative mx-auto max-w-[900px] overflow-hidden px-4 py-16 md:px-8">
        <GradientBlob className="-right-24 top-0 size-72" color="var(--color-accent-200)" opacity={0.45} />

        <div className="relative grid gap-5 md:grid-cols-[1.1fr_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45, ease: easeConfident }}
          >
            <Card className="relative flex h-full flex-col overflow-hidden p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-success-50 px-2.5 py-1 text-[11px] font-semibold text-success-500">
                    Disponible hoy
                  </span>
                  <p className="mt-3 text-sm font-semibold text-slate-500">Plan Finza</p>
                  <p className="mt-1 text-3xl font-extrabold text-slate-900">
                    S/ 0<span className="text-base font-medium text-slate-500"> / siempre</span>
                  </p>
                </div>
              </div>

              <ul className="mt-6 space-y-3 text-sm text-slate-700">
                {included.map(({ icon: Icon, tint, ink, text }) => (
                  <li key={text} className="flex items-start gap-3">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: tint }}>
                      <Icon className="size-3.5" style={{ color: ink }} strokeWidth={2} />
                    </span>
                    <span className="pt-1 leading-tight">{text}</span>
                  </li>
                ))}
              </ul>
              <Link to="/registro" className="mt-6">
                <Button variant="primary" className="w-full">
                  Crear cuenta gratis
                  <IconArrowRight className="size-4" />
                </Button>
              </Link>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45, delay: 0.1, ease: easeConfident }}
          >
            <Card className="flex h-full flex-col border-dashed p-6">
              <div className="flex items-center gap-2">
                <IconHandCoins className="size-5 text-accent-600" />
                <p className="text-sm font-semibold text-slate-500">Para bancos aliados (visión, no construido aún)</p>
              </div>
              <p className="mt-3 text-base font-bold text-slate-900">Trust Score B2B2C</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Un banco aliado como BCP podría consultar un puntaje agregado de confianza financiera de usuarios que
                dieron su consentimiento explícito, para precalificación de crédito — nunca movimientos crudos. El
                costo de este servicio lo asumiría el banco, no el usuario.
              </p>
              <div className="mt-4 flex items-start gap-2 rounded-[14px] bg-brand-50/60 px-4 py-3">
                <IconBadge className="mt-0.5 size-4 shrink-0 text-brand-700" />
                <p className="text-[13px] leading-relaxed text-slate-600">
                  Requiere validación legal/regulatoria del lado del banco (SBS) antes de un piloto real — no es parte
                  de esta demo de hackathon.
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </>
  )
}
