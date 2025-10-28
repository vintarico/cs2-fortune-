const express = require('express')
const prisma = require('../db/prisma')
const { requireAuth, requireAdmin } = require('../lib/auth')
const logger = require('../lib/logger')

const router = express.Router()

// GET /api/admin/users - list all users (admin only)
router.get('/users', requireAuth, requireAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        balance: true,
        isAdmin: true,
        createdAt: true
      }
    })
    res.json(users)
  } catch (error) {
    logger.error('Error fetching users:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// GET /api/admin/trades - list all trades (admin only)
router.get('/trades', requireAuth, requireAdmin, async (req, res) => {
  try {
    const trades = await prisma.tradeOffer.findMany({
      include: {
        user: {
          select: {
            email: true,
            username: true
          }
        }
      }
    })

    const { deserializeTrade } = require('../utils/tradeSerializer')
    const parsed = trades.map(deserializeTrade)
    res.json(parsed)
  } catch (error) {
    logger.error('Error fetching trades:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

module.exports = router