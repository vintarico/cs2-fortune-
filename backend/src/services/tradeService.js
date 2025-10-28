const prisma = require('../db/prisma')
const { serializeItems, deserializeTrade } = require('../utils/tradeSerializer')

async function createTradeOffer({ userId, itemsSent = [], itemsReceived = {}, status = 'pending' }) {
  const data = {
    userId: userId || '',
    itemsSent: serializeItems(itemsSent),
    itemsReceived: serializeItems(itemsReceived),
    status
  }
  const trade = await prisma.tradeOffer.create({ data })
  return deserializeTrade(trade)
}

module.exports = { createTradeOffer }
