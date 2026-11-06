import { z } from 'zod'
import { INSTITUTIONS } from './banking.types.js'

export const linkAccountSchema = z.object({
  provider: z.string().min(1).default('simulator'),
  institution: z.enum(INSTITUTIONS).optional(),
})

export type LinkAccountInput = z.infer<typeof linkAccountSchema>
