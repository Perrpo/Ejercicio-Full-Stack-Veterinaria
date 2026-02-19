/**
 * DOMAIN LAYER - Servicios de Dominio Veterinarios
 * Contratos de servicios (sin exponer atributos mutables)
 */

export interface IServicio {
  getId(): number
  getNombre(): string
  getDescripcion(): string
  calcularPrecio(): number
  duracion(): number
}

// Implementación base para reducir duplicación y respetar encapsulación
export abstract class ServicioBase implements IServicio {
  constructor(
    private readonly id: number,
    private readonly nombre: string,
    private readonly descripcion: string,
    private readonly precioBase: number,
    private readonly duracionMinutos: number
  ) {}

  getId(): number {
    return this.id
  }

  getNombre(): string {
    return this.nombre
  }

  getDescripcion(): string {
    return this.descripcion
  }

  calcularPrecio(): number {
    return this.precioBase
  }

  duracion(): number {
    return this.duracionMinutos
  }
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
