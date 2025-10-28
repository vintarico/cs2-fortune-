import { useState } from 'react'
import Navbar from '../components/Navbar'
import ParticlesBackground from '../components/ParticlesBackground'
import Card3D from '../components/Card3D'

export default function Withdraw() {
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [selectedMethod, setSelectedMethod] = useState(null)

  const withdrawMethods = [
    {
      name: 'PIX',
      icon: '🇧🇷',
      fee: '0%',
      time: '1-5 minutos',
      min: 10,
      max: 10000,
      gradient: 'from-green-700 to-emerald-900',
      border: 'border-green-500/30',
      hoverBorder: 'border-green-500',
      glow: 'rgba(16, 185, 129, 0.3)'
    },
    {
      name: 'Transferência Bancária',
      icon: '🏦',
      fee: '0%',
      time: '1-2 dias úteis',
      min: 50,
      max: 50000,
      gradient: 'from-blue-700 to-blue-900',
      border: 'border-blue-500/30',
      hoverBorder: 'border-blue-500',
      glow: 'rgba(59, 130, 246, 0.3)'
    },
    {
      name: 'Crypto (BTC/ETH)',
      icon: '₿',
      fee: '1%',
      time: '30-60 minutos',
      min: 20,
      max: 100000,
      gradient: 'from-orange-700 to-yellow-900',
      border: 'border-orange-500/30',
      hoverBorder: 'border-orange-500',
      glow: 'rgba(249, 115, 22, 0.3)'
    },
    {
      name: 'Steam Items',
      icon: '🎮',
      fee: '5%',
      time: 'Instantâneo',
      min: 5,
      max: 5000,
      gradient: 'from-indigo-700 to-purple-900',
      border: 'border-purple-500/30',
      hoverBorder: 'border-purple-500',
      glow: 'rgba(168, 85, 247, 0.3)'
    }
  ]

  const quickAmounts = [10, 25, 50, 100, 250, 500]

  const handleWithdraw = () => {
    if (!selectedMethod) {
      alert('Selecione um método de saque!')
      return
    }
    if (!withdrawAmount || withdrawAmount < selectedMethod.min) {
      alert(`Valor mínimo: $${selectedMethod.min}`)
      return
    }
    if (withdrawAmount > selectedMethod.max) {
      alert(`Valor máximo: $${selectedMethod.max}`)
      return
    }
    
    alert(`Saque de $${withdrawAmount} via ${selectedMethod.name} solicitado! ✅`)
  }

  return (
    <>
      <Navbar />
      
      {/* Background com partículas */}
      <ParticlesBackground />
      
      <div className="relative z-10 min-h-screen py-20 px-4">
        {/* Hero */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h2 className="text-6xl font-black mb-4 neon-gradient">
            💸 Sacar 💸
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Retire seus ganhos de forma rápida e segura! 🚀
          </p>

          {/* Saldo disponível */}
          <Card3D gradient="from-green-900/50 to-emerald-900/50" className="max-w-md mx-auto mb-12">
            <div className="text-center">
              <p className="text-gray-400 mb-2">Saldo Disponível para Saque</p>
              <p className="text-5xl font-black text-green-400 mb-2">$0.00</p>
              <p className="text-sm text-gray-500">💎 Abra caixas para ganhar prêmios!</p>
            </div>
          </Card3D>
        </div>

        {/* Métodos de saque */}
        <div className="max-w-6xl mx-auto mb-12">
          <h3 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Escolha seu Método de Saque
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {withdrawMethods.map((method, index) => (
              <Card3D
                key={index}
                gradient={method.gradient}
                borderColor={selectedMethod?.name === method.name ? method.hoverBorder : method.border}
                hoverBorderColor={method.hoverBorder}
                glowColor={method.glow}
              >
                <div
                  className="text-center cursor-pointer"
                  onClick={() => setSelectedMethod(method)}
                >
                  {selectedMethod?.name === method.name && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse-glow">
                      ✓ Selecionado
                    </div>
                  )}
                  
                  <div className="text-6xl mb-4 animate-bounce-slow" style={{ animationDelay: `${index * 0.1}s` }}>
                    {method.icon}
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">{method.name}</h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-300">Taxa: <span className="text-green-400 font-bold">{method.fee}</span></p>
                    <p className="text-gray-300">Tempo: <span className="text-blue-400">{method.time}</span></p>
                    <p className="text-gray-300">Mín: <span className="text-yellow-400">${method.min}</span></p>
                  </div>
                </div>
              </Card3D>
            ))}
          </div>
        </div>

        {/* Formulário de saque */}
        <div className="max-w-2xl mx-auto mb-12">
          <Card3D gradient="from-gray-900/80 to-gray-800/80">
            <h3 className="text-3xl font-bold text-center mb-6 text-white">
              💰 Solicitar Saque
            </h3>

            {/* Valores rápidos */}
            <div className="mb-6">
              <p className="text-gray-400 text-sm mb-3">Valores Rápidos:</p>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {quickAmounts.map(amount => (
                  <button
                    key={amount}
                    onClick={() => setWithdrawAmount(amount)}
                    className="btn-glow bg-purple-600/20 hover:bg-purple-600/40 text-white px-4 py-2 rounded-lg font-bold transition-all"
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            </div>

            {/* Input de valor */}
            <div className="mb-6">
              <label className="block text-gray-400 text-sm mb-2">Valor do Saque (USD)</label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Digite o valor..."
                className="w-full bg-white/5 border border-purple-500/30 rounded-lg px-4 py-3 text-white text-lg font-bold focus:outline-none focus:border-purple-500 transition-all"
              />
              {selectedMethod && (
                <p className="text-xs text-gray-500 mt-2">
                  Mínimo: ${selectedMethod.min} | Máximo: ${selectedMethod.max}
                </p>
              )}
            </div>

            {/* Cálculo com taxa */}
            {withdrawAmount > 0 && selectedMethod && (
              <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4 mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Valor solicitado:</span>
                  <span className="text-white font-bold">${withdrawAmount}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Taxa ({selectedMethod.fee}):</span>
                  <span className="text-red-400 font-bold">
                    -${(withdrawAmount * (parseFloat(selectedMethod.fee) / 100)).toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-purple-500/30 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-white font-bold">Você receberá:</span>
                    <span className="text-green-400 font-black text-xl">
                      ${(withdrawAmount - (withdrawAmount * (parseFloat(selectedMethod.fee) / 100))).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Botão de saque */}
            <button
              onClick={handleWithdraw}
              className="btn-glow w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-6 py-4 rounded-xl font-black text-lg transition-all"
            >
              🚀 Solicitar Saque
            </button>
          </Card3D>
        </div>

        {/* Informações */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card3D gradient="from-green-900/30 to-emerald-900/30">
            <div className="text-center">
              <div className="text-5xl mb-4">⚡</div>
              <h4 className="text-xl font-bold text-white mb-2">Saques Rápidos</h4>
              <p className="text-gray-400 text-sm">
                PIX e Steam Items processados em minutos
              </p>
            </div>
          </Card3D>

          <Card3D gradient="from-blue-900/30 to-cyan-900/30">
            <div className="text-center">
              <div className="text-5xl mb-4">🔒</div>
              <h4 className="text-xl font-bold text-white mb-2">100% Seguro</h4>
              <p className="text-gray-400 text-sm">
                Verificação em duas etapas e criptografia SSL
              </p>
            </div>
          </Card3D>

          <Card3D gradient="from-purple-900/30 to-pink-900/30">
            <div className="text-center">
              <div className="text-5xl mb-4">💎</div>
              <h4 className="text-xl font-bold text-white mb-2">Sem Limites</h4>
              <p className="text-gray-400 text-sm">
                Saque quanto quiser, quando quiser
              </p>
            </div>
          </Card3D>
        </div>

        {/* FAQ */}
        <div className="max-w-4xl mx-auto">
          <Card3D gradient="from-gray-900/50 to-gray-800/50">
            <h3 className="text-3xl font-bold text-center mb-6 text-white">
              ❓ Perguntas Frequentes
            </h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-white font-semibold mb-1">Quanto tempo leva para processar meu saque?</p>
                <p className="text-gray-400">PIX: 1-5 minutos | Banco: 1-2 dias | Crypto: 30-60 min | Steam: Instantâneo</p>
              </div>
              <div>
                <p className="text-white font-semibold mb-1">Existe valor mínimo de saque?</p>
                <p className="text-gray-400">Sim, varia por método. PIX: $10 | Banco: $50 | Crypto: $20 | Steam: $5</p>
              </div>
              <div>
                <p className="text-white font-semibold mb-1">Posso cancelar um saque solicitado?</p>
                <p className="text-gray-400">Sim, enquanto o status estiver como "Processando" você pode cancelar na seção "Histórico".</p>
              </div>
              <div>
                <p className="text-white font-semibold mb-1">Preciso verificar minha conta?</p>
                <p className="text-gray-400">Sim, para saques acima de $1000 é necessário verificação de identidade.</p>
              </div>
            </div>
          </Card3D>
        </div>
      </div>
    </>
  )
}
