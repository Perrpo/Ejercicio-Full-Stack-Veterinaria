const mysql = require('mysql2/promise');

async function checkTableStructure() {
  let connection;
  try {
    console.log('🔍 Verificando estructura de la tabla pagos...');
    
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'vetcare'
    });
    
    // Verificar estructura de la tabla pagos
    const [pagosStructure] = await connection.execute('DESCRIBE pagos');
    console.log('📋 Estructura de la tabla pagos:');
    pagosStructure.forEach(field => {
      console.log(`  ${field.Field}: ${field.Type} ${field.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${field.Default ? `DEFAULT ${field.Default}` : ''}`);
    });
    
    // Verificar si hay datos en la tabla
    const [pagosCount] = await connection.execute('SELECT COUNT(*) as count FROM pagos');
    console.log(`💰 Total de pagos en la tabla: ${pagosCount[0].count}`);
    
    // Verificar el tipo de dato de fecha_pago específicamente
    const fechaField = pagosStructure.find(field => field.Field === 'fecha_pago');
    if (fechaField) {
      console.log(`\n📅 Campo fecha_pago:`);
      console.log(`   Tipo: ${fechaField.Type}`);
      console.log(`   Null: ${fechaField.Null}`);
      console.log(`   Default: ${fechaField.Default}`);
      console.log(`   Extra: ${fechaField.Extra}`);
    }
    
    // Probar inserción de fecha
    console.log('\n🧪 Probando inserción de fecha...');
    const testDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    console.log(`   Fecha a probar: "${testDate}"`);
    
    // Verificar que hay al menos una cita para hacer la prueba
    const [citasCount] = await connection.execute('SELECT COUNT(*) as count FROM citas');
    if (citasCount[0].count > 0) {
      const [cita] = await connection.execute('SELECT id_cita FROM citas LIMIT 1');
      const testInsert = await connection.execute(
        'INSERT INTO pagos (id_cita, metodo_pago, monto, fecha_pago, estado) VALUES (?, ?, ?, ?, ?)',
        [cita[0].id_cita, 'efectivo', 100000, testDate, 'pendiente']
      );
      console.log('   ✅ Inserción de prueba exitosa');
      
      // Limpiar la inserción de prueba
      await connection.execute('DELETE FROM pagos WHERE id_pago = ?', [testInsert[0].insertId]);
      console.log('   🧹 Inserción de prueba eliminada');
    } else {
      console.log('   ⚠️ No hay citas disponibles para hacer la prueba');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkTableStructure();
