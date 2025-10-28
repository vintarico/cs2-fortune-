import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ORIGINAL_CASES } from '../data/cases-original';
import { NEW_CASES, RARITY_CONFIG } from '../data/cases-new';
import { useUser } from '../contexts/UserContext';
import CaseImage from '../components/CaseImage';

const ALL_CASES = [...ORIGINAL_CASES, ...NEW_CASES];

export default function CasesGallery() {
  const router = useRouter();
  const { balance } = useUser();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar caixas
  const filteredCases = ALL_CASES.filter(caseItem => {
    // Filtro de busca
    if (searchTerm && !caseItem.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Filtro de tipo
    if (filter === 'all') return true;
    if (filter === 'cheap') return caseItem.price <= 10;
    if (filter === 'medium') return caseItem.price > 10 && caseItem.price <= 50;
    if (filter === 'expensive') return caseItem.price > 50;
    if (filter === 'new') return NEW_CASES.includes(caseItem);
    if (filter === 'original') return ORIGINAL_CASES.includes(caseItem);
    
    return true;
  });

  // Gerar slug da URL
  const getCaseSlug = (caseName) => {
    return caseName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  };

  // Calcular valor médio e máximo da caixa
  const getCaseStats = (items) => {
    const values = items.map(i => i.value);
    return {
      min: Math.min(...values),
      max: Math.max(...values),
      avg: values.reduce((a, b) => a + b, 0) / values.length
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">🎁 Caixas Disponíveis</h1>
            <p className="text-gray-300">Escolha uma caixa e teste sua sorte!</p>
          </div>
          
          <div className="mt-4 md:mt-0 text-right">
            <p className="text-gray-400 text-sm">Seu saldo</p>
            <p className="text-2xl font-bold text-green-400">R$ {balance.toFixed(2)}</p>
          </div>
        </div>

        {/* Barra de busca e filtros */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Busca */}
            <div>
              <input
                type="text"
                placeholder="🔍 Buscar caixa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filtros */}
            <div className="flex gap-2 flex-wrap">
              {[
                { id: 'all', label: 'Todas', icon: '📦' },
                { id: 'new', label: 'Novas', icon: '✨' },
                { id: 'cheap', label: 'Baratas', icon: '💰' },
                { id: 'medium', label: 'Médias', icon: '💎' },
                { id: 'expensive', label: 'Caras', icon: '👑' },
              ].map(filterOption => (
                <button
                  key={filterOption.id}
                  onClick={() => setFilter(filterOption.id)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    filter === filterOption.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {filterOption.icon} {filterOption.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contador */}
          <div className="mt-4 text-center text-gray-400 text-sm">
            Mostrando {filteredCases.length} de {ALL_CASES.length} caixas
          </div>
        </div>
      </div>

      {/* Grid de caixas */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCases.map((caseItem) => {
            const stats = getCaseStats(caseItem.items);
            const slug = getCaseSlug(caseItem.name);
            const canAfford = balance >= caseItem.price;

            return (
              <Link 
                href={`/cases/${slug}`}
                key={caseItem.id}
              >
                <div className={`
                  bg-gray-800 rounded-lg overflow-hidden 
                  transition-all duration-300 transform 
                  hover:scale-105 hover:shadow-2xl 
                  cursor-pointer relative
                  ${!canAfford ? 'opacity-60' : ''}
                `}>
                  
                  {/* Badge de novidade */}
                  {NEW_CASES.includes(caseItem) && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                      ✨ NOVO
                    </div>
                  )}

                  {/* Imagem da caixa */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center p-4">
                    <CaseImage
                      caseId={caseItem.id}
                      caseName={caseItem.name}
                      caseImage={caseItem.image}
                      color={caseItem.color}
                      size="medium"
                      className="w-full h-full"
                    />
                    
                    {/* Overlay de saldo insuficiente */}
                    {!canAfford && (
                      <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                        <span className="text-red-400 font-bold text-sm">
                          Saldo Insuficiente
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Informações */}
                  <div className="p-4">
                    {/* Nome */}
                    <h3 className="text-lg font-bold text-white mb-2 truncate" title={caseItem.name}>
                      {caseItem.name}
                    </h3>

                    {/* Preço */}
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-yellow-400 font-bold text-xl">
                        R$ {caseItem.price.toFixed(2)}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {caseItem.items.length} itens
                      </span>
                    </div>

                    {/* Estatísticas */}
                    <div className="space-y-1 mb-4">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Mín:</span>
                        <span className="text-green-400">R$ {stats.min.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Máx:</span>
                        <span className="text-yellow-400">R$ {stats.max.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Média:</span>
                        <span className="text-blue-400">R$ {stats.avg.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Botão */}
                    <button
                      className={`w-full py-2 rounded-lg font-semibold transition ${
                        canAfford
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                      onClick={(e) => {
                        if (!canAfford) {
                          e.preventDefault();
                          alert('Saldo insuficiente!');
                        }
                      }}
                    >
                      {canAfford ? '🎁 Abrir Caixa' : '🔒 Sem Saldo'}
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Mensagem se não encontrar caixas */}
        {filteredCases.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">😢 Nenhuma caixa encontrada</p>
            <button
              onClick={() => {
                setFilter('all');
                setSearchTerm('');
              }}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              Limpar Filtros
            </button>
          </div>
        )}
      </div>

      {/* Seção informativa */}
      <div className="max-w-7xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <div className="text-4xl mb-3">🎯</div>
          <h3 className="text-white font-bold mb-2">Melhores Chances</h3>
          <p className="text-gray-400 text-sm">
            Cada caixa tem probabilidades diferentes. Escolha com sabedoria!
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <div className="text-4xl mb-3">💎</div>
          <h3 className="text-white font-bold mb-2">Itens Raros</h3>
          <p className="text-gray-400 text-sm">
            Ganhe skins lendárias e facas valiosas!
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <div className="text-4xl mb-3">📊</div>
          <h3 className="text-white font-bold mb-2">Histórico Completo</h3>
          <p className="text-gray-400 text-sm">
            Acompanhe todas as suas aberturas e lucros.
          </p>
        </div>
      </div>
    </div>
  );
}
