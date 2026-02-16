import { SupabaseClient } from '@supabase/supabase-js'

declare global {
  namespace Express {
    interface Request {
      user?: {
        sub: string
        rol: 'cliente' | 'veterinario' | 'admin'
        nombre: string
        apellido: string
      }
      supabase?: SupabaseClient
    }
  }
}
