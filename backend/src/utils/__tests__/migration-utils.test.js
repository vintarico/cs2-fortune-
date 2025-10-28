const { 
  toMonetaryAmount,
  normalizeJson,
  detectForeignKeys,
  buildTableGraph,
  topologicalSort
} = require('../migration-utils')

describe('toMonetaryAmount', () => {
  test('converte para centavos', () => {
    expect(toMonetaryAmount(10.99, { asCents: true })).toBe('1099')
    expect(toMonetaryAmount('10.99', { asCents: true })).toBe('1099')
    expect(toMonetaryAmount(10, { asCents: true })).toBe('1000')
  })

  test('converte para decimal', () => {
    expect(toMonetaryAmount(10.99, { decimals: 2 })).toBe('10.99')
    expect(toMonetaryAmount('10.99', { decimals: 2 })).toBe('10.99')
    expect(toMonetaryAmount(10, { decimals: 2 })).toBe('10.00')
  })

  test('lida com nulos/undefined', () => {
    expect(toMonetaryAmount(null, { asCents: true })).toBe('0')
    expect(toMonetaryAmount(undefined, { decimals: 2 })).toBe('0.00')
  })
})

describe('normalizeJson', () => {
  test('normaliza arrays e objetos', () => {
    const input = { b: [3, 2, 1], a: { y: 2, x: 1 } }
    const expected = '{"a":{"x":1,"y":2},"b":[1,2,3]}'
    expect(normalizeJson(input)).toBe(expected)
  })

  test('lida com JSON strings', () => {
    const input = '{"b":[3,2,1],"a":{"y":2,"x":1}}'
    const expected = '{"a":{"x":1,"y":2},"b":[1,2,3]}'
    expect(normalizeJson(input)).toBe(expected)
  })

  test('retorna null para valores inválidos', () => {
    expect(normalizeJson(null)).toBeNull()
    expect(normalizeJson('invalid json')).toBeNull()
  })
})

describe('detectForeignKeys', () => {
  test('detecta FKs básicas', () => {
    const schema = {
      TradeOffer: ['id', 'userId', 'status'],
      User: ['id', 'email']
    }
    const fks = detectForeignKeys(schema)
    expect(fks).toEqual({
      TradeOffer: [{ field: 'userId', references: 'User' }]
    })
  })

  test('detecta múltiplas FKs', () => {
    const schema = {
      CaseItem: ['id', 'caseId'],
      Deposit: ['id', 'userId'],
      Case: ['id', 'name'],
      User: ['id', 'email']
    }
    const fks = detectForeignKeys(schema)
    expect(fks).toEqual({
      CaseItem: [{ field: 'caseId', references: 'Case' }],
      Deposit: [{ field: 'userId', references: 'User' }]
    })
  })
})

describe('buildTableGraph e topologicalSort', () => {
  test('ordena tabelas por dependências', () => {
    const fks = {
      TradeOffer: [{ field: 'userId', references: 'User' }],
      CaseItem: [{ field: 'caseId', references: 'Case' }],
      Deposit: [{ field: 'userId', references: 'User' }]
    }
    
    const graph = buildTableGraph(fks)
    const order = topologicalSort(graph)
    
    // User e Case devem vir antes de suas dependências
    expect(order.indexOf('User')).toBeLessThan(order.indexOf('TradeOffer'))
    expect(order.indexOf('User')).toBeLessThan(order.indexOf('Deposit'))
    expect(order.indexOf('Case')).toBeLessThan(order.indexOf('CaseItem'))
  })
})