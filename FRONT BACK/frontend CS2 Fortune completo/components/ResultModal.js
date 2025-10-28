// components/ResultModal.js
// Modal de resultado com confete

import { useEffect, useState } from 'react';

export default function ResultModal({ isOpen, onClose, item }) {
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    if (!isOpen) return;

    // Gerar confete
    const confettiPieces = [];
    for (let i = 0; i < 50; i++) {
      confettiPieces.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
        color: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'][
          Math.floor(Math.random() * 6)
        ],
      });
    }
    setConfetti(confettiPieces);

    // Limpar confete após 4 segundos
    const timeout = setTimeout(() => {
      setConfetti([]);
    }, 4000);

    return () => clearTimeout(timeout);
  }, [isOpen]);

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm">
      {/* Confete */}
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-3 h-3 rounded-full animate-confetti"
          style={{
            left: `${piece.left}%`,
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
          }}
        />
      ))}

      {/* Modal */}
      <div className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 rounded-3xl p-8 max-w-md w-full mx-4 border-4 border-purple-500 shadow-[0_0_60px_rgba(168,85,247,0.6)] animate-modal-appear">
        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-red-400 text-2xl transition"
        >
          ✕
        </button>

        {/* Título */}
        <h2 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent animate-gradient-x">
          🎉 Você Ganhou! 🎉
        </h2>

        {/* Item */}
        <div className="bg-gradient-to-br from-purple-800 to-pink-800 rounded-2xl p-6 mb-6 border-2 border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.4)]">
          <div className="text-center">
            <div className="text-8xl mb-4 animate-bounce-slow">🎁</div>
            <h3 className="text-2xl font-bold text-white mb-2">{item.name}</h3>
            <p className="text-yellow-400 font-semibold text-lg mb-2">{item.rarity}</p>
            <p className="text-3xl font-bold text-green-400">${item.value}</p>
          </div>
        </div>

        {/* Ações */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition transform hover:scale-105 shadow-[0_0_20px_rgba(168,85,247,0.5)]"
          >
            ✨ Ver Inventário
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition transform hover:scale-105 shadow-[0_0_20px_rgba(16,185,129,0.5)]"
          >
            🔄 Abrir Outra
          </button>
        </div>
      </div>
    </div>
  );
}
