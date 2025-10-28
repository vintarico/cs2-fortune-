// components/AIAssistant.js
// Componente de Chat AI para CS2 Fortune

import { useState, useEffect, useRef } from 'react';
import { useAI } from '../hooks/useAI';

export default function AIAssistant({ context = 'general', caseId = null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const messagesEndRef = useRef(null);

  const {
    loading,
    error,
    quota,
    sendChatMessage,
    analyzeCase,
    hasQuota,
    quotaPercentage,
  } = useAI();

  // Auto-scroll para última mensagem
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mensagem inicial baseada no contexto
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessages = {
        general: '👋 Olá! Sou seu assistente AI. Como posso ajudar?',
        cases: '🎲 Quer analisar as probabilidades deste case? Posso te ajudar!',
        deposit: '💰 Precisa de ajuda com depósitos? Estou aqui!',
        withdraw: '🏦 Vou te ajudar com a retirada. O que precisa saber?',
      };

      setMessages([
        {
          role: 'assistant',
          content: welcomeMessages[context] || welcomeMessages.general,
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, context, messages.length]);

  // Analisar case automaticamente se caseId fornecido
  const handleAnalyzeCase = async () => {
    if (!caseId || isAnalyzing) return;

    setIsAnalyzing(true);
    try {
      const result = await analyzeCase(caseId);

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: result.analysis || 'Análise concluída!',
          data: result,
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `❌ Erro ao analisar: ${err.message}`,
          timestamp: new Date(),
          error: true,
        },
      ]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Enviar mensagem de chat
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');

    try {
      // Converter mensagens para formato esperado pela API
      const conversationHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const result = await sendChatMessage(inputMessage, conversationHistory);

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: result.message || result.response,
          timestamp: new Date(),
          tokensUsed: result.tokensUsed,
          cost: result.cost,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `❌ ${err.message}`,
          timestamp: new Date(),
          error: true,
        },
      ]);
    }
  };

  // Limpar conversa
  const handleClearChat = () => {
    setMessages([]);
  };

  if (!hasQuota && isOpen) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg max-w-sm">
        <p className="font-semibold">⚠️ Quota Esgotada</p>
        <p className="text-sm mt-2">
          Você atingiu seu limite mensal de tokens AI. Upgrade seu plano para
          continuar usando!
        </p>
        <button
          onClick={() => setIsOpen(false)}
          className="mt-3 px-4 py-2 bg-white text-red-500 rounded hover:bg-gray-100"
        >
          Fechar
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Botão flutuante */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50"
          aria-label="Abrir Assistente AI"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          {quota && (
            <span className="absolute -top-1 -right-1 bg-green-500 text-xs px-1.5 py-0.5 rounded-full">
              {quotaPercentage}%
            </span>
          )}
        </button>
      )}

      {/* Janela do chat */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-gray-900 rounded-lg shadow-2xl flex flex-col z-50 border border-purple-500">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-t-lg flex justify-between items-center">
            <div>
              <h3 className="text-white font-bold">🤖 AI Assistant</h3>
              {quota && (
                <p className="text-xs text-purple-200">
                  {quota.remaining.toLocaleString()} /{' '}
                  {quota.limit.toLocaleString()} tokens
                </p>
              )}
            </div>
            <div className="flex gap-2">
              {caseId && (
                <button
                  onClick={handleAnalyzeCase}
                  disabled={isAnalyzing}
                  className="text-white hover:bg-purple-700 p-2 rounded transition"
                  title="Analisar Case"
                >
                  📊
                </button>
              )}
              <button
                onClick={handleClearChat}
                className="text-white hover:bg-purple-700 p-2 rounded transition"
                title="Limpar Chat"
              >
                🗑️
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-purple-700 p-2 rounded transition"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Mensagens */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-800">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.role === 'user'
                      ? 'bg-purple-600 text-white'
                      : msg.error
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-700 text-gray-100'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  {msg.tokensUsed && (
                    <p className="text-xs opacity-70 mt-1">
                      {msg.tokensUsed} tokens · ${msg.cost?.toFixed(4)}
                    </p>
                  )}
                  <p className="text-xs opacity-50 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                      style={{ animationDelay: '0.4s' }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 bg-gray-900">
            {error && (
              <p className="text-red-400 text-xs mb-2">⚠️ {error}</p>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                disabled={loading || !hasQuota}
                className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || !inputMessage.trim() || !hasQuota}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? '...' : '📤'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
