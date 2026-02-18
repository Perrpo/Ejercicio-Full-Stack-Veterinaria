USE vetcare;

-- 1. Actualizar la tabla servicios para cambiar precio de DECIMAL a INT
ALTER TABLE servicios MODIFY COLUMN precio INT NOT NULL;

-- 2. Actualizar la tabla pagos para cambiar monto de DECIMAL a INT
ALTER TABLE pagos MODIFY COLUMN monto INT NOT NULL;

-- 3. Actualizar los precios existentes para eliminar decimales
UPDATE servicios SET precio = 180000 WHERE nombre = 'Consulta General';
UPDATE servicios SET precio = 120000 WHERE nombre = 'Vacunación';
UPDATE servicios SET precio = 300000 WHERE nombre = 'Cirugía Menor';
UPDATE servicios SET precio = 200000 WHERE nombre = 'Análisis de Sangre';
UPDATE servicios SET precio = 250000 WHERE nombre = 'Radiografía';
UPDATE servicios SET precio = 220000 WHERE nombre = 'Limpieza Dental';
UPDATE servicios SET precio = 350000 WHERE nombre = 'Urgencias';
UPDATE servicios SET precio = 160000 WHERE nombre = 'Peluquería Canina';

-- 4. Actualizar los montos de pagos existentes
UPDATE pagos SET monto = 180000 WHERE id_cita = 1;
UPDATE pagos SET monto = 120000 WHERE id_cita = 2;
UPDATE pagos SET monto = 35000 WHERE id_cita = 3;
UPDATE pagos SET monto = 120000 WHERE id_cita = 4;
UPDATE pagos SET monto = 95000 WHERE id_cita = 5;

-- Verificar los cambios
SELECT 'Servicios actualizados:' as info;
SELECT id_servicio, nombre, precio FROM servicios;

SELECT 'Pagos actualizados:' as info;
SELECT id_pago, id_cita, monto FROM pagos;
