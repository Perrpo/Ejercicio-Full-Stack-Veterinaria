import { z } from 'zod'

export const adminPacienteSchema = z.object({
  nombre: z.string().min(2),
  especie: z.string().min(3),
  raza: z.string().optional(),
  edad: z.number().int().nonnegative(),
  peso: z.number().positive().optional(),
  id_usuario: z.string().uuid(),
})

export const adminPacienteUpdateSchema = adminPacienteSchema.partial()

export type AdminPacienteDTO = z.infer<typeof adminPacienteSchema>
export type AdminPacienteUpdateDTO = z.infer<typeof adminPacienteUpdateSchema>
