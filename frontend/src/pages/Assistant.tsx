import { useState, type FormEvent, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { IconCard, IconCoins, IconPiggy, IconSend, IconSparkles } from '@/components/icons'
import { api, ApiRequestError } from '@/lib/api'
import { useAccountData } from '@/hooks/useAccountData'
import { uid } from '@/lib/format'
import type { ChatMessage } from '@/types'

const HISTORY_WINDOW = 12

const suggestions = ['¿En qué gasto más?', '¿Qué es la TCEA?', '¿Cómo ahorro más?']

const topics = [
  {
    question: '¿En qué gasto más?',
    title: 'Dónde se va tu plata',
    hint: 'Tu gasto por categoría del mes en curso',
    icon: IconCoins,
  },
  {
    question: '¿Qué es la fecha de corte?',
    title: 'Cortes y deudas de tu tarjeta',
    hint: 'Cómo se arma tu próxima cuota',
    icon: IconCard,
  },
  {
    question: '¿Cómo ahorro más?',
    title: 'Tu plan de ahorro',
    hint: 'Metas, racha y dedicación del 10%',
    icon: IconPiggy,
  },
]

interface AssistantChatResponse {
  reply: string
  model: string
}

export default function Assistant() {
  const { welcome } = useAccountData()
  const [messages, setMessages] = useState<ChatMessage[]>(welcome)
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages.length, thinking])

  const send = async (text: string) => {
    const content = text.trim()
    if (!content || thinking) return

    const userMessage: ChatMessage = { id: uid(), role: 'user', content }
    const history = [...messages, userMessage]
    setMessages(history)
    setInput('')

    setThinking(true)
    try {
      const { reply } = await api.post<AssistantChatResponse>('/api/assistant/chat', {
        messages: history.slice(-HISTORY_WINDOW).map((m) => ({ role: m.role, content: m.content })),
      })
      setMessages((prev) => [...prev, { id: uid(), role: 'assistant', content: reply }])
    } catch (err) {
      const text = err instanceof ApiRequestError ? err.message : 'No pude conectar con el asistente. Intenta de nuevo.'
      setMessages((prev) => [...prev, { id: uid(), role: 'assistant', content: text }])
    } finally {
      setThinking(false)
    }
  }

  const handleSubmit = (_e: FormEvent) => {
    if (thinking) return
    void send(input)
  }

  return (
    <div className="mx-auto flex h-[calc(100dvh-140px)] min-h-[420px] w-full max-w-3xl flex-col md:h-[calc(100dvh-120px)]">
      <header className="pb-5 pt-1">
        <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-slate-900 md:text-[28px]">
          <IconSparkles className="size-6 text-accent-600" strokeWidth={2} />
          Asistente IA
        </h1>
        <p className="mt-1 text-sm text-slate-500">Preguntas sobre tus gastos, tu ahorro o cómo funciona tu tarjeta.</p>
      </header>

      {/* Conversación: el usuario en su tile azul pálido, la IA en tarjeta */}
      <div ref={listRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto pb-4 pr-0.5">
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'user' ? (
                <p className="max-w-[85%] rounded-[20px] rounded-br-md bg-brand-100 px-4 py-2.5 text-sm font-medium text-brand-800">
                  {m.content}
                </p>
              ) : (
                <p className="max-w-[85%] rounded-[20px] rounded-bl-md border border-line bg-white px-4 py-2.5 text-sm leading-relaxed text-slate-800">
                  {m.content}
                </p>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {thinking && (
          <div className="flex justify-start" aria-label="El asistente está escribiendo">
            <span className="flex items-center gap-1.5 rounded-[20px] rounded-bl-md border border-line bg-white px-4 py-3">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="size-1.5 rounded-full bg-slate-300"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
                />
              ))}
            </span>
          </div>
        )}

        {/* Temas con los que puede empezar: el relleno honesto del chat vacío */}
        <div className="mt-2">
          <p className="text-xs text-slate-500">También puedo ayudarte con:</p>
          <div className="mt-2 grid gap-3 sm:grid-cols-3">
            {topics.map((t) => (
              <button
                key={t.title}
                type="button"
                onClick={() => send(t.question)}
                className="group rounded-[20px] bg-cat-blue-tint px-4 py-3.5 text-left transition-[transform,background-color] duration-200 ease-out hover:-translate-y-0.5 hover:bg-brand-200/70 active:translate-y-0"
              >
                <t.icon className="size-5 text-cat-blue-ink" strokeWidth={1.75} />
                <p className="mt-2 text-[13px] font-semibold leading-tight text-cat-blue-ink">{t.title}</p>
                <p className="mt-0.5 text-xs leading-snug text-cat-blue-ink/70">{t.hint}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => send(s)}
              className="h-8 rounded-full border border-line bg-white px-3 text-xs font-semibold text-brand-700 transition-colors duration-150 hover:border-brand-300 hover:bg-brand-50"
            >
              {s}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit(e)
          }}
          className="flex items-center gap-2 rounded-full border border-line bg-white p-1.5 pl-4 transition-colors duration-150 focus-within:border-brand-500"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu pregunta..."
            aria-label="Mensaje para el asistente"
            className="h-9 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-400"
          />
          <button
            type="submit"
            aria-label="Enviar mensaje"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-700 text-white transition-[transform,background-color] duration-200 ease-out hover:bg-brand-800 hover:-translate-y-px active:scale-95"
          >
            <IconSend className="size-4.5" strokeWidth={2} />
          </button>
        </form>
      </div>
    </div>
  )
}
