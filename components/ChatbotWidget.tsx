// components/ChatbotWidget.tsx
import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaUser, FaTimes, FaCommentDots } from 'react-icons/fa';

interface ChatbotWidgetProps {}

const API_URL = 'https://mentorapp-api-llm.onrender.com/api/chatbot';

const ChatbotWidget: React.FC<ChatbotWidgetProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ text: string; sender: string }[]>([
    {
      text: '¡Hola! Soy tu asistente en MentHIA. ¿En qué puedo ayudarte hoy? Puedo sugerirte servicios como asesorías, cursos, diagnósticos o el marketplace.',
      sender: 'assistant',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const currentChatInput = chatInput;
    const newMessage = { text: currentChatInput, sender: 'user' };
    setChatMessages((prev) => [...prev, newMessage]);
    setChatInput('');
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentChatInput,
          messages: chatMessages,
        }),
      });

      const data = await response.json();
      if (response.ok && data.reply) {
        setChatMessages((prev) => [
          ...prev,
          { text: data.reply, sender: 'assistant' },
        ]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          { text: 'Lo siento, hubo un error al procesar tu mensaje. Intenta con algo diferente.', sender: 'assistant' },
        ]);
      }
    } catch (error) {
      setChatMessages((prev) => [
        ...prev,
        { text: 'Error al conectar con el chatbot. Intenta de nuevo más tarde.', sender: 'assistant' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #70B5E2;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #37B6FF;
        }
        .menthia-gradient-bg {
          background: linear-gradient(135deg, #293A49 0%, #37B6FF 100%);
        }
      `}</style>

      {/* Botón flotante */}
      <button
        className="fixed bottom-6 right-6 text-white p-4 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 z-50 focus:outline-none focus:ring-4 focus:ring-opacity-75"
        style={{ 
          background: 'linear-gradient(135deg, #293A49 0%, #37B6FF 100%)',
          boxShadow: '0 4px 12px rgba(55, 182, 255, 0.4)'
        }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Cerrar Chat" : "Abrir Chat"}
      >
        {isOpen ? <FaTimes size={24} /> : <FaCommentDots size={24} />}
      </button>

      {/* Widget */}
      <div
        className={`fixed bottom-20 right-6 w-80 h-[450px] bg-white rounded-lg shadow-2xl flex flex-col transition-all duration-300 ease-in-out z-50
          ${isOpen ? 'translate-y-0 opacity-100 visible' : 'translate-y-10 opacity-0 invisible'}`}
        style={{ 
          border: '2px solid #70B5E2',
          boxShadow: '0 10px 25px rgba(55, 182, 255, 0.3)'
        }}
      >
        {/* Header */}
        <div className="text-white p-4 rounded-t-lg flex items-center justify-between menthia-gradient-bg">
          <h3 className="text-lg font-semibold flex items-center">
            <FaRobot className="mr-2" /> MentHIA, tu Asistente
          </h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-gray-200 focus:outline-none transition-colors"
            aria-label="Cerrar Chat"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Área de mensajes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 custom-scrollbar">
          {chatMessages.map((message, index) => (
            <div
              key={index}
              className={`flex items-end ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'assistant' && (
                <FaRobot className="text-xl mr-2 flex-shrink-0" style={{ color: '#37B6FF' }} />
              )}
              <span
                className={`inline-block p-3 rounded-lg max-w-[80%] break-words shadow-sm text-sm
                  ${
                    message.sender === 'user'
                      ? 'text-white rounded-br-none'
                      : 'bg-white rounded-bl-none'
                  }`}
                style={
                  message.sender === 'user'
                    ? { 
                        background: 'linear-gradient(135deg, #37B6FF 0%, #70B5E2 100%)',
                        border: '1px solid #70B5E2'
                      }
                    : { 
                        color: '#293A49',
                        border: '1px solid #E5E7EB'
                      }
                }
              >
                {message.text}
              </span>
              {message.sender === 'user' && (
                <FaUser className="text-xl ml-2 flex-shrink-0" style={{ color: '#293A49' }} />
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start items-center">
              <FaRobot className="text-xl mr-2" style={{ color: '#37B6FF' }} />
              <span className="inline-block p-3 rounded-lg rounded-bl-none bg-white shadow-sm text-sm border"
                style={{ color: '#293A49', borderColor: '#E5E7EB' }}>
                Escribiendo<span className="animate-pulse">...</span>
              </span>
            </div>
          )}
          <div ref={chatMessagesEndRef} />
        </div>

        {/* Formulario */}
        <form onSubmit={handleChatSubmit} className="p-4 border-t bg-white rounded-b-lg" style={{ borderColor: '#E5E7EB' }}>
          <div className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 text-sm transition-all"
              style={{ 
                borderColor: '#70B5E2',
                color: '#293A49'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#37B6FF';
                e.target.style.boxShadow = '0 0 0 3px rgba(55, 182, 255, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#70B5E2';
                e.target.style.boxShadow = 'none';
              }}
              placeholder={isLoading ? "Escribiendo..." : "¿En qué puedo ayudarte?"}
              disabled={isLoading}
            />
            <button
              type="submit"
              className="text-white px-4 py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold hover:shadow-lg"
              style={{ 
                background: isLoading || !chatInput.trim() 
                  ? '#9CA3AF' 
                  : 'linear-gradient(135deg, #37B6FF 0%, #70B5E2 100%)'
              }}
              disabled={isLoading || !chatInput.trim()}
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ChatbotWidget;