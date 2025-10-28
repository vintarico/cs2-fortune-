/*
  Script para migrar dados do SQLite (dev.db) para PostgreSQL com suporte a:
  - Precisão numérica (cents/NUMERIC)
  - COPY em massa para performance
  - Resume/checkpoint
  - Retry com backoff
  - Controle de constraints
  - Logs CSV human-readable
  
  Uso:
    1. Instale dependências: npm i sqlite3 pg pg-copy-streams csv-stringify
    2. Configure DATABASE_URL para o Postgres
    3. Opções:
       --copy=true     Usar COPY (mais rápido)
       --resume=true   Continuar de onde parou
       --dry=true      Testar sem inserir
       --batch=100     Tamanho do lote
       --retry=3       Tentativas por lote
       --verbose=true  Logs detalhados
*/

const sqlite3 = require('sqlite3').verbose()
const { Client } = require('pg')
const { copyFrom } = require('pg-copy-streams')
const path = require('path')
const fs = require('fs')

// CLI / env parsing
const COPY_TEMP_DIR = path.join(__dirname, '..', 'tmp')
const CHECKPOINT_FILE = path.join(COPY_TEMP_DIR, 'migration-checkpoint.json')

const argv = process.argv.slice(2)
function getArg(name) {
  const prefix = `--${name}=`
  return argv.find(a => a.startsWith(prefix))?.slice(prefix.length)
}

// Options
const DRY_RUN = process.env.MIGRATE_DRY === '1' || getArg('dry') === 'true'
const BATCH_SIZE = Number(process.env.MIGRATE_BATCH) || Number(getArg('batch')) || 100
const VERBOSE = process.env.MIGRATE_VERBOSE === '1' || getArg('verbose') === 'true'
const USE_COPY = process.env.MIGRATE_COPY === '1' || getArg('copy') === 'true'
const RETRY_COUNT = Number(process.env.MIGRATE_RETRY) || Number(getArg('retry')) || 3
const RESUME = process.env.MIGRATE_RESUME === '1' || getArg('resume') === 'true'
const DISABLE_CONSTRAINTS = process.env.MIGRATE_DISABLE_CONSTRAINTS === '1' || getArg('disable-constraints') === 'true'

// Paths
const LOG_FILE = process.env.MIGRATE_LOG || getArg('log') || 
  path.join(__dirname, '..', 'logs', `migration-failures-${Date.now()}.log`)
const SUMMARY_CSV = process.env.MIGRATE_SUMMARY || getArg('summary') || 
  path.join(__dirname, '..', 'logs', `migration-summary-${Date.now()}.csv`)
const SQLITE_DB = path.join(__dirname, '..', 'prisma', 'dev.db')
const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error('ERROR: defina DATABASE_URL (ex: postgresql://user:pass@host:5432/db)')
  process.exit(1)
}

// Setup dirs/files
try { fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true }) } catch (e) {}
try { fs.mkdirSync(COPY_TEMP_DIR, { recursive: true }) } catch (e) {}
const logStream = fs.createWriteStream(LOG_FILE, { flags: 'a' })
const summaryStream = fs.createWriteStream(SUMMARY_CSV)
summaryStream.write('table,id,error,details\n')

// DB clients
const sqlite = new sqlite3.Database(SQLITE_DB)
const pg = new Client({ connectionString: DATABASE_URL })

// Logging helpers
function logToFile(obj) {
  try { 
    logStream.write(JSON.stringify(obj) + '\n')
    summaryStream.write(
      `${obj.table},${obj.id},"${String(obj.error).replace(/"/g, '""')}",` +
      `"${JSON.stringify(obj.details || {}).replace(/"/g, '""')}"\n`
    )
  } catch (e) {}
}

// Checkpoint management
function loadCheckpoint() {
  try {
    if (fs.existsSync(CHECKPOINT_FILE)) {
      const data = JSON.parse(fs.readFileSync(CHECKPOINT_FILE, 'utf8'))
      console.log('Carregando checkpoint:', data)
      return data
    }
  } catch (e) {
    console.warn('Erro lendo checkpoint:', e)
  }
  return {}
}

function saveCheckpoint(data) {
  try {
    fs.writeFileSync(CHECKPOINT_FILE, JSON.stringify(data))
  } catch (e) {
    console.warn('Erro salvando checkpoint:', e)
  }
}

// Money handling
function toMonetaryAmount(value, opts = {}) {
  if (value === null || value === undefined) return opts.defaultValue || '0'
  // Store as cents (integer)
  if (opts.asCents) {
    return Math.round(Number(value) * 100).toString()
  }
  // Exact decimal string
  return Number(value).toFixed(opts.decimals || 2)
}

// JSON normalization (for consistent ordering)
function normalizeJson(value) {
  if (!value) return null
  try {
    const obj = typeof value === 'string' ? JSON.parse(value) : value
    return JSON.stringify(obj, Object.keys(obj).sort())
  } catch (e) {
    return null
  }
}

// COPY helpers
async function prepareCopyData(rows, mapFn) {
  const tempFile = path.join(COPY_TEMP_DIR, `copy-${Date.now()}.csv`)
  const writeStream = fs.createWriteStream(tempFile)
  
  for (const row of rows) {
    try {
      const values = await mapFn(row)
      if (values) writeStream.write(values.join('\t') + '\n')
    } catch (e) {
      console.warn('Erro preparando linha para COPY:', e)
    }
  }
  
  await new Promise(resolve => writeStream.end(resolve))
  return tempFile
}

async function executeCopy(tableName, columns, tempFile, opts = {}) {
  const maxRetries = opts.retries || RETRY_COUNT
  let lastError
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 1) {
        const backoff = Math.min(1000 * Math.pow(2, attempt - 1), 30000)
        console.log(`Tentativa ${attempt} após ${backoff}ms...`)
        await new Promise(resolve => setTimeout(resolve, backoff))
      }
      
      await pg.query('BEGIN')
      const copyStream = fs.createReadStream(tempFile)
      const copyQuery = `COPY "${tableName}" (${columns.map(c => `"${c}"`).join(',')}) FROM STDIN`
      
      await new Promise((resolve, reject) => {
        const stream = pg.query(copyFrom(copyQuery))
        stream.on('error', reject)
        stream.on('end', resolve)
        copyStream.pipe(stream)
      })
      
      await pg.query('COMMIT')
      return true
    } catch (e) {
      lastError = e
      console.warn(`Erro no COPY (tentativa ${attempt}):`, e.message)
      await pg.query('ROLLBACK')
    }
  }
  
  throw lastError
}

// Get existing IDs (for resume mode)
async function getExistingIds(tableName) {
  if (!RESUME) return new Set()
  try {
    const { rows } = await pg.query(`SELECT id FROM "${tableName}"`)
    return new Set(rows.map(r => r.id))
  } catch (e) {
    console.warn(`Erro buscando IDs existentes de ${tableName}:`, e)
    return new Set()
  }
}

// Main migration logic
async function migrateTable({ tableName, selectSql, mapRow, columns }) {
  console.log(`\nMigrando ${tableName}...`)
  
  // Load existing IDs if resuming
  const existingIds = await getExistingIds(tableName)
  if (RESUME && existingIds.size > 0) {
    console.log(`  Encontrados ${existingIds.size} registros existentes em ${tableName}`)
  }
  
  // Get SQLite data
  const rows = await new Promise((resolve, reject) => {
    sqlite.all(selectSql, (err, rows) => err ? reject(err) : resolve(rows))
  })
  
  console.log(`  Encontradas ${rows.length} linhas em SQLite`)
  if (DRY_RUN) {
    console.log('  [dry-run] Simulando migração...')
    return { total: rows.length, processed: 0, skipped: rows.length, errors: 0 }
  }
  
  let processed = 0
  let skipped = 0
  let errors = 0
  
  if (USE_COPY) {
    // Bulk copy
    try {
      const tempFile = await prepareCopyData(rows, async (row) => {
        if (RESUME && existingIds.has(row.id)) {
          skipped++
          return null
        }
        try {
          const values = await mapRow(row)
          processed++
          return values
        } catch (e) {
          errors++
          logToFile({ table: tableName, id: row.id, error: e.message, details: row })
          return null
        }
      })
      
      if (processed > 0) {
        await executeCopy(tableName, columns, tempFile)
      }
    } catch (e) {
      console.error(`  Erro no COPY de ${tableName}:`, e.message)
      errors += rows.length - processed - skipped
    }
  } else {
    // Batch insert
    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE)
      if (VERBOSE) {
        console.log(`  Lote ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(rows.length/BATCH_SIZE)}`)
      }
      
      let retries = 0
      let batchSuccess = false
      
      while (!batchSuccess && retries < RETRY_COUNT) {
        if (retries > 0) {
          const backoff = Math.min(1000 * Math.pow(2, retries), 30000)
          console.log(`  Tentativa ${retries + 1} após ${backoff}ms...`)
          await new Promise(resolve => setTimeout(resolve, backoff))
        }
        
        try {
          await pg.query('BEGIN')
          for (const row of batch) {
            if (RESUME && existingIds.has(row.id)) {
              skipped++
              continue
            }
            
            try {
              const values = await mapRow(row)
              const cols = columns.map(c => `"${c}"`).join(',')
              const placeholders = values.map((_, i) => `$${i + 1}`).join(',')
              
              const res = await pg.query(
                `INSERT INTO "${tableName}" (${cols}) VALUES(${placeholders}) ON CONFLICT (id) DO NOTHING`,
                values
              )
              
              if (res.rowCount === 1) processed++
              else skipped++
            } catch (e) {
              errors++
              logToFile({ table: tableName, id: row.id, error: e.message, details: row })
            }
          }
          
          await pg.query('COMMIT')
          batchSuccess = true
        } catch (e) {
          retries++
          await pg.query('ROLLBACK')
          console.error(`  Erro no lote (tentativa ${retries}):`, e.message)
          if (retries === RETRY_COUNT) {
            errors += batch.length
            logToFile({ 
              table: tableName, 
              id: `batch_${i}`, 
              error: `Batch failed after ${retries} retries: ${e.message}`,
              details: { batchStart: i, batchSize: batch.length }
            })
          }
        }
      }
      
      // Save progress
      saveCheckpoint({ table: tableName, lastBatch: i, processed, skipped, errors })
    }
  }
  
  const summary = { total: rows.length, processed, skipped, errors }
  console.log(`  Resumo ${tableName}:`, summary)
  return summary
}

async function migrate() {
  await pg.connect()
  console.log(`Conectado ao Postgres (${DRY_RUN ? 'dry-run' : 'live'})`)
  console.log(`Modo: copy=${USE_COPY} resume=${RESUME} batch=${BATCH_SIZE} retry=${RETRY_COUNT}`)
  
  if (DISABLE_CONSTRAINTS && !DRY_RUN) {
    console.log('Desabilitando constraints...')
    await pg.query('SET session_replication_role = replica')
  }
  
  const summary = {}
  const checkpoint = loadCheckpoint()
  
  try {
    // Users (balance as NUMERIC)
    summary.User = await migrateTable({
      tableName: 'User',
      selectSql: 'SELECT * FROM "User"',
      columns: ['id', 'email', 'username', 'password', 'balance', 'isAdmin', 
                'twoFASecret', 'twoFAEnabled', 'steamId', 'createdAt', 'updatedAt'],
      mapRow: async (u) => [
        u.id, u.email, u.username, u.password,
        toMonetaryAmount(u.balance, { decimals: 2 }),
        !!u.isAdmin, u.twoFASecret || null, !!u.twoFAEnabled,
        u.steamId || null, u.createdAt, u.updatedAt
      ]
    })
    
    // Cases (price in cents)
    summary.Case = await migrateTable({
      tableName: 'Case',
      selectSql: 'SELECT * FROM "Case"',
      columns: ['id', 'name', 'price', 'createdAt'],
      mapRow: async (r) => [
        r.id, r.name,
        toMonetaryAmount(r.price, { asCents: true }),
        r.createdAt
      ]
    })
    
    // CaseItems (value in cents)
    summary.CaseItem = await migrateTable({
      tableName: 'CaseItem',
      selectSql: 'SELECT * FROM "CaseItem"',
      columns: ['id', 'caseId', 'name', 'rarity', 'image', 'value'],
      mapRow: async (r) => [
        r.id, r.caseId, r.name, r.rarity,
        r.image || null,
        toMonetaryAmount(r.value, { asCents: true })
      ]
    })
    
    // TradeOffers (normalized JSON)
    summary.TradeOffer = await migrateTable({
      tableName: 'TradeOffer',
      selectSql: 'SELECT * FROM "TradeOffer"',
      columns: ['id', 'userId', 'steamOfferId', 'itemsSent', 'itemsReceived',
                'status', 'createdAt', 'updatedAt'],
      mapRow: async (r) => [
        r.id, r.userId, r.steamOfferId || null,
        normalizeJson(r.itemsSent),
        normalizeJson(r.itemsReceived),
        r.status || 'pending',
        r.createdAt, r.updatedAt || null
      ]
    })
    
    // Deposits (amount in cents)
    summary.Deposit = await migrateTable({
      tableName: 'Deposit',
      selectSql: 'SELECT * FROM "Deposit"',
      columns: ['id', 'userId', 'amount', 'method', 'status', 'txReference', 'createdAt'],
      mapRow: async (r) => [
        r.id, r.userId,
        toMonetaryAmount(r.amount, { asCents: true }),
        r.method, r.status || 'pending',
        r.txReference || null, r.createdAt
      ]
    })
    
    // Withdrawals (amount in cents)
    summary.Withdrawal = await migrateTable({
      tableName: 'Withdrawal',
      selectSql: 'SELECT * FROM "Withdrawal"',
      columns: ['id', 'userId', 'amount', 'method', 'status', 'txReference', 'createdAt'],
      mapRow: async (r) => [
        r.id, r.userId,
        toMonetaryAmount(r.amount, { asCents: true }),
        r.method, r.status || 'pending',
        r.txReference || null, r.createdAt
      ]
    })
  } finally {
    if (DISABLE_CONSTRAINTS && !DRY_RUN) {
      console.log('Reabilitando constraints...')
      await pg.query('SET session_replication_role = DEFAULT')
    }
  }
  
  // Print final summary
  console.log('\nMigração concluída. Resumo:')
  for (const [table, s] of Object.entries(summary)) {
    console.log(`  ${table}: total=${s.total} processed=${s.processed} skipped=${s.skipped} errors=${s.errors}`)
  }
  
  await pg.end()
  sqlite.close()
  logStream.end()
  summaryStream.end()
}

migrate().catch(err => {
  console.error('Migração falhou:', err)
  process.exit(1)
})