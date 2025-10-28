const { 
  toMonetaryAmount,
  normalizeJson,
  detectForeignKeys,
  buildTableGraph,
  topologicalSort
} = require('../migration-utils')

describe('toMonetaryAmount', () => {
  test('formats number with 2 decimal places by default', () => {
    expect(toMonetaryAmount(10.126)).toBe('10.13')
    expect(toMonetaryAmount(10)).toBe('10.00')
  })

  test('returns amount in cents when asCents=true', () => {
    expect(toMonetaryAmount(10.126, { asCents: true })).toBe('1013')
    expect(toMonetaryAmount(10, { asCents: true })).toBe('1000')
  })

  test('handles null/undefined values', () => {
    expect(toMonetaryAmount(null)).toBe('0')
    expect(toMonetaryAmount(undefined)).toBe('0')
    expect(toMonetaryAmount(null, { defaultValue: 'N/A' })).toBe('N/A')
  })
})

describe('normalizeJson', () => {
  test('sorts object keys', () => {
    const input = { b: 2, a: 1, c: 3 }
    expect(normalizeJson(input)).toBe('{"a":1,"b":2,"c":3}')
  })

  test('sorts nested objects and arrays', () => {
    const input = {
      items: [{ id: 2 }, { id: 1 }],
      meta: { z: 3, y: 2, x: 1 }
    }
    expect(normalizeJson(input)).toBe(
      '{"items":[{"id":1},{"id":2}],"meta":{"x":1,"y":2,"z":3}}'
    )
  })

  test('handles invalid JSON', () => {
    expect(normalizeJson('invalid')).toBeNull()
    expect(normalizeJson(null)).toBeNull()
  })
})

describe('detectForeignKeys', () => {
  test('detects foreign keys based on field naming', () => {
    const schema = {
      users: ['id', 'name'],
      orders: ['id', 'userId', 'productId'],
      products: ['id', 'name']
    }
    
    const fks = detectForeignKeys(schema)
    expect(fks).toEqual({
      orders: [
        { field: 'userId', references: 'user' },
        { field: 'productId', references: 'product' }
      ]
    })
  })

  test('ignores non-existent references', () => {
    const schema = {
      users: ['id', 'roleId'] // roles table doesn't exist
    }
    
    const fks = detectForeignKeys(schema)
    expect(fks).toEqual({})
  })
})

describe('buildTableGraph and topologicalSort', () => {
  test('builds dependency graph and sorts tables', () => {
    const fks = {
      orders: [
        { field: 'userId', references: 'users' },
        { field: 'productId', references: 'products' }
      ],
      orderItems: [
        { field: 'orderId', references: 'orders' }
      ]
    }
    
    const graph = buildTableGraph(fks)
    const sorted = topologicalSort(graph)
    
    // users and products can be in any order, but must come before orders
    // orders must come before orderItems
    expect(sorted).toContain('users')
    expect(sorted).toContain('products')
    expect(sorted.indexOf('orders')).toBeGreaterThan(
      Math.max(
        sorted.indexOf('users'),
        sorted.indexOf('products')
      )
    )
    expect(sorted.indexOf('orderItems')).toBeGreaterThan(sorted.indexOf('orders'))
  })
})