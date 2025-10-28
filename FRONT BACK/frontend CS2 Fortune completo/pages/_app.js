import { AuthProvider } from '../hooks/useAuth'
import { UserProvider } from '../contexts/UserContext'
import { NotificationProvider } from '../contexts/NotificationContext'
import ToastContainer from '../components/ToastContainer'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <UserProvider>
        <NotificationProvider>
          <Component {...pageProps} />
          <ToastContainer />
        </NotificationProvider>
      </UserProvider>
    </AuthProvider>
  )
}

export default MyApp