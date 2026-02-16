import { z } from 'zod'

// ======================
// Usuario
// ======================
export const adminUserSchema = z.object({
  nombre: z.string().min(2),
  apellido: z.string().min(2),
  email: z.string().email(),
  telefono: z.string().min(7),
  direccion: z.string().min(3),
  rol: z.enum(['cliente', 'veterinario', 'admin']),
})

export const adminUserUpdateSchema = adminUserSchema.partial({
  email: true,
  rol: true,
})

export type AdminUserDTO = z.infer<typeof adminUserSchema>
export type AdminUserUpdateDTO = z.infer<typeof adminUserUpdateSchema>

// ======================
// Pacientes
// ======================
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

// ======================
// Citas
// ======================
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

// ======================
// Examenes
// ======================
export const adminExamenSchema = z.object({
  nombre: z.string().min(2),
  descripcion: z.string().optional(),
  id_paciente: z.string().uuid(),
  fecha: z.string().datetime(),
})

export const adminExamenUpdateSchema = adminExamenSchema.partial()

export type AdminExamenDTO = z.infer<typeof adminExamenSchema>
export type AdminExamenUpdateDTO = z.infer<typeof adminExamenUpdateSchema>

// ======================
// Servicios
// ======================
export const adminServicioSchema = z.object({
  nombre: z.string().min(2),
  descripcion: z.string().optional(),
  precio: z.number().nonnegative(),
})

export const adminServicioUpdateSchema = adminServicioSchema.partial()

export type AdminServicioDTO = z.infer<typeof adminServicioSchema>
export type AdminServicioUpdateDTO = z.infer<typeof adminServicioUpdateSchema>

// ======================
// Pagos
// ======================
export const adminPagoSchema = z.object({
  id_cita: z.union([z.number().int(), z.string().transform((val) => Number(val))]),
  metodo_pago: z.enum(['tarjeta_credito', 'efectivo', 'transferencia']),
  monto: z.union([z.number().nonnegative(), z.string().transform((val) => Number(val))]),
  fecha_pago: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val).toISOString() : undefined)),
  estado: z.enum(['pendiente', 'pagado', 'fallido']),
})

export const adminPagoUpdateSchema = adminPagoSchema.partial()

export type AdminPagoDTO = z.infer<typeof adminPagoSchema>
export type AdminPagoUpdateDTO = z.infer<typeof adminPagoUpdateSchema>
