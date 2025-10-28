const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const prisma = require('../db/prisma')

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRES_IN = '24h'

async function hashPassword(password) {
  return bcrypt.hash(password, 10)
}

async function comparePasswords(password, hash) {
  return bcrypt.compare(password, hash)
}

function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    isAdmin: user.isAdmin
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

// Middleware to protect routes
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' })
  }

  const token = authHeader.split(' ')[1]
  const decoded = verifyToken(token)
  if (!decoded) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  req.user = decoded
  next()
}

// Middleware to require admin role
function requireAdmin(req, res, next) {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' })
  }
  next()
}

module.exports = {
  hashPassword,
  comparePasswords,
  generateToken,
  verifyToken,
  requireAuth,
  requireAdmin
}