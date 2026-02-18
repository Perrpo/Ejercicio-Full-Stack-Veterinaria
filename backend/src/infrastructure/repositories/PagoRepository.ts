import { IPagoRepository } from '../../domain/interfaces/IPagoRepository';
import { Pago } from '../../domain/entities/Pago';
import { EstadoPago } from '../../domain/enums/EstadoPago';
import { PagoEfectivo } from '../../domain/entities/payment/MetodosPago';

/**
 * PagoRepository - Implementación concreta del repositorio de pagos
 * Cumple con DIP (Dependency Inversion Principle)
 */
export class PagoRepository implements IPagoRepository {
  constructor(private supabase: any) {}

  async save(pago: Pago): Promise<void> {
    const data = {
      id_pago: pago.id,
      monto: pago.obtenerMonto(),
      estado: pago.obtenerEstado(),
      metodo: pago.metodo.obtenerTipo(),
    };

    const { error } = await this.supabase
      .from('pagos')
      .upsert(data, { onConflict: 'id_pago' });

    if (error) {
      throw new Error(`Error al guardar pago: ${error.message}`);
    }
  }

  async findById(id: string): Promise<Pago | null> {
    const { data, error } = await this.supabase
      .from('pagos')
      .select('*')
      .eq('id_pago', id)
      .single();

    if (error || !data) {
      return null;
    }

    return this.mapToPago(data);
  }

  async findByCita(citaId: string): Promise<Pago[]> {
    const { data, error } = await this.supabase
      .from('pagos')
      .select('*')
      .eq('id_cita', citaId);

    if (error || !data) {
      return [];
    }

    return data.map((item: any) => this.mapToPago(item));
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('pagos')
      .delete()
      .eq('id_pago', id);

    if (error) {
      throw new Error(`Error al eliminar pago: ${error.message}`);
    }
  }

  private mapToPago(data: any): Pago {
    // Por defecto usa efectivo, en una app real buscarías el método según el tipo
    const metodo = new PagoEfectivo();
    return new Pago(
      data.id_pago,
      data.monto,
      data.estado as EstadoPago,
      metodo,
    );
  }
}
