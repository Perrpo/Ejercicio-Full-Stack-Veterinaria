import { ICitaRepository } from '../../domain/interfaces/ICitaRepository';
import { Cita } from '../../domain/entities/Cita';
import { Mascota } from '../../domain/entities/Mascota';
import { Veterinario } from '../../domain/entities/Veterinario';
import { Cliente } from '../../domain/entities/Cliente';
import { EstadoCita } from '../../domain/enums/EstadoCita';

/**
 * CitaRepository - Implementación concreta del repositorio de citas
 * Cumple con DIP (Dependency Inversion Principle) - depende de la interfaz, no de la BD
 */
export class CitaRepository implements ICitaRepository {
  constructor(private supabase: any) {}

  async save(cita: Cita): Promise<void> {
    const data = {
      id_cita: cita.id,
      id_mascota: cita.mascota.id,
      id_veterinario: cita.veterinario.id,
      fecha_cita: cita.fecha,
      estado: cita.obtenerEstado(),
      observaciones: cita.observaciones,
    };

    const { error } = await this.supabase
      .from('citas')
      .upsert(data, { onConflict: 'id_cita' });

    if (error) {
      throw new Error(`Error al guardar cita: ${error.message}`);
    }
  }

  async findById(id: string): Promise<Cita | null> {
    const { data, error } = await this.supabase
      .from('citas')
      .select(`
        id_cita,
        fecha_cita,
        estado,
        observaciones,
        pacientes(*),
        veterinarios(*)
      `)
      .eq('id_cita', id)
      .single();

    if (error || !data) {
      return null;
    }

    return this.mapToCita(data);
  }

  async findByMascota(mascotaId: string): Promise<Cita[]> {
    const { data, error } = await this.supabase
      .from('citas')
      .select(`
        id_cita,
        fecha_cita,
        estado,
        observaciones,
        pacientes(*),
        veterinarios(*)
      `)
      .eq('id_mascota', mascotaId);

    if (error || !data) {
      return [];
    }

    return data.map((item: any) => this.mapToCita(item));
  }

  async findByCliente(clienteId: string): Promise<Cita[]> {
    const { data, error } = await this.supabase
      .from('citas')
      .select(`
        id_cita,
        fecha_cita,
        estado,
        observaciones,
        pacientes(*),
        veterinarios(*)
      `)
      .eq('id_usuario', clienteId);

    if (error || !data) {
      return [];
    }

    return data.map((item: any) => this.mapToCita(item));
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('citas')
      .delete()
      .eq('id_cita', id);

    if (error) {
      throw new Error(`Error al eliminar cita: ${error.message}`);
    }
  }

  private mapToCita(data: any): Cita {
    const cliente = new Cliente(
      data.pacientes?.id_usuario,
      data.pacientes?.nombre || '',
      '',
    );

    const mascota = new Mascota(
      data.pacientes?.id_paciente,
      data.pacientes?.nombre,
      data.pacientes?.especie,
      data.pacientes?.raza,
      data.pacientes?.edad,
      cliente,
    );

    const veterinario = new Veterinario(
      data.veterinarios?.id_veterinario,
      data.veterinarios?.nombre,
      data.veterinarios?.especialidad,
    );

    const cita = new Cita(data.id_cita, new Date(data.fecha_cita), mascota, veterinario, data.observaciones);
    cita.cambiarEstado(data.estado as EstadoCita);

    return cita;
  }
}
