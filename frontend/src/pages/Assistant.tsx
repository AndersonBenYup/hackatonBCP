import { useState, type FormEvent } from 'react'
import Button from '@/components/ui/Button'
import { mockWelcome } from '@/data/mock'
import { uid } from '@/lib/format'
import type { ChatMessage } from '@/types'

// Respuesta simulada hasta conectar el backend de IA.
const mockReply = (question: string) =>
  `Buena pregunta sobre "${question}". Pronto te responderé con tus datos reales. Mientras tanto: intenta separar al menos el 10% de cada ingreso.`

const suggestions = ['¿Cómo ahorro más?', '¿Qué es la fecha de corte?', '¿En qué gasto más?']

export default function Assistant() {
  const [messages, setMessages] = useState<ChatMessage[]>(mockWelcome)
  const [input, setInput] = useState('')

  const send = (text: string) => {
    const content = text.trim()
    if (!content) return
    setMessages((prev) => [
      ...prev,
      { id: uid(), role: 'user', content },
      { id: uid(), role: 'assistant', content: mockReply(content) },
    ])
    setInput('')
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    send(input)
  }

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex-1 space-y-2">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
              m.role === 'user' ? 'ml-auto bg-brand-500 text-white' : 'bg-white shadow-sm'
            }`}
          >
            {m.content}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <Button key={s} variant="secondary" className="text-xs" onClick={() => send(s)}>
            {s}
          </Button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu pregunta..."
          className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
        />
        <Button type="submit">Enviar</Button>
      </form>
    </div>
  )
}
