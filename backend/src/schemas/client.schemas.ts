import { z } from 'zod'

export const createMascotaSchema = z.object({
  nombre: z.string().min(1),
  especie: z.string().min(1),
  raza: z.string().min(1),
  edad: z.union([z.number().int().nonnegative(), z.string().transform(Number)]),
  peso: z.union([z.number().nonnegative(), z.string().transform(Number)]),
})

export const createCitaSchema = z.object({
  id_paciente: z.union([z.number().int(), z.string().transform(Number)]),
  id_servicio: z.union([z.number().int(), z.string().transform(Number)]),
  fecha_cita: z.string().min(1),
})
