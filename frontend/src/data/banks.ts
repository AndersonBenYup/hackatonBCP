import type { Institution } from '@/types/banking'

export const banks: Array<{ id: Institution; name: string; color: string }> = [
  { id: 'bcp', name: 'BCP', color: 'bg-brand-700' },
  { id: 'interbank', name: 'Interbank', color: 'bg-accent-500' },
  { id: 'bbva', name: 'BBVA', color: 'bg-cat-blue-ink' },
  { id: 'scotiabank', name: 'Scotiabank', color: 'bg-cat-coral-ink' },
]
