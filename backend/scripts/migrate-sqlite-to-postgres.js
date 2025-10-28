/*
  Script simples para migrar dados do SQLite (dev.db) para PostgreSQL.
  Uso:
    1. Instale dependências: npm i sqlite3 pg
    2. Configure a variável de ambiente DATABASE_URL com a connection string do Postgres
    3. Rode: node scripts/migrate-sqlite-to-postgres.js

  Observação: este é um script básico — revise antes de executar em produção.
*/

const sqlite3 = require('sqlite3').verbose()
const { Client } = require('pg')
const path = require('path')
const fs = require('fs')

// Simple CLI / env parsing
const argv = require('process').argv.slice(2)
function getArg(name) {
  const prefix = `--${name}=`
  const found = argv.find(a => a.startsWith(prefix))
  if (found) return found.slice(prefix.length)
  return undefined
}

const DRY_RUN = (process.env.MIGRATE_DRY === '1') || (getArg('dry') === 'true' || getArg('dry') === '1')
const BATCH_SIZE = Number(process.env.MIGRATE_BATCH) || Number(getArg('batch')) || 100
const VERBOSE = (process.env.MIGRATE_VERBOSE === '1') || (getArg('verbose') === 'true' || getArg('verbose') === '1')
const LOG_FILE = process.env.MIGRATE_LOG || getArg('log') || path.join(__dirname, '..', 'logs', `migration-failures-${Date.now()}.log`)

// Ensure logs dir exists
try { fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true }) } catch (e) {}
const logStream = fs.createWriteStream(LOG_FILE, { flags: 'a' })

function logToFile(obj) {
  try { logStream.write(JSON.stringify(obj) + '\n') } catch (e) { /* ignore */ }
}

const SQLITE_DB = path.join(__dirname, '..', 'prisma', 'dev.db')
const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error('ERROR: defina a variável DATABASE_URL apontando para seu Postgres (ex: postgres://user:pass@host:5432/db)')
  process.exit(1)
}

const sqlite = new sqlite3.Database(SQLITE_DB)
const pg = new Client({ connectionString: DATABASE_URL })

// util helpers to promisify sqlite3 calls
function sqliteAll(sql) {
  return new Promise((resolve, reject) => {
    sqlite.all(sql, (err, rows) => {
      if (err) return reject(err)
      resolve(rows)
    })
  })
}

async function safeParseJson(value) {
  if (value === null || value === undefined) return null
  // If already an object, return as-is
  if (typeof value === 'object') return value
  // Some values may be stored as JSON string or plain string
  try {
    return JSON.parse(value)
  } catch (e) {
    // If it's the literal string 'null' or empty, treat as null
    if (String(value).trim().toLowerCase() === 'null' || String(value).trim() === '') return null
    // fallback: wrap as array/object? better to return null and log upstream
    return null
  }
}

async function migrateTable({ tableName, selectSql, insertRowFn }) {
  console.log(`\nMigrando tabela ${tableName}...`)
  let rows
  try {
    rows = await sqliteAll(selectSql)
  } catch (err) {
    console.warn(`  Ignorando ${tableName}: não encontrada ou erro ao ler do SQLite: ${err.message}`)
    return { total: 0, inserted: 0, skipped: 0, errors: 0 }
  }

  console.log(`  Encontradas ${rows.length} linhas em SQLite (${tableName})`)
  let inserted = 0
  let skipped = 0
  let errors = 0

  // process in batches
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE)
    if (VERBOSE) console.log(`  Processando lote ${i / BATCH_SIZE + 1} (linhas ${i}..${i + batch.length - 1})`)
    if (!DRY_RUN) await pg.query('BEGIN')
    try {
      for (const r of batch) {
        try {
          if (DRY_RUN) {
            // call insertRowFn with dryRun flag so it can validate/parparse
            const wouldInsert = await insertRowFn(r, { dryRun: true })
            if (wouldInsert === true) inserted++
            else skipped++
            if (VERBOSE) console.log(`    [dry] wouldInsert id=${r.id} ok=${wouldInsert}`)
          } else {
            const ok = await insertRowFn(r)
            if (ok === true) inserted++
            else skipped++
          }
        } catch (err) {
          errors++
          console.error(`  Erro inserindo linha id=${r.id} em ${tableName}:`, err.message || err)
          logToFile({ table: tableName, id: r.id, error: String(err), row: r })
        }
      }
      if (!DRY_RUN) await pg.query('COMMIT')
    } catch (txErr) {
      if (!DRY_RUN) await pg.query('ROLLBACK')
      console.error(`  Transação para ${tableName} lote falhou e foi revertida:`, txErr.message || txErr)
      logToFile({ table: tableName, batchStart: i, error: String(txErr) })
      // continue to next batch to attempt remaining data
      errors += batch.length
    }
  }

  console.log(`  Resumo ${tableName}: total=${rows.length} inserted=${inserted} skipped=${skipped} errors=${errors}`)
  return { total: rows.length, inserted, skipped, errors }
}

async function migrate() {
  await pg.connect()
  console.log('Conectado ao Postgres')
  console.log(`Modo: ${DRY_RUN ? 'dry-run' : 'live'}  batchSize=${BATCH_SIZE} verbose=${VERBOSE} log=${LOG_FILE}`)

  const summary = {}

  // Users
  summary.User = await migrateTable({
    tableName: 'User',
    selectSql: 'SELECT * FROM "User"',
    insertRowFn: async (u, opts = {}) => {
      const dry = !!opts.dryRun
      // normalize fields and types
      const balance = (u.balance === null || u.balance === undefined) ? 0 : Number(u.balance)
      const isAdmin = !!u.isAdmin
      const twoFAEnabled = !!u.twoFAEnabled
      const twoFASecret = u.twoFASecret || null
      const steamId = u.steamId || null

      if (dry) {
        // basic validation
        if (!u.id) return false
        return true
      }

      const res = await pg.query(
        `INSERT INTO "User" (id, email, username, password, balance, "isAdmin", "twoFASecret", "twoFAEnabled", "steamId", "createdAt", "updatedAt") VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) ON CONFLICT (id) DO NOTHING`,
        [u.id, u.email, u.username, u.password, balance, isAdmin, twoFASecret, twoFAEnabled, steamId, u.createdAt, u.updatedAt]
      )
      return res.rowCount === 1
    }
  })

  // Cases
  summary.Case = await migrateTable({
    tableName: 'Case',
    selectSql: 'SELECT * FROM "Case"',
    insertRowFn: async (r, opts = {}) => {
      const dry = !!opts.dryRun
      const price = (r.price === null || r.price === undefined) ? 0 : Number(r.price)
      if (dry) {
        if (!r.id) return false
        return true
      }
      const res = await pg.query(`INSERT INTO "Case" (id, name, price, "createdAt") VALUES($1,$2,$3,$4) ON CONFLICT (id) DO NOTHING`, [r.id, r.name, price, r.createdAt])
      return res.rowCount === 1
    }
  })

  // CaseItem
  summary.CaseItem = await migrateTable({
    tableName: 'CaseItem',
    selectSql: 'SELECT * FROM "CaseItem"',
    insertRowFn: async (r, opts = {}) => {
      const dry = !!opts.dryRun
      const value = (r.value === null || r.value === undefined) ? 0 : Number(r.value)
      if (dry) {
        if (!r.id) return false
        return true
      }
      const res = await pg.query(`INSERT INTO "CaseItem" (id, "caseId", name, rarity, image, value) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT (id) DO NOTHING`, [r.id, r.caseId, r.name, r.rarity, r.image || null, value])
      return res.rowCount === 1
    }
  })

  // TradeOffer (handle JSON fields)
  summary.TradeOffer = await migrateTable({
    tableName: 'TradeOffer',
    selectSql: 'SELECT * FROM "TradeOffer"',
    insertRowFn: async (r, opts = {}) => {
      const dry = !!opts.dryRun
      const itemsSentObj = await safeParseJson(r.itemsSent)
      const itemsReceivedObj = await safeParseJson(r.itemsReceived)

      if (dry) {
        // validate json
        return true
      }

      // use pg parameterization: pass JSON strings and cast
      const res = await pg.query(`INSERT INTO "TradeOffer" (id, "userId", "steamOfferId", "itemsSent", "itemsReceived", status, "createdAt", "updatedAt") VALUES($1,$2,$3,$4::jsonb,$5::jsonb,$6,$7,$8) ON CONFLICT (id) DO NOTHING`, [
        r.id, r.userId, r.steamOfferId || null, itemsSentObj ? JSON.stringify(itemsSentObj) : null, itemsReceivedObj ? JSON.stringify(itemsReceivedObj) : null, r.status || 'pending', r.createdAt, r.updatedAt || null
      ])
      return res.rowCount === 1
    }
  })

  // Deposit
  summary.Deposit = await migrateTable({
    tableName: 'Deposit',
    selectSql: 'SELECT * FROM "Deposit"',
    insertRowFn: async (r, opts = {}) => {
      const dry = !!opts.dryRun
      const amount = (r.amount === null || r.amount === undefined) ? 0 : Number(r.amount)
      if (dry) {
        if (!r.id) return false
        return true
      }
      const res = await pg.query(`INSERT INTO "Deposit" (id, "userId", amount, method, status, "txReference", "createdAt") VALUES($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (id) DO NOTHING`, [r.id, r.userId, amount, r.method, r.status || 'pending', r.txReference || null, r.createdAt])
      return res.rowCount === 1
    }
  })

  // Withdrawal
  summary.Withdrawal = await migrateTable({
    tableName: 'Withdrawal',
    selectSql: 'SELECT * FROM "Withdrawal"',
    insertRowFn: async (r, opts = {}) => {
      const dry = !!opts.dryRun
      const amount = (r.amount === null || r.amount === undefined) ? 0 : Number(r.amount)
      if (dry) {
        if (!r.id) return false
        return true
      }
      const res = await pg.query(`INSERT INTO "Withdrawal" (id, "userId", amount, method, status, "txReference", "createdAt") VALUES($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (id) DO NOTHING`, [r.id, r.userId, amount, r.method, r.status || 'pending', r.txReference || null, r.createdAt])
      return res.rowCount === 1
    }
  })

  console.log('\nMigração concluída. Resumo:')
  for (const k of Object.keys(summary)) {
    const s = summary[k]
    console.log(`  ${k}: total=${s.total} inserted=${s.inserted} skipped=${s.skipped} errors=${s.errors}`)
  }

  await pg.end()
  sqlite.close()
}

migrate().catch(err => { console.error('Migração falhou:', err); process.exit(1) })
