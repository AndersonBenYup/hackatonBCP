import { Link } from 'react-router-dom'
import { IconCompass } from '@/components/icons'

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-canvas p-4 text-center">
      <span className="flex size-14 items-center justify-center rounded-[20px] bg-accent-50">
        <IconCompass className="size-7 text-accent-600" strokeWidth={1.75} />
      </span>
      <h1 className="text-2xl font-extrabold text-slate-900">Página no encontrada</h1>
      <p className="max-w-xs text-sm text-slate-500">Esta ruta no existe. Vuelve al inicio para seguir con tu plan del mes.</p>
      <Link to="/" className="mt-1 rounded-full bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:bg-brand-800">
        Volver al inicio
      </Link>
    </div>
  )
}
