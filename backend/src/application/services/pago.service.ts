/**
 * APPLICATION LAYER - PagoService
 * Servicio de aplicación para lógica de negocio de Pagos
 */

import { PagoRepository, CitaRepository } from '../repositories'
import { EstadoPago } from '../../domain/enums'
import { CreatePagoDTO } from '../../shared/types'

export class PagoService {
  private pagoRepository = new PagoRepository()
  private citaRepository = new CitaRepository()

  async crearPago(dto: CreatePagoDTO) {
    // Validar que cita existe
    const cita = await this.citaRepository.findById(dto.id_cita)
    if (!cita) throw new Error('Cita no encontrada')

    // Validar monto
    if (dto.monto <= 0) {
      throw new Error('El monto debe ser mayor a cero')
    }

    return this.pagoRepository.save({
      ...dto,
      estado: EstadoPago.Pendiente,
      fecha_pago: new Date()
    })
  }

  async confirmarPago(id: number) {
    const pago = await this.pagoRepository.findById(id)
    if (!pago) throw new Error('Pago no encontrado')

    return this.pagoRepository.update(id, { estado: EstadoPago.Pagado })
  }

  async rechazarPago(id: number) {
    const pago = await this.pagoRepository.findById(id)
    if (!pago) throw new Error('Pago no encontrado')

    return this.pagoRepository.update(id, { estado: EstadoPago.Fallido })
  }

  async obtenerPagosCita(citaId: number) {
    return this.pagoRepository.findByCita(citaId)
  }

  async obtenerPago(id: number) {
    return this.pagoRepository.findById(id)
  }

  async obtenerTodosPagos() {
    return this.pagoRepository.findAll()
  }

  async actualizarPago(id: number, datos: any) {
    return this.pagoRepository.update(id, datos)
  }

  async eliminarPago(id: number) {
    return this.pagoRepository.delete(id)
  }

  async verificarCitaPagada(citaId: number, montoTotal: number) {
    const pagos = await this.pagoRepository.findByCita(citaId)
    const totalPagado = pagos
      .filter((p: any) => p.estado === EstadoPago.Pagado)
      .reduce((sum: number, p: any) => sum + p.monto, 0)
    return totalPagado >= montoTotal
  }
}
