/*
  compare-db-counts.js

  Script to compare row counts between the SQLite development DB (dev.db)
  and a PostgreSQL database after migration.

  Usage:
    1. Ensure DATABASE_URL is set for the Postgres target (e.g. export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cs2_fortune)
    2. Run from the backend folder:
       node scripts/compare-db-counts.js

  The script compares counts for these tables:
    - "User"
    - "Case"
    - "CaseItem"
    - "TradeOffer"
    - "Deposit"
    - "Withdrawal"

  If counts differ it will print the difference and show up to 10 missing IDs in Postgres.
*/

const sqlite3 = require('sqlite3').verbose()
const { Client } = require('pg')
const path = require('path')

const SQLITE_DB = path.join(__dirname, '..', 'prisma', 'dev.db')
const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error('ERROR: defina a variável de ambiente DATABASE_URL apontando para o Postgres (ex: postgresql://user:pass@host:5432/db)')
  process.exit(1)
}

const tables = [
  'User',
  'Case',
  'CaseItem',
  'TradeOffer',
  'Deposit',
  'Withdrawal'
]

async function getSqliteCount(db, table) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT COUNT(*) AS cnt FROM "${table}"`, (err, row) => {
      if (err) return reject(err)
      resolve(row ? row.cnt : 0)
    })
  })
}

async function getPostgresCount(pg, table) {
  const res = await pg.query(`SELECT COUNT(*)::bigint AS cnt FROM "${table}"`)
  return res.rows[0].cnt
}

async function getSqliteIds(db, table) {
  return new Promise((resolve, reject) => {
    db.all(`SELECT id FROM "${table}"`, (err, rows) => {
      if (err) return reject(err)
      resolve(rows.map(r => r.id))
    })
  })
}

async function getPostgresIds(pg, table) {
  const res = await pg.query(`SELECT id FROM "${table}"`)
  return res.rows.map(r => r.id)
}

function difference(a, b) {
  const setB = new Set(b)
  return a.filter(x => !setB.has(x))
}

async function run() {
  const sqlite = new sqlite3.Database(SQLITE_DB)
  const pg = new Client({ connectionString: DATABASE_URL })
  await pg.connect()

  console.log('Comparando contagens entre SQLite (dev.db) e Postgres...')

  for (const table of tables) {
    try {
      const [sqliteCount, pgCount] = await Promise.all([
        getSqliteCount(sqlite, table),
        getPostgresCount(pg, table)
      ])

      const sqliteNum = Number(sqliteCount)
      const pgNum = Number(pgCount)

      if (sqliteNum === pgNum) {
        console.log(`OK\t${table}: ${sqliteNum}`)
      } else {
        console.warn(`MISMATCH\t${table}: SQLite=${sqliteNum} Postgres=${pgNum} (diff=${sqliteNum - pgNum})`)

        // show some missing ids in Postgres
        const [sqliteIds, pgIds] = await Promise.all([
          getSqliteIds(sqlite, table),
          getPostgresIds(pg, table)
        ])

        const missingInPostgres = difference(sqliteIds, pgIds)
        console.log(`  IDs in SQLite not in Postgres (show up to 10): ${missingInPostgres.slice(0, 10).join(', ')}`)
      }

      // Extra validations per-table
      try {
        // sums for numeric fields
        if (table === 'User') {
          const sqliteSum = await getSqliteSum(sqlite, 'User', 'balance')
          const pgSum = await getPostgresSum(pg, 'User', 'balance')
          console.log(`SUM\tUser.balance: SQLite=${sqliteSum} Postgres=${pgSum}`)
        }
        if (table === 'CaseItem') {
          const sqliteSum = await getSqliteSum(sqlite, 'CaseItem', 'value')
          const pgSum = await getPostgresSum(pg, 'CaseItem', 'value')
          console.log(`SUM\tCaseItem.value: SQLite=${sqliteSum} Postgres=${pgSum}`)
        }
        if (table === 'Deposit' || table === 'Withdrawal') {
          const sqliteSum = await getSqliteSum(sqlite, table, 'amount')
          const pgSum = await getPostgresSum(pg, table, 'amount')
          console.log(`SUM\t${table}.amount: SQLite=${sqliteSum} Postgres=${pgSum}`)
        }

        // sample rows (first 5 by createdAt) — compare basic fields for quick sanity check
        const sqliteSample = await getSqliteSample(sqlite, table, 5)
        const pgSample = await getPostgresSample(pg, table, 5)
        if (sqliteSample.length && pgSample.length) {
          console.log(`SAMPLE\t${table}: showing up to 5 rows from each DB for quick inspection`)
          console.log(' SQLite sample:', sqliteSample)
          console.log(' Postgres sample:', pgSample)
        }

        // diffs by date (counts per day for last 30 days where available)
        const sqliteByDate = await getCountsByDateSqlite(sqlite, table, 30)
        const pgByDate = await getCountsByDatePostgres(pg, table, 30)
        if (Object.keys(sqliteByDate).length || Object.keys(pgByDate).length) {
          console.log(`BY_DATE\t${table}: counts by date (last 30 days) — showing dates with differences`)
          const dates = new Set([...Object.keys(sqliteByDate), ...Object.keys(pgByDate)])
          for (const d of Array.from(dates).sort()) {
            const s = sqliteByDate[d] || 0
            const p = pgByDate[d] || 0
            if (s !== p) console.log(`  ${d}: SQLite=${s} Postgres=${p}`)
          }
        }
      } catch (err) {
        console.error(`Erro nas validações extras para tabela ${table}:`, err.message || err)
      }
    } catch (err) {
      console.error(`Erro verificando tabela ${table}:`, err.message || err)
    }
  }

  await pg.end()
  sqlite.close()
  console.log('Comparação finalizada.')
}

run().catch(err => {
  console.error('Script falhou:', err)
  process.exit(1)
})
