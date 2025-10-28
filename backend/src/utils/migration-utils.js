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
        const refTable = field.slice(0, -2)
        // Verifica se a tabela referenciada existe
        if (tables.includes(refTable)) {
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
  
  // Inicializa grafo
  for (const [table, refs] of Object.entries(fks)) {
    if (!graph[table]) graph[table] = []
    for (const { references } of refs) {
      if (!graph[references]) graph[references] = []
      // table depende de references
      graph[table].push(references)
    }
  }
  
  return graph
}

// Ordenação topológica (Kahn's algorithm)
function topologicalSort(graph) {
  const result = []
  const nodes = new Set(Object.keys(graph))
  const edges = new Map()
  const inDegree = new Map()
  
  // Inicializa contagem de arestas
  for (const [node, deps] of Object.entries(graph)) {
    edges.set(node, new Set(deps))
    for (const dep of deps) {
      inDegree.set(dep, (inDegree.get(dep) || 0) + 1)
    }
  }
  
  // Encontra nós sem dependências
  const queue = Array.from(nodes).filter(node => !inDegree.get(node))
  
  while (queue.length > 0) {
    const node = queue.shift()
    result.push(node)
    
    // Remove arestas
    for (const [dep, refs] of edges) {
      if (refs.has(node)) {
        refs.delete(node)
        const count = inDegree.get(dep) - 1
        inDegree.set(dep, count)
        if (count === 0) {
          queue.push(dep)
        }
      }
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