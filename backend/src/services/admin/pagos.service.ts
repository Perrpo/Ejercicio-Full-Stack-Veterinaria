import { supabaseAdmin } from '../../supabase'
import { AdminPagoDTO } from '../../schemas/admin/pagos.schema'

export class PagosAdminService {

  static async getPagos() {
    const { data, error } = await supabaseAdmin
      .from('pagos')
      .select(`
        *,
        citas (
          fecha,
          pacientes (
            nombre
          )
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw new Error('Error obteniendo pagos')
    return data ?? []
  }

  static async createPago(data: AdminPagoDTO) {
    // 1️⃣ crear pago
    const { error: pagoError } = await supabaseAdmin
      .from('pagos')
      .insert(data)

    if (pagoError) throw new Error('Error creando pago')

    // 2️⃣ marcar cita como pagada
    const { error: citaError } = await supabaseAdmin
      .from('citas')
      .update({ pagado: true })
      .eq('id', data.id_cita)

    if (citaError) throw new Error('Error actualizando cita')
  }

  static async deletePago(id: string) {
    const { error } = await supabaseAdmin
      .from('pagos')
      .delete()
      .eq('id', id)

    if (error) throw new Error('Error eliminando pago')
  }
}
