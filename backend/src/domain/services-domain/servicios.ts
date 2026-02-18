/**
 * DOMAIN LAYER - Servicios de Dominio Veterinarios
 * Interface base para servicios
 */

export interface IServicio {
  id: number
  nombre: string
  descripcion?: string
  calcularPrecio(): number
  duracion(): number
}

// Re-exportar todas las implementaciones
export { Radiografia } from './radiografia.service-domain'
export { Vacunacion } from './vacunacion.service-domain'
export { Consulta } from './consulta.service-domain'
export { Peluqueria } from './peluqueria.service-domain'
export { AnalisisSangre } from './analisis-sangre.service-domain'
export { CirugiaMenor } from './cirugia-menor.service-domain'
export { LimpiezaDental } from './limpieza-dental.service-domain'
export { Urgencias } from './urgencias.service-domain'
