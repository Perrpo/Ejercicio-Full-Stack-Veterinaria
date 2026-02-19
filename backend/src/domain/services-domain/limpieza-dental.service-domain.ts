/**
 * DOMAIN LAYER - Servicio de Limpieza Dental
 */

import { ServicioBase } from './servicios'

export class LimpiezaDental extends ServicioBase {
  constructor(id: number) {
    super(id, 'Limpieza Dental', 'Limpieza y profilaxis dental', 350, 45)
  }
}
