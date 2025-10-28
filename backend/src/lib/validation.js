const { z } = require('zod')

const schemas = {
  login: z.object({
    email: z.string().email(),
    password: z.string().min(6)
  }),

  register: z.object({
    email: z.string().email(),
    username: z.string().min(3),
    password: z.string().min(6)
  }),

  openCase: z.object({
    userId: z.string().uuid()
  }),

  deposit: z.object({
    amount: z.number().positive(),
    method: z.enum(['pix', 'card', 'crypto'])
  }),

  withdraw: z.object({
    amount: z.number().positive(),
    method: z.enum(['pix', 'crypto'])
  })
}

function validate(schema) {
  return (req, res, next) => {
    try {
      req.validated = schema.parse(req.body)
      next()
    } catch (error) {
      res.status(400).json({
        message: 'Validation error',
        errors: error.errors
      })
    }
  }
}

module.exports = {
  schemas,
  validate
}