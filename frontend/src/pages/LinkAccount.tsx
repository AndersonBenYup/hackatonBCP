import { useEffect, useState } from 'react'
import BankAggregatorFlow from '@/components/BankAggregatorFlow'
import { IconBank, IconShield } from '@/components/icons'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { banks } from '@/data/banks'
import { useAccountData } from '@/hooks/useAccountData'
import { bankingApi } from '@/lib/banking-api'
import { getErrorMessage } from '@/lib/get-error-message'
import type { BankConnection } from '@/types/banking'

const accountLabels: Record<BankConnection['accounts'][number]['type'], string> = {
  yape: 'Yape',
  ahorros: 'Cuenta de ahorros',
  tarjeta: 'Tarjeta de credito',
}

export default function LinkAccount() {
  const { refreshBankTransactions } = useAccountData()
  const [connections, setConnections] = useState<BankConnection[]>([])
  const [loading, setLoading] = useState(true)
  const [flowOpen, setFlowOpen] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [syncMessage, setSyncMessage] = useState<string | null>(null)

  useEffect(() => {
    bankingApi
      .list()
      .then(setConnections)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  function handleLinked(connection: BankConnection) {
    setConnections((prev) => [connection, ...prev])
  }

  async function handleSync(connectionId: string) {
    setError(null)
    setSyncMessage(null)
    setBusyId(connectionId)
    try {
      const result = await bankingApi.sync(connectionId)
      await refreshBankTransactions()
      setSyncMessage(
        result.synced > 0
          ? `Llegaron ${result.synced} movimientos nuevos. Ya están en Movimientos, Inicio y Pronóstico.`
          : 'Todo al día: no hay movimientos nuevos.',
      )
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setBusyId(null)
    }
  }

  async function handleRevoke(connectionId: string) {
    setError(null)
    setBusyId(connectionId)
    try {
      await bankingApi.revoke(connectionId)
      setConnections((prev) => prev.filter((c) => c.id !== connectionId))
      await refreshBankTransactions()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setBusyId(null)
    }
  }

  return (
    <>
      <header className="pb-6 pt-1">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-[28px]">Cuentas</h1>
        <p className="mt-1 text-sm text-slate-500">Vincula dónde guardas tu plata y tus movimientos se registran solos.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <div className="space-y-6">
          <Card className="p-5">
            <div className="flex items-start gap-3.5">
              <IconBank className="mt-0.5 size-6 shrink-0 text-brand-700" strokeWidth={1.75} />
              <div>
                <h2 className="text-lg font-bold text-slate-900">Vincular cuenta</h2>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  Conecta tu Yape, tu cuenta de ahorros o tu tarjeta vía un agregador de datos bancarios y deja de
                  registrar a mano: tus movimientos llegan solos y tu plan del mes se actualiza.
                </p>
              </div>
            </div>
            <Button onClick={() => setFlowOpen(true)} className="mt-4 w-full sm:w-auto">
              Vincular cuenta
            </Button>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
              <IconShield className="size-3.5 text-accent-600" />
              Demo del hackathon: usa datos simulados; la arquitectura (conector intercambiable) ya queda lista para
              un agregador real como Prometeo, sin cambios en el resto de la app.
            </p>

            {error && <p className="animate-fade-up mt-3 text-sm font-medium text-danger-500">{error}</p>}
            {syncMessage && <p className="animate-fade-up mt-3 text-sm font-medium text-success-500">{syncMessage}</p>}
          </Card>

          <Card className="p-5">
            <h2 className="text-lg font-bold text-slate-900">¿Qué gano con vincular?</h2>
            <ul className="mt-3 space-y-3 text-[13px] leading-relaxed text-slate-600">
              {[
                'Cada gasto llega con su categoría y su fecha, sin registrar nada a mano.',
                'El plan del mes se recalcula solo con los movimientos de tu cuenta.',
                'El asistente responde con tus movimientos sincronizados, no con consejos genéricos.',
              ].map((benefit, i) => (
                <li key={i} className="flex gap-2.5">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent-500" style={{ opacity: 0.9 - i * 0.3 }} />
                  {benefit}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-5">
            <h2 className="text-lg font-bold text-slate-900">Cómo funciona en esta demo</h2>
            <ul className="mt-3 space-y-3 text-[13px] leading-relaxed text-slate-600">
              {[
                'Pulsa «Vincular cuenta», elige tu banco y autoriza el acceso del agregador.',
                'Pulsa «Sincronizar» y llegan movimientos (simulados en esta demo) de esa conexión.',
                'Tu plan del mes y tu pronóstico se recalculan con esos movimientos al instante.',
              ].map((step, i) => (
                <li key={i} className="flex gap-2.5">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-300" style={{ opacity: 1 - i * 0.25 }} />
                  {step}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <section className="min-w-0 space-y-4 lg:pt-14">
          <h2 className="text-lg font-bold text-slate-900">
            Cuentas vinculadas {connections.length > 0 && <span className="text-sm font-medium text-slate-500">({connections.length})</span>}
          </h2>

          {loading ? (
            <Card className="space-y-3 p-5" aria-busy>
              <span className="block h-4 w-40 rounded-full bg-rule" />
              <span className="block h-4 w-56 rounded-full bg-rule" />
              <span className="block h-9 w-full rounded-full bg-rule" />
            </Card>
          ) : connections.length === 0 ? (
            <Card className="border-dashed p-6">
              <p className="text-sm font-medium text-slate-700">Todavía no vinculaste ninguna cuenta.</p>
              <p className="mt-1 text-[13px] text-slate-500">
                Con el botón «Vincular cuenta» eliges tu banco y te conectas vía el agregador en unos segundos.
              </p>
              <p className="mt-4 mb-2 text-[13px] font-semibold text-slate-600">
                Al conectar verás aquí, al instante:
              </p>
              <ul className="space-y-2.5 text-[13px] text-slate-600">
                <li className="flex items-center justify-between rounded-[14px] bg-rule/70 px-4 py-2.5">
                  <span>Tus tarjetas con sus últimos dígitos</span>
                  <span className="tabular text-xs text-slate-500">•••• 4207</span>
                </li>
                <li className="flex items-center justify-between rounded-[14px] bg-rule/70 px-4 py-2.5">
                  <span>El estado de cada conexión</span>
                  <span className="rounded-full bg-success-50 px-2 py-0.5 text-[11px] font-semibold text-success-500">Activa</span>
                </li>
                <li className="flex items-center justify-between rounded-[14px] bg-rule/70 px-4 py-2.5">
                  <span>Botones para sincronizar y desvincular</span>
                  <IconBank className="size-4 text-slate-400" />
                </li>
              </ul>
            </Card>
          ) : (            <div className="space-y-3">
              {connections.map((connection) => (
                <Card key={connection.id} className="space-y-3.5 p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-900">
                      {banks.find((b) => b.id === connection.institution)?.name ?? 'Cuenta de demostración'}
                      {connection.provider === 'simulator' && (
                        <span className="ml-1.5 text-xs font-medium text-slate-500">· datos simulados</span>
                      )}
                    </span>
                    <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-success-50 px-2 py-0.5 text-[11px] font-semibold text-success-500">
                      <span className="size-1.5 rounded-full bg-success-500" />
                      Activa
                    </span>
                  </div>

                  <ul className="divide-y divide-rule">
                    {connection.accounts.map((account) => (
                      <li key={account.id} className="flex items-center justify-between py-2 first:pt-0 text-sm">
                        <span className="text-slate-800">{accountLabels[account.type]}</span>
                        <span className="tabular text-slate-500">•••• {account.last4}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      className="flex-1"
                      disabled={busyId === connection.id}
                      onClick={() => handleSync(connection.id)}
                    >
                      {busyId === connection.id ? 'Sincronizando...' : 'Sincronizar'}
                    </Button>
                    <Button
                      variant="danger"
                      className="shrink-0"
                      disabled={busyId === connection.id}
                      onClick={() => handleRevoke(connection.id)}
                    >
                      Desvincular
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Nota de seguridad: contenido de cierre de la columna */}
          <Card className="flex items-start gap-3 bg-brand-50/60 border-brand-100 p-5">
            <IconShield className="mt-0.5 size-6 shrink-0 text-brand-700" strokeWidth={1.75} />
            <div>
              <h3 className="text-base font-bold text-slate-900">Tu plata y tus datos</h3>
              <p className="mt-1 text-[13px] leading-relaxed text-slate-600">
                Esta demo no se conecta a ningún banco real ni guarda credenciales: los movimientos vinculados
                son simulados. Cuando conectes una cuenta real, solo pediremos lectura de movimientos, nunca tu
                clave.
              </p>
            </div>
          </Card>
        </section>
      </div>

      <BankAggregatorFlow open={flowOpen} onClose={() => setFlowOpen(false)} onLinked={handleLinked} />
    </>
  )
}
