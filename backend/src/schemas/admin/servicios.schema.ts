import { z } from 'zod'

export const adminServicioSchema = z.object({
  nombre: z.string().min(2),
  descripcion: z.string().optional(),
  precio: z.number().nonnegative(),
})

export const adminServicioUpdateSchema = adminServicioSchema.partial()

export type AdminServicioDTO = z.infer<typeof adminServicioSchema>
export type AdminServicioUpdateDTO = z.infer<typeof adminServicioUpdateSchema>
