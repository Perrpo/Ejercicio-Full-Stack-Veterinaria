/**
 * DOMAIN LAYER - Servicio de Radiografía
 */

import { ServicioBase } from './servicios'

export class Radiografia extends ServicioBase {
  constructor(id: number) {
    super(id, 'Radiografía', 'Servicio de radiografía para diagnóstico', 250, 30)
  }
}
