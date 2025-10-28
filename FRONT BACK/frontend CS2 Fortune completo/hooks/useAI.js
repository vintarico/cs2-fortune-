// hooks/useAI.js
// Hook para integração com endpoints de IA do backend

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function useAI() {
  const [models, setModels] = useState([]);
  const [quota, setQuota] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obter token do localStorage
  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  // Headers com autenticação
  const getHeaders = () => ({
    Authorization: `Bearer ${getToken()}`,
    'Content-Type': 'application/json',
  });

  // Buscar modelos disponíveis
  const fetchModels = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/api/ai/models`, {
        headers: getHeaders(),
      });
      setModels(response.data.models || []);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao buscar modelos');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar quota do usuário
  const fetchQuota = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/api/ai/quota`, {
        headers: getHeaders(),
      });
      setQuota(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao buscar quota');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Enviar mensagem para chat AI
  const sendChatMessage = async (message, conversationHistory = []) => {
    try {
      setLoading(true);
      setError(null);

      const messages = [
        ...conversationHistory,
        { role: 'user', content: message },
      ];

      const response = await axios.post(
        `${API_URL}/api/ai/chat`,
        { messages },
        { headers: getHeaders() }
      );

      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Erro ao enviar mensagem';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Analisar case (probabilidades)
  const analyzeCase = async (caseId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        `${API_URL}/api/ai/analyze-case`,
        { caseId },
        { headers: getHeaders() }
      );

      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Erro ao analisar case';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados iniciais
  useEffect(() => {
    const token = getToken();
    if (token) {
      fetchQuota().catch(() => {
        // Silenciar erro inicial se não autenticado
      });
    }
  }, [fetchQuota]);

  return {
    // Estado
    models,
    quota,
    loading,
    error,

    // Métodos
    fetchModels,
    fetchQuota,
    sendChatMessage,
    analyzeCase,

    // Helpers
    hasQuota: quota && quota.remaining > 0,
    quotaPercentage: quota
      ? ((quota.remaining / quota.limit) * 100).toFixed(0)
      : 0,
  };
}

// Hook para admin (estatísticas de uso)
export function useAIAdmin() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  const getHeaders = () => ({
    Authorization: `Bearer ${getToken()}`,
    'Content-Type': 'application/json',
  });

  // Buscar estatísticas de uso
  const fetchUsageStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `${API_URL}/api/ai/admin/usage-stats`,
        { headers: getHeaders() }
      );
      setStats(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao buscar estatísticas');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Habilitar GPT-5 globalmente ou para usuários específicos
  const enableGPT5 = async (userIds = null) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(
        `${API_URL}/api/ai/admin/enable-gpt5`,
        { userIds },
        { headers: getHeaders() }
      );
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Erro ao habilitar GPT-5';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    loading,
    error,
    fetchUsageStats,
    enableGPT5,
  };
}

export default useAI;
