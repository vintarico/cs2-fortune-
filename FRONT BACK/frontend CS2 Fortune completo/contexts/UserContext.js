// Context para gerenciar autenticação e saldo do usuário
import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(1000); // Saldo inicial para testes
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há token salvo
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('user');
    const savedBalance = localStorage.getItem('balance');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      
      // Usar saldo salvo ou buscar do backend
      if (savedBalance) {
        setBalance(parseFloat(savedBalance));
      }
      fetchBalance(savedToken);
    } else {
      // Criar usuário demo para testes
      loginDemo();
    }
    
    setLoading(false);
  }, []);

  const loginDemo = async () => {
    // Para testes, criar um usuário demo
    const demoUser = {
      userId: 'demo-user',
      username: 'Demo User',
      steamId: 'demo-steam-id'
    };
    
    const demoToken = 'demo-token-for-testing';
    
    setUser(demoUser);
    setToken(demoToken);
    setBalance(1000); // Saldo inicial demo
    
    localStorage.setItem('authToken', demoToken);
    localStorage.setItem('user', JSON.stringify(demoUser));
  };

  const fetchBalance = async (authToken) => {
    try {
      const response = await fetch('http://localhost:3001/api/saldo', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const newBalance = data.saldo || data.balance || balance;
        setBalance(newBalance);
        localStorage.setItem('balance', newBalance.toString());
        console.log(`💰 Saldo carregado do backend: R$ ${newBalance.toFixed(2)}`);
      }
    } catch (error) {
      console.error('Erro ao buscar saldo:', error);
    }
  };

  const updateBalance = (newBalance) => {
    setBalance(newBalance);
    localStorage.setItem('balance', newBalance.toString());
    console.log(`💰 Saldo atualizado: R$ ${newBalance.toFixed(2)}`);
  };

  const addBalance = async (amount) => {
    try {
      const response = await fetch('http://localhost:3001/api/user/add-balance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount })
      });
      
      if (response.ok) {
        const data = await response.json();
        setBalance(data.newBalance);
        return true;
      }
    } catch (error) {
      console.error('Erro ao adicionar saldo:', error);
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setBalance(0);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  return (
    <UserContext.Provider value={{
      user,
      balance,
      token,
      loading,
      updateBalance,
      addBalance,
      logout,
      loginDemo
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
