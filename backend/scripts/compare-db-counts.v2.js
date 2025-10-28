const sqlite3 = require('sqlite3').verbose()
const { Client } = require('pg')
const path = require('path')
const fs = require('fs')

const SQLITE_DB = path.join(__dirname, '..', 'prisma', 'dev.db')
const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error('ERROR: defina DATABASE_URL')
  process.exit(1)
}

function normalizeJson(value) {
  if (!value) return null
  try {
    // Se já é string JSON, parse
    const obj = typeof value === 'string' ? JSON.parse(value) : value
    // Ordena chaves recursivamente
    function sortObject(obj) {
      if (Array.isArray(obj)) {
        return obj.map(sortObject).sort()
      }
      if (obj !== null && typeof obj === 'object') {
        return Object.keys(obj).sort().reduce((sorted, key) => {
          sorted[key] = sortObject(obj[key])
          return sorted
        }, {})
      }
      return obj
    }
    return JSON.stringify(sortObject(obj))
  } catch (e) {
    return null
  }
}

// Normaliza valores numéricos para comparação
function normalizeNumber(value, opts = {}) {
  if (value === null || value === undefined) return opts.defaultValue || '0'
  if (opts.asCents) {
    // Converte para centavos se necessário
    return Math.round(Number(value) * 100).toString()
  }
  // Normaliza decimais
  return Number(value).toFixed(opts.decimals || 2)
}

async function getSqliteData(db, table, opts = {}) {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM "${table}"`, (err, rows) => {
      if (err) return reject(err)
      resolve(rows.map(row => {
        const normalized = { ...row }
        // Normaliza campos específicos
        if (opts.jsonFields) {
          for (const field of opts.jsonFields) {
            normalized[field] = normalizeJson(row[field])
          }
        }
        if (opts.centFields) {
          for (const field of opts.centFields) {
            normalized[field] = normalizeNumber(row[field], { asCents: true })
          }
        }
        if (opts.decimalFields) {
          for (const field of opts.decimalFields) {
            normalized[field] = normalizeNumber(row[field], { decimals: opts.decimals || 2 })
          }
        }
        return normalized
      }))
    })
  })
}

async function getPostgresData(pg, table, opts = {}) {
  const { rows } = await pg.query(`SELECT * FROM "${table}"`)
  return rows.map(row => {
    const normalized = { ...row }
    if (opts.jsonFields) {
      for (const field of opts.jsonFields) {
        normalized[field] = normalizeJson(row[field])
      }
    }
    if (opts.centFields) {
      for (const field of opts.centFields) {
        normalized[field] = normalizeNumber(row[field], { asCents: true })
      }
    }
    if (opts.decimalFields) {
      for (const field of opts.decimalFields) {
        normalized[field] = normalizeNumber(row[field], { decimals: opts.decimals || 2 })
      }
    }
    return normalized
  })
}

function compareResults(sqlite, postgres, keyField = 'id') {
  const sqliteById = new Map(sqlite.map(r => [r[keyField], r]))
  const postgresById = new Map(postgres.map(r => [r[keyField], r]))
  
  const onlyInSqlite = []
  const onlyInPostgres = []
  const different = []
  
  // Check records in SQLite
  for (const [id, sqliteRow] of sqliteById) {
    const pgRow = postgresById.get(id)
    if (!pgRow) {
      onlyInSqlite.push(id)
      continue
    }
    
    // Compare all fields
    for (const [key, sqliteValue] of Object.entries(sqliteRow)) {
      const pgValue = pgRow[key]
      if (JSON.stringify(sqliteValue) !== JSON.stringify(pgValue)) {
        different.push({
          id,
          field: key,
          sqlite: sqliteValue,
          postgres: pgValue
        })
      }
    }
  }
  
  // Check for extra records in Postgres
  for (const id of postgresById.keys()) {
    if (!sqliteById.has(id)) {
      onlyInPostgres.push(id)
    }
  }
  
  return { onlyInSqlite, onlyInPostgres, different }
}

async function compareTable(sqlite, pg, table, opts = {}) {
  console.log(`\nComparando ${table}...`)
  
  const [sqliteRows, pgRows] = await Promise.all([
    getSqliteData(sqlite, table, opts),
    getPostgresData(pg, table, opts)
  ])
  
  console.log(`  SQLite: ${sqliteRows.length} registros`)
  console.log(`  Postgres: ${pgRows.length} registros`)
  
  const comparison = compareResults(sqliteRows, pgRows)
  
  if (comparison.onlyInSqlite.length === 0 &&
      comparison.onlyInPostgres.length === 0 &&
      comparison.different.length === 0) {
    console.log('  ✓ Dados idênticos')
    return true
  }
  
  if (comparison.onlyInSqlite.length > 0) {
    console.log(`  ! ${comparison.onlyInSqlite.length} registros apenas no SQLite:`,
      comparison.onlyInSqlite.slice(0, 5))
  }
  
  if (comparison.onlyInPostgres.length > 0) {
    console.log(`  ! ${comparison.onlyInPostgres.length} registros apenas no Postgres:`,
      comparison.onlyInPostgres.slice(0, 5))
  }
  
  if (comparison.different.length > 0) {
    console.log(`  ! ${comparison.different.length} registros com diferenças:`)
    for (const diff of comparison.different.slice(0, 5)) {
      console.log(`    - ID ${diff.id} campo ${diff.field}:`)
      console.log(`      SQLite:   ${diff.sqlite}`)
      console.log(`      Postgres: ${diff.postgres}`)
    }
  }
  
  return false
}

async function run() {
  const sqlite = new sqlite3.Database(SQLITE_DB)
  const pg = new Client({ connectionString: DATABASE_URL })
  await pg.connect()
  
  try {
    // Compare each table with specific field handling
    await compareTable(sqlite, pg, 'User', {
      decimalFields: ['balance'],
      decimals: 2
    })
    
    await compareTable(sqlite, pg, 'Case', {
      centFields: ['price']
    })
    
    await compareTable(sqlite, pg, 'CaseItem', {
      centFields: ['value']
    })
    
    await compareTable(sqlite, pg, 'TradeOffer', {
      jsonFields: ['itemsSent', 'itemsReceived']
    })
    
    await compareTable(sqlite, pg, 'Deposit', {
      centFields: ['amount']
    })
    
    await compareTable(sqlite, pg, 'Withdrawal', {
      centFields: ['amount']
    })
    
  } finally {
    await pg.end()
    sqlite.close()
  }
}

run().catch(err => {
  console.error('Comparação falhou:', err)
  process.exit(1)
})