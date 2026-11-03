import { twMerge } from 'tailwind-merge'

/** Combina clases y resuelve utilidades Tailwind en conflicto (el último override gana). */
export const cn = (...classes: Array<string | undefined | false | null>) => twMerge(classes.filter(Boolean).join(' '))
