import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { authApi } from '../lib/api'

export default function AdminPage() {
  const router = useRouter()
  const [users, setUsers] = useState([])
  const [trades, setTrades] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, tradesRes] = await Promise.all([
          authApi.get('/admin/users'),
          authApi.get('/admin/trades')
        ])
        setUsers(usersRes.data)
        setTrades(tradesRes.data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching admin data:', error)
        // Redirect to home if not admin
        if (error.response?.status === 403) {
          router.push('/')
        }
      }
    }

    fetchData()
  }, [router])

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      {/* Users Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Users</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded-lg">
            <thead>
              <tr>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Balance</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-t border-gray-700">
                  <td className="px-4 py-3">{user.username}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">${user.balance.toFixed(2)}</td>
                  <td className="px-4 py-3">{user.isAdmin ? 'Admin' : 'User'}</td>
                  <td className="px-4 py-3">{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Trades Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Trade Offers</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded-lg">
            <thead>
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Trade URL</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {trades.map(trade => (
                <tr key={trade.id} className="border-t border-gray-700">
                  <td className="px-4 py-3">{trade.user.username}</td>
                  <td className="px-4 py-3">
                    <a 
                      href={trade.tradeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      View Trade
                    </a>
                  </td>
                  <td className="px-4 py-3">{trade.status}</td>
                  <td className="px-4 py-3">{new Date(trade.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}