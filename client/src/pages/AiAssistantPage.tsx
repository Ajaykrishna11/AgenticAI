import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, HelpCircle } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AiAssistantPage: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello ${user?.name || 'there'}! 👋 I am **SmartShelf Assistant**, your household inventory AI agent. Ask me anything about your stored products, expiry dates, or recipe usage ideas!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const quickPrompts = [
    'What is expiring soon?',
    'What should I cook first?',
    'How many medicines do I have?',
    'Show expired products.',
    'Which category has the most products?'
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await api.post('/chat', { message: query });
      if (res.data.success) {
        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: res.data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMsg]);
      }
    } catch {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: 'Sorry, I encountered an issue retrieving inventory details. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-140px)] flex flex-col glass-panel rounded-3xl border border-gray-800 overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 sm:p-5 border-b border-gray-800 bg-gray-900/80 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25">
          <Bot className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-bold text-base text-white flex items-center gap-2">
            SmartShelf Assistant <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">Agent Active</span>
          </h2>
          <p className="text-xs text-gray-400">Natural language inventory query agent</p>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-none shadow-lg'
                  : 'bg-gray-900/90 border border-gray-800 text-gray-200 rounded-bl-none'
              }`}
            >
              <div className="whitespace-pre-line">{m.text}</div>
              <span className="text-[10px] opacity-60 mt-1.5 block text-right">{m.timestamp}</span>
            </div>

            {m.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-gray-800 flex items-center justify-center text-gray-300 font-bold text-xs shrink-0 mt-0.5">
                {user?.name?.charAt(0) || 'U'}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-emerald-400 p-2">
            <Sparkles className="w-4 h-4 animate-spin" /> Thinking & inspecting inventory...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompt Chips */}
      <div className="p-3 border-t border-gray-800 bg-gray-950/60 overflow-x-auto flex items-center gap-2">
        <span className="text-[11px] font-semibold text-gray-400 shrink-0 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-emerald-400" /> Prompts:
        </span>
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => sendMessage(prompt)}
            className="text-xs px-3 py-1.5 rounded-full bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-emerald-400 border border-gray-800 whitespace-nowrap transition-all"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="p-3 bg-gray-900 border-t border-gray-800 flex gap-2">
        <input
          type="text"
          placeholder="Ask SmartShelf Assistant anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 glass-input rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-emerald-500/30 transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
