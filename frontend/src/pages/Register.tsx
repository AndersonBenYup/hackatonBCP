import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { useAuth } from '@/context/useAuth'
import { getErrorMessage } from '@/lib/get-error-message'

const PASSWORD_RULE = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/

function validate(input: { name: string; email: string; password: string; confirmPassword: string }) {
  const errors: Partial<Record<'name' | 'email' | 'password' | 'confirmPassword', string>> = {}

  if (input.name.trim().length < 2) {
    errors.name = 'Ingresa tu nombre completo'
  }
  if (!/^\S+@\S+\.\S+$/.test(input.email)) {
    errors.email = 'Correo invalido'
  }
  if (!PASSWORD_RULE.test(input.password)) {
    errors.password = 'Minimo 8 caracteres, con letras y numeros'
  }
  if (input.confirmPassword !== input.password) {
    errors.confirmPassword = 'Las contrasenas no coinciden'
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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setFormError(null)

    const errors = validate({ name, email, password, confirmPassword })
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) {
      return
    }

    setSubmitting(true)
    try {
      await register({ name: name.trim(), email, password })
      navigate('/', { replace: true })
    } catch (err) {
      setFormError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-4 p-4">
      <div className="text-center">
        <h1 className="text-xl font-bold text-brand-900">Crea tu cuenta</h1>
        <p className="text-sm text-slate-500">Empieza a aprender y organizar tus finanzas</p>
      </div>

      <Card className="space-y-4">
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <Input
            label="Nombre completo"
            name="name"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={fieldErrors.name}
          />
          <Input
            label="Correo electronico"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={fieldErrors.email}
          />
          <Input
            label="Contrasena"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={fieldErrors.password}
          />
          <Input
            label="Confirma tu contrasena"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={fieldErrors.confirmPassword}
          />
          {formError && <p className="animate-fade-up text-sm text-danger-500">{formError}</p>}
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="size-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Creando cuenta...
              </span>
            ) : (
              'Crear cuenta'
            )}
          </Button>
        </form>
      </Card>

      <p className="text-center text-sm text-slate-500">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="font-semibold text-brand-600">
          Inicia sesion
        </Link>
      </p>
    </div>
  )
}
