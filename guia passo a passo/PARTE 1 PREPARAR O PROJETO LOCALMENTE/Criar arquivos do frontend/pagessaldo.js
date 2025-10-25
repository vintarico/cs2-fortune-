import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/router';

export default function Saldo() {
  const [saldo, setSaldo] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSaldo = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (!token) {
        router.push('/login');
        return;
      }

      setUser(JSON.parse(userData));

      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/saldo`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSaldo(res.data.saldo);
      } catch (err) {
        console.error(err);
        setSaldo('Erro ao carregar');
      } finally {
        setLoading(false);
      }
    };
    fetchSaldo();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <>
      <Navbar />
      <main className="p-10 max-w-4xl mx-auto">
        <div className="bg-gray-800 p-8 rounded-lg shadow-2xl border-2 border-primary">
          <h1 className="text-4xl font-bold mb-6 text-secondary">💰 Seu Saldo</h1>
          
          {loading ? (
            <p className="text-2xl">Carregando...</p>
          ) : (
            <>
              <div className="bg-gray-700 p-6 rounded-lg mb-6">
                <p className="text-gray-400 mb-2">Usuário: {user?.username}</p>
                <p className="text-gray-400 mb-4">SteamID: {user?.steamId}</p>
                <p className="text-5xl font-bold text-secondary">
                  R$ {saldo?.toFixed(2) || '0.00'}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => router.push('/deposit')}
                  className="bg-green-600 px-6 py-3 rounded-lg hover:bg-green-700 transition font-bold"
                >
                  💳 Depositar
                </button>
                <button 
                  onClick={() => router.push('/withdraw')}
                  className="bg-orange-600 px-6 py-3 rounded-lg hover:bg-orange-700 transition font-bold"
                >
                  💵 Retirar
                </button>
              </div>

              <button 
                onClick={handleLogout}
                className="w-full mt-4 bg-red-600 px-6 py-3 rounded-lg hover:bg-red-700 transition"
              >
                Sair
              </button>
            </>
          )}
        </div>
      </main>
    </>
  );
}
