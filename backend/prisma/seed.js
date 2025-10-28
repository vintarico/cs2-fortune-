const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // create sample user
  const user = await prisma.user.upsert({
    where: { email: 'demo@cs2fortune.local' },
    update: {},
    create: {
      email: 'demo@cs2fortune.local',
      username: 'demouser',
      password: 'demo',
      balance: 100.0
    }
  })

  // create a sample case with items
  let sampleCase = await prisma.case.findFirst({ where: { name: 'Starter Case' }, include: { items: true } })
  if (!sampleCase) {
    sampleCase = await prisma.case.create({
      data: {
        name: 'Starter Case',
        price: 2.5,
        items: {
          create: [
            { name: 'Common Knife', rarity: 'common', value: 1.0 },
            { name: 'Rare Pistol', rarity: 'rare', value: 5.0 },
            { name: 'Epic Rifle', rarity: 'epic', value: 15.0 }
          ]
        }
      },
      include: { items: true }
    })
  }

  console.log('Seed completed:', { user: user.email, case: sampleCase.name })
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
