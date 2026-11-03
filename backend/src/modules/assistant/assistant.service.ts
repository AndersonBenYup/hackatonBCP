import { env } from '../../config/env.js'
import { HttpError } from '../../lib/http-error.js'
import { buildAssistantSystemPrompt } from './assistant.prompt.js'
import type { AssistantChatResult, AssistantMessage } from './assistant.types.js'

const FALLBACK_MODELS = [
  'nvidia/nemotron-3-ultra-550b-a55b:free',
  'nvidia/nemotron-3.5-lightning:free',
  'openrouter/free',
] as const

interface OutgoingMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

async function callOpenRouter(model: string, messages: OutgoingMessage[]): Promise<string> {
  let response: Response
  try {
    response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': env.CORS_ORIGIN,
        'X-Title': 'Finza',
      },
      body: JSON.stringify({ model, messages, temperature: 0.4 }),
    })
  } catch {
    throw new Error(`No se pudo conectar con OpenRouter (${model}).`)
  }

  if (!response.ok) {
    throw new Error(`OpenRouter respondio ${response.status} para ${model}`)
  }

  const body = (await response.json().catch(() => null)) as
    | { choices?: Array<{ message?: { content?: string } }> }
    | null
  const content = body?.choices?.[0]?.message?.content
  if (!content) {
    throw new Error(`El modelo ${model} no devolvio contenido.`)
  }
  return content
}

export const assistantService = {
  async chat(userId: string, history: AssistantMessage[]): Promise<AssistantChatResult> {
    const messages: OutgoingMessage[] = [
      { role: 'system', content: buildAssistantSystemPrompt(userId) },
      ...history,
    ]

    for (const model of FALLBACK_MODELS) {
      try {
        const reply = await callOpenRouter(model, messages)
        return { reply, model }
      } catch {
        // probar el siguiente modelo de respaldo
      }
    }

    throw new HttpError(502, 'El asistente no esta disponible en este momento. Intenta de nuevo en unos minutos.')
  },
}
