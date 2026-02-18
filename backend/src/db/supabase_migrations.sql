-- =====================================
-- MIGRACIONES PARA SUPABASE (PostgreSQL)
-- =====================================
-- Ejecuta este archivo en Supabase SQL Editor

-- 1. Agregar columna 'observaciones' a tabla citas (si no existe)
ALTER TABLE citas
ADD COLUMN IF NOT EXISTS observaciones TEXT;

-- 2. Actualizar tabla usuarios para asegurar que tiene 'estado'
ALTER TABLE usuarios
ADD COLUMN IF NOT EXISTS estado VARCHAR(50) DEFAULT 'activo';

-- 3. Verificar que examenes tiene la estructura correcta
-- ALTER TABLE examenes ... (Supabase probablemente ya tiene esto bien)

-- 4. Crear índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_citas_usuario ON citas(id_usuario);
CREATE INDEX IF NOT EXISTS idx_citas_paciente ON citas(id_paciente);
CREATE INDEX IF NOT EXISTS idx_examenes_paciente ON examenes(id_paciente);
CREATE INDEX IF NOT EXISTS idx_pacientes_usuario ON pacientes(id_usuario);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);

-- 5. Policies RLS (Row Level Security) - IMPORTANTE para Supabase
-- Permitir a usuarios ver solo sus propios datos

ALTER TABLE citas ENABLE ROW LEVEL SECURITY;
ALTER TABLE examenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Políticas para citas
DROP POLICY IF EXISTS "enable_read_own_citas" ON citas;
CREATE POLICY "enable_read_own_citas" ON citas
  FOR SELECT USING (id_usuario = auth.uid()::text);

DROP POLICY IF EXISTS "enable_insert_own_citas" ON citas;
CREATE POLICY "enable_insert_own_citas" ON citas
  FOR INSERT WITH CHECK (id_usuario = auth.uid()::text);

DROP POLICY IF EXISTS "enable_update_own_citas" ON citas;
CREATE POLICY "enable_update_own_citas" ON citas
  FOR UPDATE USING (id_usuario = auth.uid()::text);

-- Políticas para examenes
DROP POLICY IF EXISTS "enable_read_own_examenes" ON examenes;
CREATE POLICY "enable_read_own_examenes" ON examenes
  FOR SELECT USING (
    id_paciente IN (
      SELECT id_paciente FROM pacientes WHERE id_usuario = auth.uid()::text
    )
  );

DROP POLICY IF EXISTS "enable_insert_own_examenes" ON examenes;
CREATE POLICY "enable_insert_own_examenes" ON examenes
  FOR INSERT WITH CHECK (
    id_paciente IN (
      SELECT id_paciente FROM pacientes WHERE id_usuario = auth.uid()::text
    )
  );

-- Políticas para pacientes
DROP POLICY IF EXISTS "enable_read_own_pacientes" ON pacientes;
CREATE POLICY "enable_read_own_pacientes" ON pacientes
  FOR SELECT USING (id_usuario = auth.uid()::text);

DROP POLICY IF EXISTS "enable_insert_own_pacientes" ON pacientes;
CREATE POLICY "enable_insert_own_pacientes" ON pacientes
  FOR INSERT WITH CHECK (id_usuario = auth.uid()::text);

-- Políticas para usuarios
DROP POLICY IF EXISTS "enable_read_own_perfil" ON usuarios;
CREATE POLICY "enable_read_own_perfil" ON usuarios
  FOR SELECT USING (id_usuario = auth.uid()::text);

DROP POLICY IF EXISTS "enable_update_own_perfil" ON usuarios;
CREATE POLICY "enable_update_own_perfil" ON usuarios
  FOR UPDATE USING (id_usuario = auth.uid()::text);
