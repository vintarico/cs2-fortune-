// components/CaseOpeningAnimation.js
// Animação de abertura de caixa com 3 segundos

import { useState, useEffect } from 'react';

export default function CaseOpeningAnimation({ isOpen, onComplete, wonItem }) {
  const [stage, setStage] = useState('idle'); // idle, spinning, reveal, complete
  const [items] = useState([
    { name: 'AK-47 | Redline', rarity: 'rare', color: '#eb4b4b' },
    { name: 'M4A4 | Asiimov', rarity: 'legendary', color: '#d32ce6' },
    { name: 'AWP | Dragon Lore', wonItem: true, rarity: 'mythical', color: '#ffd700' },
    { name: 'Glock-18 | Fade', rarity: 'rare', color: '#eb4b4b' },
    { name: 'Knife | Karambit', rarity: 'extraordinary', color: '#ff4500' },
  ]);

  useEffect(() => {
    if (!isOpen) {
      setStage('idle');
      return;
    }

    // Fase 1: Spinning (2s)
    setStage('spinning');
    setTimeout(() => {
      // Fase 2: Reveal (0.5s)
      setStage('reveal');
      setTimeout(() => {
        // Fase 3: Complete (0.5s)
        setStage('complete');
        setTimeout(() => {
          onComplete?.();
        }, 500);
      }, 500);
    }, 2000);
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
      <div className="relative w-full max-w-4xl px-4">
        {/* Container de rolagem */}
        <div className="relative h-48 overflow-hidden rounded-2xl border-4 border-purple-500 bg-gray-900 shadow-2xl">
          {/* Indicador central */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-yellow-400 to-transparent z-10 transform -translate-x-1/2"></div>
          <div className="absolute left-1/2 top-1/2 w-24 h-24 border-4 border-yellow-400 rounded-lg transform -translate-x-1/2 -translate-y-1/2 z-10 shadow-[0_0_30px_rgba(250,204,21,0.6)]"></div>

          {/* Items rolando */}
          <div
            className={`flex items-center h-full transition-transform ${
              stage === 'spinning' ? 'animate-case-spin' : ''
            } ${stage === 'reveal' ? 'animate-case-reveal' : ''}`}
            style={{
              transform: stage === 'complete' ? 'translateX(calc(50% - 240px))' : 'none'
            }}
          >
            {/* Repetir items para efeito de loop */}
            {[...items, ...items, ...items, ...items].map((item, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-40 h-40 mx-2 flex flex-col items-center justify-center rounded-xl p-4 transition-all"
                style={{
                  backgroundColor: `${item.color}22`,
                  borderColor: item.color,
                  borderWidth: '2px',
                  boxShadow: item.wonItem ? `0 0 40px ${item.color}` : 'none'
                }}
              >
                <div className="text-4xl mb-2">🎁</div>
                <p className="text-xs text-center font-semibold text-white">{item.name}</p>
                <span className="text-xs mt-1" style={{ color: item.color }}>
                  {item.rarity}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Texto de status */}
        <div className="text-center mt-8">
          {stage === 'spinning' && (
            <p className="text-2xl font-bold text-white animate-pulse">
              🎲 Abrindo caixa...
            </p>
          )}
          {stage === 'reveal' && (
            <p className="text-3xl font-bold text-yellow-400 animate-bounce">
              ✨ Revelando...
            </p>
          )}
          {stage === 'complete' && (
            <p className="text-4xl font-bold text-green-400">
              🎉 Parabéns!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
