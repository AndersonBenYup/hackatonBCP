import { z } from 'zod'

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(80, 'El nombre es demasiado largo'),
  email: z.string().trim().toLowerCase().email('Correo invalido').max(160),
  password: z
    .string()
    .min(8, 'La contrasena debe tener al menos 8 caracteres')
    .max(72, 'La contrasena es demasiado larga')
    .regex(/[a-zA-Z]/, 'La contrasena debe incluir al menos una letra')
    .regex(/[0-9]/, 'La contrasena debe incluir al menos un numero'),
})

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Correo invalido'),
  password: z.string().min(1, 'La contrasena es requerida'),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
