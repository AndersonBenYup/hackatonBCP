import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { IconArrowRight, IconBank, IconShield, IconX } from '@/components/icons'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { bankingApi } from '@/lib/banking-api'
import { getErrorMessage } from '@/lib/get-error-message'
import type { BankConnection } from '@/types/banking'

type Step = 'select-bank' | 'consent' | 'connecting' | 'error'

const banks = [
  { id: 'bcp', name: 'BCP', color: 'bg-brand-700' },
  { id: 'interbank', name: 'Interbank', color: 'bg-accent-500' },
  { id: 'bbva', name: 'BBVA', color: 'bg-cat-blue-ink' },
  { id: 'scotiabank', name: 'Scotiabank', color: 'bg-cat-coral-ink' },
]

interface Props {
  open: boolean
  onClose: () => void
  onLinked: (connection: BankConnection) => void
}

/**
 * Simula la puesta en escena de un agregador de datos bancarios real
 * (seleccion de banco -> consentimiento estilo OAuth -> conectando) sobre el
 * BankConnector "simulator" que ya existe en el backend. No hay credenciales
 * de un agregador real (Prometeo) todavia, asi que esto es deliberadamente
 * una demo honesta, no una conexion bancaria real.
 */
export default function BankAggregatorFlow({ open, onClose, onLinked }: Props) {
  const [step, setStep] = useState<Step>('select-bank')
  const [selectedBank, setSelectedBank] = useState<(typeof banks)[number] | null>(null)
  const [error, setError] = useState<string | null>(null)

  function reset() {
    setStep('select-bank')
    setSelectedBank(null)
    setError(null)
  }

  function handleClose() {
    reset()
    onClose()
  }

  async function handleConsent() {
    setStep('connecting')
    setError(null)
    try {
      const connection = await bankingApi.link('simulator')
      await new Promise((resolve) => setTimeout(resolve, 900))
      onLinked(connection)
      handleClose()
    } catch (err) {
      setError(getErrorMessage(err))
      setStep('error')
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" role="dialog" aria-modal>
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <Card className="relative p-6">
          <button
            type="button"
            onClick={handleClose}
            aria-label="Cerrar"
            className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full text-slate-400 hover:bg-rule hover:text-slate-700"
          >
            <IconX className="size-4" />
          </button>

          <AnimatePresence mode="wait">
            {step === 'select-bank' && (
              <motion.div key="select-bank" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 className="text-lg font-bold text-slate-900">Elige tu banco</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Finza usa un agregador de datos bancarios para leer tus movimientos.
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2.5">
                  {banks.map((bank) => (
                    <button
                      key={bank.id}
                      type="button"
                      onClick={() => {
                        setSelectedBank(bank)
                        setStep('consent')
                      }}
                      className="flex items-center gap-2.5 rounded-[14px] border border-line px-3.5 py-3 text-left transition-colors duration-150 hover:border-brand-300 hover:bg-brand-50"
                    >
                      <span className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${bank.color}`}>
                        {bank.name.slice(0, 2).toUpperCase()}
                      </span>
                      <span className="text-sm font-semibold text-slate-800">{bank.name}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 'consent' && selectedBank && (
              <motion.div key="consent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex items-center gap-2.5">
                  <span className={`flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${selectedBank.color}`}>
                    {selectedBank.name.slice(0, 2).toUpperCase()}
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Conectar con {selectedBank.name}</h2>
                    <p className="text-xs text-slate-500">vía el agregador de Finza</p>
                  </div>
                </div>

                <div className="mt-4 rounded-[14px] border border-line p-4">
                  <p className="text-sm font-semibold text-slate-800">Finza pedirá permiso para:</p>
                  <ul className="mt-2.5 space-y-2 text-[13px] text-slate-600">
                    <li className="flex gap-2"><span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-success-500" />Ver tus cuentas y sus movimientos</li>
                    <li className="flex gap-2"><span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-success-500" />Sincronizar movimientos nuevos periódicamente</li>
                  </ul>
                  <p className="mt-3 flex items-center gap-1.5 text-[13px] font-semibold text-danger-500">
                    <IconX className="size-3.5" /> Nunca pedimos tu clave de banca por internet
                  </p>
                </div>

                <Button onClick={handleConsent} className="mt-4 w-full">
                  Autorizar y conectar
                  <IconArrowRight className="size-4" />
                </Button>
                <button
                  type="button"
                  onClick={() => setStep('select-bank')}
                  className="mt-2 w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-700"
                >
                  Elegir otro banco
                </button>
                <p className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
                  <IconShield className="size-3.5" />
                  Demo del hackathon: genera movimientos simulados, sin datos bancarios reales.
                </p>
              </motion.div>
            )}

            {step === 'connecting' && (
              <motion.div
                key="connecting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-3 py-8 text-center"
              >
                <span className="flex size-12 items-center justify-center rounded-full bg-brand-100">
                  <IconBank className="size-6 animate-pulse text-brand-700" strokeWidth={1.75} />
                </span>
                <p className="text-sm font-semibold text-slate-800">
                  Conectando con {selectedBank?.name}...
                </p>
                <p className="text-xs text-slate-500">Esto toma solo un momento</p>
              </motion.div>
            )}

            {step === 'error' && (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 className="text-lg font-bold text-slate-900">No pudimos conectar</h2>
                <p className="mt-1.5 text-sm text-danger-500">{error}</p>
                <Button onClick={() => setStep('select-bank')} variant="secondary" className="mt-4 w-full">
                  Intentar de nuevo
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </div>
  )
}
