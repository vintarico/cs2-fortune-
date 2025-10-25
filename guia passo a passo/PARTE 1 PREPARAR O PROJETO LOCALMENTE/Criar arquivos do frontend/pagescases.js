import Navbar from '../components/Navbar';

export default function Cases() {
  const cases = [
    { id: 1, name: 'Caixa Bronze', price: 'R$ 10,00', color: 'bg-orange-900' },
    { id: 2, name: 'Caixa Prata', price: 'R$ 25,00', color: 'bg-gray-500' },
    { id: 3, name: 'Caixa Ouro', price: 'R$ 50,00', color: 'bg-yellow-600' },
  ];

  return (
    <>
      <Navbar />
      <main className="p-10">
        <h2 className="text-4xl font-bold mb-8 text-center text-secondary">🎁 Escolha sua Caixa</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {cases.map(c => (
            <div key={c.id} className={`${c.color} p-6 rounded-lg text-center cursor-pointer hover:scale-105 transition transform border-2 border-transparent hover:border-secondary`}>
              <div className="w-32 h-32 bg-gray-700 mx-auto mb-4 rounded-lg flex items-center justify-center text-4xl">
                📦
              </div>
              <h3 className="text-2xl font-bold mb-2">{c.name}</h3>
              <p className="text-xl mb-4">{c.price}</p>
              <button className="bg-secondary text-primary px-6 py-2 rounded-lg hover:bg-cyan-400 transition font-bold">
                Abrir Agora
              </button>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
