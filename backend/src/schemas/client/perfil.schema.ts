// Si en un futuro quieres validar updates del perfil
import { z } from 'zod'

export const updateProfileSchema = z.object({
  nombre: z.string().min(1).optional(),
  apellido: z.string().min(1).optional(),
  email: z.string().email().optional(),
  telefono: z.string().optional(),
  direccion: z.string().optional(),
})
