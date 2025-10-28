import { motion } from 'framer-motion'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import ParticlesBackground from '../components/ParticlesBackground'
import { FaGift, FaDollarSign, FaTrophy } from 'react-icons/fa'

export default function Home() {
  return (
    <>
      <Navbar />
      <ParticlesBackground />
      
      <main className="relative min-h-screen">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-neon via-secondary to-pink-neon bg-clip-text text-transparent animate-pulse-slow">
              Bem-vindo à CS 2 Fortune
            </h1>
            
            <p className="text-xl md:text-2xl mb-10 text-gray-300 max-w-3xl mx-auto">
              Abra caixas, troque skins e ganhe recompensas exclusivas no universo CS2.
            </p>
            
            <Link href="/cases">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 20px #00ffff' }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-secondary to-primary text-white px-10 py-4 rounded-lg font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-secondary/50 animate-glow"
              >
                🎁 Abrir Caixa Agora
              </motion.button>
            </Link>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<FaGift className="text-5xl text-secondary" />}
              title="Caixas Exclusivas"
              description="Abra caixas com as melhores skins de CS2"
              delay={0.2}
            />
            <FeatureCard
              icon={<FaDollarSign className="text-5xl text-secondary" />}
              title="Depósito Rápido"
              description="Adicione saldo de forma rápida e segura"
              delay={0.4}
            />
            <FeatureCard
              icon={<FaTrophy className="text-5xl text-secondary" />}
              title="Saque Fácil"
              description="Retire seus ganhos a qualquer momento"
              delay={0.6}
            />
          </div>
        </section>

        {/* Featured Cases Section */}
        <section className="container mx-auto px-4 py-16">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-4xl font-bold text-center mb-12 text-secondary"
          >
            Caixas em Destaque
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item, index) => (
              <CaseCard key={item} index={index} caseNumber={item} />
            ))}
          </div>
        </section>
      </main>
    </>
  )
}

function FeatureCard({ icon, title, description, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-secondary/20 hover:border-secondary/50 transition-all duration-300"
    >
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-2xl font-bold mb-3 text-center text-white">{title}</h3>
      <p className="text-gray-400 text-center">{description}</p>
    </motion.div>
  )
}

function CaseCard({ index, caseNumber }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ 
        scale: 1.05, 
        rotateY: 5,
        boxShadow: '0 10px 40px rgba(0, 255, 255, 0.3)'
      }}
      className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border-2 border-purple-neon/30 hover:border-secondary transition-all duration-300 cursor-pointer"
    >
      <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-4 flex items-center justify-center">
        <div className="text-6xl">🎁</div>
      </div>
      <h4 className="text-xl font-bold text-white mb-2">Caixa Premium #{caseNumber}</h4>
      <p className="text-gray-400 mb-4">Contém skins raras e exclusivas</p>
      <Link href="/cases">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-gradient-to-r from-secondary to-primary text-white py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-secondary/50 transition-all"
        >
          Abrir Agora
        </motion.button>
      </Link>
    </motion.div>
  )
}
