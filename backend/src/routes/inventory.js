const express = require('express')
const prisma = require('../db/prisma')
const { requireAuth } = require('../lib/auth')
const { validate, schemas } = require('../lib/validation')
const logger = require('../lib/logger')

const router = express.Router()

// GET /api/inventory - list user's trade offers/items
router.get('/', requireAuth, async (req, res) => {
  try {
    const trades = await prisma.tradeOffer.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    })

    const { deserializeTrade } = require('../utils/tradeSerializer')
    const parsed = trades.map(deserializeTrade)
    res.json(parsed)
  } catch (error) {
    logger.error('Error fetching inventory:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

module.exports = router