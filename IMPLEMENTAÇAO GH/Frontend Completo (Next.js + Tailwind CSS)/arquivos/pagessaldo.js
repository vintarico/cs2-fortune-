import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function Saldo() {
  const [saldo, setSaldo] = useState(null);

  useEffect(() => {
    const fetchSaldo = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/saldo`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSaldo(res.data.saldo);
      } catch {
        setSaldo('Erro ao carregar saldo');
      }
    };
    fetchSaldo();
  }, []);

  return (
    <>
      <Navbar />
      <main className="p-10 text-center">
        <h1 className="text-3xl">Seu saldo atual</h1>
        <p className="mt-4 text-2xl">{saldo !== null ? saldo : 'Carregando...'}</p>
      </main>
    </>
  );
}
