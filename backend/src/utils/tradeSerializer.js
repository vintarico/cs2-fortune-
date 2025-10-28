function serializeItems(items) {
  try {
    return JSON.stringify(items)
  } catch (e) {
    return String(items)
  }
}

function deserializeItems(value) {
  try {
    return JSON.parse(value)
  } catch (e) {
    return value
  }
}

function deserializeTrade(trade) {
  if (!trade) return trade
  return {
    ...trade,
    itemsSent: deserializeItems(trade.itemsSent),
    itemsReceived: deserializeItems(trade.itemsReceived)
  }
}

module.exports = { serializeItems, deserializeItems, deserializeTrade }
