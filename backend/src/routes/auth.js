const express = require('express')
const router = express.Router()

// Stub login for demo: returns next '2fa' to simulate enabled 2FA
router.post('/login', (req, res) => {
  const { email } = req.body || {}
  // In real implementation: verify password and determine 2FA
  res.json({ message: `Bem vindo, ${email || 'usuário'}`, next: '2fa' })
})

// Stub 2FA setup - return a QR/secret in real impl
router.post('/2fa/setup', (req, res) => {
  res.json({ secret: 'BASE32SECRET', qr: 'data:image/png;base64,...' })
})

// Stub 2FA verify - accept any 6-digit code '123456'
router.post('/2fa/verify', (req, res) => {
  const { code } = req.body || {}
  if (code === '123456') return res.json({ success: true, message: 'Verificado' })
  return res.json({ success: false, message: 'Código inválido' })
})

module.exports = router
