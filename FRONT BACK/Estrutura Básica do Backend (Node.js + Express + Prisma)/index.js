const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// Rotas básicas
app.get('/api/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.post('/api/users', async (req, res) => {
  const { steamId, username } = req.body;
  const user = await prisma.user.create({ data: { steamId, username } });
  res.json(user);
});

// Mais rotas para login, saldo, transações, pagamentos...

app.listen(3001, () => {
  console.log('Backend rodando na porta 3001');
});
