import Navbar from '../components/Navbar'

export default function Login() {
  const handleSteamLogin = () => {
    // Chamar API de login com Steam (endpoint backend)
    alert('Aguardando implementação de login Steam...');
  }

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center h-screen">
        <button className="bg-primary text-secondary px-6 py-3 rounded-lg" onClick={handleSteamLogin}>
          Login com Steam
        </button>
      </div>
    </>
  )
}
