import { Link } from 'react-router-dom'
import Card from '@/components/ui/Card'

export default function NotFound() {
  return (
    <Card className="space-y-2 text-center">
      <p className="text-4xl">🧭</p>
      <p className="font-semibold">Página no encontrada</p>
      <Link to="/" className="text-sm font-semibold text-brand-600">
        Volver al inicio
      </Link>
    </Card>
  )
}
