/**
 * DOMAIN LAYER - Servicio de Consulta
 */

import { ServicioBase } from './servicios'

export class Consulta extends ServicioBase {
  constructor(id: number) {
    super(id, 'Consulta', 'Consulta general con el veterinario', 100, 30)
  }
}
