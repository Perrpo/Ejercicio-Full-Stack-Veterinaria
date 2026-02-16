import { z } from 'zod'

export const registerSchema = z.object({
  nombre: z.string().min(2),
  apellido: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  telefono: z.string().min(7),
  direccion: z.string().min(3),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export type RegisterDTO = z.infer<typeof registerSchema>
export type LoginDTO = z.infer<typeof loginSchema>
