import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { LogoMark } from '@/layouts/AppLayout'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { useAuth } from '@/context/useAuth'
import { getErrorMessage } from '@/lib/get-error-message'
import { IconChevronLeft, IconShield } from '@/components/icons'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/app'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login({ email, password })
      navigate(from, { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* El campo de marca: azul BCP plano con el chevron coral en parada */}
      <section className="relative hidden overflow-hidden bg-brand-900 text-white lg:flex lg:flex-col lg:justify-center lg:gap-9">
        <ChevronsDrift className="pointer-events-none absolute -right-24 top-1/2 h-[560px] w-[560px] -translate-y-1/2" />

        <Link to="/" className="relative z-10 flex items-center gap-2.5 px-10 transition-opacity duration-150 hover:opacity-80">
          <LogoMark className="size-9" />
          <p className="text-lg font-extrabold tracking-tight">Finza</p>
        </Link>

        <div className="relative z-10 max-w-md px-10 text-white">
          <h2 className="text-3xl font-extrabold leading-[1.12] tracking-tight">
            Tu plata clara,
            <br /> tus metas en racha.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-brand-100">
            Registra tus gastos, sigue tu plan del mes y aprende a usar tu tarjeta — con retos y
            rachas que hacen que el ahorro se vuelva hábito.
          </p>
          <ul className="mt-5 space-y-2.5 text-sm text-brand-100">
            <li className="flex items-center gap-2.5">
              <IconShield className="size-4.5 shrink-0 text-accent-400" strokeWidth={2} />
              Pronóstico IA de tu fin de mes
            </li>
            <li className="flex items-center gap-2.5">
              <IconShield className="size-4.5 shrink-0 text-accent-400" strokeWidth={2} />
              Retos de ahorro con puntos y niveles
            </li>
            <li className="flex items-center gap-2.5">
              <IconShield className="size-4.5 shrink-0 text-accent-400" strokeWidth={2} />
              Tu saldo, tus metas y tus categorías en una sola vista
            </li>
          </ul>
          <p className="mt-5 text-xs text-brand-100/80">Demo del hackathon · sin datos bancarios reales</p>
        </div>
      </section>

      {/* El formulario */}
      <section className="flex flex-col items-center justify-center bg-canvas px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          <Link to="/" className="mb-7 flex flex-col items-center gap-3 text-center lg:hidden">
            <LogoMark className="size-11" />
            <p className="text-xl font-extrabold text-brand-900">Finza</p>
          </Link>

          <Link
            to="/"
            className="mb-4 hidden items-center gap-1.5 text-sm font-semibold text-slate-500 transition-colors duration-150 hover:text-brand-700 lg:flex"
          >
            <IconChevronLeft className="size-4" />
            Volver al inicio
          </Link>

          <Card className="p-6 md:p-8">
            <h1 className="text-xl font-extrabold text-slate-900">Inicia sesión</h1>
            <p className="mb-5 mt-1 text-sm text-slate-500">Y retoma tu racha donde la dejaste.</p>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <Input
                  label="Correo electrónico"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.14, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <Input
                  label="Contraseña"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </motion.div>
              {error && <p className="animate-fade-up text-sm font-medium text-danger-500">{error}</p>}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <Button type="submit" className="h-11 w-full" disabled={submitting}>
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Ingresando...
                    </span>
                  ) : (
                    <>
                      Ingresar
                      <span aria-hidden className="tabular text-sm opacity-50">
                        →
                      </span>
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          </Card>

          <p className="mt-6 text-center text-sm text-slate-600">
            ¿No tienes cuenta?{' '}
            <Link to="/registro" className="font-semibold text-brand-700 underline-offset-2 hover:underline">
              Regístrate
            </Link>
          </p>

          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-500">
            <IconShield className="size-3.5 text-accent-600" />
            Tus datos están protegidos · demo sin datos reales
          </p>
        </motion.div>
      </section>
    </div>
  )
}

/** Los dos chevrons del isotipo, enormes y a la deriva — el motivo de la marca. */
function ChevronsDrift({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 160 160" className={`animate-drift ${className}`} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M38 30 L82 80 L38 130" stroke="var(--color-brand-700)" strokeWidth="14" opacity="0.9" />
      <path d="M78 30 L122 80 L78 130" stroke="var(--color-accent-500)" strokeWidth="14" opacity="0.95" />
    </svg>
  )
}
