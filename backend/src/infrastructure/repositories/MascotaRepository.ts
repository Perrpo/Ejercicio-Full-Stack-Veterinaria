import { IMascotaRepository } from '../../domain/interfaces/IMascotaRepository';
import { Mascota } from '../../domain/entities/Mascota';
import { Cliente } from '../../domain/entities/Cliente';

/**
 * MascotaRepository - Implementación concreta del repositorio de mascotas
 * Cumple con DIP (Dependency Inversion Principle)
 */
export class MascotaRepository implements IMascotaRepository {
  constructor(private supabase: any) {}

  async save(mascota: Mascota): Promise<void> {
    const data = {
      id_paciente: mascota.id,
      nombre: mascota.nombre,
      especie: mascota.especie,
      raza: mascota.raza,
      edad: mascota.edad,
      id_usuario: mascota.cliente.id,
    };

    const { error } = await this.supabase
      .from('pacientes')
      .upsert(data, { onConflict: 'id_paciente' });

    if (error) {
      throw new Error(`Error al guardar mascota: ${error.message}`);
    }
  }

  async findById(id: string): Promise<Mascota | null> {
    const { data, error } = await this.supabase
      .from('pacientes')
      .select('*')
      .eq('id_paciente', id)
      .single();

    if (error || !data) {
      return null;
    }

    return this.mapToMascota(data);
  }

  async findByCliente(clienteId: string): Promise<Mascota[]> {
    const { data, error } = await this.supabase
      .from('pacientes')
      .select('*')
      .eq('id_usuario', clienteId);

    if (error || !data) {
      return [];
    }

    return data.map((item: any) => this.mapToMascota(item));
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('pacientes')
      .delete()
      .eq('id_paciente', id);

    if (error) {
      throw new Error(`Error al eliminar mascota: ${error.message}`);
    }
  }

  private mapToMascota(data: any): Mascota {
    const cliente = new Cliente(data.id_usuario, '', '');
    return new Mascota(
      data.id_paciente,
      data.nombre,
      data.especie,
      data.raza,
      data.edad,
      cliente,
    );
  }
}
