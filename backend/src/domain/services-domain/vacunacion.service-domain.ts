/**
 * DOMAIN LAYER - Servicio de Vacunación
 */

import { ServicioBase } from './servicios'

export class Vacunacion extends ServicioBase {
  constructor(id: number) {
    super(id, 'Vacunación', 'Aplicación de vacunas preventivas', 150, 20)
  }
}
