const { serializeItems } = require('../utils/tradeSerializer')

function tradeSerializerMiddleware(req, res, next) {
  if (req.body) {
    if (req.body.itemsSent !== undefined) {
      req.body.itemsSent = serializeItems(req.body.itemsSent)
    }
    if (req.body.itemsReceived !== undefined) {
      req.body.itemsReceived = serializeItems(req.body.itemsReceived)
    }
  }
  next()
}

module.exports = tradeSerializerMiddleware
