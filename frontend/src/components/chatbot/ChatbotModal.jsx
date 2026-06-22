import { useState, useRef, useEffect } from 'react';
import { HiPaperAirplane, HiChip, HiUser, HiX } from 'react-icons/hi';
import { askBot } from '../../services/chatbotApi';

const initialMessages = [
  { id: 1, from: 'bot', text: 'Halo! Saya asisten virtual BEM. Ada yang bisa saya bantu?' },
  { id: 2, from: 'bot', text: 'Saya bisa memberikan informasi tentang anggota kabinet, program kerja, dan jadwal rapat.' },
];

export default function ChatbotModal({ onClose }) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const question = input.trim();
    setMessages(prev => [...prev, { id: Date.now(), from: 'user', text: question }]);
    setInput('');
    setIsTyping(true);

    try {
      const result = await askBot(question);
      setMessages(prev => [...prev, { id: Date.now() + 1, from: 'bot', text: result.answer }]);
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        from: 'bot',
        text: 'Maaf, terjadi kesalahan. Silakan coba lagi.',
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-40 w-[380px] max-w-[calc(100vw-2rem)] bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300">
      <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-burgundy rounded-xl flex items-center justify-center">
            <HiChip className="text-white text-base" />
          </div>
          <div>
            <h3 className="text-slate-900 text-sm">Asisten BEM</h3>
            <p className="text-[11px] text-emerald-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block" />
              Online
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-gray-100 transition-colors">
          <HiX className="text-lg" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 min-h-[320px] max-h-[440px]">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-2.5 max-w-[85%] ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                msg.from === 'user' ? 'bg-burgundy text-white' : 'bg-gray-100 text-slate-500'
              }`}>
                {msg.from === 'user' ? <HiUser className="text-xs" /> : <HiChip className="text-xs" />}
              </div>
              <div className={`px-3.5 py-2.5 rounded-xl text-sm leading-relaxed ${
                msg.from === 'user'
                  ? 'bg-burgundy text-white rounded-tr-sm'
                  : 'bg-gray-100 text-slate-900 rounded-tl-sm'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-2.5 max-w-[85%]">
              <div className="w-7 h-7 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                <HiChip className="text-xs text-slate-500" />
              </div>
              <div className="px-4 py-3 bg-gray-100 rounded-xl rounded-tl-sm">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-2.5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ketik pesan..."
            className="flex-1 px-4 py-2.5 bg-gray-100 rounded-xl border-none outline-none text-sm text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-burgundy/20 transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2.5 bg-burgundy text-white rounded-xl hover:bg-burgundy-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <HiPaperAirplane className="text-lg rotate-90" />
          </button>
        </div>
      </form>
    </div>
  );
}
