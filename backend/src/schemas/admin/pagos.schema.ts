import { z } from 'zod'

export const adminPagoSchema = z.object({
  id_cita: z.string().uuid(),
  monto: z.number().positive(),
  metodo: z.enum(['efectivo', 'tarjeta', 'transferencia']),
})

export type AdminPagoDTO = z.infer<typeof adminPagoSchema>
