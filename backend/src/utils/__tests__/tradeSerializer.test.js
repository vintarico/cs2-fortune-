const { serializeItems, deserializeItems } = require('../tradeSerializer')

test('serialize and deserialize array', () => {
  const arr = [{ id: 1 }, { id: 2 }]
  const s = serializeItems(arr)
  expect(typeof s).toBe('string')
  const d = deserializeItems(s)
  expect(d).toEqual(arr)
})

test('serialize and deserialize object', () => {
  const obj = { id: 'a', name: 'test' }
  const s = serializeItems(obj)
  expect(typeof s).toBe('string')
  const d = deserializeItems(s)
  expect(d).toEqual(obj)
})

test('deserialize invalid json returns original', () => {
  const value = 'not-json'
  const d = deserializeItems(value)
  expect(d).toBe(value)
})
