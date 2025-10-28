import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import AIAssistant from '../components/AIAssistant'
import ParticlesBackground from '../components/ParticlesBackground'
import Card3D from '../components/Card3D'

export default function Home() {
  const [isMobile, setIsMobile] = useState(false)
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const topCases = [
    { name: 'Starter', price: '$5', icon: '📦', gradient: 'from-gray-600 to-gray-800', popularity: '🔥 Mais Popular' },
    { name: 'Premium', price: '$10', icon: '💎', gradient: 'from-blue-600 to-blue-800', popularity: '⭐ Novo' },
    { name: 'Elite', price: '$25', icon: '👑', gradient: 'from-purple-600 to-purple-800', popularity: '💥 Tendência' }
  ]

  const testimonials = [
    { name: 'Player1', text: 'Ganhei uma faca no primeiro caso! Incrível!', rating: 5, skin: '🔪 Butterfly Knife' },
    { name: 'GamerPro', text: 'Saques rápidos e suporte excelente', rating: 5, skin: '🧤 Sport Gloves' },
    { name: 'CS2Fan', text: 'Melhores chances do mercado, comprovado!', rating: 5, skin: '🎯 AWP Dragon Lore' }
  ]

  const recentWins = [
    { user: 'Alex***', item: 'Karambit Fade', value: '$850', time: '2 min' },
    { user: 'Maria***', item: 'AWP Dragon Lore', value: '$1200', time: '5 min' },
    { user: 'João***', item: 'M4A4 Howl', value: '$650', time: '8 min' },
    { user: 'Ana***', item: 'Glock Fade', value: '$320', time: '12 min' }
  ]

  return (
    <>
      {/* Navbar fixada no topo */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      
      {/* Background com partículas */}
      <ParticlesBackground />

      {/* Main Content */}
      <main className="relative z-10 pt-16">
        
        {/* ===== HERO SECTION ===== */}
        <section className="hero-gradient min-h-screen flex flex-col items-center justify-center px-4 py-12 sm:py-20">
          <div className="text-center max-w-6xl mx-auto w-full">
            
            {/* Badge de destaque */}
            <div className="inline-block mb-6 animate-bounce-slow">
              <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                🎁 BÔNUS DE $10 PARA NOVOS JOGADORES
              </span>
            </div>

            {/* Título responsivo */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-4 sm:mb-6 neon-gradient leading-tight px-2">
              CS 2 Fortune
            </h1>
            
            {/* Subtítulo responsivo */}
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-3 sm:mb-4 text-gray-300 animate-pulse-glow px-4">
              🎮 Abra caixas épicas e ganhe skins lendárias! 🎁
            </p>
            
            <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-8 sm:mb-12 text-gray-400 max-w-2xl mx-auto px-4">
              A maior plataforma de casos CS2 do Brasil. Saques instantâneos, skins raras e bônus exclusivos te esperam!
            </p>

            {/* Botões CTA responsivos */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 mb-8 sm:mb-12">
              <a 
                href="/cases" 
                className="btn-glow w-full sm:w-auto bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transform hover:scale-105 sm:hover:scale-110 transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:shadow-[0_0_40px_rgba(168,85,247,0.8)] text-center"
              >
                🎁 Abrir Caixa Agora
              </a>
              
              <a 
                href="/deposit" 
                className="btn-glow w-full sm:w-auto bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transform hover:scale-105 sm:hover:scale-110 transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:shadow-[0_0_40px_rgba(16,185,129,0.8)] text-center"
              >
                💰 Depositar e Ganhar Bônus
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-8 sm:mb-12 px-4">
              <div className="flex items-center gap-2 text-gray-300 text-xs sm:text-sm">
                <span className="text-green-400 text-lg sm:text-xl">✓</span>
                <span>Pagamentos Seguros</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-xs sm:text-sm">
                <span className="text-green-400 text-lg sm:text-xl">✓</span>
                <span>Steam Oficial</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-xs sm:text-sm">
                <span className="text-green-400 text-lg sm:text-xl">✓</span>
                <span>Suporte 24/7</span>
              </div>
            </div>

            {/* Stats cards responsivos */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto w-full px-4">
              <Card3D gradient="from-purple-900/50 to-pink-900/50" borderColor="border-purple-500/50" glowColor="rgba(168, 85, 247, 0.3)">
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl mb-2 sm:mb-3 animate-bounce-slow">🎯</div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">50K+</h3>
                  <p className="text-sm sm:text-base text-gray-300">Caixas Abertas Hoje</p>
                </div>
              </Card3D>

              <Card3D gradient="from-blue-900/50 to-cyan-900/50" borderColor="border-blue-500/50" glowColor="rgba(59, 130, 246, 0.3)">
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl mb-2 sm:mb-3 animate-bounce-slow" style={{ animationDelay: '0.2s' }}>👥</div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">10K+</h3>
                  <p className="text-sm sm:text-base text-gray-300">Jogadores Online</p>
                </div>
              </Card3D>

              <Card3D gradient="from-green-900/50 to-emerald-900/50" borderColor="border-green-500/50" glowColor="rgba(16, 185, 129, 0.3)">
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl mb-2 sm:mb-3 animate-bounce-slow" style={{ animationDelay: '0.4s' }}>💎</div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">$2M+</h3>
                  <p className="text-sm sm:text-base text-gray-300">Distribuídos Hoje</p>
                </div>
              </Card3D>
            </div>
          </div>

          {/* Scroll indicator (apenas desktop) */}
          {!isMobile && (
            <div className="mt-12 animate-bounce">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            </div>
          )}
        </section>

        {/* ===== CASOS MAIS POPULARES ===== */}
        <section className="py-12 sm:py-20 px-4 relative z-10 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-3 sm:mb-4 neon-gradient">
                🔥 Casos Mais Populares
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-gray-400">
                Comece com estes casos e tenha suas primeiras skins raras!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {topCases.map((caseItem, index) => (
                <Card3D 
                  key={index}
                  gradient={caseItem.gradient}
                  className="cursor-pointer group"
                >
                  <div className="text-center">
                    {/* Badge de popularidade */}
                    <div className="absolute -top-3 -right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse-glow">
                      {caseItem.popularity}
                    </div>

                    <div className="text-6xl sm:text-7xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                      {caseItem.icon}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{caseItem.name}</h3>
                    <p className="text-2xl sm:text-3xl font-black text-green-400 mb-4">{caseItem.price}</p>
                    
                    <button className="btn-glow w-full bg-white/10 hover:bg-white/20 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-base transition-all">
                      Abrir Agora →
                    </button>
                  </div>
                </Card3D>
              ))}
            </div>

            <div className="text-center mt-8">
              <a 
                href="/cases" 
                className="inline-block btn-glow bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base hover:scale-105 transition-all"
              >
                Ver Todos os Casos →
              </a>
            </div>
          </div>
        </section>

        {/* ===== VITÓRIAS RECENTES (Scrolling Feed) ===== */}
        <section className="py-8 sm:py-12 px-4 relative z-10 bg-black/30">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-white">
              🏆 Vitórias Recentes
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {recentWins.map((win, index) => (
                <div 
                  key={index}
                  className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-green-500/30 hover:border-green-500 transition-all animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-bold text-sm sm:text-base">{win.user}</span>
                    <span className="text-gray-400 text-xs">{win.time}</span>
                  </div>
                  <p className="text-gray-300 text-xs sm:text-sm mb-2">{win.item}</p>
                  <p className="text-green-400 font-bold text-base sm:text-lg">{win.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== POR QUE ESCOLHER CS2 FORTUNE ===== */}
        <section className="py-12 sm:py-20 px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-center mb-8 sm:mb-12 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              ✨ Por que somos os melhores? ✨
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              <Card3D gradient="from-purple-900/30 to-transparent" borderColor="border-purple-500/30" hoverBorderColor="border-purple-500">
                <div className="text-center sm:text-left">
                  <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">⚡</div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-white">Abertura Instantânea</h3>
                  <p className="text-sm sm:text-base text-gray-400">Animações em 3D e resultados em tempo real. Sem espera!</p>
                </div>
              </Card3D>

              <Card3D gradient="from-pink-900/30 to-transparent" borderColor="border-pink-500/30" hoverBorderColor="border-pink-500">
                <div className="text-center sm:text-left">
                  <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">🔒</div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-white">100% Seguro</h3>
                  <p className="text-sm sm:text-base text-gray-400">Criptografia SSL, 2FA e integração oficial com Steam.</p>
                </div>
              </Card3D>

              <Card3D gradient="from-blue-900/30 to-transparent" borderColor="border-blue-500/30" hoverBorderColor="border-blue-500">
                <div className="text-center sm:text-left">
                  <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">🎁</div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-white">Skins Exclusivas</h3>
                  <p className="text-sm sm:text-base text-gray-400">Facas, luvas e AWP Dragon Lore esperando por você!</p>
                </div>
              </Card3D>

              <Card3D gradient="from-green-900/30 to-transparent" borderColor="border-green-500/30" hoverBorderColor="border-green-500">
                <div className="text-center sm:text-left">
                  <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">💰</div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-white">Saque Rápido</h3>
                  <p className="text-sm sm:text-base text-gray-400">Retire para sua conta Steam em menos de 5 minutos.</p>
                </div>
              </Card3D>

              <Card3D gradient="from-yellow-900/30 to-transparent" borderColor="border-yellow-500/30" hoverBorderColor="border-yellow-500">
                <div className="text-center sm:text-left">
                  <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">🤖</div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-white">IA Assistente</h3>
                  <p className="text-sm sm:text-base text-gray-400">Análise de probabilidades e estratégias vencedoras.</p>
                </div>
              </Card3D>

              <Card3D gradient="from-red-900/30 to-transparent" borderColor="border-red-500/30" hoverBorderColor="border-red-500">
                <div className="text-center sm:text-left">
                  <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">🏆</div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-white">Bônus Diários</h3>
                  <p className="text-sm sm:text-base text-gray-400">$10 grátis todo dia + eventos exclusivos VIP.</p>
                </div>
              </Card3D>
            </div>
          </div>
        </section>

        {/* ===== DEPOIMENTOS ===== */}
        <section className="py-12 sm:py-20 px-4 relative z-10 bg-gradient-to-b from-transparent via-pink-900/10 to-transparent">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-center mb-8 sm:mb-12 neon-gradient">
              💬 O que dizem nossos jogadores
            </h2>

            <div className="relative">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`transition-all duration-500 ${
                    index === activeTestimonial ? 'opacity-100 block' : 'opacity-0 hidden'
                  }`}
                >
                  <Card3D gradient="from-gray-900/90 to-gray-800/90">
                    <div className="text-center">
                      <div className="mb-4">
                        {'⭐'.repeat(testimonial.rating)}
                      </div>
                      <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-4 italic">
                        "{testimonial.text}"
                      </p>
                      <p className="text-green-400 font-bold mb-2">{testimonial.skin}</p>
                      <p className="text-gray-400 text-sm">- {testimonial.name}</p>
                    </div>
                  </Card3D>
                </div>
              ))}

              {/* Indicadores */}
              <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                      index === activeTestimonial ? 'bg-purple-500 w-6 sm:w-8' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== CTA FINAL ===== */}
        <section className="py-16 sm:py-24 px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Card3D gradient="from-purple-900/80 to-pink-900/80">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 sm:mb-6 text-white">
                Pronto para sua primeira vitória? 🎉
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-6 sm:mb-8">
                Junte-se a milhares de jogadores e comece a ganhar agora mesmo!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/login" 
                  className="btn-glow bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-all"
                >
                  🚀 Criar Conta Grátis
                </a>
                <a 
                  href="/cases" 
                  className="btn-glow bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-all"
                >
                  🎁 Ver Casos
                </a>
              </div>
            </Card3D>
          </div>
        </section>

        {/* ===== FOOTER ===== */}
        <footer className="py-8 sm:py-12 px-4 relative z-10 bg-black/50 border-t border-purple-500/30">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8">
              <div>
                <h4 className="text-white font-bold mb-3 text-lg">CS2 Fortune</h4>
                <p className="text-gray-400 text-sm">A melhor plataforma de casos CS2 do Brasil.</p>
              </div>
              <div>
                <h4 className="text-white font-bold mb-3 text-base">Links Rápidos</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="/cases" className="text-gray-400 hover:text-purple-400">Casos</a></li>
                  <li><a href="/deposit" className="text-gray-400 hover:text-purple-400">Depositar</a></li>
                  <li><a href="/withdraw" className="text-gray-400 hover:text-purple-400">Sacar</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-3 text-base">Suporte</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="text-gray-400 hover:text-purple-400">FAQ</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-purple-400">Contato</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-purple-400">Termos</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-3 text-base">Social</h4>
                <div className="flex gap-3">
                  <a href="#" className="text-2xl hover:scale-110 transition-transform">📱</a>
                  <a href="#" className="text-2xl hover:scale-110 transition-transform">💬</a>
                  <a href="#" className="text-2xl hover:scale-110 transition-transform">📧</a>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-6 text-center">
              <p className="text-gray-500 text-sm">
                © 2025 CS2 Fortune. Todos os direitos reservados. 🎮
              </p>
            </div>
          </div>
        </footer>
      </main>
      
      {/* AI Assistant - contexto geral */}
      <AIAssistant context="general" />
    </>
  )
}

