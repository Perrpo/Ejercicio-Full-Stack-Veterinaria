import { IPagoRepository } from '../../domain/interfaces/IPagoRepository';
import { ICitaRepository } from '../../domain/interfaces/ICitaRepository';
import { IProcesadorPago } from '../strategies/IProcesadorPago';
import { Pago } from '../../domain/entities/Pago';
import { IMetodoPago } from '../../domain/interfaces/IMetodoPago';
import { EstadoPago } from '../../domain/enums/EstadoPago';

/**
 * PagoService - Servicio de aplicación para gestionar pagos
 * Cumple con SRP (Single Responsibility Principle) - solo gestiona pagos
 * Cumple con DIP (Dependency Inversion Principle) - depende de interfaces
 */
export class PagoService {
  constructor(
    private pagoRepository: IPagoRepository,
    private citaRepository: ICitaRepository,
    private procesador: IProcesadorPago,
  ) {}

  async procesarPago(citaId: string, metodo: IMetodoPago): Promise<Pago> {
    // Verificar que la cita existe
    const cita = await this.citaRepository.findById(citaId);
    if (!cita) {
      throw new Error('Cita no encontrada');
    }

    // Crear el pago
    const pagoId = `pago_${Date.now()}`;
    const monto = 100000; // Valor fijo para ejemplo, en producción sería el total de la cita
    const pago = new Pago(pagoId, monto, EstadoPago.PENDIENTE, metodo);

    // Procesar el pago
    const procesado = await this.procesador.procesar(pago);
    if (!procesado) {
      throw new Error('El pago fue rechazado');
    }

    // Guardar el pago
    await this.pagoRepository.save(pago);

    // Agregar pago a la cita
    cita.agregarPago(pago);
    await this.citaRepository.save(cita);

    return pago;
  }

  async obtenerPagosDeCita(citaId: string): Promise<Pago[]> {
    return this.pagoRepository.findByCita(citaId);
  }

  async verificarPagoAprobado(pagoId: string): Promise<boolean> {
    const pago = await this.pagoRepository.findById(pagoId);
    if (!pago) {
      return false;
    }
    return this.procesador.estaAprobado(pago);
  }
}
