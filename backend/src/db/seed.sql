USE vetcare;

-- Usuarios (incluye admin con password 'Admin1234!')
INSERT INTO usuarios (nombre, apellido, email, password, telefono, direccion, rol, fecha_registro) VALUES
('Admin', 'Sistema', 'admin@vetcare.com', '$2a$10$4XjJv0qF1t.k1sV4gX6xge6p6r6yqf8aH1mM2bQfQwD9o7u5c9m4K', '+57 300 000 0000', 'Oficina Central', 'admin', NOW()),
('María', 'González', 'maria.gonzalez@email.com', '$2a$10$B7o8Jm7M2i7wO8r9qS1pUe6O9wT2yXj3d2u1aQpWq6h8l9d0cN8uK', '+57 300 123 456', 'Calle Mayor 123, Bogotá', 'cliente', NOW()),
('Carlos', 'Rodríguez', 'carlos.rodriguez@veterinaria.com', '$2a$10$B7o8Jm7M2i7wO8r9qS1pUe6O9wT2yXj3d2u1aQpWq6h8l9d0cN8uK', '+57 300 789 012', 'Avenida Veterinaria 45, Bogotá', 'veterinario', NOW()),
('Ana', 'López', 'ana.lopez@email.com', '$2a$10$B7o8Jm7M2i7wO8r9qS1pUe6O9wT2yXj3d2u1aQpWq6h8l9d0cN8uK', '+57 300 345 678', 'Plaza Central 8, Bogotá', 'cliente', NOW()),
('Elena', 'Martín', 'elena.martin@veterinaria.com', '$2a$10$B7o8Jm7M2i7wO8r9qS1pUe6O9wT2yXj3d2u1aQpWq6h8l9d0cN8uK', '+57 300 555 444', 'Consulta 2, Bogotá', 'veterinario', NOW());

-- Servicios
INSERT INTO servicios (nombre, descripcion, precio) VALUES
('Consulta General', 'Revisión médica general del paciente', 180000),
('Vacunación', 'Administración de vacunas', 120000),
('Cirugía Menor', 'Procedimientos quirúrgicos menores', 300000),
('Análisis de Sangre', 'Extracción y análisis de sangre', 200000),
('Radiografía', 'Radiografía digital para diagnóstico', 250000),
('Limpieza Dental', 'Limpieza profesional de dientes', 220000),
('Urgencias', 'Atención médica urgente', 350000),
('Peluquería Canina', 'Servicio de peluquería y estética', 160000);

-- Pacientes (propietarios: María=2, Ana=4)
INSERT INTO pacientes (id_usuario, nombre, especie, raza, edad, peso) VALUES
(2, 'Luna', 'Perro', 'Golden Retriever', 3, 28.50),
(2, 'Miau', 'Gato', 'Persa', 2, 4.20),
(4, 'Max', 'Perro', 'Pastor Alemán', 5, 35.00),
(4, 'Coco', 'Conejo', 'Holandés', 1, 1.80),
(2, 'Pipo', 'Ave', 'Canario', 2, 0.25);

-- Citas (cliente María=2, Ana=4; vet Carlos=3, Elena=5)
INSERT INTO citas (id_usuario, id_paciente, id_servicio, fecha_cita, estado) VALUES
(2, 1, 1, '2024-09-15 10:30:00', 'confirmada'),
(4, 3, 2, '2024-09-15 14:00:00', 'pendiente'),
(2, 2, 6, '2024-09-16 09:00:00', 'completada'),
(4, 4, 1, '2024-09-16 11:30:00', 'confirmada'),
(2, 1, 7, '2024-09-14 20:00:00', 'cancelada');

-- Pagos (en COP)
INSERT INTO pagos (id_cita, metodo_pago, monto, fecha_pago, estado) VALUES
(1, 'tarjeta_credito', 180000, NOW(), 'pagado'),
(2, 'efectivo', 120000, NOW(), 'pagado'),
(3, 'transferencia', 35000, NOW(), 'pendiente'),
(4, 'tarjeta_credito', 120000, NOW(), 'fallido'),
(5, 'efectivo', 95000, NOW(), 'pagado');

-- Exámenes
INSERT INTO examenes (id_paciente, tipo_examen, fecha_examen, resultado, observaciones, estado) VALUES
(1, 'Análisis de Sangre', '2024-09-10 08:00:00', 'Valores normales', 'Paciente en buen estado general', 'completado'),
(2, 'Radiografía Torácica', '2024-09-12 10:00:00', 'Sin hallazgos patológicos', 'Pulmones y corazón normales', 'completado'),
(3, 'Análisis de Orina', '2024-09-13 14:00:00', 'Pendiente de resultados', 'Muestra enviada al laboratorio', 'en_proceso'),
(4, 'Ecografía Abdominal', '2024-09-14 09:00:00', 'Órganos internos normales', 'No se observan alteraciones', 'completado'),
(5, 'Análisis de Plumas', '2024-09-11 11:00:00', 'Pendiente de resultados', 'Muestra en análisis', 'pendiente');


