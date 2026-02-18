-- =====================================================
-- LIMPIAR SUPABASE Y CARGAR DATOS DESDE MYSQL
-- =====================================================

-- 1) Borrar tablas existentes (en orden inverso por FKs)
DROP TABLE IF EXISTS pagos CASCADE;
DROP TABLE IF EXISTS examenes CASCADE;
DROP TABLE IF EXISTS citas CASCADE;
DROP TABLE IF EXISTS pacientes CASCADE;
DROP TABLE IF EXISTS servicios CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

-- 2) Crear tipos personalizados (si no existen)
DO $$ BEGIN
  CREATE TYPE rol AS ENUM ('cliente', 'veterinario', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE estado_cita AS ENUM ('pendiente', 'confirmada', 'completada', 'cancelada');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE estado_pago AS ENUM ('pendiente', 'pagado', 'fallido');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE metodo_pago AS ENUM ('tarjeta_credito', 'efectivo', 'transferencia');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE estado_examen AS ENUM ('pendiente', 'en_proceso', 'completado');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3) Crear tablas con UUIDs y DEFAULT auth.uid() para usuarios
CREATE TABLE usuarios (
  id_usuario uuid PRIMARY KEY DEFAULT auth.uid(),
  nombre varchar(100) NOT NULL,
  apellido varchar(100) NOT NULL,
  email varchar(150) NOT NULL UNIQUE,
  password varchar(255) NOT NULL,
  telefono varchar(20) NOT NULL,
  direccion varchar(255) NOT NULL,
  rol rol NOT NULL DEFAULT 'cliente',
  fecha_registro timestamp with time zone DEFAULT now()
);

CREATE TABLE servicios (
  id_servicio integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre varchar(100) NOT NULL,
  descripcion text NOT NULL,
  precio integer NOT NULL,
  duracion integer DEFAULT 60
);

CREATE TABLE pacientes (
  id_paciente integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_usuario uuid NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  nombre varchar(100) NOT NULL,
  especie varchar(50) NOT NULL,
  raza varchar(100) NOT NULL,
  edad integer NOT NULL,
  peso numeric(5,2) NOT NULL
);

CREATE TABLE citas (
  id_cita integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_usuario uuid NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  id_paciente integer NOT NULL REFERENCES pacientes(id_paciente) ON DELETE CASCADE,
  id_servicio integer NOT NULL REFERENCES servicios(id_servicio) ON DELETE CASCADE,
  fecha_cita timestamp with time zone NOT NULL,
  estado estado_cita NOT NULL DEFAULT 'pendiente'
);

CREATE TABLE examenes (
  id_examen integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_paciente integer NOT NULL REFERENCES pacientes(id_paciente) ON DELETE CASCADE,
  tipo_examen varchar(100) NOT NULL,
  fecha_examen timestamp with time zone NOT NULL,
  resultado text,
  observaciones text,
  estado estado_examen NOT NULL DEFAULT 'pendiente'
);

CREATE TABLE pagos (
  id_pago integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_cita integer NOT NULL REFERENCES citas(id_cita) ON DELETE CASCADE,
  metodo_pago metodo_pago NOT NULL,
  monto integer NOT NULL,
  fecha_pago timestamp with time zone DEFAULT now(),
  estado estado_pago NOT NULL DEFAULT 'pendiente'
);

-- 4) Crear función helper para admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.usuarios
    WHERE id_usuario = user_id AND rol = 'admin'
  );
$$;

-- 5) Insertar datos desde MySQL (ajustando IDs a UUIDs)
-- NOTA: Los usuarios de MySQL no se migran directamente porque Supabase Auth maneja auth.users.
-- Solo insertamos usuarios de ejemplo con UUIDs fijos para pruebas.
-- Los usuarios reales se crearán via registro en Supabase Auth.

-- Insertar servicios
INSERT INTO servicios (nombre, descripcion, precio, duracion) VALUES
('Consulta General', 'Revisión médica general del paciente', 180000, 60),
('Vacunación', 'Administración de vacunas', 120000, 30),
('Cirugía Menor', 'Procedimientos quirúrgicos menores', 300000, 120),
('Análisis de Sangre', 'Extracción y análisis de sangre', 200000, 45),
('Radiografía', 'Radiografía digital para diagnóstico', 250000, 30),
('Limpieza Dental', 'Limpieza profesional de dientes', 220000, 60),
('Urgencias', 'Atención médica urgente', 350000, 90),
('Peluquería Canina', 'Servicio de peluquería y estética', 160000, 90);

-- Insertar usuarios de ejemplo con UUIDs fijos (para migrar datos existentes)
-- Estos usuarios deben existir en Supabase Auth con los mismos emails para que funcionen las relaciones
INSERT INTO usuarios (id_usuario, nombre, apellido, email, password, telefono, direccion, rol, fecha_registro) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'María', 'González', 'maria.gonzalez@email.com', '$2a$10$B7o8Jm7M2i7wO8r9qS1pUe6O9wT2yXj3d2u1aQpWq6h8l9d0cN8uK', '+57 300 123 456', 'Calle Mayor 123, Bogotá', 'cliente', '2025-09-03 02:27:55'),
('550e8400-e29b-41d4-a716-446655440002', 'Ana', 'López', 'ana.lopez@email.com', '$2a$10$B7o8Jm7M2i7wO8r9qS1pUe6O9wT2yXj3d2u1aQpWq6h8l9d0cN8uK', '+57 300 345 678', 'Plaza Central 8, Bogotá', 'cliente', '2025-09-03 02:27:55'),
('550e8400-e29b-41d4-a716-446655440003', 'Nicole', 'Yuqui', 'nicole@gmail.com', '', '3123821739', 'Mi casa', 'cliente', '2025-09-03 17:55:18'),
('550e8400-e29b-41d4-a716-446655440004', 'Andres', 'Felipe', 'andresfelipe@gmail.com', '$2b$10$3T/gKkyKteSAkWXA0EP8neOytpPqdx06Ohbkzy95MaCb.1Ca7sydK', '3503374876', 'Al costado de mi vecino', 'cliente', '2025-09-03 20:22:37'),
('550e8400-e29b-41d4-a716-446655440005', 'Jose', 'Velez', 'josevelez@gmail.com', '$2b$10$jw6tq4ZDD4PNTR/V083skOiXDFIq9KPtNgj2VpffaeWi4RcvfUlEC', '3059305930', 'Al costado de mi vecino', 'cliente', '2025-09-04 17:54:43');

-- Insertar pacientes (mapeando id_usuario antiguos a nuevos UUIDs)
INSERT INTO pacientes (id_usuario, nombre, especie, raza, edad, peso) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Luna', 'Perro', 'Golden Retriever', 3, 28.50),
('550e8400-e29b-41d4-a716-446655440001', 'Miau', 'Gato', 'Persa', 2, 4.20),
('550e8400-e29b-41d4-a716-446655440002', 'Max', 'Perro', 'Pastor Alemán', 5, 35.00),
('550e8400-e29b-41d4-a716-446655440002', 'Coco', 'Conejo', 'Holandés', 1, 1.80),
('550e8400-e29b-41d4-a716-446655440001', 'Pipo', 'Ave', 'Canario', 2, 0.25),
('550e8400-e29b-41d4-a716-446655440003', 'Oreo', 'Perro', 'Chandoso', 3, 60.02),
('550e8400-e29b-41d4-a716-446655440004', 'Pumba', 'Gato', 'Otro', 1, 5.00);

-- Insertar citas (mapeando IDs)
INSERT INTO citas (id_usuario, id_paciente, id_servicio, fecha_cita, estado) VALUES
('550e8400-e29b-41d4-a716-446655440001', 1, 1, '2024-09-15 20:30:00', 'confirmada'),
('550e8400-e29b-41d4-a716-446655440002', 3, 2, '2024-09-15 14:00:00', 'pendiente'),
('550e8400-e29b-41d4-a716-446655440001', 2, 6, '2024-09-16 09:00:00', 'completada'),
('550e8400-e29b-41d4-a716-446655440002', 4, 1, '2024-09-16 11:30:00', 'confirmada'),
('550e8400-e29b-41d4-a716-446655440001', 1, 7, '2024-09-14 20:00:00', 'cancelada'),
('550e8400-e29b-41d4-a716-446655440003', 6, 8, '2025-09-11 01:30:00', 'cancelada'),
('550e8400-e29b-41d4-a716-446655440004', 7, 4, '2025-09-18 15:00:00', 'completada'),
('550e8400-e29b-41d4-a716-446655440004', 7, 1, '2025-09-13 00:00:00', 'cancelada');

-- Insertar exámenes
INSERT INTO examenes (id_paciente, tipo_examen, fecha_examen, resultado, observaciones, estado) VALUES
(7, 'Análisis de Sangre', '2025-09-03 22:44:09', NULL, 'Lo pidio el veterinario', 'pendiente');

-- Insertar pagos (mapeando id_cita)
INSERT INTO pagos (id_cita, metodo_pago, monto, fecha_pago, estado) VALUES
(1, 'tarjeta_credito', 180000, '2025-09-03 02:27:55', 'pagado'),
(2, 'efectivo', 120000, '2025-09-03 02:27:55', 'pagado'),
(3, 'transferencia', 60000, '2025-09-03 02:27:55', 'pendiente'),
(4, 'tarjeta_credito', 120000, '2025-09-03 02:27:55', 'pagado'),
(5, 'efectivo', 95000, '2025-09-03 02:27:55', 'pagado'),
(6, 'efectivo', 60000, '2025-09-04 00:08:06', 'pagado'),
(7, 'tarjeta_credito', 200000, '2025-09-04 08:53:39', 'pagado'),
(8, 'efectivo', 80000, '2025-09-04 22:53:58', 'pagado');

-- 6) Habilitar RLS
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE citas ENABLE ROW LEVEL SECURITY;
ALTER TABLE examenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagos ENABLE ROW LEVEL SECURITY;

-- 7) Policies
-- Usuarios: admin puede ver todos, usuarios solo ven su propio perfil
CREATE POLICY "usuarios_select_own" ON usuarios FOR SELECT USING (auth.uid() = id_usuario);
CREATE POLICY "usuarios_admin_all" ON usuarios FOR ALL USING (public.is_admin(auth.uid()));

-- Pacientes: admin todo, dueño solo sus pacientes
CREATE POLICY "pacientes_owner_select" ON pacientes FOR SELECT USING (id_usuario = auth.uid());
CREATE POLICY "pacientes_owner_insert" ON pacientes FOR INSERT WITH CHECK (id_usuario = auth.uid());
CREATE POLICY "pacientes_owner_update" ON pacientes FOR UPDATE USING (id_usuario = auth.uid());
CREATE POLICY "pacientes_owner_delete" ON pacientes FOR DELETE USING (id_usuario = auth.uid());
CREATE POLICY "pacientes_admin_all" ON pacientes FOR ALL USING (public.is_admin(auth.uid()));

-- Citas: admin todo, cliente solo sus citas
CREATE POLICY "citas_owner_select" ON citas FOR SELECT USING (id_usuario = auth.uid());
CREATE POLICY "citas_owner_insert" ON citas FOR INSERT WITH CHECK (id_usuario = auth.uid());
CREATE POLICY "citas_owner_update" ON citas FOR UPDATE USING (id_usuario = auth.uid());
CREATE POLICY "citas_owner_delete" ON citas FOR DELETE USING (id_usuario = auth.uid());
CREATE POLICY "citas_admin_all" ON citas FOR ALL USING (public.is_admin(auth.uid()));

-- Examenes: admin todo, dueño del paciente solo sus exámenes
CREATE POLICY "examenes_owner_select" ON examenes FOR SELECT USING (
  EXISTS (SELECT 1 FROM pacientes p WHERE p.id_paciente = examenes.id_paciente AND p.id_usuario = auth.uid())
);
CREATE POLICY "examenes_owner_insert" ON examenes FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM pacientes p WHERE p.id_paciente = examenes.id_paciente AND p.id_usuario = auth.uid())
);
CREATE POLICY "examenes_owner_update" ON examenes FOR UPDATE USING (
  EXISTS (SELECT 1 FROM pacientes p WHERE p.id_paciente = examenes.id_paciente AND p.id_usuario = auth.uid())
);
CREATE POLICY "examenes_owner_delete" ON examenes FOR DELETE USING (
  EXISTS (SELECT 1 FROM pacientes p WHERE p.id_paciente = examenes.id_paciente AND p.id_usuario = auth.uid())
);
CREATE POLICY "examenes_admin_all" ON examenes FOR ALL USING (public.is_admin(auth.uid()));

-- Pagos: admin todo, cliente solo sus pagos
CREATE POLICY "pagos_owner_select" ON pagos FOR SELECT USING (
  EXISTS (SELECT 1 FROM citas c WHERE c.id_cita = pagos.id_cita AND c.id_usuario = auth.uid())
);
CREATE POLICY "pagos_owner_insert" ON pagos FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM citas c WHERE c.id_cita = pagos.id_cita AND c.id_usuario = auth.uid())
);
CREATE POLICY "pagos_owner_update" ON pagos FOR UPDATE USING (
  EXISTS (SELECT 1 FROM citas c WHERE c.id_cita = pagos.id_cita AND c.id_usuario = auth.uid())
);
CREATE POLICY "pagos_owner_delete" ON pagos FOR DELETE USING (
  EXISTS (SELECT 1 FROM citas c WHERE c.id_cita = pagos.id_cita AND c.id_usuario = auth.uid())
);
CREATE POLICY "pagos_admin_all" ON pagos FOR ALL USING (public.is_admin(auth.uid()));

-- Servicios: solo lectura para todos
CREATE POLICY "servicios_read" ON servicios FOR SELECT USING (true);
CREATE POLICY "servicios_admin_all" ON servicios FOR ALL USING (public.is_admin(auth.uid()));

-- =====================================================
-- IMPORTANTE: Para que los usuarios de ejemplo funcionen,
-- deben existir en Supabase Auth con los mismos emails.
-- Puedes crearlos manualmente en Authentication → Users.
-- =====================================================
