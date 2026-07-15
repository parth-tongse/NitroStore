import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, CornerDownLeft, Sparkles, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export const AIChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Hey! Main hoon NitroBot. ⚡ Aapko Nitro, Game Keys, ya GTA Prefabs ke baare me koi bhi sawaal poochna hai? Main aapki poori help karunga!',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, isOpen]);

  // Handle Quick Replies
  const handleQuickReply = (question: string) => {
    sendMessage(question);
  };

  // Submit Message to Server API Proxy
  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    // Create user message
    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      role: 'user',
      text: trimmed,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Map existing messages to history payload expected by Express backend
      const historyPayload = messages.map(m => ({
        role: m.role,
        text: m.text
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: trimmed,
          history: historyPayload
        })
      });

      if (!res.ok) {
        throw new Error('API server returned error');
      }

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: Math.random().toString(36).substring(7),
        role: 'model',
        text: data.text || 'Maaf kijiye, main abhi respond nahi kar pa rha hu. Kripya thodi der baad koshish karein.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error("Failed to send message to AI assistant:", err);
      const errorMsg: ChatMessage = {
        id: 'error-' + Math.random().toString(36).substring(5),
        role: 'model',
        text: '⚠️ Network issue ke karan connection fail ho gaya. Kripya check karein ki aapka backend server run kar rha hai.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          id="chatbot-toggle-btn"
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 border border-indigo-400/20 cursor-pointer hover:scale-105 transition-all relative group"
        >
          {isOpen ? (
            <X size={22} className="transition-transform duration-300 rotate-90" />
          ) : (
            <>
              <MessageSquare size={22} className="transition-transform duration-300" />
              <span className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-950 rounded-full animate-ping"></span>
              <span className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-950 rounded-full"></span>
            </>
          )}
          
          {/* Tooltip on Hover */}
          <span className="absolute right-16 bg-slate-900 border border-slate-800 text-slate-200 text-[10px] font-bold px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-md">
            NitroBot AI Help 🤖
          </span>
        </button>
      </div>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="chatbot-panel"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] h-[480px] bg-slate-950/95 border border-slate-800/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-lg"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-slate-900 to-indigo-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Bot size={18} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-white tracking-tight flex items-center gap-1.5">
                    NitroBot Assist <Sparkles size={11} className="text-amber-400" />
                  </h3>
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full"></span>
                    <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">AI Support Online</span>
                  </div>
                </div>
              </div>
              <button
                id="chatbot-close-btn"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-850 rounded-lg cursor-pointer transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Chat Messages List */}
            <div className="flex-grow p-4 overflow-y-auto space-y-3.5 scrollbar-thin flex flex-col">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 max-w-[85%] ${
                    msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'
                  }`}
                >
                  <div className={`h-6 w-6 rounded-lg flex items-center justify-center shrink-0 ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' 
                      : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}>
                    {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                  </div>

                  <div className="space-y-1">
                    <div className={`px-3.5 py-2 rounded-2xl text-[11px] leading-relaxed font-semibold ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-slate-900 border border-slate-850 text-slate-200 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                    <span className={`block text-[8px] text-slate-500 font-medium ${
                      msg.role === 'user' ? 'text-right' : 'text-left'
                    }`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isLoading && (
                <div className="flex gap-2.5 max-w-[80%] self-start">
                  <div className="h-6 w-6 rounded-lg bg-slate-900 text-slate-400 border border-slate-800 flex items-center justify-center shrink-0">
                    <Bot size={12} />
                  </div>
                  <div className="px-3 py-2 bg-slate-900 border border-slate-850 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies Tray */}
            {messages.length < 5 && (
              <div className="px-4 pb-2.5 pt-1.5 border-t border-slate-900 space-y-1.5 bg-slate-950/40">
                <span className="text-[8px] text-slate-500 font-extrabold uppercase tracking-widest flex items-center gap-1">
                  <HelpCircle size={10} /> Suggested Questions:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => handleQuickReply('GTA Prefabs kaise buy karein?')}
                    className="px-2 py-1 text-[9px] font-bold bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white rounded-lg cursor-pointer transition-colors"
                  >
                    🚀 GTA Prefabs Buy Guideline
                  </button>
                  <button
                    onClick={() => handleQuickReply('Discord Nitro prices kya hain?')}
                    className="px-2 py-1 text-[9px] font-bold bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white rounded-lg cursor-pointer transition-colors"
                  >
                    💎 Nitro Price Details
                  </button>
                  <button
                    onClick={() => handleQuickReply('Utr submit ke baad keys kaise milegi?')}
                    className="px-2 py-1 text-[9px] font-bold bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white rounded-lg cursor-pointer transition-colors"
                  >
                    🔑 Verification Duration
                  </button>
                </div>
              </div>
            )}

            {/* Chat Input Footer */}
            <form onSubmit={handleFormSubmit} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
              <input
                id="chatbot-input"
                type="text"
                placeholder="Type your question..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-grow px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-[11px] font-semibold text-white focus:outline-none focus:border-indigo-600 shadow-inner"
              />
              <button
                id="chatbot-send-btn"
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="h-8 w-8 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white flex items-center justify-center cursor-pointer transition-colors shrink-0"
              >
                <Send size={13} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
