import { createPool } from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

const db = createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'vetcare',
  port: Number(process.env.DB_PORT || 3306),
  connectionLimit: 10,
})

async function testDatabase() {
  try {
    console.log('Probando conexión a la base de datos...')
    
    // Probar conexión básica
    const [result] = await db.query('SELECT 1 as test')
    console.log('✅ Conexión exitosa:', result)
    
    // Verificar que la base de datos existe
    const [databases] = await db.query('SHOW DATABASES')
    console.log('📚 Bases de datos disponibles:', databases.map(db => db.Database))
    
    // Verificar que la tabla pagos existe
    const [tables] = await db.query('SHOW TABLES')
    console.log('📋 Tablas disponibles:', tables.map(table => Object.values(table)[0]))
    
    // Verificar estructura de la tabla pagos
    const [pagosStructure] = await db.query('DESCRIBE pagos')
    console.log('🔍 Estructura de la tabla pagos:', pagosStructure)
    
    // Verificar datos en la tabla pagos
    const [pagosData] = await db.query('SELECT * FROM pagos LIMIT 5')
    console.log('💰 Datos de pagos (primeros 5):', pagosData)
    
    // Verificar que las citas existen
    const [citasData] = await db.query('SELECT id_cita, fecha_cita FROM citas LIMIT 5')
    console.log('📅 Datos de citas (primeros 5):', citasData)
    
    console.log('✅ Todas las pruebas pasaron exitosamente')
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error)
  } finally {
    await db.end()
  }
}

testDatabase()
