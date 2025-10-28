// Hook para buscar preços das skins em uma caixa
import { useState, useEffect } from 'react';
import { getSteamMarketName } from '../data/skinNameMapper';

export function useCasePrices(caseItems) {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!caseItems || caseItems.length === 0) return;

    const fetchPrices = async () => {
      setLoading(true);
      const priceMap = {};

      for (const item of caseItems) {
        try {
          // Converter nome para formato Steam Market
          const steamName = getSteamMarketName(item.name);
          
          console.log(`🔍 Buscando: ${item.name} → ${steamName}`);
          
          const response = await fetch(
            `http://localhost:3001/api/steam/price?name=${encodeURIComponent(steamName)}`
          );
          
          if (response.ok) {
            const data = await response.json();
            if (data.brl > 0) {
              priceMap[item.name] = data;
              console.log(`✅ ${steamName}: R$ ${data.brl.toFixed(2)}`);
            } else {
              // Fallback para valor original
              priceMap[item.name] = {
                brl: item.value,
                formatted_brl: `R$ ${item.value.toFixed(2)}`,
                from_fallback: true
              };
              console.log(`⚠️ ${steamName}: Usando valor padrão R$ ${item.value.toFixed(2)}`);
            }
          } else {
            // Fallback para valor original
            priceMap[item.name] = {
              brl: item.value,
              formatted_brl: `R$ ${item.value.toFixed(2)}`,
              from_fallback: true
            };
          }
        } catch (error) {
          console.error(`❌ Erro ao buscar preço de ${item.name}:`, error);
          priceMap[item.name] = {
            brl: item.value,
            formatted_brl: `R$ ${item.value.toFixed(2)}`,
            error: true
          };
        }

        // Pequeno delay entre requisições
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      setPrices(priceMap);
      setLoading(false);
      console.log(`📊 Preços carregados:`, priceMap);
    };

    fetchPrices();
  }, [caseItems]);

  return { prices, loading };
}

export default useCasePrices;
