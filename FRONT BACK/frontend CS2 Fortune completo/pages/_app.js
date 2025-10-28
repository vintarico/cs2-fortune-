import { AuthProvider } from '../hooks/useAuth'
import { UserProvider } from '../contexts/UserContext'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </AuthProvider>
  )
}

export default MyApp