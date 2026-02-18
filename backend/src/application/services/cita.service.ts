/**
 * APPLICATION LAYER - CitaService
 * Servicio de aplicación para lógica de negocio de Citas
 */

import { CitaRepository, MascotaRepository } from '../repositories'
import { EstadoCita } from '../../domain/enums'
import { CreateCitaDTO } from '../../shared/types'

export class CitaService {
  private citaRepository = new CitaRepository()
  private mascotaRepository = new MascotaRepository()

  async crearCita(dto: CreateCitaDTO) {
    // Validar que mascota existe
    const mascota = await this.mascotaRepository.findById(dto.id_paciente)
    if (!mascota) {
      throw new Error('Mascota no encontrada')
    }

    // Validar que pertenece al cliente
    if (mascota.id_usuario !== dto.id_usuario) {
      throw new Error('La mascota no pertenece a este cliente')
    }

    // Validar fecha futura
    if (new Date(dto.fecha_cita) < new Date()) {
      throw new Error('La fecha debe ser futura')
    }

    return this.citaRepository.save({
      ...dto,
      estado: EstadoCita.Pendiente
    })
  }

  async confirmarCita(id: number) {
    const cita = await this.citaRepository.findById(id)
    if (!cita) throw new Error('Cita no encontrada')

    if (cita.estado !== EstadoCita.Pendiente) {
      throw new Error('Solo se pueden confirmar citas pendientes')
    }

    return this.citaRepository.update(id, { estado: EstadoCita.Confirmada })
  }

  async cancelarCita(id: number) {
    const cita = await this.citaRepository.findById(id)
    if (!cita) throw new Error('Cita no encontrada')

    return this.citaRepository.update(id, { estado: EstadoCita.Cancelada })
  }

  async finalizarCita(id: number) {
    const cita = await this.citaRepository.findById(id)
    if (!cita) throw new Error('Cita no encontrada')

    return this.citaRepository.update(id, { estado: EstadoCita.Finalizada })
  }

  async obtenerCitasPorCliente(clienteId: string) {
    return this.citaRepository.findByCliente(clienteId)
  }

  async obtenerCitasPorMascota(mascotaId: number) {
    return this.citaRepository.findByMascota(mascotaId)
  }

  async obtenerTodasLasCitas(filtro?: string) {
    return this.citaRepository.findAll(filtro)
  }

  async actualizarCita(id: number, datos: any) {
    return this.citaRepository.update(id, datos)
  }

  async eliminarCita(id: number) {
    return this.citaRepository.delete(id)
  }
}
