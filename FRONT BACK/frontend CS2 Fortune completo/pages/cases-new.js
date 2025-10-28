import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import ParticlesBackground from '../components/ParticlesBackground'
import { cases } from '../services/api'
import { FaSpinner } from 'react-icons/fa'

export default function Cases() {
  const [availableCases, setAvailableCases] = useState([])
  const [selectedCase, setSelectedCase] = useState(null)
  const [isOpening, setIsOpening] = useState(false)
  const [wonItem, setWonItem] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCases()
  }, [])

  const loadCases = async () => {
    try {
      // Mock data - substitua pela chamada real da API
      setAvailableCases([
        { id: 1, name: 'Caixa Premium', price: 10, image: '/images/cases/case1.png' },
        { id: 2, name: 'Caixa Elite', price: 25, image: '/images/cases/case2.png' },
        { id: 3, name: 'Caixa Legendary', price: 50, image: '/images/cases/case3.png' },
        { id: 4, name: 'Caixa Ultimate', price: 100, image: '/images/cases/case4.png' },
      ])
      setLoading(false)
    } catch (error) {
      console.error('Erro ao carregar casos:', error)
      setLoading(false)
    }
  }

  const openCase = async (caseItem) => {
    setSelectedCase(caseItem)
    setIsOpening(true)
    setWonItem(null)

    try {
      // Simulação de abertura - substitua pela chamada real da API
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const mockItem = {
        id: Math.random(),
        name: 'AK-47 | Neon Revolution',
        rarity: 'legendary',
        price: Math.random() * 500 + 50,
        image: '/images/skins/ak47-neon.png'
      }
      
      setWonItem(mockItem)
      setIsOpening(false)
    } catch (error) {
      console.error('Erro ao abrir caixa:', error)
      setIsOpening(false)
    }
  }

  const closeModal = () => {
    setSelectedCase(null)
    setWonItem(null)
    setIsOpening(false)
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <FaSpinner className="text-secondary text-6xl animate-spin" />
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <ParticlesBackground />
      
      <main className="relative min-h-screen py-20">
        <div className="container mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-center mb-12 bg-gradient-to-r from-purple-neon to-secondary bg-clip-text text-transparent"
          >
            Escolha sua Caixa
          </motion.h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {availableCases.map((caseItem, index) => (
              <CaseItem
                key={caseItem.id}
                caseItem={caseItem}
                index={index}
                onOpen={() => openCase(caseItem)}
              />
            ))}
          </div>
        </div>

        {/* Modal de Abertura */}
        <AnimatePresence>
          {selectedCase && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={closeModal}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-gray-900 p-8 rounded-2xl border-2 border-secondary max-w-2xl w-full mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                {isOpening ? (
                  <div className="text-center">
                    <motion.div
                      animate={{ rotateY: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className="text-8xl mb-6"
                    >
                      🎁
                    </motion.div>
                    <h2 className="text-3xl font-bold text-secondary mb-4">
                      Abrindo {selectedCase.name}...
                    </h2>
                    <div className="flex justify-center space-x-2">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-3 h-3 bg-secondary rounded-full"
                          animate={{ y: [0, -20, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                        />
                      ))}
                    </div>
                  </div>
                ) : wonItem ? (
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                      className="mb-6"
                    >
                      <div className="text-8xl mb-4">🏆</div>
                      <h2 className="text-4xl font-bold text-yellow-400 mb-2">
                        Parabéns!
                      </h2>
                      <p className="text-2xl text-white mb-4">{wonItem.name}</p>
                      <div className="text-3xl font-bold text-secondary">
                        ${wonItem.price.toFixed(2)}
                      </div>
                    </motion.div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={closeModal}
                      className="mt-6 bg-gradient-to-r from-secondary to-primary text-white px-8 py-3 rounded-lg font-bold"
                    >
                      Fechar
                    </motion.button>
                  </div>
                ) : null}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  )
}

function CaseItem({ caseItem, index, onOpen }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -10, scale: 1.05 }}
      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border-2 border-purple-neon/30 hover:border-secondary transition-all duration-300"
    >
      <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
        <div className="text-9xl">🎁</div>
      </div>
      
      <div className="p-6">
        <h3 className="text-2xl font-bold text-white mb-2">{caseItem.name}</h3>
        <div className="text-3xl font-bold text-secondary mb-4">
          ${caseItem.price}
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 20px #00ffff' }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpen}
          className="w-full bg-gradient-to-r from-secondary to-primary text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all"
        >
          Abrir Agora
        </motion.button>
      </div>
    </motion.div>
  )
}
