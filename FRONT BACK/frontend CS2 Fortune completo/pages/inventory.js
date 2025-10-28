import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { useNotifications } from '../contexts/NotificationContext';
import SkinImage from '../components/SkinImage';
import { RARITY_CONFIG } from '../data/cases-new';

export default function Inventory() {
  const { balance, user } = useUser();
  const { success, error, warning, info } = useNotifications();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalValue: 0,
    totalItems: 0,
    uniqueItems: 0
  });
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent'); // recent, value-high, value-low, rarity
  const [selectedItems, setSelectedItems] = useState([]);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [userLevel, setUserLevel] = useState(1);
  const [userXP, setUserXP] = useState(0);
  const [userXPToNextLevel, setUserXPToNextLevel] = useState(100);

  // Carregar inventário
  useEffect(() => {
    loadInventory();
    calculateUserLevel();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:3001/api/inventory', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setInventory(data.items || []);
        setStats(data.stats || { totalValue: 0, totalItems: 0, uniqueItems: 0 });
      }
    } catch (error) {
      console.error('Erro ao carregar inventário:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calcular nível do usuário baseado em XP (aberturas)
  const calculateUserLevel = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:3001/api/cases/history?limit=1000', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        const totalOpenings = data.total || 0;
        
        // 10 XP por abertura
        const xp = totalOpenings * 10;
        
        // Calcular nível (a cada 100 XP = 1 nível)
        const level = Math.floor(xp / 100) + 1;
        const currentLevelXP = xp % 100;
        
        setUserLevel(level);
        setUserXP(currentLevelXP);
        setUserXPToNextLevel(100);
      }
    } catch (error) {
      console.error('Erro ao calcular nível:', error);
    }
  };

  // Filtrar e ordenar inventário
  const getFilteredInventory = () => {
    let filtered = [...inventory];

    // Filtro por raridade
    if (filter !== 'all') {
      filtered = filtered.filter(item => item.itemRarity === filter);
    }

    // Ordenação
    switch (sortBy) {
      case 'value-high':
        filtered.sort((a, b) => (b.itemValue * b.quantity) - (a.itemValue * a.quantity));
        break;
      case 'value-low':
        filtered.sort((a, b) => (a.itemValue * a.quantity) - (b.itemValue * b.quantity));
        break;
      case 'rarity':
        const rarityOrder = { LEGENDARY: 5, EPIC: 4, RARE: 3, UNCOMMON: 2, COMMON: 1 };
        filtered.sort((a, b) => (rarityOrder[b.itemRarity] || 0) - (rarityOrder[a.itemRarity] || 0));
        break;
      case 'recent':
      default:
        filtered.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
        break;
    }

    return filtered;
  };

  // Selecionar/Deselecionar item
  const toggleItemSelection = (itemId) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  // Vender itens selecionados
  const sellSelectedItems = async () => {
    if (selectedItems.length === 0) {
      warning('Nenhum Item Selecionado', 'Selecione ao menos um item para vender');
      return;
    }

    if (!confirm(`Deseja vender ${selectedItems.length} item(ns)?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      let totalValue = 0;

      for (const itemId of selectedItems) {
        const item = inventory.find(i => i.id === itemId);
        if (!item) continue;

        const response = await fetch('http://localhost:3001/api/inventory/sell-from-inventory', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            itemId: item.id,
            quantity: item.quantity
          })
        });

        if (response.ok) {
          const data = await response.json();
          totalValue += data.valueAdded;
        }
      }

      success(
        '💰 Itens Vendidos!', 
        `${selectedItems.length} item(ns) vendido(s)! Total recebido: R$ ${totalValue.toFixed(2)}`,
        {
          duration: 6000
        }
      );
      setSelectedItems([]);
      loadInventory();

    } catch (error) {
      error('Erro na Venda', 'Não foi possível vender os itens. Tente novamente.');
    }
  };

  // Retirar itens para Steam
  const withdrawToSteam = async () => {
    if (selectedItems.length === 0) {
      warning('Nenhum Item Selecionado', 'Selecione ao menos um item para retirar');
      return;
    }

    setShowWithdrawModal(true);
  };

  const confirmWithdraw = async (tradeUrl) => {
    if (!tradeUrl || !tradeUrl.includes('steamcommunity.com')) {
      alert('❌ URL de Trade inválida!\nCole sua URL de trade do Steam.');
      return;
    }

    try {
      setWithdrawing(true);
      const token = localStorage.getItem('token');
      
      const selectedItemsData = selectedItems.map(id => {
        const item = inventory.find(i => i.id === id);
        return {
          id: item.id,
          name: item.itemName,
          value: item.itemValue,
          quantity: item.quantity
        };
      });

      const response = await fetch('http://localhost:3001/api/inventory/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: selectedItemsData,
          tradeUrl
        })
      });

      if (response.ok) {
        const data = await response.json();
        alert(`✅ Solicitação de retirada criada!\n\n📦 ${selectedItems.length} item(ns)\n🔗 Trade ID: ${data.tradeId}\n\n⏰ Aguarde até 24h para receber a oferta de trade no Steam.`);
        setShowWithdrawModal(false);
        setSelectedItems([]);
        loadInventory();
      } else {
        const error = await response.json();
        alert(`❌ Erro: ${error.error || 'Não foi possível criar retirada'}`);
      }

    } catch (error) {
      console.error('Erro ao retirar:', error);
      alert('❌ Erro ao conectar com o servidor');
    } finally {
      setWithdrawing(false);
    }
  };

  const filteredInventory = getFilteredInventory();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4">
      
      {/* Header com Perfil do Usuário */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-6 border border-blue-500/30 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center gap-6">
            
            {/* Foto de Perfil */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1 shadow-lg">
                <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-5xl">👤</span>
                  )}
                </div>
              </div>
              
              {/* Badge de Nível */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-1 rounded-full border-2 border-gray-900 shadow-lg">
                <span className="text-white font-bold text-sm">Nível {userLevel}</span>
              </div>
            </div>

            {/* Informações do Usuário */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-2">
                {user?.username || 'Jogador'}
              </h1>
              
              {/* Barra de XP */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>XP: {userXP} / {userXPToNextLevel}</span>
                  <span>{Math.floor((userXP / userXPToNextLevel) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(userXP / userXPToNextLevel) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  +10 XP por cada caixa aberta • Nível {userLevel + 1} em {userXPToNextLevel - userXP} XP
                </p>
              </div>

              {/* Steam ID */}
              <p className="text-gray-400 text-sm">
                🎮 Steam ID: {user?.steamId || 'Não conectado'}
              </p>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-xs mb-1">Saldo</p>
                <p className="text-green-400 font-bold text-lg">R$ {balance.toFixed(2)}</p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-xs mb-1">Itens</p>
                <p className="text-blue-400 font-bold text-lg">{stats.totalItems}</p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-xs mb-1">Valor</p>
                <p className="text-yellow-400 font-bold text-lg">R$ {stats.totalValue.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controles e Filtros */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Filtros de Raridade */}
            <div className="flex gap-2 flex-wrap">
              {[
                { id: 'all', label: 'Todos', icon: '📦' },
                { id: 'LEGENDARY', label: 'Lendário', icon: '👑', color: RARITY_CONFIG.LEGENDARY?.color },
                { id: 'EPIC', label: 'Épico', icon: '💎', color: RARITY_CONFIG.EPIC?.color },
                { id: 'RARE', label: 'Raro', icon: '⭐', color: RARITY_CONFIG.RARE?.color },
                { id: 'UNCOMMON', label: 'Incomum', icon: '🎯', color: RARITY_CONFIG.UNCOMMON?.color },
                { id: 'COMMON', label: 'Comum', icon: '🔹', color: RARITY_CONFIG.COMMON?.color },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`px-3 py-2 rounded-lg font-semibold text-sm transition ${
                    filter === f.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  style={filter === f.id && f.color ? { backgroundColor: f.color } : {}}
                >
                  {f.icon} {f.label}
                </button>
              ))}
            </div>

            {/* Ordenação */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="recent">🕐 Mais Recentes</option>
              <option value="value-high">💰 Maior Valor</option>
              <option value="value-low">💵 Menor Valor</option>
              <option value="rarity">⭐ Raridade</option>
            </select>
          </div>

          {/* Ações em massa */}
          {selectedItems.length > 0 && (
            <div className="mt-4 bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 flex justify-between items-center">
              <p className="text-white font-semibold">
                {selectedItems.length} item(ns) selecionado(s)
              </p>
              <div className="flex gap-3">
                <button
                  onClick={sellSelectedItems}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                >
                  💰 Vender Selecionados
                </button>
                <button
                  onClick={withdrawToSteam}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                >
                  🎮 Retirar para Steam
                </button>
                <button
                  onClick={() => setSelectedItems([])}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                >
                  ❌ Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grid de Itens */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400">Carregando inventário...</p>
          </div>
        ) : filteredInventory.length === 0 ? (
          <div className="text-center py-20 bg-gray-800 rounded-lg">
            <p className="text-6xl mb-4">📭</p>
            <p className="text-gray-400 text-xl mb-2">Inventário vazio</p>
            <p className="text-gray-500">Abra caixas e guarde itens para começar sua coleção!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredInventory.map((item) => {
              const rarityConfig = RARITY_CONFIG[item.itemRarity];
              const isSelected = selectedItems.includes(item.id);
              const totalValue = item.itemValue * item.quantity;

              return (
                <div
                  key={item.id}
                  onClick={() => toggleItemSelection(item.id)}
                  className={`
                    relative bg-gray-800 rounded-lg p-4 border-2 cursor-pointer
                    transition-all duration-300 transform hover:scale-105
                    ${isSelected ? 'border-blue-500 shadow-lg shadow-blue-500/50' : 'border-transparent hover:border-gray-600'}
                  `}
                  style={{
                    boxShadow: isSelected ? `0 0 30px ${rarityConfig?.color}60` : `0 0 20px ${rarityConfig?.color}20`
                  }}
                >
                  {/* Checkbox de seleção */}
                  <div className="absolute top-2 right-2 z-10">
                    <div className={`
                      w-6 h-6 rounded border-2 flex items-center justify-center transition
                      ${isSelected ? 'bg-blue-500 border-blue-500' : 'bg-gray-700 border-gray-500'}
                    `}>
                      {isSelected && <span className="text-white text-xs">✓</span>}
                    </div>
                  </div>

                  {/* Quantidade */}
                  {item.quantity > 1 && (
                    <div className="absolute top-2 left-2 bg-gray-900 px-2 py-1 rounded-full border border-gray-600 z-10">
                      <span className="text-white text-xs font-bold">x{item.quantity}</span>
                    </div>
                  )}

                  {/* Imagem */}
                  <div className="mb-3">
                    <SkinImage
                      skinName={item.itemName}
                      rarity={item.itemRarity}
                      size="medium"
                      className="w-full h-32"
                    />
                  </div>

                  {/* Nome */}
                  <h3 
                    className="text-sm font-semibold mb-2 truncate"
                    style={{ color: rarityConfig?.color }}
                    title={item.itemName}
                  >
                    {item.itemName}
                  </h3>

                  {/* Valor */}
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="text-green-400 font-bold">
                      R$ {totalValue.toFixed(2)}
                    </span>
                    {item.quantity > 1 && (
                      <span className="text-gray-400">
                        {item.itemValue.toFixed(2)}/un
                      </span>
                    )}
                  </div>

                  {/* Badge de raridade */}
                  <div 
                    className="text-center text-xs py-1 rounded font-semibold"
                    style={{
                      backgroundColor: `${rarityConfig?.color}20`,
                      color: rarityConfig?.color
                    }}
                  >
                    {rarityConfig?.name || 'Comum'}
                  </div>

                  {/* Data de adição */}
                  <p className="text-gray-500 text-xs mt-2 text-center">
                    {new Date(item.addedAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de Retirada */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-8 max-w-2xl w-full">
            <h2 className="text-3xl font-bold text-white mb-6">🎮 Retirar para Steam</h2>
            
            <div className="mb-6">
              <p className="text-gray-300 mb-4">
                Você está prestes a retirar <span className="text-blue-400 font-bold">{selectedItems.length} item(ns)</span> para sua conta Steam.
              </p>
              
              {/* Lista de itens selecionados */}
              <div className="bg-gray-900 rounded-lg p-4 max-h-48 overflow-y-auto mb-4">
                {selectedItems.map(id => {
                  const item = inventory.find(i => i.id === id);
                  return (
                    <div key={id} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-0">
                      <span className="text-white">{item.itemName} x{item.quantity}</span>
                      <span className="text-green-400">R$ {(item.itemValue * item.quantity).toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>

              {/* Input da Trade URL */}
              <div>
                <label className="text-gray-300 block mb-2">
                  🔗 URL de Trade do Steam
                  <a 
                    href="https://steamcommunity.com/my/tradeoffers/privacy" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 text-sm ml-2 hover:underline"
                  >
                    (Como encontrar?)
                  </a>
                </label>
                <input
                  id="tradeUrlInput"
                  type="text"
                  placeholder="https://steamcommunity.com/tradeoffer/new/?partner=..."
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Instruções */}
              <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 mt-4">
                <p className="text-blue-300 text-sm mb-2 font-semibold">📋 Instruções:</p>
                <ol className="text-gray-300 text-sm space-y-1 list-decimal list-inside">
                  <li>Acesse suas configurações de privacidade no Steam</li>
                  <li>Copie sua URL de Trade</li>
                  <li>Cole no campo acima</li>
                  <li>Aguarde até 24h para receber a oferta de trade</li>
                  <li>Aceite a oferta no Steam para receber seus itens</li>
                </ol>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  const tradeUrl = document.getElementById('tradeUrlInput').value;
                  confirmWithdraw(tradeUrl);
                }}
                disabled={withdrawing}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {withdrawing ? '⏳ Processando...' : '✅ Confirmar Retirada'}
              </button>
              
              <button
                onClick={() => setShowWithdrawModal(false)}
                disabled={withdrawing}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                ❌ Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
