import { z } from 'zod'

export const createExamenSchema = z.object({
  id_paciente: z.union([z.number().int(), z.string().transform(Number)]),
  tipo_examen: z.string().min(1),
  observaciones: z.string().optional(),
})
