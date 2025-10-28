const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => res.json({ status: 'ok' }))

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/health', require('./routes/health'))
app.use('/api/cases', require('./routes/cases'))

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`)
})
