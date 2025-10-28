import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ORIGINAL_CASES } from '../../data/cases-original';
import { NEW_CASES, RARITY_CONFIG } from '../../data/cases-new';
import { useUser } from '../../contexts/UserContext';
import useCasePrices from '../../hooks/useCasePrices';
import SkinImage from '../../components/SkinImage';
import CaseImage from '../../components/CaseImage';
import { generateProvablyFairResult } from '../../utils/provablyFair';

const ALL_CASES = [...ORIGINAL_CASES, ...NEW_CASES];

export default function CasePage() {
  const router = useRouter();
  const { caseId } = router.query;
  const { balance, updateBalance, token } = useUser();
  
  const [caseData, setCaseData] = useState(null);
  const [isOpening, setIsOpening] = useState(false);
  const [wonItem, setWonItem] = useState(null);
  const [wonItems, setWonItems] = useState([]); // Array para múltiplas aberturas
  const [showAnimation, setShowAnimation] = useState(false);
  const [history, setHistory] = useState([]);
  const [rouletteItems, setRouletteItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [provablyFairData, setProvablyFairData] = useState(null);
  const [quantityToOpen, setQuantityToOpen] = useState(1); // Quantidade de caixas a abrir
  const [finalWonItem, setFinalWonItem] = useState(null); // Item que REALMENTE foi sorteado
  
  // Buscar a caixa pelo slug
  useEffect(() => {
    if (caseId) {
      const foundCase = ALL_CASES.find(c => 
        c.id === caseId || 
        c.name.toLowerCase().replace(/\s+/g, '-') === caseId.toLowerCase()
      );
      setCaseData(foundCase);
      
      if (!foundCase) {
        // Redireciona para página de casos se não encontrar
        router.push('/cases');
      }
    }
  }, [caseId]);

  // Buscar preços reais da Steam
  const { prices, loading: pricesLoading } = useCasePrices(caseData?.items);

  // Carregar histórico
  useEffect(() => {
    if (token && caseData) {
      fetchHistory();
    }
  }, [token, caseData]);

  const fetchHistory = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/cases/history?caseId=${caseData.id}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setHistory(data.history);
      }
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
    }
  };

  const getRandomItem = (items) => {
    const totalWeight = items.reduce((sum, item) => {
      const rarity = RARITY_CONFIG[item.rarity];
      return sum + (rarity?.chance || 1);
    }, 0);

    let random = Math.random() * totalWeight;

    for (const item of items) {
      const rarity = RARITY_CONFIG[item.rarity];
      const chance = rarity?.chance || 1;
      
      if (random < chance) {
        return item;
      }
      random -= chance;
    }

    return items[items.length - 1];
  };

  const openCase = async () => {
    if (!token) {
      alert('Você precisa fazer login para abrir caixas!');
      router.push('/login');
      return;
    }

    const totalCost = caseData.price * quantityToOpen;
    if (balance < totalCost) {
      alert(`Saldo insuficiente! Você precisa de R$ ${totalCost.toFixed(2)} mas tem apenas R$ ${balance.toFixed(2)}`);
      return;
    }

    // Array para armazenar todos os itens ganhos
    const allWonItems = [];

    // Gerar itens vencedores para cada abertura
    for (let i = 0; i < quantityToOpen; i++) {
      const fairResult = generateProvablyFairResult(caseData.items, RARITY_CONFIG);
      allWonItems.push({
        item: fairResult.selectedItem,
        provablyFair: fairResult
      });
    }

    const firstWonItem = allWonItems[0].item;
    
    // Criar array de itens para a roleta (100 itens)
    const rouletteArray = [];
    for (let i = 0; i < 100; i++) {
      rouletteArray.push(getRandomItem(caseData.items));
    }
    
    // ✅ POSIÇÃO 85 = ITEM VENCEDOR
    rouletteArray[85] = firstWonItem;
    
    console.log('═══════════════════════════════════');
    console.log('🎯 ITEM SORTEADO (DEFINITIVO):');
    console.log('Nome:', firstWonItem.name);
    console.log('Raridade:', firstWonItem.rarity);
    console.log('Valor:', firstWonItem.value);
    console.log('Posição 85:', rouletteArray[85].name);
    console.log('═══════════════════════════════════');
    
    // Guardar o item FINAL que deve aparecer
    setFinalWonItem(firstWonItem);
    setWonItems(allWonItems);
    setProvablyFairData(allWonItems[0].provablyFair);
    setRouletteItems(rouletteArray);
    setShowAnimation(true);
    setIsOpening(true);

    // Após 10 segundos de animação
    setTimeout(async () => {
      setIsOpening(false);
      
      // ✅ USAR O ITEM DA POSIÇÃO 85 (que é o firstWonItem)
      const itemQueParouNaRoleta = rouletteArray[85];
      
      console.log('═══════════════════════════════════');
      console.log('🏁 ANIMAÇÃO TERMINOU');
      console.log('Item que PAROU na roleta (pos 85):', itemQueParouNaRoleta.name);
      console.log('Item que foi SORTEADO:', firstWonItem.name);
      console.log('São o mesmo?', itemQueParouNaRoleta === firstWonItem);
      console.log('═══════════════════════════════════');
      
      // Setar wonItem para o modal USANDO O ITEM DA POSIÇÃO 85
      setWonItem(itemQueParouNaRoleta);
      setShowModal(true);

      try {
        // Enviar todas as aberturas para o backend
        for (const wonItemData of allWonItems) {
          const response = await fetch('http://localhost:3001/api/cases/open', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              caseId: caseData.id,
              caseName: caseData.name,
              casePrice: caseData.price,
              wonItem: {
                name: wonItemData.item.name,
                rarity: wonItemData.item.rarity,
                value: wonItemData.item.value,
                chance: wonItemData.item.chance || RARITY_CONFIG[wonItemData.item.rarity].chance
              },
              provablyFair: {
                serverSeed: wonItemData.provablyFair.serverSeed,
                clientSeed: wonItemData.provablyFair.clientSeed,
                nonce: wonItemData.provablyFair.nonce,
                hash: wonItemData.provablyFair.hash
              }
            })
          });

          if (response.ok) {
            const data = await response.json();
            updateBalance(data.newBalance);
          }
        }
        
        fetchHistory();
      } catch (error) {
        console.error('Erro ao abrir caixa:', error);
      }
    }, 10000);
  };

  if (!caseData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4">
      {/* Header com breadcrumb */}
      <div className="max-w-7xl mx-auto mb-6">
        <Link href="/cases" className="text-blue-400 hover:text-blue-300 transition">
          ← Voltar para todas as caixas
        </Link>
        
        <div className="mt-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{caseData.name}</h1>
          </div>
          
          <div className="text-right">
            <p className="text-gray-400 text-sm">Seu saldo</p>
            <p className="text-2xl font-bold text-green-400">R$ {balance.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* ROLETA SEMPRE VISÍVEL */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-gray-800 rounded-lg p-6 border-2 border-yellow-500/30">
          {/* Indicador central da roleta */}
          <div className="relative mb-4">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-24 bg-gradient-to-b from-yellow-400 via-orange-500 to-red-500 z-10 shadow-2xl shadow-yellow-500/50"></div>
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-6 z-20">
              <div className="bg-yellow-500 text-black px-3 py-1 rounded-lg font-bold text-sm shadow-2xl">
                ▼ VENCEDOR ▼
              </div>
            </div>
          </div>

          {/* Container da roleta */}
          <div className="relative overflow-hidden h-40 bg-gray-900 rounded-lg border-2 border-yellow-500/50 mb-6">
            {/* Gradiente nas bordas */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-gray-900 to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-gray-900 to-transparent z-10"></div>

            {/* Itens da roleta */}
            <div 
              className="flex gap-3 absolute items-center h-full px-4"
              style={{
                animation: showAnimation && isOpening ? 'rouletteSpin 10s cubic-bezier(0.17, 0.67, 0.12, 0.99) forwards' : 'none',
                left: '50%',
                willChange: 'transform',
                transform: showAnimation && isOpening ? undefined : 'translateX(-50%)'
              }}
              onAnimationEnd={() => {
                if (rouletteItems.length > 0) {
                  const itemNaPosicao85 = rouletteItems[85];
                  console.log('🎬 CALLBACK DA ANIMAÇÃO');
                  console.log('Item na posição 85 (FINAL):', itemNaPosicao85?.name);
                  console.log('Este é o item que PAROU na roleta');
                  // Forçar atualização do wonItem para o item da posição 85
                  setWonItem(itemNaPosicao85);
                }
              }}
            >
              {(showAnimation && rouletteItems.length > 0 ? rouletteItems : caseData.items.slice(0, 10)).map((item, index) => {
                const rarityConfig = RARITY_CONFIG[item.rarity];
                
                return (
                  <div
                    key={index}
                    className="flex-shrink-0 w-32 h-32 bg-gray-800 rounded-lg border-2 flex flex-col items-center justify-center p-2"
                    style={{
                      borderColor: rarityConfig?.color || '#888',
                      boxShadow: `0 0 15px ${rarityConfig?.color}60`
                    }}
                  >
                    <div className="w-20 h-20 mb-1">
                      <SkinImage
                        skinName={item.name}
                        rarity={item.rarity}
                        size="small"
                      />
                    </div>
                    <p 
                      className="text-xs font-bold text-center truncate w-full"
                      style={{ color: rarityConfig?.color }}
                    >
                      {item.name.split('|')[0]}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Controles de quantidade e botão de abrir */}
          <div className="flex items-center gap-4">
            {/* Seletor de quantidade */}
            <div className="flex gap-2">
              {[1, 2, 5, 10].map(qty => (
                <button
                  key={qty}
                  onClick={() => setQuantityToOpen(qty)}
                  disabled={isOpening}
                  className={`px-4 py-2 rounded-lg font-bold transition ${
                    quantityToOpen === qty
                      ? 'bg-yellow-500 text-black'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  } ${isOpening ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {qty}x
                </button>
              ))}
            </div>

            {/* Botão de abrir */}
            <button
              onClick={openCase}
              disabled={isOpening || balance < (caseData.price * quantityToOpen)}
              className={`flex-1 py-3 rounded-lg font-bold text-lg transition transform hover:scale-105 ${
                isOpening || balance < (caseData.price * quantityToOpen)
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 shadow-lg'
              }`}
            >
              {isOpening 
                ? '🎲 Abrindo...' 
                : `🎁 Abrir ${quantityToOpen}x por R$ ${(caseData.price * quantityToOpen).toFixed(2)}`
              }
            </button>
          </div>

          {balance < (caseData.price * quantityToOpen) && (
            <p className="text-red-400 text-sm mt-2 text-center">
              Saldo insuficiente. Necessário: R$ {(caseData.price * quantityToOpen).toFixed(2)}
            </p>
          )}
        </div>
      </div>

      {/* CONTEÚDO DA CAIXA - Organizado por raridade */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">📦 Conteúdo da Caixa</h2>
            <p className="text-gray-400 text-sm">
              {caseData.items.length} itens disponíveis • Ordenados por raridade
            </p>
          </div>
          
          <div className="space-y-4">
            {/* Agrupar itens por raridade e ordenar */}
            {Object.entries(
              caseData.items.reduce((groups, item) => {
                const rarity = item.rarity;
                if (!groups[rarity]) groups[rarity] = [];
                groups[rarity].push(item);
                return groups;
              }, {})
            )
            // Ordenar grupos por valor da raridade (LEGENDARY > EPIC > RARE > UNCOMMON > COMMON)
            .sort((a, b) => {
              const rarityOrder = { 'LEGENDARY': 5, 'EPIC': 4, 'RARE': 3, 'UNCOMMON': 2, 'COMMON': 1 };
              return (rarityOrder[b[0]] || 0) - (rarityOrder[a[0]] || 0);
            })
            .map(([rarityKey, items]) => {
              const rarityConfig = RARITY_CONFIG[rarityKey];
              const totalChance = caseData.items.reduce((sum, i) => sum + (RARITY_CONFIG[i.rarity]?.chance || 1), 0);
              const rarityChance = items.reduce((sum, i) => sum + (RARITY_CONFIG[i.rarity]?.chance || 1), 0);
              const rarityPercent = (rarityChance / totalChance * 100).toFixed(2);

              return (
                <div key={rarityKey} className="bg-gray-900 rounded-lg p-4 border-2" style={{ borderColor: rarityConfig?.color || '#888' }}>
                  {/* Header da raridade */}
                  <div className="flex justify-between items-center mb-4">
                    <h3 
                      className="text-lg font-bold flex items-center gap-2"
                      style={{ color: rarityConfig?.color }}
                    >
                      <span className="text-2xl">{rarityConfig?.icon || '⭐'}</span>
                      {rarityConfig?.label || rarityKey}
                    </h3>
                    <div className="text-right">
                      <div 
                        className="px-3 py-1 rounded-full font-bold text-sm"
                        style={{
                          backgroundColor: `${rarityConfig?.color}20`,
                          color: rarityConfig?.color
                        }}
                      >
                        {rarityPercent}% de chance
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{items.length} {items.length === 1 ? 'item' : 'itens'}</p>
                    </div>
                  </div>

                  {/* Grid de itens dessa raridade */}
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                    {items.map((item, index) => {
                      const price = Number(prices[item.name]) || Number(item.value) || 0;
                      const itemChance = (RARITY_CONFIG[item.rarity]?.chance || 1);
                      const itemPercent = (itemChance / totalChance * 100).toFixed(3);

                      return (
                        <div
                          key={index}
                          className="group bg-gray-800 rounded-lg p-3 border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer relative"
                          style={{
                            borderColor: rarityConfig?.color || '#888',
                            boxShadow: `0 0 15px ${rarityConfig?.color}30`
                          }}
                          title={`${item.name}\n💰 R$ ${price.toFixed(2)}\n🎲 ${itemPercent}% de chance`}
                        >
                          {/* Tooltip de preço ao hover */}
                          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black text-white px-3 py-2 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap shadow-2xl">
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-green-400 text-lg">R$ {price.toFixed(2)}</span>
                              <span className="text-gray-400">{itemPercent}%</span>
                            </div>
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
                          </div>

                          {/* Imagem da skin */}
                          <div className="mb-2">
                            <SkinImage
                              skinName={item.name}
                              rarity={item.rarity}
                              size="small"
                              className="w-full h-24"
                            />
                          </div>

                          {/* Nome truncado */}
                          <h4 
                            className="text-xs font-semibold mb-1 truncate"
                            style={{ color: rarityConfig?.color }}
                          >
                            {item.name.split('|')[1]?.trim() || item.name}
                          </h4>

                          {/* Arma */}
                          <p className="text-xs text-gray-500 truncate mb-2">
                            {item.name.split('|')[0]?.trim()}
                          </p>

                          {/* Badge de chance */}
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-400 font-mono">
                              {itemPercent}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Histórico recente */}
          {history.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-white mb-4">📊 Últimas Aberturas</h3>
              <div className="bg-gray-900 rounded-lg p-4 space-y-2">
                {history.slice(0, 5).map((entry, index) => (
                  <div key={index} className="flex justify-between items-center border-b border-gray-700 pb-2">
                    <span className="text-gray-300 text-sm truncate flex-1">
                      {entry.wonItem.name}
                    </span>
                    <span className={`font-semibold text-sm ${
                      entry.profit > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {entry.profit > 0 ? '+' : ''}{entry.profit.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de resultado - Múltiplos itens */}
      {showModal && wonItems.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-8 max-w-4xl w-full">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              🎉 {wonItems.length === 1 ? 'Parabéns!' : `Você ganhou ${wonItems.length} itens!`}
            </h2>
            
            {/* Grid de itens ganhos */}
            <div className={`grid ${wonItems.length === 1 ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'} gap-4 mb-6`}>
              {wonItems.map((wonItemData, index) => {
                const item = wonItemData.item;
                const price = Number(prices[item.name]) || Number(item.value) || 0;
                
                return (
                  <div 
                    key={index}
                    className="bg-gray-900 rounded-lg p-4 border-2"
                    style={{ borderColor: RARITY_CONFIG[item.rarity]?.color }}
                  >
                    <div className="mb-3">
                      <SkinImage
                        skinName={item.name}
                        rarity={item.rarity}
                        size="medium"
                        className="w-full h-32"
                      />
                    </div>

                    <h3 
                      className="text-sm font-bold mb-2 truncate"
                      style={{ color: RARITY_CONFIG[item.rarity]?.color }}
                      title={item.name}
                    >
                      {item.name}
                    </h3>

                    <p className="text-green-400 text-xl font-bold text-center">
                      R$ {price.toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Valor total */}
            <div className="bg-gray-900 p-4 rounded-lg mb-6 text-center">
              <p className="text-gray-400 text-sm mb-2">Valor Total dos Itens</p>
              <p className="text-green-400 text-3xl font-bold">
                R$ {wonItems.reduce((total, w) => {
                  const itemPrice = Number(prices[w.item.name]) || Number(w.item.value) || 0;
                  return total + itemPrice;
                }, 0).toFixed(2)}
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Custo: R$ {(caseData.price * wonItems.length).toFixed(2)} | 
                Lucro: <span className={
                  (wonItems.reduce((total, w) => {
                    const itemPrice = Number(prices[w.item.name]) || Number(w.item.value) || 0;
                    return total + itemPrice;
                  }, 0) - (caseData.price * wonItems.length)) > 0 
                    ? 'text-green-400' 
                    : 'text-red-400'
                }>
                  R$ {(wonItems.reduce((total, w) => {
                    const itemPrice = Number(prices[w.item.name]) || Number(w.item.value) || 0;
                    return total + itemPrice;
                  }, 0) - (caseData.price * wonItems.length)).toFixed(2)}
                </span>
              </p>
            </div>

            {/* Opções: Vender Tudo ou Guardar Tudo */}
            <div className="bg-gray-900 p-4 rounded-lg mb-6">
              <p className="text-gray-300 text-sm mb-4 text-center">O que deseja fazer com {wonItems.length === 1 ? 'este item' : 'estes itens'}?</p>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Botão Vender Tudo */}
                <button
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem('token');
                      let newBalance = balance;
                      
                      for (const wonItemData of wonItems) {
                        const itemValue = Number(prices[wonItemData.item.name]) || Number(wonItemData.item.value) || 0;
                        const response = await fetch('http://localhost:3001/api/inventory/sell', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                          },
                          body: JSON.stringify({
                            itemName: wonItemData.item.name,
                            itemValue: itemValue
                          })
                        });

                        if (response.ok) {
                          const data = await response.json();
                          newBalance = data.newBalance;
                        }
                      }

                      updateBalance(newBalance);
                      const totalValue = wonItems.reduce((total, w) => {
                        const itemPrice = Number(prices[w.item.name]) || Number(w.item.value) || 0;
                        return total + itemPrice;
                      }, 0);
                      alert(`✅ Todos os itens vendidos!\n💰 +R$ ${totalValue.toFixed(2)}\n💵 Novo saldo: R$ ${newBalance.toFixed(2)}`);
                      setShowModal(false);
                      setWonItems([]);
                      setWonItem(null);
                      setShowAnimation(false);
                    } catch (error) {
                      console.error('Erro ao vender:', error);
                      alert('❌ Erro ao conectar com o servidor');
                    }
                  }}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-4 rounded-lg font-semibold transition flex flex-col items-center gap-2 transform hover:scale-105"
                >
                  <span className="text-3xl">💰</span>
                  <span className="text-lg">Vender Tudo</span>
                  <span className="text-sm opacity-90">
                    +R$ {wonItems.reduce((total, w) => {
                      const itemPrice = Number(prices[w.item.name]) || Number(w.item.value) || 0;
                      return total + itemPrice;
                    }, 0).toFixed(2)}
                  </span>
                </button>

                {/* Botão Guardar Tudo */}
                <button
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem('token');
                      
                      for (const wonItemData of wonItems) {
                        const itemValue = Number(prices[wonItemData.item.name]) || Number(wonItemData.item.value) || 0;
                        const response = await fetch('http://localhost:3001/api/inventory/add', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                          },
                          body: JSON.stringify({
                            itemName: wonItemData.item.name,
                            itemValue: itemValue,
                            itemRarity: wonItemData.item.rarity,
                            itemImage: wonItemData.item.image
                          })
                        });
                      }

                      alert(`✅ ${wonItems.length === 1 ? 'Item adicionado' : wonItems.length + ' itens adicionados'} ao inventário!\n🎒 Acesse /inventory para visualizar.`);
                      setShowModal(false);
                      setWonItems([]);
                      setWonItem(null);
                      setShowAnimation(false);
                    } catch (error) {
                      console.error('Erro ao guardar:', error);
                      alert('❌ Erro ao conectar com o servidor');
                    }
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-4 rounded-lg font-semibold transition flex flex-col items-center gap-2 transform hover:scale-105"
                >
                  <span className="text-3xl">🎒</span>
                  <span className="text-lg">Guardar Tudo</span>
                  <span className="text-sm opacity-90">Inventário</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setWonItems([]);
                  setWonItem(null);
                  setShowAnimation(false);
                }}
                className="bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition"
              >
                ❌ Fechar
              </button>
              
              <button
                onClick={() => {
                  setShowModal(false);
                  setWonItems([]);
                  setWonItem(null);
                  setShowAnimation(false);
                  setTimeout(() => openCase(), 300);
                }}
                disabled={balance < (caseData.price * quantityToOpen)}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white py-3 rounded-lg font-semibold transition disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                🔄 Abrir Novamente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
