import { useState } from 'react'
import Navbar from '../components/Navbar'
import AIAssistant from '../components/AIAssistant'
import ParticlesBackground from '../components/ParticlesBackground'
import CaseOpeningAnimation from '../components/CaseOpeningAnimation'
import ResultModal from '../components/ResultModal'

export default function Cases() {
  const [selectedCaseId, setSelectedCaseId] = useState(null)
  const [isOpening, setIsOpening] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [wonItem, setWonItem] = useState(null)

  const cases = [
    {
      id: 'starter',
      name: 'Caixa Iniciante',
      price: 5,
      image: '🎁',
      rarity: 'common',
      gradient: 'from-gray-700 to-gray-900',
      border: 'border-gray-500',
      glow: 'rgba(156, 163, 175, 0.5)'
    },
    {
      id: 'premium',
      name: 'Caixa Premium',
      price: 10,
      image: '💎',
      rarity: 'rare',
      gradient: 'from-blue-700 to-blue-900',
      border: 'border-blue-500',
      glow: 'rgba(59, 130, 246, 0.5)'
    },
    {
      id: 'elite',
      name: 'Caixa Elite',
      price: 25,
      image: '👑',
      rarity: 'epic',
      gradient: 'from-purple-700 to-purple-900',
      border: 'border-purple-500',
      glow: 'rgba(168, 85, 247, 0.5)'
    },
    {
      id: 'legendary',
      name: 'Caixa Lendária',
      price: 50,
      image: '🔥',
      rarity: 'legendary',
      gradient: 'from-orange-700 to-red-900',
      border: 'border-orange-500',
      glow: 'rgba(249, 115, 22, 0.5)'
    },
    {
      id: 'mythical',
      name: 'Caixa Mítica',
      price: 100,
      image: '⚡',
      rarity: 'mythical',
      gradient: 'from-yellow-600 to-yellow-900',
      border: 'border-yellow-500',
      glow: 'rgba(250, 204, 21, 0.5)'
    },
    {
      id: 'divine',
      name: 'Caixa Divina',
      price: 250,
      image: '✨',
      rarity: 'divine',
      gradient: 'from-pink-600 to-purple-900',
      border: 'border-pink-500',
      glow: 'rgba(236, 72, 153, 0.5)'
    }
  ]

  const handleOpenCase = (caseData) => {
    setSelectedCaseId(caseData.id)
    setIsOpening(true)
  }

  const handleOpeningComplete = () => {
    setIsOpening(false)
    setWonItem({
      name: 'AWP | Dragon Lore',
      rarity: 'Covert',
      value: '2,450.00',
      image: '🎯'
    })
    setShowResult(true)
  }

  const handleCloseResult = () => {
    setShowResult(false)
    setWonItem(null)
    setSelectedCaseId(null)
  }

  return (
    <>
      <Navbar />
      
      {/* Background com partículas */}
      <ParticlesBackground />
      
      <div className="relative z-10 min-h-screen py-20 px-4">
        {/* Título com gradiente neon */}
        <h2 className="text-6xl font-black text-center mb-4 neon-gradient">
          🎁 Escolha sua Caixa 🎁
        </h2>
        <p className="text-center text-gray-400 text-xl mb-16 max-w-2xl mx-auto">
          Selecione uma caixa e teste sua sorte! Quanto mais rara, maiores as recompensas! ✨
        </p>

        {/* Grid de caixas com cards 3D */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {cases.map((caseItem) => (
            <div 
              key={caseItem.id}
              className="card-3d group relative"
            >
              {/* Card */}
              <div className={`relative bg-gradient-to-br ${caseItem.gradient} backdrop-blur-sm rounded-3xl p-8 border-2 ${caseItem.border} overflow-hidden transition-all duration-300 cursor-pointer`}
                   onClick={() => handleOpenCase(caseItem)}
                   style={{
                     boxShadow: `0 10px 40px ${caseItem.glow}`
                   }}>
                
                {/* Efeito de brilho no hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                {/* Conteúdo */}
                <div className="relative z-10 text-center">
                  {/* Ícone com animação */}
                  <div className="text-8xl mb-6 animate-float-3d group-hover:scale-110 transition-transform duration-300">
                    {caseItem.image}
                  </div>
                  
                  {/* Nome */}
                  <h3 className="text-3xl font-bold text-white mb-2 group-hover:scale-105 transition-transform">
                    {caseItem.name}
                  </h3>
                  
                  {/* Raridade */}
                  <p className="text-sm uppercase tracking-wider mb-4 opacity-80">
                    {caseItem.rarity}
                  </p>
                  
                  {/* Preço */}
                  <div className="mb-6">
                    <span className="text-5xl font-black text-green-400">
                      ${caseItem.price}
                    </span>
                  </div>
                  
                  {/* Botão com glow */}
                  <button className="btn-glow w-full bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded-xl font-bold text-lg transform hover:scale-105 transition-all duration-300 border-2 border-white/30 hover:border-white/50">
                    🎲 Abrir Agora
                  </button>
                  
                  {/* Info adicional */}
                  <div className="mt-4 text-xs text-gray-400">
                    <p>🎯 Chance de itens raros!</p>
                  </div>
                </div>

                {/* Partículas decorativas */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-white rounded-full animate-ping"></div>
                <div className="absolute bottom-4 left-4 w-2 h-2 bg-white rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
              </div>

              {/* Sombra extra para profundidade */}
              <div className={`absolute inset-0 bg-gradient-to-br ${caseItem.gradient} rounded-3xl blur-xl opacity-50 -z-10 group-hover:opacity-75 transition-opacity`}></div>
            </div>
          ))}
        </div>

        {/* Informações adicionais */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
            <h3 className="text-3xl font-bold text-center mb-6 text-white">
              ℹ️ Como Funciona?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl mb-3">1️⃣</div>
                <p className="text-white font-semibold mb-2">Escolha sua Caixa</p>
                <p className="text-gray-400 text-sm">Selecione entre diversos níveis de raridade</p>
              </div>
              <div>
                <div className="text-4xl mb-3">2️⃣</div>
                <p className="text-white font-semibold mb-2">Assista a Abertura</p>
                <p className="text-gray-400 text-sm">Veja a animação épica de 3 segundos</p>
              </div>
              <div>
                <div className="text-4xl mb-3">3️⃣</div>
                <p className="text-white font-semibold mb-2">Receba seu Item</p>
                <p className="text-gray-400 text-sm">Ganhe skins valiosas instantaneamente!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Animação de abertura */}
      <CaseOpeningAnimation 
        isOpen={isOpening}
        onComplete={handleOpeningComplete}
        wonItem={wonItem}
      />

      {/* Modal de resultado com confete */}
      <ResultModal 
        isOpen={showResult}
        onClose={handleCloseResult}
        item={wonItem}
      />
      
      {/* AI Assistant com análise de cases */}
      <AIAssistant context="cases" caseId={selectedCaseId} />
    </>
  )
}
