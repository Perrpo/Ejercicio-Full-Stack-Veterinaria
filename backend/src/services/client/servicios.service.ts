export class ServiciosService {
  static async getServicios(supabase: any) {
    const { data: servicios, error } = await supabase
      .from('servicios')
      .select('id_servicio, nombre, precio')
      .order('nombre', { ascending: true })

    if (error) throw new Error('Error al obtener servicios')

    return (servicios || []).map((servicio: any) => ({
      ...servicio,
      precio_formateado: servicio.precio.toLocaleString('es-CO'),
    }))
  }
}
