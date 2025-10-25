const SteamUser = require('steam-user');
const TradeOfferManager = require('steam-tradeoffer-manager');
const SteamTotp = require('steam-totp');
require('dotenv').config();

const client = new SteamUser();
const manager = new TradeOfferManager({
  steam: client,
  domain: 'cs2fortune.com',
  language: 'pt',
});

const steamAccountName = process.env.STEAM_USERNAME;
const steamPassword = process.env.STEAM_PASSWORD;
const steamSharedSecret = process.env.STEAM_SHARED_SECRET;

client.logOn({
  accountName: steamAccountName,
  password: steamPassword,
  twoFactorCode: SteamTotp.generateAuthCode(steamSharedSecret),
});

client.on('loggedOn', () => {
  console.log('Steam Bot logado com sucesso!');
  client.setPersona(1); // Online
  client.gamesPlayed(730); // CS:GO/CS2 appid
});

client.on('webSession', (sessionID, cookies) => {
  manager.setCookies(cookies, err => {
    if (err) {
      console.log('Erro ao configurar cookies no TradeOfferManager:', err);
      return;
    }
    console.log('TradeOfferManager configurado.');
  });
});

// Monitorar ofertas recebidas
manager.on('newOffer', offer => {
  console.log(`Nova oferta recebida: ${offer.id}`);

  // Exemplo: aceitar ofertas de depósito automaticamente (usar checagens reais)
  if (offer.isOurOffer()) {
    return;
  }

  // Para depósito, verificar as condições
  offer.accept((err) => {
    if (err) {
      console.error('Erro ao aceitar oferta:', err);
    } else {
      console.log('Oferta aceita com sucesso', offer.id);
      // Aqui, atualizar backend de CS 2 Fortune via API para refletir depósito
    }
  });
});

// Enviar oferta de retirada
async function enviarOfertaRetirada(steamIdTarget, items) {
  const offer = manager.createOffer(steamIdTarget);
  offer.addMyItems(items);
  try {
    await offer.send();
    console.log(`Oferta de retirada enviada para ${steamIdTarget}`);
  } catch (err) {
    console.error('Erro ao enviar oferta:', err);
  }
}

module.exports = {
  enviarOfertaRetirada,
};
