const path = require('path')

// Utilitários monetários
function toMonetaryAmount(value, opts = {}) {
  if (value === null || value === undefined) return opts.defaultValue || '0'
  if (opts.asCents) {
    return Math.round(Number(value) * 100).toString()
  }
  return Number(value).toFixed(opts.decimals || 2)
}

// Normalização de JSON com ordenação
function normalizeJson(value) {
  if (!value) return null
  try {
    const obj = typeof value === 'string' ? JSON.parse(value) : value
    function sortObject(obj) {
      if (Array.isArray(obj)) {
        return obj.map(sortObject).sort((a, b) => {
          return JSON.stringify(a) < JSON.stringify(b) ? -1 : 1
        })
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

// Detecta FKs analisando nomes de campos
function detectForeignKeys(schema) {
  const fks = {}
  const tables = Object.keys(schema)
  
  for (const table of tables) {
    const fields = schema[table]
    const tableFks = []
    
    for (const field of fields) {
      if (field === 'id') continue
      
      // Procura campos terminados em 'Id'
      if (field.endsWith('Id')) {
        const refTable = field.slice(0, -2).toLowerCase()
        
        // Checar se existe uma tabela no plural que corresponda à referência
        const possibleRefs = [
          refTable,
          refTable + 's',
          refTable.endsWith('s') ? refTable : null
        ].filter(Boolean)
        
        // Verifica se a tabela referenciada existe em qualquer forma
        const matchingTable = tables.find(t => 
          possibleRefs.includes(t.toLowerCase())
        )
        
        if (matchingTable) {
          tableFks.push({
            field,
            references: refTable
          })
        }
      }
    }
    
    if (tableFks.length > 0) {
      fks[table] = tableFks
    }
  }
  
  return fks
}

// Constrói grafo de dependências
function buildTableGraph(fks) {
  const graph = {}
  
  // Initialize all tables (including referenced ones) in the graph
  for (const [table, refs] of Object.entries(fks)) {
    if (!graph[table]) graph[table] = []
    for (const { references } of refs) {
      if (!graph[references]) graph[references] = []
    }
  }
  
  // Add dependencies
  for (const [table, refs] of Object.entries(fks)) {
    for (const { references } of refs) {
      graph[table].push(references)
    }
  }
  
  return graph
}

// Ordenação topológica (Kahn's algorithm)
function topologicalSort(graph) {
  const result = []
  const visited = new Set()
  const temp = new Set()
  
  function visit(node) {
    if (temp.has(node)) {
      throw new Error('Cycle detected')
    }
    if (visited.has(node)) {
      return
    }
    temp.add(node)
    const deps = graph[node] || []
    for (const dep of deps) {
      visit(dep)
    }
    temp.delete(node)
    visited.add(node)
    result.push(node)
  }
  
  // Start with nodes that have no dependencies
  const noDeps = Object.keys(graph).filter(node => 
    !Object.values(graph).some(deps => deps.includes(node))
  )
  
  // Visit independent nodes first
  for (const node of noDeps) {
    if (!visited.has(node)) {
      visit(node)
    }
  }
  
  // Then visit remaining nodes
  for (const node of Object.keys(graph)) {
    if (!visited.has(node)) {
      visit(node)
    }
  }
  
  return result
}

// Analisa tipos e ranges de valores
async function analyzeTable(db, tableName) {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM "${tableName}"`, (err, rows) => {
      if (err) return reject(err)
      
      const analysis = {
        count: rows.length,
        columns: {}
      }
      
      if (rows.length === 0) {
        return resolve(analysis)
      }
      
      // Analisa cada coluna
      const sample = rows[0]
      for (const [col, value] of Object.entries(sample)) {
        analysis.columns[col] = {
          type: typeof value,
          nullable: false,
          min: value,
          max: value,
          uniqueValues: new Set([value]),
          possibleFk: col.endsWith('Id')
        }
      }
      
      // Processa todas as linhas
      for (const row of rows.slice(1)) {
        for (const [col, value] of Object.entries(row)) {
          const stats = analysis.columns[col]
          
          if (value === null) {
            stats.nullable = true
            continue
          }
          
          if (typeof value === 'number') {
            stats.min = Math.min(stats.min, value)
            stats.max = Math.max(stats.max, value)
          }
          
          if (stats.uniqueValues.size < 100) {
            stats.uniqueValues.add(value)
          }
        }
      }
      
      // Converte Sets para arrays
      for (const col of Object.values(analysis.columns)) {
        col.uniqueValues = Array.from(col.uniqueValues)
      }
      
      resolve(analysis)
    })
  })
}

module.exports = {
  toMonetaryAmount,
  normalizeJson,
  detectForeignKeys,
  buildTableGraph,
  topologicalSort,
  analyzeTable
}