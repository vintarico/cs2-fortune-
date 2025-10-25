import Navbar from '../components/Navbar'

export default function Cases() {
  return (
    <>
      <Navbar />
      <div className="p-10">
        <h2 className="text-3xl mb-4">Escolha sua Caixa</h2>
        <div className="grid grid-cols-3 gap-4">
          {/* Aqui você pode colocar cards com imagens de skins e botões de abrir */}
          <div className="bg-gray-800 p-4 rounded-lg text-center cursor-pointer hover:bg-gray-700">
            <img src="/images/case-skins/skin1.png" alt="Skin 1" className="mx-auto mb-2" />
            <h3 className="text-xl">Caixa Bronze</h3>
          </div>
          {/* Mais caixas */}
        </div>
      </div>
    </>
  )
}
