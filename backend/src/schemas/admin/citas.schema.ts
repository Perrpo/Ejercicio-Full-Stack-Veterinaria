import { z } from 'zod'

export const adminCitaSchema = z.object({
  fecha: z.string().datetime(),
  motivo: z.string().min(3),
  estado: z.enum(['pendiente', 'confirmada', 'cancelada', 'finalizada']),
  id_paciente: z.string().uuid(),
  id_usuario: z.string().uuid(),
  id_servicio: z.string().uuid(),
})

export const adminCitaUpdateSchema = adminCitaSchema.partial()

export type AdminCitaDTO = z.infer<typeof adminCitaSchema>
export type AdminCitaUpdateDTO = z.infer<typeof adminCitaUpdateSchema>
