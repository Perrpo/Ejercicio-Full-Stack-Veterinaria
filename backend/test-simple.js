const mysql = require('mysql2/promise');

async function testDB() {
  let connection;
  try {
    console.log('🔌 Probando conexión a la base de datos...');
    
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'vetcare'
    });
    
    console.log('✅ Conexión exitosa');
    
    // Verificar tablas
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('📋 Tablas disponibles:', tables.map(t => Object.values(t)[0]));
    
    // Verificar estructura de pagos
    const [pagosStructure] = await connection.execute('DESCRIBE pagos');
    console.log('🔍 Estructura de pagos:', pagosStructure);
    
    // Verificar datos de pagos
    const [pagosData] = await connection.execute('SELECT * FROM pagos LIMIT 3');
    console.log('💰 Datos de pagos:', pagosData);
    
    // Verificar citas
    const [citasData] = await connection.execute('SELECT id_cita, fecha_cita FROM citas LIMIT 3');
    console.log('📅 Datos de citas:', citasData);
    
    console.log('✅ Todas las pruebas pasaron');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

testDB();
