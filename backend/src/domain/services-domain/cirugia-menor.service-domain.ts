/**
 * DOMAIN LAYER - Servicio de Cirugía Menor
 */

import { ServicioBase } from './servicios'

export class CirugiaMenor extends ServicioBase {
  constructor(id: number) {
    super(id, 'Cirugía Menor', 'Procedimientos quirúrgicos menores', 500, 60)
  }
}
