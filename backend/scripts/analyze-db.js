const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const {
  analyzeTable,
  detectForeignKeys,
  buildTableGraph,
  topologicalSort
} = require('../utils/migration-utils')

const SQLITE_DB = path.join(__dirname, '..', 'prisma', 'dev.db')

async function analyzeTables() {
  const sqlite = new sqlite3.Database(SQLITE_DB)
  
  // Get table list
  const tables = await new Promise((resolve, reject) => {
    sqlite.all(
      `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'`,
      (err, rows) => err ? reject(err) : resolve(rows.map(r => r.name))
    )
  })
  
  console.log(`\nEncontradas ${tables.length} tabelas no SQLite:`, tables)
  
  // Analyze schema
  const schema = {}
  for (const table of tables) {
    const columns = await new Promise((resolve, reject) => {
      sqlite.all(
        `PRAGMA table_info("${table}")`,
        (err, rows) => err ? reject(err) : resolve(rows.map(r => r.name))
      )
    })
    schema[table] = columns
  }
  
  // Detect dependencies
  const fks = detectForeignKeys(schema)
  const graph = buildTableGraph(fks)
  const order = topologicalSort(graph)
  
  console.log('\nOrdem sugerida para migração:', order)
  console.log('\nDependências detectadas:')
  for (const [table, refs] of Object.entries(fks)) {
    console.log(`  ${table}:`)
    for (const { field, references } of refs) {
      console.log(`    - ${field} → ${references}`)
    }
  }
  
  // Analyze each table
  console.log('\nAnálise por tabela:')
  for (const table of tables) {
    console.log(`\n=== ${table} ===`)
    const analysis = await analyzeTable(sqlite, table)
    
    console.log(`Registros: ${analysis.count}`)
    for (const [col, stats] of Object.entries(analysis.columns)) {
      console.log(`  ${col}:`)
      console.log(`    Tipo: ${stats.type}`)
      console.log(`    Nullable: ${stats.nullable}`)
      
      if (typeof stats.min !== 'undefined') {
        console.log(`    Range: ${stats.min} → ${stats.max}`)
      }
      
      if (stats.uniqueValues.length < 10) {
        console.log(`    Valores distintos: ${stats.uniqueValues.join(', ')}`)
      } else {
        console.log(`    Valores distintos: ${stats.uniqueValues.length}`)
      }
      
      if (stats.possibleFk) {
        console.log(`    Possível FK: sim`)
      }
    }
  }
  
  sqlite.close()
}

analyzeTables().catch(err => {
  console.error('Análise falhou:', err)
  process.exit(1)
})