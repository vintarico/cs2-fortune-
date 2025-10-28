const express = require('express')
const router = express.Router()
const prisma = require('../db/prisma')

// GET /api/cases - list cases
router.get('/', async (req, res) => {
  const cases = await prisma.case.findMany({ include: { items: true } })
  const result = cases.map(c => ({ id: c.id, name: c.name, price: c.price, itemCount: c.items.length }))
  res.json(result)
})

// GET /api/cases/:id
router.get('/:id', async (req, res) => {
  const c = await prisma.case.findUnique({ where: { id: req.params.id }, include: { items: true } })
  if (!c) return res.status(404).json({ message: 'Case not found' })
  res.json({ id: c.id, name: c.name, price: c.price, items: c.items })
})

const tradeSerializer = require('../middleware/tradeSerializerMiddleware')

// POST /api/cases/:id/open
router.post('/:id/open', tradeSerializer, async (req, res) => {
  const { userId } = req.body || {}
  const c = await prisma.case.findUnique({ where: { id: req.params.id }, include: { items: true } })
  if (!c) return res.status(404).json({ message: 'Case not found' })

  // simple random pick
  const items = c.items
  if (!items || items.length === 0) return res.status(400).json({ message: 'No items in case' })
  const picked = items[Math.floor(Math.random() * items.length)]

  // create a trade offer (stub) — use service to centralize serialization
  const { createTradeOffer } = require('../services/tradeService')
  const trade = await createTradeOffer({
    userId: userId || '',
    itemsSent: req.body.itemsSent ? JSON.parse(req.body.itemsSent) : [],
    itemsReceived: req.body.itemsReceived ? JSON.parse(req.body.itemsReceived) : { id: picked.id, name: picked.name, rarity: picked.rarity },
    status: 'pending'
  })

  res.json({ tradeOfferId: trade.id, result: { itemId: picked.id, itemName: picked.name, rarity: picked.rarity, value: picked.value } })
})

module.exports = router
