import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data);
      } catch (err) {
        alert('❌ Acesso negado ou erro: ' + err.response?.data?.error);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  return (
    <>
      <Navbar />
      <main className="p-10">
        <h1 className="text-4xl font-bold mb-6 text-secondary">⚙️ Painel Admin</h1>
        
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
              <thead className="bg-primary">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">SteamID</th>
                  <th className="p-3 text-left">Username</th>
                  <th className="p-3 text-left">Saldo</th>
                  <th className="p-3 text-left">Admin</th>
                  <th className="p-3 text-left">Cadastro</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700">
                    <td className="p-3">{user.id}</td>
                    <td className="p-3 font-mono text-sm">{user.steamId}</td>
                    <td className="p-3">{user.username || 'N/A'}</td>
                    <td className="p-3 text-green-400">R$ {user.saldo.toFixed(2)}</td>
                    <td className="p-3">{user.isAdmin ? '✅' : '❌'}</td>
                    <td className="p-3 text-sm text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}
