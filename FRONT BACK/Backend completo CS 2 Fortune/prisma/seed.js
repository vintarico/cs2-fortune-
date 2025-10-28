// Prisma seed para Cases e CaseItems (SQLite dev)
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding cases and items...');

  const cases = [
    {
      name: 'Starter Case',
      price: 5.0,
      items: [
        { name: 'P250 | Sand Dune', rarity: 'Consumer Grade', value: 0.05, image: '/images/skins/p250_sand_dune.png' },
        { name: 'FAMAS | Colony', rarity: 'Mil-Spec', value: 0.15, image: '/images/skins/famas_colony.png' },
        { name: 'MP9 | Dart', rarity: 'Mil-Spec', value: 0.25, image: '/images/skins/mp9_dart.png' },
        { name: 'M4A1-S | Nitro', rarity: 'Restricted', value: 2.5, image: '/images/skins/m4a1s_nitro.png' }
      ]
    },
    {
      name: 'Premium Case',
      price: 10.0,
      items: [
        { name: 'AK-47 | Neon Rider', rarity: 'Covert', value: 32.5, image: '/images/skins/ak_neon_rider.png' },
        { name: 'AWP | Asiimov', rarity: 'Classified', value: 25.0, image: '/images/skins/awp_asiimov.png' },
        { name: 'Glock-18 | Candy Apple', rarity: 'Mil-Spec', value: 1.5, image: '/images/skins/glock_candy_apple.png' },
        { name: 'USP-S | Kill Confirmed', rarity: 'Classified', value: 18.0, image: '/images/skins/usps_kill_confirmed.png' },
        { name: 'P90 | Asiimov', rarity: 'Restricted', value: 8.0, image: '/images/skins/p90_asiimov.png' }
      ]
    },
    {
      name: 'Elite Case',
      price: 25.0,
      items: [
        { name: 'M4A4 | Howl (Replica)', rarity: 'Contraband', value: 120.0, image: '/images/skins/m4_howl.png' },
        { name: 'AK-47 | Fire Serpent', rarity: 'Covert', value: 95.0, image: '/images/skins/ak_fire_serpent.png' },
        { name: 'Desert Eagle | Blaze', rarity: 'Classified', value: 60.0, image: '/images/skins/deagle_blaze.png' },
        { name: 'AWP | Dragon Lore', rarity: 'Covert', value: 150.0, image: '/images/skins/awp_dragon_lore.png' }
      ]
    },
    {
      name: 'Legendary Case',
      price: 50.0,
      items: [
        { name: 'AK-47 | Case Hardened (Blue Gem)', rarity: 'Covert', value: 250.0, image: '/images/skins/ak_case_hardened.png' },
        { name: 'M4A4 | Poseidon', rarity: 'Classified', value: 180.0, image: '/images/skins/m4_poseidon.png' },
        { name: 'Karambit | Fade', rarity: 'Covert', value: 350.0, image: '/images/skins/karambit_fade.png' },
        { name: 'AWP | Medusa', rarity: 'Covert', value: 200.0, image: '/images/skins/awp_medusa.png' },
        { name: 'Glock-18 | Fade', rarity: 'Classified', value: 85.0, image: '/images/skins/glock_fade.png' }
      ]
    },
    {
      name: 'VIP Case',
      price: 100.0,
      items: [
        { name: 'Sport Gloves | Pandora\'s Box', rarity: 'Extraordinary', value: 500.0, image: '/images/skins/gloves_pandora.png' },
        { name: 'Butterfly Knife | Doppler', rarity: 'Covert', value: 600.0, image: '/images/skins/butterfly_doppler.png' },
        { name: 'M4A4 | Howl (Factory New)', rarity: 'Contraband', value: 800.0, image: '/images/skins/m4_howl_fn.png' },
        { name: 'AK-47 | Wild Lotus', rarity: 'Covert', value: 450.0, image: '/images/skins/ak_wild_lotus.png' },
        { name: 'AWP | Gungnir', rarity: 'Covert', value: 700.0, image: '/images/skins/awp_gungnir.png' }
      ]
    }
  ];

  for (const c of cases) {
    const created = await prisma.case.create({
      data: {
        name: c.name,
        price: c.price,
        items: {
          create: c.items.map((it) => ({
            name: it.name,
            rarity: it.rarity,
            value: it.value,
            image: it.image
          }))
        }
      },
      include: { items: true }
    });
    console.log(`Created case: ${created.name} with ${created.items.length} items`);
  }

  console.log('Seeding users/admin/premium/free...');

  const admin = await prisma.user.upsert({
    where: { steamId: 'admin-001' },
    update: {},
    create: {
      email: 'admin@example.com',
      username: 'admin',
      password: 'hashed',
      steamId: 'admin-001',
      isAdmin: true,
      isPremium: true,
      plan: 'admin',
      aiQuota: 999999,
      aiUsage: 0,
      gpt5Access: true
    }
  });

  const premium = await prisma.user.upsert({
    where: { steamId: 'premium-001' },
    update: {},
    create: {
      email: 'premium@example.com',
      username: 'premiumUser',
      password: 'hashed',
      steamId: 'premium-001',
      isPremium: true,
      plan: 'premium',
      aiQuota: 50000,
      aiUsage: 0
    }
  });

  const free = await prisma.user.upsert({
    where: { steamId: 'free-001' },
    update: {},
    create: {
      email: 'free@example.com',
      username: 'freeUser',
      password: 'hashed',
      steamId: 'free-001',
      plan: 'free',
      aiQuota: 5000,
      aiUsage: 0
    }
  });

  console.log('Creating sample transactions (TradeOffer/Deposit/Withdrawal)...');

  // Deposit
  await prisma.deposit.upsert({
    where: { id: 'deposit-seed-001' },
    update: {},
    create: {
      id: 'deposit-seed-001',
      userId: premium.id,
      amount: 100,
      method: 'mercadopago',
      status: 'approved',
      txReference: 'MP-TEST-001'
    }
  });

  // Withdrawal
  await prisma.withdrawal.upsert({
    where: { id: 'withdrawal-seed-001' },
    update: {},
    create: {
      id: 'withdrawal-seed-001',
      userId: premium.id,
      amount: 25,
      method: 'coinpayments',
      status: 'pending',
      txReference: 'CP-TEST-001'
    }
  });

  // TradeOffer
  await prisma.tradeOffer.upsert({
    where: { steamOfferId: 'SO-TEST-001' },
    update: {},
    create: {
      userId: premium.id,
      steamOfferId: 'SO-TEST-001',
      itemsSent: JSON.stringify([{ name: 'P250 | Sand Dune', value: 0.1 }]),
      itemsReceived: JSON.stringify([{ name: 'AK-47 | Redline', value: 10.5 }]),
      status: 'completed'
    }
  });

  console.log('Seed concluído.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
