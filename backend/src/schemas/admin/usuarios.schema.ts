import { z } from 'zod'

export const adminUserSchema = z.object({
  nombre: z.string().min(2),
  apellido: z.string().min(2),
  email: z.string().email(),
  telefono: z.string().min(7),
  direccion: z.string().min(3),
  rol: z.enum(['cliente', 'veterinario', 'admin']),
})

export const adminUserUpdateSchema = adminUserSchema.partial({
  email: true,
  rol: true,
})

export type AdminUserDTO = z.infer<typeof adminUserSchema>
export type AdminUserUpdateDTO = z.infer<typeof adminUserUpdateSchema>
