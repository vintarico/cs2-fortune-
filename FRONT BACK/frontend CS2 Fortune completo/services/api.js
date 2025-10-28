import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para tratar erros globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido ou expirado
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth
export const auth = {
  loginSteam: () => api.get('/api/auth/steam'),
  me: () => api.get('/api/me'),
  logout: () => {
    localStorage.removeItem('token')
    return Promise.resolve()
  },
}

// Cases
export const cases = {
  getAll: () => api.get('/api/cases'),
  getById: (id) => api.get(`/api/cases/${id}`),
  open: (caseId) => api.post(`/api/cases/${caseId}/open`),
}

// User
export const user = {
  getBalance: () => api.get('/api/user/balance'),
  getInventory: () => api.get('/api/user/inventory'),
  deposit: (amount) => api.post('/api/user/deposit', { amount }),
  withdraw: (itemId) => api.post('/api/user/withdraw', { itemId }),
}

export default api
