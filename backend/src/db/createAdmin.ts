import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

/**
 * Script de utilidad para promover a admin un usuario existente (o crearlo si no existe).
 * Variables opcionales:
 *  ADMIN_EMAIL (default: admin@vetcare.com)
 *  ADMIN_PASSWORD (default: Admin1234!)
 *  ADMIN_NOMBRE (default: Admin)
 *  ADMIN_APELLIDO (default: Principal)
 */
async function main() {
  const supabaseUrl = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env')
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@vetcare.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin1234!'
  const adminNombre = process.env.ADMIN_NOMBRE || 'Admin'
  const adminApellido = process.env.ADMIN_APELLIDO || 'Principal'

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  let userId: string | undefined

  // Intentar crear; si ya existe, se seguirá buscando
  const createRes = await supabase.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true,
  })

  if (!createRes.error && createRes.data.user) {
    userId = createRes.data.user.id
    console.log(`Usuario creado: ${adminEmail}`)
  } else {
    if (createRes.error && !createRes.error.message.toLowerCase().includes('exists')) {
      throw createRes.error
    }

    // Buscar usuario existente iterando listUsers
    let page = 1
    const perPage = 100
    while (!userId) {
      const { data, error } = await supabase.auth.admin.listUsers({ page, perPage })
      if (error) throw error
      const found = data.users.find((u) => u.email?.toLowerCase() === adminEmail.toLowerCase())
      if (found) {
        userId = found.id
        break
      }
      if (data.users.length < perPage) break
      page++
    }

    if (!userId) throw new Error(`No se encontró usuario en auth.users con email ${adminEmail}`)

    const { error: updErr } = await supabase.auth.admin.updateUserById(userId, {
      password: adminPassword,
      email_confirm: true,
    })
    if (updErr) throw updErr
    console.log(`Usuario existente actualizado: ${adminEmail}`)
  }

  // Upsert en tabla de dominio
  const { error: upsertErr } = await supabase
    .from('usuarios')
    .upsert(
      {
        id_usuario: userId,
        nombre: adminNombre,
        apellido: adminApellido,
        email: adminEmail,
        telefono: 'N/A',
        direccion: 'N/A',
        rol: 'admin',
      },
      { onConflict: 'id_usuario' }
    )
  if (upsertErr) throw upsertErr

  console.log(`Listo. ${adminEmail} es admin. Password: ${adminPassword}`)
}

main().catch((err) => {
  console.error('Error creando admin:', err)
  process.exit(1)
})
