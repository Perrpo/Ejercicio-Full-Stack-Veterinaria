import { z } from 'zod'

export const createCitaSchema = z.object({
  id_paciente: z.union([z.number().int(), z.string().transform(Number)]),
  id_servicio: z.union([z.number().int(), z.string().transform(Number)]),
  fecha_cita: z.string().min(1),
  observaciones: z.string().optional(),
})
