-- ===================================
-- SCRIPT: Crear Usuario Admin
-- ===================================
-- Ejecuta este script en Supabase para crear un usuario admin

-- 1. Crear usuario en tabla usuarios
INSERT INTO usuarios (
  id_usuario,
  nombre,
  apellido,
  email,
  telefono,
  direccion,
  rol,
  estado
) VALUES (
  'admin-veterinario-001',
  'Admin',
  'Veterinario',
  'admin@veterinaria.com',
  '3001234567',
  'Clínica Veterinaria',
  'admin',
  'activo'
) ON CONFLICT DO NOTHING;

-- 2. Crear usuario en tabla admin_users (si la tienes)
INSERT INTO admin_users (
  id_admin,
  nombre,
  email,
  password_hash,
  rol,
  estado,
  fecha_creacion
) VALUES (
  'admin-vet-001',
  'Admin Veterinario',
  'admin@veterinaria.com',
  'hashear-password-aqui',
  'superadmin',
  'activo',
  NOW()
) ON CONFLICT DO NOTHING;

-- 3. Crear veterinario admin (si tienes tabla veterinarios)
INSERT INTO veterinarios (
  id_veterinario,
  nombre,
  especialidad,
  email,
  telefono,
  es_admin
) VALUES (
  'vet-admin-001',
  'Dr. Admin',
  'Medicina General',
  'admin@veterinaria.com',
  '3001234567',
  true
) ON CONFLICT DO NOTHING;
