import fs from 'fs'
import path from 'path'
import { createPool } from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

async function runSQL(file: string) {
  const sql = fs.readFileSync(file, 'utf-8')
  const statements = sql
    .split(/;\s*\n/)
    .map(s => s.trim())
    .filter(Boolean)
  const pool = createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
    port: Number(process.env.DB_PORT || 3306),
  })
  const conn = await pool.getConnection()
  try {
    for (const stmt of statements) {
      await conn.query(stmt)
    }
  } finally {
    conn.release()
    await pool.end()
  }
}

async function main() {
  const base = path.resolve(__dirname)
  await runSQL(path.join(base, 'migrations.sql'))
  await runSQL(path.join(base, 'seed.sql'))
  console.log('DB migrated and seeded')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})


