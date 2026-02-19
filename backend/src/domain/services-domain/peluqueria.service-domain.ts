/**
 * DOMAIN LAYER - Servicio de Peluquería
 */

import { ServicioBase } from './servicios'

export class Peluqueria extends ServicioBase {
  constructor(id: number) {
    super(id, 'Peluquería', 'Servicio de baño y grooming', 300, 60)
  }
}
