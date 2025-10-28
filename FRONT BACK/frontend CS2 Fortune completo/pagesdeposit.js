import Navbar from '../components/Navbar'
import AIAssistant from '../components/AIAssistant'
import ParticlesBackground from '../components/ParticlesBackground'
import Card3D from '../components/Card3D'

export default function Deposit() {
  const paymentMethods = [
    {
      name: 'PIX',
      icon: '🇧🇷',
      fee: '0%',
      time: 'Instantâneo',
      gradient: 'from-green-700 to-emerald-900',
      border: 'border-green-500/30',
      hoverBorder: 'border-green-500',
      glow: 'rgba(16, 185, 129, 0.3)'
    },
    {
      name: 'Cartão de Crédito',
      icon: '💳',
      fee: '3%',
      time: '1-5 minutos',
      gradient: 'from-blue-700 to-blue-900',
      border: 'border-blue-500/30',
      hoverBorder: 'border-blue-500',
      glow: 'rgba(59, 130, 246, 0.3)'
    },
    {
      name: 'Crypto (BTC/ETH)',
      icon: '₿',
      fee: '1%',
      time: '10-30 minutos',
      gradient: 'from-orange-700 to-yellow-900',
      border: 'border-orange-500/30',
      hoverBorder: 'border-orange-500',
      glow: 'rgba(249, 115, 22, 0.3)'
    },
    {
      name: 'Boleto',
      icon: '🎫',
      fee: '0%',
      time: '1-3 dias',
      gradient: 'from-purple-700 to-purple-900',
      border: 'border-purple-500/30',
      hoverBorder: 'border-purple-500',
      glow: 'rgba(168, 85, 247, 0.3)'
    }
  ]

  const bonusLevels = [
    { amount: 10, bonus: 0, total: 10 },
    { amount: 50, bonus: 5, total: 55 },
    { amount: 100, bonus: 15, total: 115 },
    { amount: 250, bonus: 50, total: 300 },
    { amount: 500, bonus: 125, total: 625 }
  ]

  return (
    <>
      <Navbar />
      
      {/* Background com partículas */}
      <ParticlesBackground />
      
      <div className="relative z-10 min-h-screen py-20 px-4">
        {/* Hero */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h2 className="text-6xl font-black mb-4 neon-gradient">
            💰 Depositar 💰
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Adicione fundos à sua conta e ganhe bônus exclusivos! ✨
          </p>

          {/* Saldo atual */}
          <Card3D gradient="from-purple-900/50 to-pink-900/50" className="max-w-md mx-auto mb-12">
            <div className="text-center">
              <p className="text-gray-400 mb-2">Saldo Atual</p>
              <p className="text-5xl font-black text-green-400 mb-2">$0.00</p>
              <p className="text-sm text-gray-500">🎁 Faça um depósito e ganhe bônus!</p>
            </div>
          </Card3D>
        </div>

        {/* Métodos de pagamento */}
        <div className="max-w-6xl mx-auto mb-16">
          <h3 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Escolha seu Método de Pagamento
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {paymentMethods.map((method, index) => (
              <Card3D
                key={index}
                gradient={method.gradient}
                borderColor={method.border}
                hoverBorderColor={method.hoverBorder}
                glowColor={method.glow}
              >
                <div className="text-center">
                  <div className="text-6xl mb-4 animate-bounce-slow" style={{ animationDelay: `${index * 0.1}s` }}>
                    {method.icon}
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">{method.name}</h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-300">Taxa: <span className="text-green-400 font-bold">{method.fee}</span></p>
                    <p className="text-gray-300">Tempo: <span className="text-blue-400">{method.time}</span></p>
                  </div>
                  <button className="btn-glow mt-4 w-full bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-semibold transition-all">
                    Selecionar
                  </button>
                </div>
              </Card3D>
            ))}
          </div>
        </div>

        {/* Valores rápidos com bônus */}
        <div className="max-w-6xl mx-auto mb-16">
          <h3 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            💎 Valores Rápidos com Bônus 💎
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {bonusLevels.map((level, index) => (
              <div
                key={index}
                className="card-3d group cursor-pointer"
              >
                <div className={`relative bg-gradient-to-br ${
                  level.bonus > 0 
                    ? 'from-yellow-700 to-orange-900' 
                    : 'from-gray-700 to-gray-900'
                } backdrop-blur-sm rounded-2xl p-6 border-2 ${
                  level.bonus > 0 
                    ? 'border-yellow-500/50' 
                    : 'border-gray-500/50'
                } transition-all duration-300`}
                     style={{
                       boxShadow: level.bonus > 0 
                         ? '0 10px 40px rgba(250, 204, 21, 0.3)' 
                         : '0 10px 30px rgba(156, 163, 175, 0.2)'
                     }}>
                  
                  {level.bonus > 0 && (
                    <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse-glow">
                      +${level.bonus} 🎁
                    </div>
                  )}

                  <div className="text-center">
                    <p className="text-gray-400 text-sm mb-2">Depositar</p>
                    <p className="text-3xl font-black text-white mb-2">${level.amount}</p>
                    
                    {level.bonus > 0 && (
                      <>
                        <div className="border-t border-white/20 my-2"></div>
                        <p className="text-green-400 font-bold text-lg">= ${level.total}</p>
                        <p className="text-xs text-gray-400">+{((level.bonus / level.amount) * 100).toFixed(0)}% bônus!</p>
                      </>
                    )}
                  </div>

                  <button className="btn-glow mt-4 w-full bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all">
                    Depositar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Informações e segurança */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card3D gradient="from-green-900/30 to-emerald-900/30">
            <div className="text-center">
              <div className="text-5xl mb-4">🔒</div>
              <h4 className="text-xl font-bold text-white mb-2">100% Seguro</h4>
              <p className="text-gray-400 text-sm">
                Criptografia SSL de 256 bits e proteção PCI compliant
              </p>
            </div>
          </Card3D>

          <Card3D gradient="from-blue-900/30 to-cyan-900/30">
            <div className="text-center">
              <div className="text-5xl mb-4">⚡</div>
              <h4 className="text-xl font-bold text-white mb-2">Instantâneo</h4>
              <p className="text-gray-400 text-sm">
                Créditos disponíveis imediatamente após confirmação
              </p>
            </div>
          </Card3D>

          <Card3D gradient="from-purple-900/30 to-pink-900/30">
            <div className="text-center">
              <div className="text-5xl mb-4">🎁</div>
              <h4 className="text-xl font-bold text-white mb-2">Bônus Exclusivos</h4>
              <p className="text-gray-400 text-sm">
                Quanto maior o depósito, maior o bônus recebido
              </p>
            </div>
          </Card3D>
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-4xl mx-auto">
          <Card3D gradient="from-gray-900/50 to-gray-800/50">
            <h3 className="text-3xl font-bold text-center mb-6 text-white">
              ❓ Perguntas Frequentes
            </h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-white font-semibold mb-1">Quanto tempo leva para o depósito ser creditado?</p>
                <p className="text-gray-400">PIX e Cartão de Crédito são instantâneos. Crypto leva 10-30 minutos e Boleto 1-3 dias.</p>
              </div>
              <div>
                <p className="text-white font-semibold mb-1">Existe valor mínimo de depósito?</p>
                <p className="text-gray-400">Sim, o valor mínimo é de $10 para todos os métodos de pagamento.</p>
              </div>
              <div>
                <p className="text-white font-semibold mb-1">Os bônus têm requisitos?</p>
                <p className="text-gray-400">Sim, o bônus deve ser usado em aberturas de caixas antes de poder ser sacado.</p>
              </div>
            </div>
          </Card3D>
        </div>
      </div>
      
      {/* AI Assistant - ajuda com depósitos */}
      <AIAssistant context="deposit" />
    </>
  )
}
