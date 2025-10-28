import Link from 'next/link'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth()

  return (
    <nav className="bg-gray-800 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link href="/">
            <span className="text-white text-xl font-bold cursor-pointer">CS2 Fortune</span>
          </Link>
          
          <div className="hidden md:flex space-x-6">
            <Link href="/cases">
              <span className="text-gray-300 hover:text-white cursor-pointer transition">🎁 Cases</span>
            </Link>
            <Link href="/inventory">
              <span className="text-gray-300 hover:text-white cursor-pointer transition">🎒 Inventário</span>
            </Link>
            <Link href="/deposit">
              <span className="text-gray-300 hover:text-white cursor-pointer transition">💳 Depositar</span>
            </Link>
            <Link href="/withdraw">
              <span className="text-gray-300 hover:text-white cursor-pointer transition">💰 Sacar</span>
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {isAdmin && (
                <Link href="/admin">
                  <span className="text-yellow-400 hover:text-yellow-300 cursor-pointer">
                    Admin Panel
                  </span>
                </Link>
              )}
              <span className="text-green-400">${user.balance?.toFixed(2)}</span>
              <button 
                onClick={logout}
                className="text-gray-300 hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login">
              <span className="text-gray-300 hover:text-white cursor-pointer">Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}