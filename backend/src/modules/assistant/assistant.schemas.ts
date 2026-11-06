import { z } from 'zod'

export const assistantMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().trim().min(1).max(4000),
})

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)

/**
 * Lo que solo conoce el navegador: movimientos manuales (viven en localStorage),
 * metas y la fecha de referencia. Son datos del propio usuario y solo alimentan
 * su conversacion.
 */
export const assistantContextSchema = z.object({
  asOf: isoDate,
  budget: z.number().min(0).max(100_000_000),
  manualTransactions: z
    .array(
      z.object({
        type: z.enum(['income', 'expense']),
        amount: z.number().positive().max(100_000_000),
        category: z.enum(['comida', 'transporte', 'entretenimiento', 'educacion', 'servicios', 'salario', 'otros']),
        description: z.string().trim().max(120),
        date: isoDate,
      }),
    )
    .max(200),
  goals: z
    .array(
      z.object({
        name: z.string().trim().min(1).max(80),
        target: z.number().min(0).max(100_000_000),
        saved: z.number().min(0).max(100_000_000),
      }),
    )
    .max(20),
})

export const assistantChatSchema = z.object({
  messages: z.array(assistantMessageSchema).min(1).max(40),
  context: assistantContextSchema.optional(),
})

export type AssistantContext = z.infer<typeof assistantContextSchema>
export type AssistantChatInput = z.infer<typeof assistantChatSchema>
