import { ICitaRepository } from '../../domain/interfaces/ICitaRepository';
import { IMascotaRepository } from '../../domain/interfaces/IMascotaRepository';
import { ICalculadoraPrecio } from '../strategies/ICalculadoraPrecio';
import { Cita } from '../../domain/entities/Cita';
import { Mascota } from '../../domain/entities/Mascota';
import { Veterinario } from '../../domain/entities/Veterinario';
import { IServicio } from '../../domain/interfaces/IServicio';

/**
 * CitaService - Servicio de aplicación para gestionar citas
 * Cumple con SRP (Single Responsibility Principle) - solo lógica de citas
 * Cumple con DIP (Dependency Inversion Principle) - depende de interfaces
 */
export class CitaService {
  constructor(
    private citaRepository: ICitaRepository,
    private mascotaRepository: IMascotaRepository,
    private calculadora: ICalculadoraPrecio,
  ) {}

  async crearCita(
    mascotaId: string,
    veterinario: Veterinario,
    fecha: Date,
    observaciones?: string,
  ): Promise<Cita> {
    // Verificar que la mascota existe
    const mascota = await this.mascotaRepository.findById(mascotaId);
    if (!mascota) {
      throw new Error('Mascota no encontrada');
    }

    // Crear la cita
    const citaId = `cita_${Date.now()}`;
    const cita = new Cita(citaId, fecha, mascota, veterinario, observaciones);

    // Guardar en repositorio
    await this.citaRepository.save(cita);

    return cita;
  }

  async agregarServicio(citaId: string, servicio: IServicio): Promise<void> {
    const cita = await this.citaRepository.findById(citaId);
    if (!cita) {
      throw new Error('Cita no encontrada');
    }

    cita.agregarServicio(servicio);
    await this.citaRepository.save(cita);
  }

  async obtenerTotal(citaId: string): Promise<number> {
    const cita = await this.citaRepository.findById(citaId);
    if (!cita) {
      throw new Error('Cita no encontrada');
    }

    const servicios = cita.obtenerServicios();
    return this.calculadora.calcular(servicios);
  }

  async obtenerCita(citaId: string): Promise<Cita | null> {
    return this.citaRepository.findById(citaId);
  }

  async obtenerCitasPorMascota(mascotaId: string): Promise<Cita[]> {
    return this.citaRepository.findByMascota(mascotaId);
  }

  async obtenerCitasPorCliente(clienteId: string): Promise<Cita[]> {
    return this.citaRepository.findByCliente(clienteId);
  }
}
