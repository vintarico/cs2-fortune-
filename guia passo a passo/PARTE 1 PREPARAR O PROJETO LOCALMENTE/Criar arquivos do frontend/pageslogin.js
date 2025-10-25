import { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/router';

export default function Login() {
  const [steamId, setSteamId] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!steamId) {
      alert('Por favor, insira seu SteamID');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/login/steam`, { 
        steamId, 
        username 
      });
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      alert('✅ Login bem sucedido!');
      router.push('/saldo');
    } catch (err) {
      console.error(err);
      alert('❌ Erro no login: ' + (err.response?.data?.error || 'Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex flex-col items-center justify-center min-h-screen space-y-6 p-4">
        <div className="bg-gray-800 p-10 rounded-lg shadow-2xl border-2 border-primary max-w-md w-full">
          <h2 className="text-3xl font-bold mb-6 text-center text-secondary">Login Steam</h2>
          
          <input 
            type="text" 
            placeholder="SteamID (ex: 76561198...)" 
            className="w-full p-3 rounded bg-gray-700 border border-gray-600 mb-4 focus:border-secondary focus:outline-none" 
            value={steamId} 
            onChange={e => setSteamId(e.target.value)} 
          />
          
          <input 
            type="text" 
            placeholder="Username (opcional)" 
            className="w-full p-3 rounded bg-gray-700 border border-gray-600 mb-6 focus:border-secondary focus:outline-none" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
          />
          
          <button 
            onClick={handleLogin} 
            disabled={loading}
            className="w-full bg-secondary text-primary px-6 py-3 rounded-lg font-bold hover:bg-cyan-400 transition disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar com Steam'}
          </button>
          
          <p className="text-gray-400 text-sm mt-4 text-center">
            Ao fazer login, você ganha R$ 100 de bônus!
          </p>
        </div>
      </main>
    </>
  );
}
