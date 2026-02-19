/**
 * TEST - Verificar conexión a Supabase y data de pagos
 */
import 'dotenv/config'
import { supabaseAdmin } from './src/supabase'

async function testPagos() {
  console.log('🧪 Iniciando test de pagos...')
  
  try {
    console.log('📡 Consultando tabla "pagos"...')
    const { data, error } = await supabaseAdmin
      .from('pagos')
      .select('*')
      .limit(5)
    
    if (error) {
      console.error('❌ Error en la query:', error)
      return
    }
    
    console.log('✅ Datos recibidos:', JSON.stringify(data, null, 2))
    console.log(`📊 Total de pagos encontrados: ${data?.length || 0}`)
  } catch (err) {
    console.error('❌ Error inesperado:', err)
  }
}

testPagos()
