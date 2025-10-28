import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';

export default function ProvablyFair() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [session, setSession] = useState(null);
  const [clientSeed, setClientSeed] = useState('');
  const [newClientSeed, setNewClientSeed] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [verificationData, setVerificationData] = useState(null);

  // Campos de verificação manual
  const [verifyServerSeed, setVerifyServerSeed] = useState('');
  const [verifyClientSeed, setVerifyClientSeed] = useState('');
  const [verifyNonce, setVerifyNonce] = useState('');
  const [verifyResult, setVerifyResult] = useState('');
  const [manualVerification, setManualVerification] = useState(null);

  useEffect(() => {
    fetchSession();
    fetchHistory();
  }, []);

  const fetchSession = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/provably-fair/session', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSession(data.session);
        setClientSeed(data.session.clientSeed);
      } else {
        // Criar nova sessão se não existir
        await createNewSession();
      }
    } catch (error) {
      console.error('Erro ao buscar sessão:', error);
    }
  };

  const createNewSession = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/provably-fair/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          clientSeed: clientSeed || undefined
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSession(data.session);
        setClientSeed(data.session.clientSeed);
      }
    } catch (error) {
      console.error('Erro ao criar sessão:', error);
    }
  };

  const updateClientSeed = async () => {
    if (!newClientSeed.trim()) {
      alert('Digite um client seed válido');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await fetch('/api/provably-fair/update-client-seed', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          clientSeed: newClientSeed
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSession(data.session);
        setClientSeed(data.session.clientSeed);
        setNewClientSeed('');
        alert('Client seed atualizado com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao atualizar client seed:', error);
      alert('Erro ao atualizar client seed');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/provably-fair/history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setHistory(data.history);
      }
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
    }
  };

  const verifyManual = async () => {
    if (!verifyServerSeed || !verifyClientSeed || !verifyNonce || !verifyResult) {
      alert('Preencha todos os campos para verificação');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/provably-fair/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          serverSeed: verifyServerSeed,
          clientSeed: verifyClientSeed,
          nonce: parseInt(verifyNonce),
          expectedResult: parseInt(verifyResult)
        })
      });

      if (response.ok) {
        const data = await response.json();
        setManualVerification(data.verification);
      }
    } catch (error) {
      console.error('Erro ao verificar:', error);
      alert('Erro ao verificar resultado');
    } finally {
      setLoading(false);
    }
  };

  const revealServerSeed = async (nonce) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/provably-fair/reveal/${nonce}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setVerificationData(data.reveal);
      }
    } catch (error) {
      console.error('Erro ao revelar server seed:', error);
    }
  };

  const generateRandomSeed = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewClientSeed(result);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">🔒 Provably Fair</h1>
          <p className="text-gray-300 text-lg">
            Sistema transparente que garante a justiça de todos os jogos
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800 rounded-lg p-1 flex">
            {[
              { id: 'overview', label: '📋 Visão Geral', icon: '📋' },
              { id: 'session', label: '🎮 Sua Sessão', icon: '🎮' },
              { id: 'verify', label: '🔍 Verificar', icon: '🔍' },
              { id: 'history', label: '📜 Histórico', icon: '📜' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Conteúdo das Tabs */}
        {activeTab === 'overview' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800 rounded-xl p-8 mb-6">
              <h2 className="text-2xl font-bold text-white mb-6">Como Funciona o Provably Fair</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    step: '1',
                    title: 'Server Seed',
                    description: 'Geramos um código secreto no servidor e mostramos apenas seu hash SHA256',
                    icon: '🔐'
                  },
                  {
                    step: '2',
                    title: 'Client Seed',
                    description: 'Você define seu próprio código ou usa um gerado automaticamente',
                    icon: '👤'
                  },
                  {
                    step: '3',
                    title: 'Nonce',
                    description: 'Contador que incrementa a cada jogo para garantir resultados únicos',
                    icon: '🔢'
                  },
                  {
                    step: '4',
                    title: 'Resultado',
                    description: 'Combinamos tudo e geramos um resultado verificável',
                    icon: '🎯'
                  }
                ].map(item => (
                  <div key={item.step} className="bg-gray-700 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                        {item.step}
                      </div>
                      <span className="text-2xl mr-2">{item.icon}</span>
                      <h3 className="text-xl font-bold text-white">{item.title}</h3>
                    </div>
                    <p className="text-gray-300">{item.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-blue-900/30 rounded-lg border border-blue-500/30">
                <h3 className="text-lg font-bold text-white mb-3">🧮 Fórmula</h3>
                <code className="text-blue-300 bg-gray-900 px-4 py-2 rounded block">
                  Resultado = SHA256(ServerSeed + ":" + ClientSeed + ":" + Nonce)
                </code>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'session' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">🎮 Sua Sessão Atual</h2>
              
              {session ? (
                <div className="space-y-6">
                  <div className="bg-gray-700 rounded-lg p-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      🔐 Server Seed Hash (SHA256)
                    </label>
                    <div className="bg-gray-900 p-3 rounded border break-all text-blue-300 font-mono text-sm">
                      {session.serverSeedHash}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Este é o hash do server seed. O seed original será revelado após cada jogo.
                    </p>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      👤 Seu Client Seed
                    </label>
                    <div className="bg-gray-900 p-3 rounded border break-all text-green-300 font-mono text-sm mb-4">
                      {session.clientSeed}
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newClientSeed}
                          onChange={(e) => setNewClientSeed(e.target.value)}
                          placeholder="Digite seu novo client seed..."
                          className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                          maxLength={64}
                        />
                        <button
                          onClick={generateRandomSeed}
                          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 whitespace-nowrap"
                        >
                          🎲 Gerar
                        </button>
                      </div>
                      
                      <button
                        onClick={updateClientSeed}
                        disabled={loading || !newClientSeed.trim()}
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                      >
                        {loading ? '⏳ Atualizando...' : '🔄 Atualizar Client Seed'}
                      </button>
                    </div>
                    
                    <p className="text-xs text-gray-400 mt-2">
                      Alterar o client seed iniciará uma nova sequência de jogos.
                    </p>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      🔢 Próximo Nonce
                    </label>
                    <div className="bg-gray-900 p-3 rounded border text-yellow-300 font-mono text-lg">
                      {session.nonce + 1}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-300 mb-4">Nenhuma sessão ativa encontrada.</p>
                  <button
                    onClick={createNewSession}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                  >
                    🎮 Criar Nova Sessão
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'verify' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">🔍 Verificar Resultado</h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Server Seed (original)
                  </label>
                  <input
                    type="text"
                    value={verifyServerSeed}
                    onChange={(e) => setVerifyServerSeed(e.target.value)}
                    placeholder="Cole o server seed revelado aqui..."
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Client Seed
                  </label>
                  <input
                    type="text"
                    value={verifyClientSeed}
                    onChange={(e) => setVerifyClientSeed(e.target.value)}
                    placeholder="Seu client seed..."
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nonce
                  </label>
                  <input
                    type="number"
                    value={verifyNonce}
                    onChange={(e) => setVerifyNonce(e.target.value)}
                    placeholder="Número do nonce..."
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Resultado Esperado
                  </label>
                  <input
                    type="number"
                    value={verifyResult}
                    onChange={(e) => setVerifyResult(e.target.value)}
                    placeholder="Resultado que você obteve..."
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>

                <button
                  onClick={verifyManual}
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? '⏳ Verificando...' : '🔍 Verificar Resultado'}
                </button>
              </div>

              {manualVerification && (
                <div className={`p-6 rounded-lg border ${manualVerification.match ? 'bg-green-900/30 border-green-500' : 'bg-red-900/30 border-red-500'}`}>
                  <h3 className="text-lg font-bold mb-4">
                    {manualVerification.match ? '✅ Verificação Bem-sucedida' : '❌ Verificação Falhou'}
                  </h3>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-300">String Combinada:</span>
                      <code className="block bg-gray-900 p-2 rounded mt-1 break-all">
                        {manualVerification.process.combinedString}
                      </code>
                    </div>
                    
                    <div>
                      <span className="text-gray-300">Hash SHA256:</span>
                      <code className="block bg-gray-900 p-2 rounded mt-1 break-all">
                        {manualVerification.process.resultHash}
                      </code>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-300">Resultado Gerado:</span>
                        <div className="bg-gray-900 p-2 rounded mt-1 text-center font-bold">
                          {manualVerification.process.generatedResult}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-300">Resultado Esperado:</span>
                        <div className="bg-gray-900 p-2 rounded mt-1 text-center font-bold">
                          {manualVerification.process.expectedResult}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">📜 Histórico de Jogos</h2>
              
              {history.length > 0 ? (
                <div className="space-y-4">
                  {history.map((game, index) => (
                    <div key={index} className="bg-gray-700 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-white">
                            🎲 Jogo #{game.nonce}
                          </h3>
                          <p className="text-gray-300 text-sm">
                            {new Date(game.openedAt).toLocaleString('pt-BR')}
                          </p>
                        </div>
                        <button
                          onClick={() => revealServerSeed(game.nonce)}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                          🔍 Ver Detalhes
                        </button>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Item Ganho:</span>
                          <p className="text-white font-medium">{game.wonItem?.name}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Resultado:</span>
                          <p className="text-white font-mono">{game.result}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Status:</span>
                          <p className="text-green-400">✅ Verificado</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-300">Nenhum jogo encontrado no histórico.</p>
                  <button
                    onClick={() => router.push('/cases')}
                    className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                  >
                    🎮 Jogar Agora
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal de Detalhes */}
        {verificationData && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white">
                    🔍 Detalhes do Jogo #{verificationData.nonce}
                  </h3>
                  <button
                    onClick={() => setVerificationData(null)}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-300 text-sm">Server Seed (Revelado):</label>
                    <code className="block bg-gray-900 p-3 rounded mt-1 break-all text-green-300">
                      {verificationData.serverSeed}
                    </code>
                  </div>
                  
                  <div>
                    <label className="text-gray-300 text-sm">Client Seed:</label>
                    <code className="block bg-gray-900 p-3 rounded mt-1 break-all text-blue-300">
                      {verificationData.clientSeed}
                    </code>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-300 text-sm">Nonce:</label>
                      <div className="bg-gray-900 p-3 rounded mt-1 text-yellow-300 font-mono">
                        {verificationData.nonce}
                      </div>
                    </div>
                    <div>
                      <label className="text-gray-300 text-sm">Resultado:</label>
                      <div className="bg-gray-900 p-3 rounded mt-1 text-white font-mono">
                        {verificationData.result}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-gray-300 text-sm">Item Ganho:</label>
                    <div className="bg-gray-900 p-3 rounded mt-1 text-white">
                      {verificationData.wonItem?.name} ({verificationData.wonItem?.rarity})
                    </div>
                  </div>
                  
                  <div className="bg-green-900/30 border border-green-500 rounded-lg p-4">
                    <p className="text-green-300 font-medium">
                      ✅ Este resultado foi verificado e é válido
                    </p>
                    <p className="text-green-200 text-sm mt-1">
                      Você pode usar esses dados na aba "Verificar" para confirmar.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}