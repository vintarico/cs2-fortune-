import { useState } from 'react'
import { useRouter } from 'next/router'
import ParticlesBackground from '../components/ParticlesBackground'
import Card3D from '../components/Card3D'

export default function Login() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [steamId, setSteamId] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (isLogin) {
      // Login via backend
      try {
        const res = await fetch('http://localhost:3001/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        })
        const data = await res.json()
        
        if (data.token) {
          localStorage.setItem('token', data.token)
          alert('Login realizado com sucesso! ✅')
          router.push('/')
        } else {
          alert('Credenciais inválidas ❌')
        }
      } catch (error) {
        alert('Erro ao fazer login. Tente novamente.')
        console.error(error)
      }
    } else {
      // Registro
      alert('Funcionalidade de registro em desenvolvimento! 🚧')
    }
  }

  const handleSteamLogin = () => {
    alert('Login via Steam em breve! 🎮')
  }

  return (
    <>
      {/* Background com partículas */}
      <ParticlesBackground />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full">
          {/* Logo/Título */}
          <div className="text-center mb-8">
            <h1 className="text-6xl font-black mb-4 neon-gradient">
              🎮 CS2 Fortune
            </h1>
            <p className="text-xl text-gray-400">
              {isLogin ? 'Entre na sua conta' : 'Crie sua conta'}
            </p>
          </div>

          {/* Card de Login/Registro */}
          <Card3D gradient="from-gray-900/90 to-gray-800/90">
            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 rounded-lg font-bold transition-all ${
                  isLogin
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 rounded-lg font-bold transition-all ${
                  !isLogin
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                Registrar
              </button>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Escolha um username..."
                    className="w-full bg-white/5 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-gray-400 text-sm mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full bg-white/5 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Senha</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all"
                  required
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Steam ID (opcional)</label>
                  <input
                    type="text"
                    value={steamId}
                    onChange={(e) => setSteamId(e.target.value)}
                    placeholder="STEAM_0:X:XXXXXXXX"
                    className="w-full bg-white/5 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all"
                  />
                </div>
              )}

              <button
                type="submit"
                className="btn-glow w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-4 rounded-xl font-black text-lg transition-all"
              >
                {isLogin ? '🚀 Entrar' : '✨ Criar Conta'}
              </button>
            </form>

            {/* Divisor */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 border-t border-gray-700"></div>
              <p className="text-gray-500 text-sm">ou</p>
              <div className="flex-1 border-t border-gray-700"></div>
            </div>

            {/* Login via Steam */}
            <button
              onClick={handleSteamLogin}
              className="btn-glow w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-3"
            >
              <span className="text-2xl">🎮</span>
              Entrar com Steam
            </button>

            {/* Links */}
            <div className="mt-6 text-center text-sm">
              {isLogin ? (
                <p className="text-gray-400">
                  Esqueceu a senha?{' '}
                  <a href="#" className="text-purple-400 hover:text-purple-300 font-semibold">
                    Recuperar
                  </a>
                </p>
              ) : (
                <p className="text-gray-400">
                  Ao registrar, você concorda com nossos{' '}
                  <a href="#" className="text-purple-400 hover:text-purple-300">
                    Termos
                  </a>
                </p>
              )}
            </div>
          </Card3D>

          {/* Benefícios */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="text-center">
              <div className="text-3xl mb-2 animate-bounce-slow">🎁</div>
              <p className="text-xs text-gray-400">Bônus de Boas-Vindas</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2 animate-bounce-slow" style={{ animationDelay: '0.1s' }}>⚡</div>
              <p className="text-xs text-gray-400">Saques Rápidos</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2 animate-bounce-slow" style={{ animationDelay: '0.2s' }}>🔒</div>
              <p className="text-xs text-gray-400">100% Seguro</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
