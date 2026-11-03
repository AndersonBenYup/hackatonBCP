import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { LogoMark } from '@/layouts/AppLayout'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { useAuth } from '@/context/useAuth'
import { getErrorMessage } from '@/lib/get-error-message'
import { IconShield } from '@/components/icons'

function validate(input: { name: string; email: string; password: string; confirmPassword: string }) {
  const errors: Partial<Record<'name' | 'email' | 'password' | 'confirmPassword', string>> = {}
  if (!input.name.trim()) errors.name = 'Ingresa tu nombre'
  if (!input.email.trim()) errors.email = 'Ingresa tu correo'
  if (!/^\S+@\S+\.\S+$/.test(input.email)) errors.email = 'Correo no válido'
  if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(input.password)) {
    errors.password = 'Mínimo 8 caracteres, con letras y números'
  }
  if (input.confirmPassword !== input.password) {
    errors.confirmPassword = 'Las contraseñas no coinciden'
  }
  return errors
}

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<Partial<Record<'name' | 'email' | 'password' | 'confirmPassword', string>>>({})
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErrors({})
    const validation = validate({ name, email, password, confirmPassword })
    if (Object.keys(validation).length > 0) {
      setErrors(validation)
      return
    }
    setError(null)
    setSubmitting(true)
    try {
      await register({ name: name.trim(), email, password })
      navigate('/', { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-canvas px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm"
      >
        <div className="mb-7 flex flex-col items-center gap-3 text-center">
          <LogoMark className="size-11" />
          <div>
            <h1 className="text-xl font-extrabold text-brand-900">Crea tu cuenta</h1>
            <p className="mt-1 text-sm text-slate-500">Empieza tu racha de ahorro hoy mismo.</p>
          </div>
        </div>

        <Card className="p-6 md:p-8">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input label="Nombre" name="name" required value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
            <Input label="Correo electrónico" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
            <Input
              label="Contraseña"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              aria-describedby="password-rule"
            />
            <p id="password-rule" className="-mt-2 text-xs text-slate-500">
              Mínimo 8 caracteres, con letras y números
            </p>
            <Input
              label="Confirma tu contraseña"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
            />
            {error && <p className="animate-fade-up text-sm font-medium text-danger-500">{error}</p>}
            <Button type="submit" className="h-11 w-full" disabled={submitting}>
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Creando cuenta...
                </span>
              ) : (
                'Crear cuenta'
              )}
            </Button>
          </form>
        </Card>

        <p className="mt-6 text-center text-sm text-slate-600">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-semibold text-brand-700 underline-offset-2 hover:underline">
            Inicia sesión
          </Link>
        </p>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-500">
          <IconShield className="size-3.5 text-accent-600" />
          Datos protegidos · demo sin datos reales
        </p>
      </motion.div>
    </div>
  )
}
