const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const prisma = require('../db/prisma')
const SECRET_KEY = process.env.SECRET_KEY

function requireAuth(req, res, next) {
  const authHeader = req.headers['authorization']
  if (!authHeader) return res.status(401).json({ error: 'Token necessário' })

  const token = authHeader.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Token inválido' })

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token expirado ou inválido' })
    req.user = user
    next()
  })
}

function requireAdmin(req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: 'Acesso negado: requer privilégios de admin' })
  }
  next()
}

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
    console.error('Error fetching users:', error)
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
    console.error('Error fetching trades:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

module.exports = router
