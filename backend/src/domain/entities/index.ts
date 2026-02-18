/**
 * DOMAIN LAYER - Índice de Entidades
 * Barrel exports para todas las entidades
 */

export { Cliente } from './cliente.entity'
export { Mascota } from './mascota.entity'
export { Veterinario } from './veterinario.entity'
export { Cita } from './cita.entity'
export { Pago } from './pago.entity'

// Re-export de servicios de dominio
export { IServicio } from '../services-domain/servicios'
