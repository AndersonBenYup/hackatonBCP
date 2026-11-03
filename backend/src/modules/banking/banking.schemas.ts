import { z } from 'zod'

export const linkAccountSchema = z.object({
  provider: z.string().min(1).default('simulator'),
})

export type LinkAccountInput = z.infer<typeof linkAccountSchema>
