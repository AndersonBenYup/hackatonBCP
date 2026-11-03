import { z } from 'zod'

export const assistantMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().trim().min(1).max(4000),
})

export const assistantChatSchema = z.object({
  messages: z.array(assistantMessageSchema).min(1).max(40),
})

export type AssistantChatInput = z.infer<typeof assistantChatSchema>
