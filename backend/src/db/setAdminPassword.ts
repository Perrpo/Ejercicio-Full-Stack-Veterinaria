import { createPool } from 'mysql2/promise'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'

dotenv.config()

async function main(){
  const pool = createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'vetcare',
    port: Number(process.env.DB_PORT || 3306),
  })
  const hash = await bcrypt.hash('Admin1234!', 10)
  await pool.query('UPDATE usuarios SET password = ? WHERE email = ?', [hash, 'admin@vetcare.com'])
  console.log('Admin password set to Admin1234!')
  await pool.end()
}

main().catch(e=>{ console.error(e); process.exit(1) })


