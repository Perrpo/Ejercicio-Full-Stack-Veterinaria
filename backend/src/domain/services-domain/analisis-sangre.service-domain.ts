/**
 * DOMAIN LAYER - Servicio de Análisis de Sangre
 */

import { ServicioBase } from './servicios'

export class AnalisisSangre extends ServicioBase {
  constructor(id: number) {
    super(id, 'Análisis de Sangre', 'Análisis de laboratorio de sangre', 200, 15)
  }
}
