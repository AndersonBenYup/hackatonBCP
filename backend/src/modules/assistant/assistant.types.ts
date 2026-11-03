export type AssistantRole = 'user' | 'assistant'

export interface AssistantMessage {
  role: AssistantRole
  content: string
}

export interface AssistantChatResult {
  reply: string
  model: string
}
