import { z } from 'zod'

export const createMascotaSchema = z.object({
  nombre: z.string().min(1),
  especie: z.string().min(1),
  raza: z.string().min(1),
  edad: z.union([z.number().int().nonnegative(), z.string().transform(Number)]),
  peso: z.union([z.number().nonnegative(), z.string().transform(Number)]),
})
