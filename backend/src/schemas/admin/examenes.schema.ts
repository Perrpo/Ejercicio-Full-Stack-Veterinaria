import { z } from 'zod'

export const adminExamenSchema = z.object({
  nombre: z.string().min(2),
  descripcion: z.string().optional(),
  id_paciente: z.string().uuid(),
  fecha: z.string().datetime(),
})

export const adminExamenUpdateSchema = adminExamenSchema.partial()

export type AdminExamenDTO = z.infer<typeof adminExamenSchema>
export type AdminExamenUpdateDTO = z.infer<typeof adminExamenUpdateSchema>
