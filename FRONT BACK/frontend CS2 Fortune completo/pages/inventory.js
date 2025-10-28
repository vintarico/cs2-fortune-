import { useState, useEffect } from 'react';import { useState, useEffect } from 'react';import { useState, useEffect } from 'react';

import { useUser } from '../contexts/UserContext';

import { useNotifications } from '../contexts/NotificationContext';import { useUser } from '../contexts/UserContext';import { useUser } from '../contexts/UserContext';

import SkinImage from '../components/SkinImage';

import { useNotifications } from '../contexts/NotificationContext';import { useNotifications } from '../contexts/NotificationContext';

export default function Inventory() {

  const { balance, user } = useUser();import SkinImage from '../components/SkinImage';import SkinImage from '../components/SkinImage';

  const { success, error, warning, info } = useNotifications();

  const [inventory, setInventory] = useState([]);import { RARITY_CONFIG } from '../data/cases-new';

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({export default function Inventory() {

    totalValue: 0,

    totalItems: 0,  const { balance, user } = useUser();export default function Inventory() {

    uniqueItems: 0

  });  const { success, error, warning, info } = useNotifications();  const { balance, user } = useUser();

  

  // Estados de filtros e busca avançados  const [inventory, setInventory] = useState([]);  const { success, error, warning, info } = useNotifications();

  const [searchTerm, setSearchTerm] = useState('');

  const [filter, setFilter] = useState('all');  const [loading, setLoading] = useState(true);  const [inventory, setInventory] = useState([]);

  const [sortBy, setSortBy] = useState('recent');

  const [viewMode, setViewMode] = useState('grid');  const [stats, setStats] = useState({  const [loading, setLoading] = useState(true);

  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const [showFilters, setShowFilters] = useState(false);    totalValue: 0,  const [stats, setStats] = useState({

  

  // Estados de seleção e ações    totalItems: 0,    totalValue: 0,

  const [selectedItems, setSelectedItems] = useState([]);

  const [selectAll, setSelectAll] = useState(false);    uniqueItems: 0    totalItems: 0,

  

  // Estados de modais  });    uniqueItems: 0

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const [withdrawing, setWithdrawing] = useState(false);    });

  

  // Estados de perfil  // Estados de filtros e busca avançados  

  const [userLevel, setUserLevel] = useState(1);

  const [userXP, setUserXP] = useState(0);  const [searchTerm, setSearchTerm] = useState('');  // Estados de filtros e busca avançados

  const [userXPToNextLevel, setUserXPToNextLevel] = useState(100);

  const [filter, setFilter] = useState('all');  const [searchTerm, setSearchTerm] = useState('');

  // Carregar inventário

  useEffect(() => {  const [sortBy, setSortBy] = useState('recent');  const [filter, setFilter] = useState('all');

    loadInventory();

    calculateUserLevel();  const [viewMode, setViewMode] = useState('grid');  const [sortBy, setSortBy] = useState('recent');

  }, []);

  const [priceRange, setPriceRange] = useState({ min: '', max: '' });  const [viewMode, setViewMode] = useState('grid'); // grid, list

  const loadInventory = async () => {

    try {  const [showFilters, setShowFilters] = useState(false);  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

      setLoading(true);

      const token = localStorage.getItem('token');    const [showFilters, setShowFilters] = useState(false);

      

      if (!token) {  // Estados de seleção e ações  

        setLoading(false);

        return;  const [selectedItems, setSelectedItems] = useState([]);  // Estados de seleção e ações

      }

  const [selectAll, setSelectAll] = useState(false);  const [selectedItems, setSelectedItems] = useState([]);

      const response = await fetch('http://localhost:3001/api/inventory', {

        headers: {    const [selectAll, setSelectAll] = useState(false);

          'Authorization': `Bearer ${token}`

        }  // Estados de modais  

      });

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);  // Estados de modais

      if (response.ok) {

        const data = await response.json();  const [withdrawing, setWithdrawing] = useState(false);  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

        setInventory(data.items || []);

        setStats(data.stats || { totalValue: 0, totalItems: 0, uniqueItems: 0 });    const [withdrawing, setWithdrawing] = useState(false);

      }

    } catch (error) {  // Estados de perfil  

      console.error('Erro ao carregar inventário:', error);

    } finally {  const [userLevel, setUserLevel] = useState(1);  // Estados de perfil

      setLoading(false);

    }  const [userXP, setUserXP] = useState(0);  const [userLevel, setUserLevel] = useState(1);

  };

  const [userXPToNextLevel, setUserXPToNextLevel] = useState(100);  const [userXP, setUserXP] = useState(0);

  // Calcular nível do usuário baseado em XP (aberturas)

  const calculateUserLevel = async () => {  const [userXPToNextLevel, setUserXPToNextLevel] = useState(100);

    try {

      const token = localStorage.getItem('token');  // Carregar inventário

      if (!token) return;

  useEffect(() => {  // Carregar inventário

      const response = await fetch('http://localhost:3001/api/cases/history?limit=1000', {

        headers: { 'Authorization': `Bearer ${token}` }    loadInventory();  useEffect(() => {

      });

    calculateUserLevel();    loadInventory();

      if (response.ok) {

        const data = await response.json();  }, []);    calculateUserLevel();

        const totalOpenings = data.total || 0;

          }, []);

        // 10 XP por abertura

        const xp = totalOpenings * 10;  const loadInventory = async () => {

        

        // Calcular nível (a cada 100 XP = 1 nível)    try {  const loadInventory = async () => {

        const level = Math.floor(xp / 100) + 1;

        const currentLevelXP = xp % 100;      setLoading(true);    try {

        

        setUserLevel(level);      const token = localStorage.getItem('token');      setLoading(true);

        setUserXP(currentLevelXP);

        setUserXPToNextLevel(100);            const token = localStorage.getItem('token');

      }

    } catch (error) {      if (!token) {      

      console.error('Erro ao calcular nível:', error);

    }        setLoading(false);      if (!token) {

  };

        return;        setLoading(false);

  // Filtrar e ordenar inventário

  const getFilteredInventory = () => {      }        return;

    let filtered = [...inventory];

      }

    // Filtro por busca de nome

    if (searchTerm) {      const response = await fetch('http://localhost:3001/api/inventory', {

      const search = searchTerm.toLowerCase();

      filtered = filtered.filter(item =>         headers: {      const response = await fetch('http://localhost:3001/api/inventory', {

        item.itemName.toLowerCase().includes(search)

      );          'Authorization': `Bearer ${token}`        headers: {

    }

        }          'Authorization': `Bearer ${token}`

    // Filtro por raridade

    if (filter !== 'all') {      });        }

      filtered = filtered.filter(item => item.itemRarity === filter);

    }      });



    // Filtro por faixa de preço      if (response.ok) {

    if (priceRange.min !== '') {

      filtered = filtered.filter(item => item.itemValue >= parseFloat(priceRange.min || 0));        const data = await response.json();      if (response.ok) {

    }

    if (priceRange.max !== '') {        setInventory(data.items || []);        const data = await response.json();

      filtered = filtered.filter(item => item.itemValue <= parseFloat(priceRange.max || Infinity));

    }        setStats(data.stats || { totalValue: 0, totalItems: 0, uniqueItems: 0 });        setInventory(data.items || []);



    // Ordenação      }        setStats(data.stats || { totalValue: 0, totalItems: 0, uniqueItems: 0 });

    switch (sortBy) {

      case 'value-high':    } catch (error) {      }

        filtered.sort((a, b) => (b.itemValue * b.quantity) - (a.itemValue * a.quantity));

        break;      console.error('Erro ao carregar inventário:', error);    } catch (error) {

      case 'value-low':

        filtered.sort((a, b) => (a.itemValue * a.quantity) - (b.itemValue * b.quantity));    } finally {      console.error('Erro ao carregar inventário:', error);

        break;

      case 'name-asc':      setLoading(false);    } finally {

        filtered.sort((a, b) => a.itemName.localeCompare(b.itemName));

        break;    }      setLoading(false);

      case 'name-desc':

        filtered.sort((a, b) => b.itemName.localeCompare(a.itemName));  };    }

        break;

      case 'quantity-high':  };

        filtered.sort((a, b) => b.quantity - a.quantity);

        break;  // Calcular nível do usuário baseado em XP (aberturas)

      case 'quantity-low':

        filtered.sort((a, b) => a.quantity - b.quantity);  const calculateUserLevel = async () => {  // Calcular nível do usuário baseado em XP (aberturas)

        break;

      case 'rarity':    try {  const calculateUserLevel = async () => {

        const rarityOrder = { 

          'Exceedingly Rare': 7,      const token = localStorage.getItem('token');    try {

          'Covert': 6, 

          'Classified': 5,       if (!token) return;      const token = localStorage.getItem('token');

          'Restricted': 4, 

          'Mil-Spec': 3,       if (!token) return;

          'Industrial Grade': 2, 

          'Consumer Grade': 1       const response = await fetch('http://localhost:3001/api/cases/history?limit=1000', {

        };

        filtered.sort((a, b) => (rarityOrder[b.itemRarity] || 0) - (rarityOrder[a.itemRarity] || 0));        headers: { 'Authorization': `Bearer ${token}` }      const response = await fetch('http://localhost:3001/api/cases/history?limit=1000', {

        break;

      case 'recent':      });        headers: { 'Authorization': `Bearer ${token}` }

      default:

        filtered.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));      });

        break;

    }      if (response.ok) {



    return filtered;        const data = await response.json();      if (response.ok) {

  };

        const totalOpenings = data.total || 0;        const data = await response.json();

  // Funções auxiliares

  const toggleItemSelection = (itemId) => {                const totalOpenings = data.total || 0;

    setSelectedItems(prev => {

      if (prev.includes(itemId)) {        // 10 XP por abertura        

        return prev.filter(id => id !== itemId);

      } else {        const xp = totalOpenings * 10;        // 10 XP por abertura

        return [...prev, itemId];

      }                const xp = totalOpenings * 10;

    });

  };        // Calcular nível (a cada 100 XP = 1 nível)        



  const toggleSelectAll = () => {        const level = Math.floor(xp / 100) + 1;        // Calcular nível (a cada 100 XP = 1 nível)

    const filteredItems = getFilteredInventory();

    if (selectAll) {        const currentLevelXP = xp % 100;        const level = Math.floor(xp / 100) + 1;

      setSelectedItems([]);

      setSelectAll(false);                const currentLevelXP = xp % 100;

    } else {

      setSelectedItems(filteredItems.map(item => item.id));        setUserLevel(level);        

      setSelectAll(true);

    }        setUserXP(currentLevelXP);        setUserLevel(level);

  };

        setUserXPToNextLevel(100);        setUserXP(currentLevelXP);

  const clearFilters = () => {

    setSearchTerm('');      }        setUserXPToNextLevel(100);

    setFilter('all');

    setPriceRange({ min: '', max: '' });    } catch (error) {      }

    setSortBy('recent');

  };      console.error('Erro ao calcular nível:', error);    } catch (error) {



  const getSelectedItemsValue = () => {    }      console.error('Erro ao calcular nível:', error);

    return selectedItems.reduce((total, itemId) => {

      const item = inventory.find(i => i.id === itemId);  };    }

      return total + (item ? item.itemValue * item.quantity : 0);

    }, 0);  };

  };

  // Filtrar e ordenar inventário

  const getRarityColor = (rarity) => {

    const colors = {  const getFilteredInventory = () => {  // Filtrar e ordenar inventário com busca e filtros avançados

      'Consumer Grade': '#B0C3D9',

      'Industrial Grade': '#5E98D9',     let filtered = [...inventory];  const getFilteredInventory = () => {

      'Mil-Spec': '#4B69FF',

      'Restricted': '#8847FF',    let filtered = [...inventory];

      'Classified': '#D32CE6',

      'Covert': '#EB4B4B',    // Filtro por busca de nome

      'Exceedingly Rare': '#E4AE39'

    };    if (searchTerm) {    // Filtro por busca de nome

    return colors[rarity] || '#B0C3D9';

  };      const search = searchTerm.toLowerCase();    if (searchTerm) {



  // Vender itens selecionados      filtered = filtered.filter(item =>       const search = searchTerm.toLowerCase();

  const sellSelectedItems = async () => {

    if (selectedItems.length === 0) {        item.itemName.toLowerCase().includes(search)      filtered = filtered.filter(item => 

      warning('Nenhum Item Selecionado', 'Selecione ao menos um item para vender');

      return;      );        item.itemName.toLowerCase().includes(search)

    }

    }      );

    if (!confirm(`Deseja vender ${selectedItems.length} item(ns)?`)) {

      return;    }

    }

    // Filtro por raridade

    try {

      const token = localStorage.getItem('token');    if (filter !== 'all') {    // Filtro por raridade

      let totalValue = 0;

      filtered = filtered.filter(item => item.itemRarity === filter);    if (filter !== 'all') {

      for (const itemId of selectedItems) {

        const item = inventory.find(i => i.id === itemId);    }      filtered = filtered.filter(item => item.itemRarity === filter);

        if (!item) continue;

    }

        const response = await fetch('http://localhost:3001/api/inventory/sell-from-inventory', {

          method: 'POST',    // Filtro por faixa de preço

          headers: {

            'Content-Type': 'application/json',    if (priceRange.min !== '') {    // Filtro por faixa de preço

            'Authorization': `Bearer ${token}`

          },      filtered = filtered.filter(item => item.itemValue >= parseFloat(priceRange.min || 0));    if (priceRange.min !== '') {

          body: JSON.stringify({

            itemId: item.id,    }      filtered = filtered.filter(item => item.itemValue >= parseFloat(priceRange.min || 0));

            quantity: item.quantity

          })    if (priceRange.max !== '') {    }

        });

      filtered = filtered.filter(item => item.itemValue <= parseFloat(priceRange.max || Infinity));    if (priceRange.max !== '') {

        if (response.ok) {

          const data = await response.json();    }      filtered = filtered.filter(item => item.itemValue <= parseFloat(priceRange.max || Infinity));

          totalValue += data.valueAdded;

        }    }

      }

    // Ordenação

      success(

        '💰 Itens Vendidos!',     switch (sortBy) {    // Ordenação

        `${selectedItems.length} item(ns) vendido(s)! Total recebido: R$ ${totalValue.toFixed(2)}`,

        { duration: 6000 }      case 'value-high':    switch (sortBy) {

      );

      setSelectedItems([]);        filtered.sort((a, b) => (b.itemValue * b.quantity) - (a.itemValue * a.quantity));      case 'value-high':

      loadInventory();

        break;        filtered.sort((a, b) => (b.itemValue * b.quantity) - (a.itemValue * a.quantity));

    } catch (error) {

      error('Erro na Venda', 'Não foi possível vender os itens. Tente novamente.');      case 'value-low':        break;

    }

  };        filtered.sort((a, b) => (a.itemValue * a.quantity) - (b.itemValue * b.quantity));      case 'value-low':



  const filteredInventory = getFilteredInventory();        break;        filtered.sort((a, b) => (a.itemValue * a.quantity) - (b.itemValue * b.quantity));



  return (      case 'name-asc':        break;

    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4">

              filtered.sort((a, b) => a.itemName.localeCompare(b.itemName));      case 'name-asc':

      {/* Header Melhorado */}

      <div className="max-w-7xl mx-auto mb-6">        break;        filtered.sort((a, b) => a.itemName.localeCompare(b.itemName));

        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-6 border border-blue-500/30 shadow-2xl">

          <div className="flex flex-col lg:flex-row items-center gap-6">      case 'name-desc':        break;

            

            {/* Foto de Perfil */}        filtered.sort((a, b) => b.itemName.localeCompare(a.itemName));      case 'name-desc':

            <div className="relative">

              <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1 shadow-lg">        break;        filtered.sort((a, b) => b.itemName.localeCompare(a.itemName));

                <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">

                  {user?.avatar ? (      case 'quantity-high':        break;

                    <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />

                  ) : (        filtered.sort((a, b) => b.quantity - a.quantity);      case 'quantity-high':

                    <span className="text-3xl lg:text-5xl">👤</span>

                  )}        break;        filtered.sort((a, b) => b.quantity - a.quantity);

                </div>

              </div>      case 'quantity-low':        break;

              

              {/* Badge de Nível */}        filtered.sort((a, b) => a.quantity - b.quantity);      case 'quantity-low':

              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-500 px-3 py-1 rounded-full border-2 border-gray-900 shadow-lg">

                <span className="text-white font-bold text-xs lg:text-sm">Nível {userLevel}</span>        break;        filtered.sort((a, b) => a.quantity - b.quantity);

              </div>

            </div>      case 'rarity':        break;



            {/* Informações do Usuário */}        const rarityOrder = {       case 'rarity':

            <div className="flex-1 text-center lg:text-left">

              <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">          'Exceedingly Rare': 7,        const rarityOrder = { 

                🎒 Meu Inventário

              </h1>          'Covert': 6,           'Exceedingly Rare': 7,

              

              {/* Barra de XP */}          'Classified': 5,           'Covert': 6, 

              <div className="mb-3">

                <div className="flex justify-between text-xs text-gray-400 mb-1">          'Restricted': 4,           'Classified': 5, 

                  <span>XP: {userXP} / {userXPToNextLevel}</span>

                  <span>{Math.floor((userXP / userXPToNextLevel) * 100)}%</span>          'Mil-Spec': 3,           'Restricted': 4, 

                </div>

                <div className="w-full bg-gray-700 rounded-full h-2 lg:h-3 overflow-hidden">          'Industrial Grade': 2,           'Mil-Spec': 3, 

                  <div 

                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-500"          'Consumer Grade': 1           'Industrial Grade': 2, 

                    style={{ width: `${(userXP / userXPToNextLevel) * 100}%` }}

                  />        };          'Consumer Grade': 1 

                </div>

                <p className="text-xs text-gray-500 mt-1">        filtered.sort((a, b) => (rarityOrder[b.itemRarity] || 0) - (rarityOrder[a.itemRarity] || 0));        };

                  +10 XP por cada caixa aberta • Nível {userLevel + 1} em {userXPToNextLevel - userXP} XP

                </p>        break;        filtered.sort((a, b) => (rarityOrder[b.itemRarity] || 0) - (rarityOrder[a.itemRarity] || 0));

              </div>

      case 'recent':        break;

              {/* Steam ID */}

              <p className="text-gray-400 text-sm">      default:      case 'recent':

                🎮 {user?.username || 'Jogador'} • Steam ID: {user?.steamId || 'Não conectado'}

              </p>        filtered.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));      default:

            </div>

        break;        filtered.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));

            {/* Estatísticas */}

            <div className="grid grid-cols-3 gap-3 lg:gap-4">    }        break;

              <div className="bg-gray-700/50 rounded-lg p-3 lg:p-4 text-center">

                <p className="text-gray-400 text-xs mb-1">Saldo</p>    }

                <p className="text-green-400 font-bold text-sm lg:text-lg">R$ {balance.toFixed(2)}</p>

              </div>    return filtered;

              <div className="bg-gray-700/50 rounded-lg p-3 lg:p-4 text-center">

                <p className="text-gray-400 text-xs mb-1">Itens</p>  };    return filtered;

                <p className="text-blue-400 font-bold text-sm lg:text-lg">{stats.totalItems}</p>

              </div>  };

              <div className="bg-gray-700/50 rounded-lg p-3 lg:p-4 text-center">

                <p className="text-gray-400 text-xs mb-1">Valor Total</p>  // Funções auxiliares

                <p className="text-purple-400 font-bold text-sm lg:text-lg">R$ {stats.totalValue.toFixed(2)}</p>

              </div>  const toggleItemSelection = (itemId) => {  // Selecionar/Deselecionar item

            </div>

          </div>    setSelectedItems(prev => {  const toggleItemSelection = (itemId) => {

        </div>

      </div>      if (prev.includes(itemId)) {    setSelectedItems(prev => {



      {/* Sistema de Busca e Filtros Avançados */}        return prev.filter(id => id !== itemId);      if (prev.includes(itemId)) {

      <div className="max-w-7xl mx-auto mb-6">

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 shadow-lg">      } else {        return prev.filter(id => id !== itemId);

          

          {/* Linha Principal - Busca e Controles */}        return [...prev, itemId];      } else {

          <div className="flex flex-col lg:flex-row gap-4 mb-4">

                  }        return [...prev, itemId];

            {/* Busca */}

            <div className="flex-1">    });      }

              <div className="relative">

                <input  };    });

                  type="text"

                  placeholder="🔍 Buscar por nome da skin..."  };

                  value={searchTerm}

                  onChange={(e) => setSearchTerm(e.target.value)}  const toggleSelectAll = () => {

                  className="w-full bg-gray-700 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"

                />    const filteredItems = getFilteredInventory();  // Selecionar/Deselecionar todos os itens filtrados

                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">

                  🔍    if (selectAll) {  const toggleSelectAll = () => {

                </div>

                {searchTerm && (      setSelectedItems([]);    const filteredItems = getFilteredInventory();

                  <button

                    onClick={() => setSearchTerm('')}      setSelectAll(false);    if (selectAll) {

                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"

                  >    } else {      setSelectedItems([]);

                    ❌

                  </button>      setSelectedItems(filteredItems.map(item => item.id));      setSelectAll(false);

                )}

              </div>      setSelectAll(true);    } else {

            </div>

    }      setSelectedItems(filteredItems.map(item => item.id));

            {/* Controles de Visualização */}

            <div className="flex gap-2">  };      setSelectAll(true);

              <button

                onClick={() => setViewMode('grid')}    }

                className={`px-4 py-3 rounded-lg font-medium transition ${

                  viewMode === 'grid'   const clearFilters = () => {  };

                    ? 'bg-blue-600 text-white' 

                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'    setSearchTerm('');

                }`}

              >    setFilter('all');  // Limpar filtros

                🔲 Grade

              </button>    setPriceRange({ min: '', max: '' });  const clearFilters = () => {

              <button

                onClick={() => setViewMode('list')}    setSortBy('recent');    setSearchTerm('');

                className={`px-4 py-3 rounded-lg font-medium transition ${

                  viewMode === 'list'   };    setFilter('all');

                    ? 'bg-blue-600 text-white' 

                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'    setPriceRange({ min: '', max: '' });

                }`}

              >  const getSelectedItemsValue = () => {    setSortBy('recent');

                📋 Lista

              </button>    return selectedItems.reduce((total, itemId) => {  };

              <button

                onClick={() => setShowFilters(!showFilters)}      const item = inventory.find(i => i.id === itemId);

                className={`px-4 py-3 rounded-lg font-medium transition ${

                  showFilters       return total + (item ? item.itemValue * item.quantity : 0);  // Calcular valor total dos itens selecionados

                    ? 'bg-purple-600 text-white' 

                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'    }, 0);  const getSelectedItemsValue = () => {

                }`}

              >  };    return selectedItems.reduce((total, itemId) => {

                🔧 Filtros

              </button>      const item = inventory.find(i => i.id === itemId);

            </div>

          </div>  const getRarityColor = (rarity) => {      return total + (item ? item.itemValue * item.quantity : 0);



          {/* Filtros Avançados (Expansível) */}    const colors = {    }, 0);

          {showFilters && (

            <div className="border-t border-gray-700 pt-4">      'Consumer Grade': '#B0C3D9',  };

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">

                      'Industrial Grade': '#5E98D9', 

                {/* Filtro por Raridade */}

                <div>      'Mil-Spec': '#4B69FF',  // Obter cor da raridade

                  <label className="block text-gray-300 text-sm font-medium mb-2">Raridade</label>

                  <select      'Restricted': '#8847FF',  const getRarityColor = (rarity) => {

                    value={filter}

                    onChange={(e) => setFilter(e.target.value)}      'Classified': '#D32CE6',    const colors = {

                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"

                  >      'Covert': '#EB4B4B',      'Consumer Grade': '#B0C3D9',

                    <option value="all">Todas</option>

                    <option value="Consumer Grade">Consumer Grade</option>      'Exceedingly Rare': '#E4AE39'      'Industrial Grade': '#5E98D9', 

                    <option value="Industrial Grade">Industrial Grade</option>

                    <option value="Mil-Spec">Mil-Spec</option>    };      'Mil-Spec': '#4B69FF',

                    <option value="Restricted">Restricted</option>

                    <option value="Classified">Classified</option>    return colors[rarity] || '#B0C3D9';      'Restricted': '#8847FF',

                    <option value="Covert">Covert</option>

                    <option value="Exceedingly Rare">Exceedingly Rare</option>  };      'Classified': '#D32CE6',

                  </select>

                </div>      'Covert': '#EB4B4B',



                {/* Ordenação */}  // Vender itens selecionados      'Exceedingly Rare': '#E4AE39'

                <div>

                  <label className="block text-gray-300 text-sm font-medium mb-2">Ordenar por</label>  const sellSelectedItems = async () => {    };

                  <select

                    value={sortBy}    if (selectedItems.length === 0) {    return colors[rarity] || '#B0C3D9';

                    onChange={(e) => setSortBy(e.target.value)}

                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"      warning('Nenhum Item Selecionado', 'Selecione ao menos um item para vender');  };

                  >

                    <option value="recent">Mais Recente</option>      return;

                    <option value="value-high">Maior Valor</option>

                    <option value="value-low">Menor Valor</option>    }  // Vender itens selecionados

                    <option value="name-asc">Nome A-Z</option>

                    <option value="name-desc">Nome Z-A</option>  const sellSelectedItems = async () => {

                    <option value="quantity-high">Mais Quantidade</option>

                    <option value="quantity-low">Menos Quantidade</option>    if (!confirm(`Deseja vender ${selectedItems.length} item(ns)?`)) {    if (selectedItems.length === 0) {

                    <option value="rarity">Raridade</option>

                  </select>      return;      warning('Nenhum Item Selecionado', 'Selecione ao menos um item para vender');

                </div>

    }      return;

                {/* Preço Mínimo */}

                <div>    }

                  <label className="block text-gray-300 text-sm font-medium mb-2">Preço Mín.</label>

                  <input    try {

                    type="number"

                    placeholder="R$ 0.00"      const token = localStorage.getItem('token');    if (!confirm(`Deseja vender ${selectedItems.length} item(ns)?`)) {

                    step="0.01"

                    value={priceRange.min}      let totalValue = 0;      return;

                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}

                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"    }

                  />

                </div>      for (const itemId of selectedItems) {



                {/* Preço Máximo */}        const item = inventory.find(i => i.id === itemId);    try {

                <div>

                  <label className="block text-gray-300 text-sm font-medium mb-2">Preço Máx.</label>        if (!item) continue;      const token = localStorage.getItem('token');

                  <input

                    type="number"      let totalValue = 0;

                    placeholder="R$ 999.00"

                    step="0.01"        const response = await fetch('http://localhost:3001/api/inventory/sell-from-inventory', {

                    value={priceRange.max}

                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}          method: 'POST',      for (const itemId of selectedItems) {

                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"

                  />          headers: {        const item = inventory.find(i => i.id === itemId);

                </div>

            'Content-Type': 'application/json',        if (!item) continue;

                {/* Botão Limpar */}

                <div className="flex items-end">            'Authorization': `Bearer ${token}`

                  <button

                    onClick={clearFilters}          },        const response = await fetch('http://localhost:3001/api/inventory/sell-from-inventory', {

                    className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition"

                  >          body: JSON.stringify({          method: 'POST',

                    🗑️ Limpar

                  </button>            itemId: item.id,          headers: {

                </div>

              </div>            quantity: item.quantity            'Content-Type': 'application/json',

            </div>

          )}          })            'Authorization': `Bearer ${token}`

        </div>

      </div>        });          },



      {/* Barra de Ações (Itens Selecionados) */}          body: JSON.stringify({

      {selectedItems.length > 0 && (

        <div className="max-w-7xl mx-auto mb-6">        if (response.ok) {            itemId: item.id,

          <div className="bg-gradient-to-r from-blue-800 to-purple-800 rounded-lg p-4 border border-blue-500/50 shadow-lg">

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">          const data = await response.json();            quantity: item.quantity

              

              {/* Info dos Itens Selecionados */}          totalValue += data.valueAdded;          })

              <div className="flex items-center gap-4">

                <div className="text-white">        }        });

                  <span className="font-bold text-lg">{selectedItems.length}</span>

                  <span className="text-blue-200 ml-1">      }

                    {selectedItems.length === 1 ? 'item selecionado' : 'itens selecionados'}

                  </span>        if (response.ok) {

                </div>

                <div className="text-green-400 font-bold">      success(          const data = await response.json();

                  Valor Total: R$ {getSelectedItemsValue().toFixed(2)}

                </div>        '💰 Itens Vendidos!',           totalValue += data.valueAdded;

              </div>

        `${selectedItems.length} item(ns) vendido(s)! Total recebido: R$ ${totalValue.toFixed(2)}`,        }

              {/* Botões de Ação */}

              <div className="flex gap-2">        { duration: 6000 }      }

                <button

                  onClick={toggleSelectAll}      );

                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition"

                >      setSelectedItems([]);      success(

                  {selectAll ? '❌ Desmarcar Todos' : '✅ Selecionar Todos'}

                </button>      loadInventory();        '💰 Itens Vendidos!', 

                <button

                  onClick={sellSelectedItems}        `${selectedItems.length} item(ns) vendido(s)! Total recebido: R$ ${totalValue.toFixed(2)}`,

                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition"

                >    } catch (error) {        {

                  💰 Vender Selecionados

                </button>      error('Erro na Venda', 'Não foi possível vender os itens. Tente novamente.');          duration: 6000

                <button

                  onClick={() => setSelectedItems([])}    }        }

                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition"

                >  };      );

                  ❌ Limpar Seleção

                </button>      setSelectedItems([]);

              </div>

            </div>  const filteredInventory = getFilteredInventory();      loadInventory();

          </div>

        </div>

      )}

  return (    } catch (error) {

      {/* Conteúdo Principal */}

      <div className="max-w-7xl mx-auto">    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4">      error('Erro na Venda', 'Não foi possível vender os itens. Tente novamente.');

        {loading ? (

          <div className="text-center py-20">          }

            <div className="inline-block w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>

            <p className="text-gray-400">Carregando inventário...</p>      {/* Header Melhorado */}  };

          </div>

        ) : filteredInventory.length === 0 ? (      <div className="max-w-7xl mx-auto mb-6">

          <div className="text-center py-20">

            <div className="text-6xl mb-4">📦</div>        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-6 border border-blue-500/30 shadow-2xl">  // Retirar itens para Steam

            <h2 className="text-2xl font-bold text-white mb-2">

              {inventory.length === 0 ? 'Inventário Vazio' : 'Nenhum Item Encontrado'}          <div className="flex flex-col lg:flex-row items-center gap-6">  const withdrawToSteam = async () => {

            </h2>

            <p className="text-gray-400 mb-6">                if (selectedItems.length === 0) {

              {inventory.length === 0 

                ? 'Abra algumas caixas para adicionar itens ao seu inventário!'            {/* Foto de Perfil */}      warning('Nenhum Item Selecionado', 'Selecione ao menos um item para retirar');

                : 'Tente ajustar os filtros para encontrar os itens desejados.'

              }            <div className="relative">      return;

            </p>

            {inventory.length === 0 ? (              <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1 shadow-lg">    }

              <button

                onClick={() => window.location.href = '/cases'}                <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">    setShowWithdrawModal(true);

                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold text-lg transition"

              >                  {user?.avatar ? (  };

                🎁 Ir para Cases

              </button>                    <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />

            ) : (

              <button                  ) : (  const confirmWithdraw = async (tradeUrl) => {

                onClick={clearFilters}

                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-bold text-lg transition"                    <span className="text-3xl lg:text-5xl">👤</span>    if (!tradeUrl || !tradeUrl.includes('steamcommunity.com')) {

              >

                🔄 Limpar Filtros                  )}      error('URL Inválida', 'Cole sua URL de trade do Steam.');

              </button>

            )}                </div>      return;

          </div>

        ) : (              </div>    }

          <>

            {/* Cabeçalho da Lista */}              

            <div className="flex justify-between items-center mb-6">

              <div className="text-white">              {/* Badge de Nível */}    try {

                <h2 className="text-xl font-bold">

                  {filteredInventory.length} {filteredInventory.length === 1 ? 'item encontrado' : 'itens encontrados'}              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-500 px-3 py-1 rounded-full border-2 border-gray-900 shadow-lg">      setWithdrawing(true);

                </h2>

                {filteredInventory.length !== inventory.length && (                <span className="text-white font-bold text-xs lg:text-sm">Nível {userLevel}</span>      const token = localStorage.getItem('token');

                  <p className="text-gray-400 text-sm">

                    Mostrando {filteredInventory.length} de {inventory.length} itens              </div>      

                  </p>

                )}            </div>      const selectedItemsData = selectedItems.map(id => {

              </div>

                      const item = inventory.find(i => i.id === id);

              <div className="flex items-center gap-2">

                <button            {/* Informações do Usuário */}        return {

                  onClick={toggleSelectAll}

                  className="text-blue-400 hover:text-blue-300 text-sm"            <div className="flex-1 text-center lg:text-left">          id: item.id,

                >

                  {selectAll ? 'Desmarcar todos' : 'Selecionar todos'}              <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">          name: item.itemName,

                </button>

              </div>                🎒 Meu Inventário          value: item.itemValue,

            </div>

              </h1>          quantity: item.quantity

            {/* Grade de Itens */}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">                      };

              {filteredInventory.map((item) => (

                <div              {/* Barra de XP */}      });

                  key={item.id}

                  className={`relative bg-gray-800 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:scale-105 ${              <div className="mb-3">

                    selectedItems.includes(item.id)

                      ? 'border-blue-500 shadow-lg shadow-blue-500/25'                <div className="flex justify-between text-xs text-gray-400 mb-1">      const response = await fetch('http://localhost:3001/api/inventory/withdraw', {

                      : 'border-gray-700 hover:border-gray-600'

                  }`}                  <span>XP: {userXP} / {userXPToNextLevel}</span>        method: 'POST',

                  onClick={() => toggleItemSelection(item.id)}

                >                  <span>{Math.floor((userXP / userXPToNextLevel) * 100)}%</span>        headers: {

                  {/* Checkbox de Seleção */}

                  <div className="absolute top-2 left-2 z-10">                </div>          'Content-Type': 'application/json',

                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${

                      selectedItems.includes(item.id)                <div className="w-full bg-gray-700 rounded-full h-2 lg:h-3 overflow-hidden">          'Authorization': `Bearer ${token}`

                        ? 'bg-blue-500 border-blue-500'

                        : 'bg-gray-700 border-gray-500'                  <div         },

                    }`}>

                      {selectedItems.includes(item.id) && (                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-500"        body: JSON.stringify({

                        <span className="text-white text-xs">✓</span>

                      )}                    style={{ width: `${(userXP / userXPToNextLevel) * 100}%` }}          items: selectedItemsData,

                    </div>

                  </div>                  />          tradeUrl



                  {/* Quantidade */}                </div>        })

                  {item.quantity > 1 && (

                    <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-bold z-10">                <p className="text-xs text-gray-500 mt-1">      });

                      {item.quantity}x

                    </div>                  +10 XP por cada caixa aberta • Nível {userLevel + 1} em {userXPToNextLevel - userXP} XP

                  )}

                </p>      if (response.ok) {

                  {/* Imagem da Skin */}

                  <div className="p-4 pb-2">              </div>        const data = await response.json();

                    <SkinImage

                      skinName={item.itemName}        success(

                      className="w-full h-24 object-contain"

                    />              {/* Steam ID */}          '✅ Retirada Solicitada!',

                  </div>

              <p className="text-gray-400 text-sm">          `${selectedItems.length} item(ns) solicitados para retirada. Trade ID: ${data.tradeId}. Aguarde até 24h para receber a oferta no Steam.`,

                  {/* Informações */}

                  <div className="p-3 pt-0">                🎮 {user?.username || 'Jogador'} • Steam ID: {user?.steamId || 'Não conectado'}          { duration: 8000 }

                    {/* Raridade */}

                    <div className="text-center mb-2">              </p>        );

                      <span 

                        className="text-xs font-bold px-2 py-1 rounded"            </div>        setShowWithdrawModal(false);

                        style={{ 

                          backgroundColor: getRarityColor(item.itemRarity) + '20',        setSelectedItems([]);

                          color: getRarityColor(item.itemRarity)

                        }}            {/* Estatísticas */}        loadInventory();

                      >

                        {item.itemRarity}            <div className="grid grid-cols-3 gap-3 lg:gap-4">      } else {

                      </span>

                    </div>              <div className="bg-gray-700/50 rounded-lg p-3 lg:p-4 text-center">        const errorData = await response.json();



                    {/* Nome */}                <p className="text-gray-400 text-xs mb-1">Saldo</p>        error('Erro na Retirada', errorData.error || 'Não foi possível criar retirada');

                    <h3 className="text-white font-medium text-sm text-center mb-2 line-clamp-2 leading-tight">

                      {item.itemName}                <p className="text-green-400 font-bold text-sm lg:text-lg">R$ {balance.toFixed(2)}</p>      }

                    </h3>

              </div>

                    {/* Preço */}

                    <div className="text-center">              <div className="bg-gray-700/50 rounded-lg p-3 lg:p-4 text-center">    } catch (err) {

                      <p className="text-green-400 font-bold">

                        R$ {item.itemValue.toFixed(2)}                <p className="text-gray-400 text-xs mb-1">Itens</p>      error('Erro de Conexão', 'Não foi possível conectar ao servidor');

                      </p>

                      {item.quantity > 1 && (                <p className="text-blue-400 font-bold text-sm lg:text-lg">{stats.totalItems}</p>    } finally {

                        <p className="text-gray-400 text-xs">

                          Total: R$ {(item.itemValue * item.quantity).toFixed(2)}              </div>      setWithdrawing(false);

                        </p>

                      )}              <div className="bg-gray-700/50 rounded-lg p-3 lg:p-4 text-center">    }

                    </div>

                  </div>                <p className="text-gray-400 text-xs mb-1">Valor Total</p>  };

                </div>

              ))}                <p className="text-purple-400 font-bold text-sm lg:text-lg">R$ {stats.totalValue.toFixed(2)}</p>

            </div>

          </>              </div>  const filteredInventory = getFilteredInventory();

        )}

      </div>            </div>

    </div>

  );          </div>  return (

}
        </div>    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4">

      </div>      

      {/* Header com Perfil do Usuário */}

      {/* Barra de Busca e Filtros */}      <div className="max-w-7xl mx-auto mb-6">

      <div className="max-w-7xl mx-auto mb-6">        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-6 border border-blue-500/30 shadow-2xl">

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 shadow-lg">          <div className="flex flex-col lg:flex-row items-center gap-6">

                      

          {/* Linha Principal - Busca e Controles */}            {/* Foto de Perfil */}

          <div className="flex flex-col lg:flex-row gap-4 mb-4">            <div className="relative">

                          <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1 shadow-lg">

            {/* Busca */}                <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">

            <div className="flex-1">                  {user?.avatar ? (

              <div className="relative">                    <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />

                <input                  ) : (

                  type="text"                    <span className="text-3xl lg:text-5xl">👤</span>

                  placeholder="🔍 Buscar por nome da skin..."                  )}

                  value={searchTerm}                </div>

                  onChange={(e) => setSearchTerm(e.target.value)}              </div>

                  className="w-full bg-gray-700 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"              

                />              {/* Badge de Nível */}

                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-500 px-3 py-1 rounded-full border-2 border-gray-900 shadow-lg">

                  🔍                <span className="text-white font-bold text-xs lg:text-sm">Nível {userLevel}</span>

                </div>              </div>

                {searchTerm && (            </div>

                  <button

                    onClick={() => setSearchTerm('')}            {/* Informações do Usuário */}

                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"            <div className="flex-1 text-center lg:text-left">

                  >              <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">

                    ❌                🎒 Meu Inventário

                  </button>              </h1>

                )}              

              </div>              {/* Barra de XP */}

            </div>              <div className="mb-3">

                <div className="flex justify-between text-xs text-gray-400 mb-1">

            {/* Controles de Visualização */}                  <span>XP: {userXP} / {userXPToNextLevel}</span>

            <div className="flex gap-2">                  <span>{Math.floor((userXP / userXPToNextLevel) * 100)}%</span>

              <button                </div>

                onClick={() => setViewMode('grid')}                <div className="w-full bg-gray-700 rounded-full h-2 lg:h-3 overflow-hidden">

                className={`px-4 py-3 rounded-lg font-medium transition ${                  <div 

                  viewMode === 'grid'                     className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-500"

                    ? 'bg-blue-600 text-white'                     style={{ width: `${(userXP / userXPToNextLevel) * 100}%` }}

                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'                  />

                }`}                </div>

              >                <p className="text-xs text-gray-500 mt-1">

                🔲 Grade                  +10 XP por cada caixa aberta • Nível {userLevel + 1} em {userXPToNextLevel - userXP} XP

              </button>                </p>

              <button              </div>

                onClick={() => setViewMode('list')}

                className={`px-4 py-3 rounded-lg font-medium transition ${              {/* Steam ID */}

                  viewMode === 'list'               <p className="text-gray-400 text-sm">

                    ? 'bg-blue-600 text-white'                 🎮 {user?.username || 'Jogador'} • Steam ID: {user?.steamId || 'Não conectado'}

                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'              </p>

                }`}            </div>

              >

                📋 Lista            {/* Estatísticas */}

              </button>            <div className="grid grid-cols-3 gap-3 lg:gap-4">

              <button              <div className="bg-gray-700/50 rounded-lg p-3 lg:p-4 text-center">

                onClick={() => setShowFilters(!showFilters)}                <p className="text-gray-400 text-xs mb-1">Saldo</p>

                className={`px-4 py-3 rounded-lg font-medium transition ${                <p className="text-green-400 font-bold text-sm lg:text-lg">R$ {balance.toFixed(2)}</p>

                  showFilters               </div>

                    ? 'bg-purple-600 text-white'               <div className="bg-gray-700/50 rounded-lg p-3 lg:p-4 text-center">

                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'                <p className="text-gray-400 text-xs mb-1">Itens</p>

                }`}                <p className="text-blue-400 font-bold text-sm lg:text-lg">{stats.totalItems}</p>

              >              </div>

                🔧 Filtros              <div className="bg-gray-700/50 rounded-lg p-3 lg:p-4 text-center">

              </button>                <p className="text-gray-400 text-xs mb-1">Valor Total</p>

            </div>                <p className="text-purple-400 font-bold text-sm lg:text-lg">R$ {stats.totalValue.toFixed(2)}</p>

          </div>              </div>

            </div>

          {/* Filtros Avançados (Expansível) */}          </div>

          {showFilters && (        </div>

            <div className="border-t border-gray-700 pt-4">      </div>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">

                      {/* Sistema de Inventário Melhorado continua aqui... */}

                {/* Filtro por Raridade */}      <div className="max-w-7xl mx-auto">

                <div>        <div className="text-center py-20">

                  <label className="block text-gray-300 text-sm font-medium mb-2">Raridade</label>          <div className="text-6xl mb-4">🔧</div>

                  <select          <h2 className="text-2xl font-bold text-white mb-4">Sistema Sendo Atualizado</h2>

                    value={filter}          <p className="text-gray-400">

                    onChange={(e) => setFilter(e.target.value)}            Implementando melhorias avançadas no inventário com filtros, busca e nova interface...

                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"          </p>

                  >        </div>

                    <option value="all">Todas</option>      </div>

                    <option value="Consumer Grade">Consumer Grade</option>    </div>

                    <option value="Industrial Grade">Industrial Grade</option>  );

                    <option value="Mil-Spec">Mil-Spec</option>}

                    <option value="Restricted">Restricted</option>

                    <option value="Classified">Classified</option>  // Carregar inventário

                    <option value="Covert">Covert</option>  useEffect(() => {

                    <option value="Exceedingly Rare">Exceedingly Rare</option>    loadInventory();

                  </select>    calculateUserLevel();

                </div>  }, []);



                {/* Ordenação */}  const loadInventory = async () => {

                <div>    try {

                  <label className="block text-gray-300 text-sm font-medium mb-2">Ordenar por</label>      setLoading(true);

                  <select      const token = localStorage.getItem('token');

                    value={sortBy}      

                    onChange={(e) => setSortBy(e.target.value)}      if (!token) {

                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"        setLoading(false);

                  >        return;

                    <option value="recent">Mais Recente</option>      }

                    <option value="value-high">Maior Valor</option>

                    <option value="value-low">Menor Valor</option>      const response = await fetch('http://localhost:3001/api/inventory', {

                    <option value="name-asc">Nome A-Z</option>        headers: {

                    <option value="name-desc">Nome Z-A</option>          'Authorization': `Bearer ${token}`

                    <option value="quantity-high">Mais Quantidade</option>        }

                    <option value="quantity-low">Menos Quantidade</option>      });

                    <option value="rarity">Raridade</option>

                  </select>      if (response.ok) {

                </div>        const data = await response.json();

        setInventory(data.items || []);

                {/* Preço Mínimo */}        setStats(data.stats || { totalValue: 0, totalItems: 0, uniqueItems: 0 });

                <div>      }

                  <label className="block text-gray-300 text-sm font-medium mb-2">Preço Mín.</label>    } catch (error) {

                  <input      console.error('Erro ao carregar inventário:', error);

                    type="number"    } finally {

                    placeholder="R$ 0.00"      setLoading(false);

                    step="0.01"    }

                    value={priceRange.min}  };

                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}

                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"  // Calcular nível do usuário baseado em XP (aberturas)

                  />  const calculateUserLevel = async () => {

                </div>    try {

      const token = localStorage.getItem('token');

                {/* Preço Máximo */}      if (!token) return;

                <div>

                  <label className="block text-gray-300 text-sm font-medium mb-2">Preço Máx.</label>      const response = await fetch('http://localhost:3001/api/cases/history?limit=1000', {

                  <input        headers: { 'Authorization': `Bearer ${token}` }

                    type="number"      });

                    placeholder="R$ 999.00"

                    step="0.01"      if (response.ok) {

                    value={priceRange.max}        const data = await response.json();

                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}        const totalOpenings = data.total || 0;

                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"        

                  />        // 10 XP por abertura

                </div>        const xp = totalOpenings * 10;

        

                {/* Botão Limpar */}        // Calcular nível (a cada 100 XP = 1 nível)

                <div className="flex items-end">        const level = Math.floor(xp / 100) + 1;

                  <button        const currentLevelXP = xp % 100;

                    onClick={clearFilters}        

                    className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition"        setUserLevel(level);

                  >        setUserXP(currentLevelXP);

                    🗑️ Limpar        setUserXPToNextLevel(100);

                  </button>      }

                </div>    } catch (error) {

              </div>      console.error('Erro ao calcular nível:', error);

            </div>    }

          )}  };

        </div>

      </div>  // Filtrar e ordenar inventário com busca e filtros avançados

  const getFilteredInventory = () => {

      {/* Barra de Ações */}    let filtered = [...inventory];

      {selectedItems.length > 0 && (

        <div className="max-w-7xl mx-auto mb-6">    // Filtro por busca de nome

          <div className="bg-gradient-to-r from-blue-800 to-purple-800 rounded-lg p-4 border border-blue-500/50 shadow-lg">    if (searchTerm) {

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">      const search = searchTerm.toLowerCase();

                    filtered = filtered.filter(item => 

              <div className="flex items-center gap-4">        item.itemName.toLowerCase().includes(search)

                <div className="text-white">      );

                  <span className="font-bold text-lg">{selectedItems.length}</span>    }

                  <span className="text-blue-200 ml-1">

                    {selectedItems.length === 1 ? 'item selecionado' : 'itens selecionados'}    // Filtro por raridade

                  </span>    if (filter !== 'all') {

                </div>      filtered = filtered.filter(item => item.itemRarity === filter);

                <div className="text-green-400 font-bold">    }

                  Valor Total: R$ {getSelectedItemsValue().toFixed(2)}

                </div>    // Filtro por faixa de preço

              </div>    if (priceRange.min !== '') {

      filtered = filtered.filter(item => item.itemValue >= parseFloat(priceRange.min || 0));

              <div className="flex gap-2">    }

                <button    if (priceRange.max !== '') {

                  onClick={toggleSelectAll}      filtered = filtered.filter(item => item.itemValue <= parseFloat(priceRange.max || Infinity));

                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition"    }

                >

                  {selectAll ? '❌ Desmarcar Todos' : '✅ Selecionar Todos'}    // Ordenação

                </button>    switch (sortBy) {

                <button      case 'value-high':

                  onClick={sellSelectedItems}        filtered.sort((a, b) => (b.itemValue * b.quantity) - (a.itemValue * a.quantity));

                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition"        break;

                >      case 'value-low':

                  💰 Vender Selecionados        filtered.sort((a, b) => (a.itemValue * a.quantity) - (b.itemValue * b.quantity));

                </button>        break;

                <button      case 'name-asc':

                  onClick={() => setSelectedItems([])}        filtered.sort((a, b) => a.itemName.localeCompare(b.itemName));

                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition"        break;

                >      case 'name-desc':

                  ❌ Limpar Seleção        filtered.sort((a, b) => b.itemName.localeCompare(a.itemName));

                </button>        break;

              </div>      case 'quantity-high':

            </div>        filtered.sort((a, b) => b.quantity - a.quantity);

          </div>        break;

        </div>      case 'quantity-low':

      )}        filtered.sort((a, b) => a.quantity - b.quantity);

        break;

      {/* Conteúdo Principal */}      case 'rarity':

      <div className="max-w-7xl mx-auto">        const rarityOrder = { 

        {loading ? (          'Exceedingly Rare': 7,

          <div className="text-center py-20">          'Covert': 6, 

            <div className="inline-block w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>          'Classified': 5, 

            <p className="text-gray-400">Carregando inventário...</p>          'Restricted': 4, 

          </div>          'Mil-Spec': 3, 

        ) : filteredInventory.length === 0 ? (          'Industrial Grade': 2, 

          <div className="text-center py-20">          'Consumer Grade': 1 

            <div className="text-6xl mb-4">📦</div>        };

            <h2 className="text-2xl font-bold text-white mb-2">        filtered.sort((a, b) => (rarityOrder[b.itemRarity] || 0) - (rarityOrder[a.itemRarity] || 0));

              {inventory.length === 0 ? 'Inventário Vazio' : 'Nenhum Item Encontrado'}        break;

            </h2>      case 'recent':

            <p className="text-gray-400 mb-6">      default:

              {inventory.length === 0         filtered.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));

                ? 'Abra algumas caixas para adicionar itens ao seu inventário!'        break;

                : 'Tente ajustar os filtros para encontrar os itens desejados.'    }

              }

            </p>    return filtered;

            {inventory.length === 0 ? (  };

              <button

                onClick={() => window.location.href = '/cases'}  // Selecionar/Deselecionar item

                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold text-lg transition"  const toggleItemSelection = (itemId) => {

              >    setSelectedItems(prev => {

                🎁 Ir para Cases      if (prev.includes(itemId)) {

              </button>        return prev.filter(id => id !== itemId);

            ) : (      } else {

              <button        return [...prev, itemId];

                onClick={clearFilters}      }

                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-bold text-lg transition"    });

              >  };

                🔄 Limpar Filtros

              </button>  // Selecionar/Deselecionar todos os itens filtrados

            )}  const toggleSelectAll = () => {

          </div>    const filteredItems = getFilteredInventory();

        ) : (    if (selectAll) {

          <>      setSelectedItems([]);

            {/* Cabeçalho da Lista */}      setSelectAll(false);

            <div className="flex justify-between items-center mb-6">    } else {

              <div className="text-white">      setSelectedItems(filteredItems.map(item => item.id));

                <h2 className="text-xl font-bold">      setSelectAll(true);

                  {filteredInventory.length} {filteredInventory.length === 1 ? 'item encontrado' : 'itens encontrados'}    }

                </h2>  };

                {filteredInventory.length !== inventory.length && (

                  <p className="text-gray-400 text-sm">  // Limpar filtros

                    Mostrando {filteredInventory.length} de {inventory.length} itens  const clearFilters = () => {

                  </p>    setSearchTerm('');

                )}    setFilter('all');

              </div>    setPriceRange({ min: '', max: '' });

                  setSortBy('recent');

              <div className="flex items-center gap-2">  };

                <button

                  onClick={toggleSelectAll}  // Calcular valor total dos itens selecionados

                  className="text-blue-400 hover:text-blue-300 text-sm"  const getSelectedItemsValue = () => {

                >    return selectedItems.reduce((total, itemId) => {

                  {selectAll ? 'Desmarcar todos' : 'Selecionar todos'}      const item = inventory.find(i => i.id === itemId);

                </button>      return total + (item ? item.itemValue * item.quantity : 0);

              </div>    }, 0);

            </div>  };



            {/* Grade de Itens */}  // Obter cor da raridade

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">  const getRarityColor = (rarity) => {

              {filteredInventory.map((item) => (    const colors = {

                <div      'Consumer Grade': '#B0C3D9',

                  key={item.id}      'Industrial Grade': '#5E98D9', 

                  className={`relative bg-gray-800 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:scale-105 ${      'Mil-Spec': '#4B69FF',

                    selectedItems.includes(item.id)      'Restricted': '#8847FF',

                      ? 'border-blue-500 shadow-lg shadow-blue-500/25'      'Classified': '#D32CE6',

                      : 'border-gray-700 hover:border-gray-600'      'Covert': '#EB4B4B',

                  }`}      'Exceedingly Rare': '#E4AE39'

                  onClick={() => toggleItemSelection(item.id)}    };

                >    return colors[rarity] || '#B0C3D9';

                  {/* Checkbox de Seleção */}  };

                  <div className="absolute top-2 left-2 z-10">

                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${  // Vender itens selecionados

                      selectedItems.includes(item.id)  const sellSelectedItems = async () => {

                        ? 'bg-blue-500 border-blue-500'    if (selectedItems.length === 0) {

                        : 'bg-gray-700 border-gray-500'      warning('Nenhum Item Selecionado', 'Selecione ao menos um item para vender');

                    }`}>      return;

                      {selectedItems.includes(item.id) && (    }

                        <span className="text-white text-xs">✓</span>

                      )}    if (!confirm(`Deseja vender ${selectedItems.length} item(ns)?`)) {

                    </div>      return;

                  </div>    }



                  {/* Quantidade */}    try {

                  {item.quantity > 1 && (      const token = localStorage.getItem('token');

                    <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-bold z-10">      let totalValue = 0;

                      {item.quantity}x

                    </div>      for (const itemId of selectedItems) {

                  )}        const item = inventory.find(i => i.id === itemId);

        if (!item) continue;

                  {/* Imagem da Skin */}

                  <div className="p-4 pb-2">        const response = await fetch('http://localhost:3001/api/inventory/sell-from-inventory', {

                    <SkinImage          method: 'POST',

                      skinName={item.itemName}          headers: {

                      className="w-full h-24 object-contain"            'Content-Type': 'application/json',

                    />            'Authorization': `Bearer ${token}`

                  </div>          },

          body: JSON.stringify({

                  {/* Informações */}            itemId: item.id,

                  <div className="p-3 pt-0">            quantity: item.quantity

                    {/* Raridade */}          })

                    <div className="text-center mb-2">        });

                      <span 

                        className="text-xs font-bold px-2 py-1 rounded"        if (response.ok) {

                        style={{           const data = await response.json();

                          backgroundColor: getRarityColor(item.itemRarity) + '20',          totalValue += data.valueAdded;

                          color: getRarityColor(item.itemRarity)        }

                        }}      }

                      >

                        {item.itemRarity}      success(

                      </span>        '💰 Itens Vendidos!', 

                    </div>        `${selectedItems.length} item(ns) vendido(s)! Total recebido: R$ ${totalValue.toFixed(2)}`,

        {

                    {/* Nome */}          duration: 6000

                    <h3 className="text-white font-medium text-sm text-center mb-2 line-clamp-2 leading-tight">        }

                      {item.itemName}      );

                    </h3>      setSelectedItems([]);

      loadInventory();

                    {/* Preço */}

                    <div className="text-center">    } catch (error) {

                      <p className="text-green-400 font-bold">      error('Erro na Venda', 'Não foi possível vender os itens. Tente novamente.');

                        R$ {item.itemValue.toFixed(2)}    }

                      </p>  };

                      {item.quantity > 1 && (

                        <p className="text-gray-400 text-xs">  // Retirar itens para Steam

                          Total: R$ {(item.itemValue * item.quantity).toFixed(2)}  const withdrawToSteam = async () => {

                        </p>    if (selectedItems.length === 0) {

                      )}      warning('Nenhum Item Selecionado', 'Selecione ao menos um item para retirar');

                    </div>      return;

                  </div>    }

                </div>

              ))}    setShowWithdrawModal(true);

            </div>  };

          </>

        )}  const confirmWithdraw = async (tradeUrl) => {

      </div>    if (!tradeUrl || !tradeUrl.includes('steamcommunity.com')) {

    </div>      alert('❌ URL de Trade inválida!\nCole sua URL de trade do Steam.');

  );      return;

}    }

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
          <div className="flex flex-col lg:flex-row items-center gap-6">
            
            {/* Foto de Perfil */}
            <div className="relative">
              <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1 shadow-lg">
                <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl lg:text-5xl">👤</span>
                  )}
                </div>
              </div>
              
              {/* Badge de Nível */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-500 px-3 py-1 rounded-full border-2 border-gray-900 shadow-lg">
                <span className="text-white font-bold text-xs lg:text-sm">Nível {userLevel}</span>
              </div>
            </div>

            {/* Informações do Usuário */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                🎒 Meu Inventário
              </h1>
              
              {/* Barra de XP */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>XP: {userXP} / {userXPToNextLevel}</span>
                  <span>{Math.floor((userXP / userXPToNextLevel) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 lg:h-3 overflow-hidden">
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
                🎮 {user?.username || 'Jogador'} • Steam ID: {user?.steamId || 'Não conectado'}
              </p>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-3 gap-3 lg:gap-4">
              <div className="bg-gray-700/50 rounded-lg p-3 lg:p-4 text-center">
                <p className="text-gray-400 text-xs mb-1">Saldo</p>
                <p className="text-green-400 font-bold text-sm lg:text-lg">R$ {balance.toFixed(2)}</p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-3 lg:p-4 text-center">
                <p className="text-gray-400 text-xs mb-1">Itens</p>
                <p className="text-blue-400 font-bold text-sm lg:text-lg">{stats.totalItems}</p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-3 lg:p-4 text-center">
                <p className="text-gray-400 text-xs mb-1">Valor Total</p>
                <p className="text-purple-400 font-bold text-sm lg:text-lg">R$ {stats.totalValue.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Busca e Filtros */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 shadow-lg">
          
          {/* Linha Principal - Busca e Controles */}
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            
            {/* Busca */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="🔍 Buscar por nome da skin..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-700 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </div>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    ❌
                  </button>
                )}
              </div>
            </div>

            {/* Controles de Visualização */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-3 rounded-lg font-medium transition ${
                  viewMode === 'grid' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                🔲 Grade
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-3 rounded-lg font-medium transition ${
                  viewMode === 'list' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                📋 Lista
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-3 rounded-lg font-medium transition ${
                  showFilters 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                🔧 Filtros
              </button>
            </div>
          </div>

          {/* Filtros Avançados (Expansível) */}
          {showFilters && (
            <div className="border-t border-gray-700 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                
                {/* Filtro por Raridade */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Raridade</label>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
                  >
                    <option value="all">Todas</option>
                    <option value="Consumer Grade">Consumer Grade</option>
                    <option value="Industrial Grade">Industrial Grade</option>
                    <option value="Mil-Spec">Mil-Spec</option>
                    <option value="Restricted">Restricted</option>
                    <option value="Classified">Classified</option>
                    <option value="Covert">Covert</option>
                    <option value="Exceedingly Rare">Exceedingly Rare</option>
                  </select>
                </div>

                {/* Ordenação */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Ordenar por</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
                  >
                    <option value="recent">Mais Recente</option>
                    <option value="value-high">Maior Valor</option>
                    <option value="value-low">Menor Valor</option>
                    <option value="name-asc">Nome A-Z</option>
                    <option value="name-desc">Nome Z-A</option>
                    <option value="quantity-high">Mais Quantidade</option>
                    <option value="quantity-low">Menos Quantidade</option>
                    <option value="rarity">Raridade</option>
                  </select>
                </div>

                {/* Preço Mínimo */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Preço Mín.</label>
                  <input
                    type="number"
                    placeholder="R$ 0.00"
                    step="0.01"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
                  />
                </div>

                {/* Preço Máximo */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Preço Máx.</label>
                  <input
                    type="number"
                    placeholder="R$ 999.00"
                    step="0.01"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
                  />
                </div>

                {/* Botão Limpar */}
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition"
                  >
                    🗑️ Limpar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
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
