import Navbar from '../components/Navbar'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen p-10">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4 text-secondary animate-pulse">
            Bem-vindo à CS 2 Fortune
          </h1>
          <p className="text-xl mb-10 text-gray-300">
            Abra caixas, troque skins e ganhe recompensas exclusivas no universo CS2.
          </p>
          <Link href="/cases">
            <a className="bg-secondary text-primary px-8 py-4 rounded-lg text-xl font-semibold hover:bg-cyan-400 transition transform hover:scale-105">
              Abrir Caixa Agora 🎁
            </a>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-gray-800 p-6 rounded-lg border-2 border-primary hover:border-secondary transition">
            <h3 className="text-2xl font-bold mb-3 text-secondary">🎲 Abra Caixas</h3>
            <p className="text-gray-300">Ganhe skins raras abrindo nossas caixas exclusivas</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border-2 border-primary hover:border-secondary transition">
            <h3 className="text-2xl font-bold mb-3 text-secondary">💱 Troque Skins</h3>
            <p className="text-gray-300">Sistema seguro de trade com outros jogadores</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border-2 border-primary hover:border-secondary transition">
            <h3 className="text-2xl font-bold mb-3 text-secondary">💰 Ganhe Bônus</h3>
            <p className="text-gray-300">Bônus diários e promoções especiais</p>
          </div>
        </div>
      </main>
    </>
  )
}
