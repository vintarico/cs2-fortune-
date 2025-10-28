import { useState, useEffect } from 'react';
import { ORIGINAL_CASES } from '../data/cases-original';
import { NEW_CASES, RARITY_CONFIG } from '../data/cases-new';
import { CASE_IMAGES, getSkinImage } from '../utils/imageUtils';
import { getCaseImageUrl } from '../utils/imageProxy';
import { getCaseIcon, getCaseGradient } from '../utils/caseIcons';
import { useUser } from '../contexts/UserContext';
import useCasePrices from '../hooks/useCasePrices';
import SkinImage from '../components/SkinImage';
import CaseImage from '../components/CaseImage';

const ALL_CASES = [...ORIGINAL_CASES, ...NEW_CASES];

export default function Cases() {
  const { balance, updateBalance, token } = useUser();
  const [selectedCase, setSelectedCase] = useState(null);
  const [isOpening, setIsOpening] = useState(false);
  const [wonItem, setWonItem] = useState(null);
  const [filter, setFilter] = useState('all');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [stats, setStats] = useState(null);
  
  // Buscar preços reais da Steam para a caixa selecionada
  const { prices, loading: pricesLoading } = useCasePrices(selectedCase?.items);

  // Carregar histórico ao montar
  useEffect(() => {
    if (token) {
      fetchHistory();
    }
  }, [token]);

  const fetchHistory = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/cases/history?limit=50', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setHistory(data.history);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
    }
  };

  const openCase = async (caseData) => {
    // Verificar saldo
    if (balance < caseData.price) {
      alert(`Saldo insuficiente! Você precisa de R$ ${caseData.price.toFixed(2)} mas tem apenas R$ ${balance.toFixed(2)}`);
      return;
    }

    setIsOpening(true);
    setWonItem(null);

    // Sortear item localmente primeiro (para mostrar animação)
    const randomItem = getRandomItem(caseData.items);

    // Simula abertura (3 segundos)
    setTimeout(async () => {
      setWonItem(randomItem);
      setIsOpening(false);

      // Salvar no backend
      try {
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
              name: randomItem.name,
              rarity: randomItem.rarity,
              value: randomItem.value,
              chance: randomItem.chance || RARITY_CONFIG[randomItem.rarity].chance
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          updateBalance(data.newBalance);
          
          // Atualizar histórico
          fetchHistory();
          
          console.log(`✅ Caixa aberta! Lucro: R$ ${data.profit.toFixed(2)}`);
        } else {
          const error = await response.json();
          console.error('Erro ao abrir caixa:', error);
          
          if (error.error === 'Saldo insuficiente') {
            alert('Saldo insuficiente após verificação!');
          }
        }
      } catch (error) {
        console.error('Erro de conexão:', error);
        alert('Erro ao conectar com o servidor. A abertura não foi salva.');
      }
    }, 3000);
  };

  const getRandomItem = (items) => {
    const rand = Math.random() * 100;
    let cumulative = 0;

    for (const item of items) {
      cumulative += (item.chance || RARITY_CONFIG[item.rarity].chance);
      if (rand <= cumulative) return item;
    }
    
    return items[0];
  };

  const filteredCases = filter === 'all' 
    ? ALL_CASES 
    : ALL_CASES.filter(c => {
        if (filter === 'cheap') return c.price < 50;
        if (filter === 'medium') return c.price >= 50 && c.price < 200;
        if (filter === 'expensive') return c.price >= 200;
        return true;
      });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Barra de Saldo e Histórico */}
        <div className="mb-8 flex justify-between items-center bg-gray-800 rounded-xl p-6 border-2 border-purple-500">
          <div>
            <p className="text-gray-400 text-sm mb-1">Seu Saldo</p>
            <p className="text-4xl font-bold text-green-400">R$ {balance.toFixed(2)}</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-2"
            >
              📊 Histórico ({history.length})
            </button>
            <button
              onClick={() => {
                const amount = parseFloat(prompt('Quanto deseja adicionar?', '100'));
                if (amount && amount > 0) {
                  updateBalance(balance + amount);
                }
              }}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center gap-2"
            >
              💰 Adicionar Saldo
            </button>
          </div>
        </div>

        {/* Modal de Histórico */}
        {showHistory && (
          <div className="mb-8 bg-gray-800 rounded-xl p-6 border-2 border-blue-500">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">📊 Histórico de Aberturas</h2>
              <button
                onClick={() => setShowHistory(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Estatísticas */}
            {stats && (
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Total Gasto</p>
                  <p className="text-red-400 text-2xl font-bold">R$ {stats.totalSpent.toFixed(2)}</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Total Ganho</p>
                  <p className="text-green-400 text-2xl font-bold">R$ {stats.totalWon.toFixed(2)}</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Lucro Total</p>
                  <p className={`text-2xl font-bold ${stats.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    R$ {stats.totalProfit.toFixed(2)}
                  </p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Lucro Médio</p>
                  <p className={`text-2xl font-bold ${stats.avgProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    R$ {stats.avgProfit.toFixed(2)}
                  </p>
                </div>
              </div>
            )}

            {/* Lista de Aberturas */}
            <div className="max-h-96 overflow-y-auto space-y-3">
              {history.length === 0 ? (
                <p className="text-center text-gray-400 py-8">Nenhuma caixa aberta ainda</p>
              ) : (
                history.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-700 rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-gray-400 text-sm">
                        {new Date(item.openedAt).toLocaleString('pt-BR')}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{item.caseName}</p>
                        <p className="text-sm text-gray-400">
                          {item.itemName} • 
                          <span style={{ color: RARITY_CONFIG[item.itemRarity]?.color || '#fff' }}>
                            {' '}{RARITY_CONFIG[item.itemRarity]?.name || item.itemRarity}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-sm">
                        Pago: R$ {item.casePrice.toFixed(2)}
                      </p>
                      <p className="text-green-400 font-semibold">
                        Ganho: R$ {item.itemValue.toFixed(2)}
                      </p>
                      <p className={`font-bold ${item.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {item.profit >= 0 ? '+' : ''}R$ {item.profit.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 animate-gradient">
            🎁 Caixas CS2 Fortune
          </h1>
          <p className="text-gray-300 text-lg">
            {ALL_CASES.length} caixas disponíveis • Preços de R$1,00 a R$3.000,00
          </p>
        </div>

        {/* Filtros */}
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              filter === 'all' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Todas ({ALL_CASES.length})
          </button>
          <button
            onClick={() => setFilter('cheap')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              filter === 'cheap' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Baratas (até R$50)
          </button>
          <button
            onClick={() => setFilter('medium')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              filter === 'medium' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Médias (R$50-R$200)
          </button>
          <button
            onClick={() => setFilter('expensive')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              filter === 'expensive' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Caras (R$200+)
          </button>
        </div>

        {/* Grid de Caixas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCases.map((caseItem) => (
            <div
              key={caseItem.id}
              className="bg-gray-800 rounded-xl p-6 hover:transform hover:scale-105 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-purple-500"
              onClick={() => setSelectedCase(caseItem)}
              style={{ borderColor: caseItem.color + '40' }}
            >
              {/* Imagem da Caixa - Componente Otimizado */}
              <CaseImage
                caseId={caseItem.id}
                caseName={caseItem.name}
                caseImage={caseItem.image}
                color={caseItem.color}
                size="medium"
                className="mb-4"
              />
              
              <h3 className="text-xl font-bold text-white mb-2">{caseItem.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{caseItem.description}</p>
              
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-green-400">
                  R$ {caseItem.price.toFixed(2)}
                </span>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold">
                  Abrir
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal de Abertura */}
        {selectedCase && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-purple-500">
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedCase.name}</h2>
                  <p className="text-gray-400">{selectedCase.description}</p>
                </div>
                <button
                  onClick={() => {setSelectedCase(null); setWonItem(null);}}
                  className="text-gray-400 hover:text-white text-3xl"
                >
                  ✕
                </button>
              </div>

              {/* Animação de Abertura */}
              {isOpening && (
                <div className="mb-8 p-12 bg-gradient-to-r from-purple-900 to-pink-900 rounded-xl">
                  <div className="animate-spin text-8xl text-center">🎁</div>
                  <p className="text-center text-white text-2xl font-bold mt-4">Abrindo...</p>
                </div>
              )}

              {/* Item Ganho */}
              {wonItem && (
                <div className="mb-8 p-8 bg-gradient-to-r from-green-900 to-emerald-900 rounded-xl border-4 border-green-400 animate-pulse">
                  <p className="text-center text-green-400 text-xl font-bold mb-6">🎉 PARABÉNS! VOCÊ GANHOU! 🎉</p>
                  
                  <div className="bg-gray-800 rounded-lg p-6">
                    {/* Imagem Grande do Item Ganho - Componente Otimizado */}
                    <SkinImage
                      skinName={wonItem.name}
                      size="large"
                      className="w-full h-48 mb-4"
                      rarity={wonItem.rarity}
                    />

                    <h3 className="text-3xl font-bold mb-3 text-center" style={{ color: RARITY_CONFIG[wonItem.rarity].color }}>
                      {wonItem.name}
                    </h3>
                    
                    <div className="flex justify-center gap-4 mb-4">
                      <span 
                        className="px-4 py-2 rounded-lg font-bold"
                        style={{ 
                          backgroundColor: RARITY_CONFIG[wonItem.rarity].color + '30',
                          color: RARITY_CONFIG[wonItem.rarity].color,
                          border: `2px solid ${RARITY_CONFIG[wonItem.rarity].color}`
                        }}
                      >
                        {RARITY_CONFIG[wonItem.rarity].name}
                      </span>
                      <span className="px-4 py-2 rounded-lg font-bold bg-gray-700 text-gray-300">
                        {(wonItem.chance || RARITY_CONFIG[wonItem.rarity].chance).toFixed(2)}% de chance
                      </span>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-gray-400 mb-2">Valor do Item (Steam Market)</p>
                      {pricesLoading ? (
                        <p className="text-yellow-400 text-3xl font-bold mb-2">Carregando preço...</p>
                      ) : prices[wonItem.name] ? (
                        <>
                          <p className="text-green-400 text-5xl font-bold mb-2">
                            {prices[wonItem.name].formatted_brl || `R$ ${prices[wonItem.name].brl.toFixed(2)}`}
                          </p>
                          <p className="text-xs text-gray-500 mb-2">
                            💰 Preço real do Steam Market
                          </p>
                          <p className="text-gray-500">
                            Lucro: <span className={(prices[wonItem.name].brl || wonItem.value) > selectedCase.price ? 'text-green-400' : 'text-red-400'}>
                              {(prices[wonItem.name].brl || wonItem.value) > selectedCase.price ? '+' : ''}R$ {((prices[wonItem.name].brl || wonItem.value) - selectedCase.price).toFixed(2)}
                            </span>
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-green-400 text-5xl font-bold mb-2">R$ {wonItem.value.toFixed(2)}</p>
                          <p className="text-gray-500">
                            Lucro: <span className={wonItem.value > selectedCase.price ? 'text-green-400' : 'text-red-400'}>
                              {wonItem.value > selectedCase.price ? '+' : ''}R$ {(wonItem.value - selectedCase.price).toFixed(2)}
                            </span>
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Botão Abrir */}
              {!isOpening && !wonItem && (
                <button
                  onClick={() => openCase(selectedCase)}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 rounded-xl font-bold text-xl mb-6"
                >
                  🎁 ABRIR POR R$ {selectedCase.price.toFixed(2)}
                </button>
              )}

              {/* Itens Possíveis */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">📦 Conteúdo da Caixa</h3>
                <div className="space-y-3">
                  {selectedCase.items.map((item, idx) => (
                    <div 
                      key={idx}
                      className="bg-gray-800 rounded-lg p-4 flex items-center gap-4 border-l-4 hover:bg-gray-750 transition"
                      style={{ borderLeftColor: RARITY_CONFIG[item.rarity].color }}
                    >
                      {/* Imagem do Item - Componente Otimizado */}
                      <SkinImage
                        skinName={item.name}
                        size="small"
                        className="w-20 h-20 flex-shrink-0"
                        rarity={item.rarity}
                      />

                      {/* Info do Item */}
                      <div className="flex-1">
                        <p className="font-semibold text-white text-sm mb-1">{item.name}</p>
                        <div className="flex items-center gap-3 text-xs">
                          <span 
                            className="px-2 py-1 rounded font-semibold"
                            style={{ 
                              backgroundColor: RARITY_CONFIG[item.rarity].color + '20',
                              color: RARITY_CONFIG[item.rarity].color 
                            }}
                          >
                            {RARITY_CONFIG[item.rarity].name}
                          </span>
                          <span className="text-gray-400">
                            {(item.chance || RARITY_CONFIG[item.rarity].chance).toFixed(2)}% chance
                          </span>
                        </div>
                      </div>

                      {/* Valor */}
                      <div className="text-right">
                        {pricesLoading ? (
                          <p className="text-gray-500 text-sm">💰...</p>
                        ) : prices[item.name] ? (
                          <>
                            <p className="text-green-400 font-bold text-lg">
                              {prices[item.name].formatted_brl || `R$ ${prices[item.name].brl.toFixed(2)}`}
                            </p>
                            <p className="text-xs text-gray-500">
                              {((prices[item.name].brl || item.value) / selectedCase.price * 100).toFixed(0)}x
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-green-400 font-bold text-lg">R$ {item.value.toFixed(2)}</p>
                            <p className="text-xs text-gray-500">
                              {(item.value / selectedCase.price * 100).toFixed(0)}x
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background: linear-gradient(90deg, #a855f7, #ec4899, #a855f7);
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        @keyframes shine {
          0% { transform: translateX(-100%) rotate(45deg); }
          100% { transform: translateX(100%) rotate(45deg); }
        }
        .animate-shine {
          animation: shine 2s ease-in-out infinite;
        }
        .hover\:bg-gray-750:hover {
          background-color: #2d3748;
        }
      `}</style>
    </div>
  );
}
