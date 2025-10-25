import { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function Login() {
  const [steamId, setSteamId] = useState('');
  const [username, setUsername] = useState('');
  const [token, setToken] = useState(null);

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:3001/api/login/steam', { steamId, username });
      setToken(res.data.token);
      alert('Login bem sucedido!');
      // Salvar token localStorage, context ou cookie para uso posterior
      localStorage.setItem('token', res.data.token);
    } catch (err) {
      alert('Erro no login.');
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex flex-col items-center justify-center h-screen space-y-4">
        <input type="text" placeholder="SteamID" className="p-2 rounded" value={steamId} onChange={e => setSteamId(e.target.value)} />
        <input type="text" placeholder="Username" className="p-2 rounded" value={username} onChange={e => setUsername(e.target.value)} />
        <button onClick={handleLogin} className="bg-primary text-secondary px-6 py-3 rounded-lg">Login Steam</button>
      </main>
    </>
  );
}
