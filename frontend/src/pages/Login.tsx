import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { useAuth } from '@/context/useAuth'
import { getErrorMessage } from '@/lib/get-error-message'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/'

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
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-4 p-4">
      <div className="text-center">
        <h1 className="text-xl font-bold text-brand-900">Finanzas IA</h1>
        <p className="text-sm text-slate-500">Inicia sesion para continuar</p>
      </div>

      <Card className="space-y-4">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Correo electronico"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Contrasena"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="animate-fade-up text-sm text-danger-500">{error}</p>}
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="size-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Ingresando...
              </span>
            ) : (
              'Ingresar'
            )}
          </Button>
        </form>
      </Card>

      <p className="text-center text-sm text-slate-500">
        ¿No tienes cuenta?{' '}
        <Link to="/registro" className="font-semibold text-brand-600">
          Registrate
        </Link>
      </p>
    </div>
  )
}
