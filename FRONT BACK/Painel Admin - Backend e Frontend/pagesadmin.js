import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function Admin() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3001/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data);
      } catch (err) {
        alert('Acesso negado ou erro ao buscar dados.');
      }
    }
    fetchUsers();
  }, []);

  return (
    <>
      <Navbar />
      <main className="p-10">
        <h1 className="text-3xl mb-4">Painel Admin - Usuários</h1>
        <table className="w-full text-left border-collapse border border-gray-700">
          <thead>
            <tr>
              <th className="border border-gray-600 p-2">ID</th>
              <th className="border border-gray-600 p-2">SteamID</th>
              <th className="border border-gray-600 p-2">Username</th>
              <th className="border border-gray-600 p-2">Saldo</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td className="border border-gray-600 p-2">{user.id}</td>
                <td className="border border-gray-600 p-2">{user.steamId}</td>
                <td className="border border-gray-600 p-2">{user.username}</td>
                <td className="border border-gray-600 p-2">{user.saldo.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </>
  );
}
