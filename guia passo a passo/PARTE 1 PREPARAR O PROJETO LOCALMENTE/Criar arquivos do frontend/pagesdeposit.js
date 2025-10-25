import { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function Deposit() {
  const [amount, setAmount] = useState('');
  const [pixData, setPixData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGeneratePix = async () => {
    if (!amount || amount <= 0) {
      alert('Insira um valor válido');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payment/pix`,
        { amount: parseFloat(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setPixData(res.data);
    } catch (err) {
      alert('Erro ao gerar PIX: ' + err.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="p-10 max-w-2xl mx-auto">
        <div className="bg-gray-800 p-8 rounded-lg shadow-2xl border-2 border-primary">
          <h2 className="text-3xl font-bold mb-6 text-secondary">💳 Depositar via PIX</h2>
          
          {!pixData ? (
            <>
              <input 
                type="number" 
                placeholder="Valor (R$)" 
                className="w-full p-3 rounded bg-gray-700 border border-gray-600 mb-4 focus:border-secondary focus:outline-none" 
                value={amount} 
                onChange={e => setAmount(e.target.value)} 
              />
              
              <button 
                onClick={handleGeneratePix}
                disabled={loading}
                className="w-full bg-secondary text-primary px-6 py-3 rounded-lg font-bold hover:bg-cyan-400 transition disabled:opacity-50"
              >
                {loading ? 'Gerando...' : 'Gerar QR Code PIX'}
              </button>
            </>
          ) : (
            <div className="text-center">
              <p className="mb-4 text-xl">Escaneie o QR Code para pagar</p>
              <div className="bg-white p-4 inline-block rounded-lg mb-4">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${pixData.qr_code}`} alt="QR Code PIX" />
              </div>
              <p className="text-sm text-gray-400 break-all bg-gray-700 p-3 rounded">
                {pixData.qr_code}
              </p>
              <button 
                onClick={() => setPixData(null)}
                className="mt-4 bg-gray-600 px-6 py-2 rounded hover:bg-gray-700"
              >
                Novo Depósito
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
