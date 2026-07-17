import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Bot, Send, X, Sparkles } from 'lucide-react';
import { apiFetch } from '../api';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, isTyping, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    const text = message.trim();
    if (!text) return;

    setMessage('');

    // Add user message to local rendering
    setHistory((prev) => [...prev, { role: 'user', content: text }]);
    setIsTyping(true);

    try {
      const res = await apiFetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: text,
          history: history,
        }),
      });

      setIsTyping(false);
      if (res && res.response) {
        setHistory((prev) => [...prev, { role: 'model', content: res.response }]);
      } else {
        setHistory((prev) => [
          ...prev,
          { role: 'model', content: '⚠️ Something went wrong. Please try again.' },
        ]);
      }
    } catch (err) {
      setIsTyping(false);
      setHistory((prev) => [
        ...prev,
        { role: 'model', content: '⚠️ Connection error. Make sure your server is online.' },
      ]);
      console.error(err);
    }
  };

  // Helper to format basic Markdown bold/italic/newlines
  const formatText = (txt) => {
    let formatted = txt
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
    return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
  };

  return createPortal(
    <div className="chatbot-root" aria-live="polite">
      {/* Floating AI Chat Bubble Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`chatbot-fab ${isOpen ? 'chatbot-fab--open' : ''}`}
        style={{
          background: 'var(--accent)',
          color: 'var(--accent-foreground)',
        }}
        aria-label="Toggle AI Support Assistant"
        aria-expanded={isOpen}
      >
        <Bot size={22} className="chatbot-fab-icon" />
        <span
          className="chatbot-fab-badge"
          style={{
            background: 'var(--primary)',
            borderColor: 'var(--border)',
            color: 'var(--primary-foreground)',
          }}
        >
          <Sparkles size={11} />
        </span>
      </button>

      {/* Chat Window Container */}
      {isOpen && (
        <div
          className="chatbot-panel slide-in-bottom"
          style={{
            background: 'var(--card)',
            borderColor: 'var(--border)',
          }}
        >
          {/* Header */}
          <div 
            className="px-5 py-4.5 flex items-center justify-between border-b shadow-sm"
            style={{ 
              background: 'var(--primary)', 
              color: 'var(--primary-foreground)',
              borderColor: 'var(--border)' 
            }}
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <div className="flex items-center gap-1.5">
                <Bot size={16} />
                <span className="font-extrabold text-xs tracking-wider uppercase" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  ShopEasy AI Support
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:opacity-75 transition-opacity bg-transparent border-none cursor-pointer"
              style={{ color: 'var(--primary-foreground)' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Logs Area */}
          <div 
            className="flex-1 p-5 overflow-y-auto flex flex-col gap-4"
            style={{ background: 'var(--muted)' }}
          >
            <div 
              className="self-start max-w-[85%] border px-4 py-3 rounded-2xl rounded-bl-sm text-xs font-semibold leading-relaxed shadow-sm"
              style={{ 
                background: 'var(--card)', 
                borderColor: 'var(--border)', 
                color: 'var(--foreground)' 
              }}
            >
              Hello! I'm your ShopEasy AI support assistant. Ask me anything about our products, special discounts, or order status!
            </div>

            {history.map((msg, i) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={i}
                  className={`self-${isUser ? 'end' : 'start'} max-w-[85%] px-4 py-3 rounded-2xl text-xs font-semibold leading-relaxed shadow-sm border ${
                    isUser
                      ? 'rounded-br-sm border-transparent'
                      : 'rounded-bl-sm'
                  }`}
                  style={{
                    background: isUser ? 'var(--primary)' : 'var(--card)',
                    color: isUser ? 'var(--primary-foreground)' : 'var(--foreground)',
                    borderColor: isUser ? 'transparent' : 'var(--border)'
                  }}
                >
                  {formatText(msg.content)}
                </div>
              );
            })}

            {isTyping && (
              <div 
                className="self-start border px-4.5 py-3.5 rounded-2xl rounded-bl-sm flex items-center gap-1.5"
                style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-bounce bg-slate-400"></span>
                <span className="w-1.5 h-1.5 rounded-full animate-bounce bg-slate-400" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-1.5 h-1.5 rounded-full animate-bounce bg-slate-400" style={{ animationDelay: '0.4s' }}></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form 
            onSubmit={handleSend} 
            className="p-3.5 border-t flex gap-2.5 items-center"
            style={{ 
              background: 'var(--card)', 
              borderColor: 'var(--border)' 
            }}
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask AI support..."
              className="flex-1 input-field px-4.5 py-3 rounded-full text-xs font-semibold"
            />
            <button
              type="submit"
              className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white flex items-center justify-center cursor-pointer transition-all border-none btn-primary flex-shrink-0"
            >
              <Send size={13} />
            </button>
          </form>
        </div>
      )}
    </div>,
    document.body
  );
}

export default Chatbot;
