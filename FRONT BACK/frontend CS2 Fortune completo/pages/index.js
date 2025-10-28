import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '../contexts/UserContext';
import { ORIGINAL_CASES } from '../data/cases-original';
import { NEW_CASES } from '../data/cases-new';
import CaseImage from '../components/CaseImage';

const ALL_CASES = [...ORIGINAL_CASES, ...NEW_CASES];

export default function Home() {
  const { balance, isAuthenticated } = useUser();
  const [liveDrops, setLiveDrops] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 125840,
    totalPaid: 5842300,
    onlineNow: 342,
    biggestWin: 8920
  });

  // Simular live drops
  useEffect(() => {
    const mockDrops = [
      { id: 1, user: 'player***23', item: 'AK-47 | Redline', value: 245.00, rarity: 'Classified', time: 'Agora' },
      { id: 2, user: 'winner***99', item: 'M4A4 | Asiimov', value: 892.00, rarity: 'Covert', time: 'Há 1 min' },
      { id: 3, user: 'lucky***77', item: '★ Karambit | Fade', value: 8920.00, rarity: 'Rare', time: 'Há 2 min' },
      { id: 4, user: 'pro***45', item: 'AWP | Dragon Lore', value: 4250.00, rarity: 'Covert', time: 'Há 3 min' },
      { id: 5, user: 'noob***12', item: 'Glock-18 | Fade', value: 1240.00, rarity: 'Covert', time: 'Há 5 min' },
    ];
    setLiveDrops(mockDrops);

    // Atualizar drops a cada 5 segundos
    const interval = setInterval(() => {
      const newDrop = {
        id: Date.now(),
        user: `user***${Math.floor(Math.random() * 99)}`,
        item: mockDrops[Math.floor(Math.random() * mockDrops.length)].item,
        value: Math.random() * 1000 + 50,
        rarity: ['Mil-Spec', 'Restricted', 'Classified', 'Covert'][Math.floor(Math.random() * 4)],
        time: 'Agora'
      };
      setLiveDrops(prev => [newDrop, ...prev.slice(0, 9)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const featuredCases = ALL_CASES.slice(0, 8);
  const topWinners = [
    { rank: 1, user: 'megawinner', profit: 5240.00, cases: 18 },
    { rank: 2, user: 'luckyplayer', profit: 3890.00, cases: 12 },
    { rank: 3, user: 'kingofcs', profit: 2450.00, cases: 25 },
  ];

  const getRarityColor = (rarity) => {
    const colors = {
      'Mil-Spec': 'text-blue-400',
      'Restricted': 'text-purple-400',
      'Classified': 'text-pink-400',
      'Covert': 'text-red-400',
      'Rare': 'text-yellow-400'
    };
    return colors[rarity] || 'text-gray-400';
  };

  const getRarityEmoji = (value) => {
    if (value > 5000) return '👑';
    if (value > 1000) return '💎';
    if (value > 500) return '🔥';
    return '✨';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      
      {/* HERO BANNER */}
      <section className="relative overflow-hidden">
        {/* Background animado */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
            🎮 <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              CS2 FORTUNE
            </span>
          </h1>
          <p className="text-2xl text-gray-300 mb-8 animate-fade-in-delay">
            Abra caixas, ganhe skins valiosas e teste sua sorte!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-delay-2">
            <Link href="/cases">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg rounded-lg shadow-lg transform hover:scale-105 transition">
                🎁 Abrir Primeira Caixa
              </button>
            </Link>
            <Link href="/cases">
              <button className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold text-lg rounded-lg shadow-lg transform hover:scale-105 transition">
                👀 Ver Todas as Caixas
              </button>
            </Link>
          </div>

          <p className="text-gray-400 text-sm">
            <span className="inline-block animate-bounce">🔥</span> 
            {' '}<span className="font-bold text-yellow-400">10,234</span> caixas abertas hoje
          </p>
        </div>
      </section>

      {/* ESTATÍSTICAS AO VIVO */}
      <section className="max-w-7xl mx-auto px-4 -mt-8 mb-12">
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">
                {(stats.totalUsers / 1000).toFixed(1)}K+
              </div>
              <div className="text-gray-400 text-sm">Usuários</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">
                R$ {(stats.totalPaid / 1000000).toFixed(1)}M
              </div>
              <div className="text-gray-400 text-sm">Pagos</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">
                {stats.onlineNow}
              </div>
              <div className="text-gray-400 text-sm">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></span>
                Online Agora
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">
                R$ {stats.biggestWin.toLocaleString()}
              </div>
              <div className="text-gray-400 text-sm">Maior Prêmio</div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUNA ESQUERDA - Cases em Destaque */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* CASES EM DESTAQUE */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white">🎁 Cases em Destaque</h2>
                <Link href="/cases">
                  <span className="text-blue-400 hover:text-blue-300 cursor-pointer transition">
                    Ver Todos →
                  </span>
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {featuredCases.map((caseItem, index) => {
                  const isNew = NEW_CASES.includes(caseItem);
                  const isHot = index === 1;
                  
                  return (
                    <Link href={`/cases/${caseItem.name.toLowerCase().replace(/\s+/g, '-')}`} key={caseItem.id}>
                      <div className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 cursor-pointer group relative">
                        
                        {/* Badge */}
                        {(isNew || isHot) && (
                          <div className={`absolute top-2 right-2 z-10 px-2 py-1 rounded-full text-xs font-bold ${
                            isNew ? 'bg-green-500' : 'bg-red-500'
                          } text-white`}>
                            {isNew ? '✨ NEW' : '🔥 HOT'}
                          </div>
                        )}

                        {/* Imagem */}
                        <div className="h-32 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center p-3">
                          <CaseImage
                            caseId={caseItem.id}
                            caseName={caseItem.name}
                            caseImage={`/images/cases/${caseItem.id}.png`}
                            color={caseItem.color || '#a855f7'}
                            size="small"
                            className="w-full h-full"
                          />
                        </div>

                        {/* Info */}
                        <div className="p-3">
                          <h3 className="text-white font-semibold text-sm mb-2 truncate" title={caseItem.name}>
                            {caseItem.name}
                          </h3>
                          <div className="flex justify-between items-center">
                            <span className="text-yellow-400 font-bold">R$ {caseItem.price.toFixed(2)}</span>
                            <span className="text-gray-400 text-xs">{caseItem.items.length} itens</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* TOP WINNERS */}
            <section className="bg-gray-800 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                🏆 Top Vencedores (Hoje)
              </h2>
              <div className="space-y-3">
                {topWinners.map((winner) => (
                  <div key={winner.rank} className="flex items-center justify-between bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition">
                    <div className="flex items-center gap-4">
                      <div className={`text-2xl ${
                        winner.rank === 1 ? 'text-yellow-400' :
                        winner.rank === 2 ? 'text-gray-300' :
                        'text-orange-400'
                      }`}>
                        {winner.rank === 1 ? '🥇' : winner.rank === 2 ? '🥈' : '🥉'}
                      </div>
                      <div>
                        <div className="text-white font-semibold">@{winner.user}</div>
                        <div className="text-gray-400 text-sm">{winner.cases} caixas abertas</div>
                      </div>
                    </div>
                    <div className="text-green-400 font-bold text-lg">
                      +R$ {winner.profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* COLUNA DIREITA - Live Drops */}
          <div className="lg:col-span-1">
            <section className="bg-gray-800 rounded-2xl p-6 sticky top-4">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                🔥 Últimos Drops
                <span className="ml-2 inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              </h2>
              
              <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
                {liveDrops.map((drop) => (
                  <div 
                    key={drop.id} 
                    className="bg-gray-700 rounded-lg p-3 hover:bg-gray-600 transition animate-slide-in"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{getRarityEmoji(drop.value)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-semibold text-sm truncate">
                          {drop.user}
                        </div>
                        <div className={`text-sm truncate ${getRarityColor(drop.rarity)}`}>
                          {drop.item}
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-green-400 font-bold text-sm">
                            R$ {drop.value.toFixed(2)}
                          </span>
                          <span className="text-gray-500 text-xs">{drop.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

        </div>
      </div>

      {/* SEÇÃO INFORMATIVA */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-xl p-8 text-center hover:transform hover:scale-105 transition">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-white font-bold text-xl mb-3">Melhores Chances</h3>
            <p className="text-gray-400">
              Cada caixa tem probabilidades transparentes. Escolha com sabedoria!
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl p-8 text-center hover:transform hover:scale-105 transition">
            <div className="text-5xl mb-4">💎</div>
            <h3 className="text-white font-bold text-xl mb-3">Itens Raros</h3>
            <p className="text-gray-400">
              Ganhe skins lendárias, facas valiosas e itens exclusivos!
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl p-8 text-center hover:transform hover:scale-105 transition">
            <div className="text-5xl mb-4">🔒</div>
            <h3 className="text-white font-bold text-xl mb-3">Provably Fair</h3>
            <p className="text-gray-400">
              Sistema verificável. Todos os resultados podem ser checados!
            </p>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in 0.8s ease-out 0.2s both;
        }

        .animate-fade-in-delay-2 {
          animation: fade-in 0.8s ease-out 0.4s both;
        }

        .animate-slide-in {
          animation: slide-in 0.5s ease-out;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>
    </div>
  );
}