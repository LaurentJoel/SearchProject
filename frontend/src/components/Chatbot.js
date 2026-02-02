// src/components/Chatbot.js - FIXED with Robot icon and better dimensions
import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Minimize2, Bot, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import enTranslations from '../translations/en.json';
import frTranslations from '../translations/fr.json';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  const { isFrench } = useLanguage();
  const translations = isFrench ? frTranslations : enTranslations;

  useEffect(() => {
    if (!sessionId) {
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setSessionId(newSessionId);
      
      const welcomeMessage = {
        id: Date.now(),
        text: translations.chatbot.welcome,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([welcomeMessage]);
    }
  }, [isFrench, sessionId, translations.chatbot.welcome]);

  useEffect(() => {
    if (messagesEndRef.current && isOpen && !isMinimized) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMsg = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: inputMessage,
          session_id: sessionId,
          language: isFrench ? 'fr' : 'en'
        })
      });

      let botResponse;
      if (response.ok) {
        const data = await response.json();
        botResponse = data.response;
      } else {
        botResponse = translations.chatbot.errorTechnical;
      }

      const botMsg = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      const botMsg = {
        id: Date.now() + 1,
        text: translations.chatbot.errorConnection,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 group"
        aria-label={translations.chatbot.title}
      >
        <div className="relative">
          {/* Pulse animation */}
          <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
          
          {/* Main button with ROBOT ICON */}
          <div className="relative bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-4 rounded-full shadow-2xl hover:shadow-emerald-500/50 hover:scale-110 active:scale-95 transition-all duration-300">
            <Bot className="h-6 w-6" />
          </div>
          
          {/* Badge */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
        </div>
      </button>
    );
  }

  return (
    <div className={`fixed z-50 transition-all duration-300 ${
      isMinimized 
        ? 'bottom-6 right-6' 
        : 'bottom-6 right-6 w-[380px] h-[550px]'
    }`}>
      <div className={`bg-white rounded-2xl shadow-2xl border border-emerald-100 flex flex-col h-full overflow-hidden ${
        isMinimized ? 'w-16 h-16' : 'w-full h-full'
      }`}>
        
        {!isMinimized && (
          <>
            {/* Header with ROBOT ICON */}
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-4 rounded-t-2xl flex items-center justify-between shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">{translations.chatbot.title}</h3>
                  <p className="text-emerald-100 text-xs flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    {translations.chatbot.online}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-2 rounded-full hover:bg-emerald-600 transition-colors"
                  title={translations.chatbot.minimize}
                  aria-label={translations.chatbot.minimize}
                >
                  <Minimize2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-emerald-600 transition-colors"
                  title={translations.chatbot.close}
                  aria-label={translations.chatbot.close}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-white to-emerald-50 scroll-container">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-md ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-tr-none'
                      : 'bg-white text-gray-800 border border-emerald-100 rounded-tl-none'
                  }`}>
                    <div className="prose prose-sm max-w-none">
                      {message.text.split('\n').map((line, i) => (
                        <p key={i} className={`${i > 0 ? 'mt-2' : ''} ${message.sender === 'user' ? 'text-white' : 'text-gray-800'} text-sm`}>
                          {line}
                        </p>
                      ))}
                    </div>
                    <div className={`text-xs mt-2 ${message.sender === 'user' ? 'text-emerald-100' : 'text-gray-500'}`}>
                      {message.timestamp}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-white border border-emerald-100 rounded-2xl px-4 py-3 rounded-tl-none shadow-md">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 text-emerald-500 animate-spin" />
                      <span className="text-sm text-emerald-600">
                        {translations.chatbot.thinking}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-emerald-100 bg-white rounded-b-2xl">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={translations.chatbot.typeMessage}
                  className="flex-1 px-4 py-2.5 border-2 border-emerald-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition-all"
                  disabled={isLoading}
                  aria-label={translations.chatbot.typeMessage}
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-2.5 rounded-full hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg hover:shadow-emerald-500/50"
                  aria-label={translations.chatbot.send}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </div>
              
              {/* Quick actions */}
              <div className="mt-3 flex gap-2 flex-wrap">
                {[
                  translations.chatbot.quickActions.features,
                  translations.chatbot.quickActions.security,
                  translations.chatbot.quickActions.support
                ].map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInputMessage(action)}
                    className="px-3 py-1.5 text-xs bg-emerald-50 text-emerald-700 rounded-full hover:bg-emerald-100 transition-colors border border-emerald-200"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {isMinimized && (
          <button
            onClick={() => setIsMinimized(false)}
            className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl hover:scale-110 transition-transform shadow-2xl"
            aria-label={translations.chatbot.title}
          >
            <Bot className="h-6 w-6" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Chatbot;