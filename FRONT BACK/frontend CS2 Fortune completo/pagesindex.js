import Navbar from '../components/Navbar'

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="p-10 text-center">
        <h1 className="text-5xl font-bold mb-4 text-secondary">Bem-vindo à CS 2 Fortune</h1>
        <p className="mb-10">Abra caixas, troque skins e ganhe recompensas exclusivas no universo CS2.</p>
        <a href="/cases" className="bg-secondary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-cyan-400 transition">Abrir Caixa Agora</a>
      </main>
    </>
  )
}
