import { useState, useRef, useEffect } from 'react';
import { HiPaperAirplane, HiChip, HiUser } from 'react-icons/hi';
import { Card } from '../../components/ui';
import { askBot } from '../../services/chatbotApi';

const initialMessages = [
  { id: 1, from: 'bot', text: 'Halo! Saya adalah asisten virtual BEM. Ada yang bisa saya bantu?' },
  { id: 2, from: 'bot', text: 'Saya bisa membantu Anda dengan:\n• Informasi anggota kabinet\n• Program kerja\n• Jadwal rapat' },
];

export default function Chatbot() {
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
    <div className="space-y-[14px] animate-fade-in">
      <div className="mb-6">
        <h1 className="text-[15px] font-medium text-slate-900">Chatbot BEM</h1>
        <p className="text-sm text-slate-600 mt-1">Asisten virtual untuk informasi organisasi</p>
      </div>

      <Card padding={false} className="flex flex-col h-[600px]">
        <div className="px-5 lg:px-6 py-4 border-b border-gray-200 flex items-center gap-3">
          <div className="w-10 h-10 bg-burgundy rounded-xl flex items-center justify-center">
            <HiChip className="text-white text-lg" />
          </div>
          <div>
            <h3 className="text-slate-900 text-sm">Asisten BEM</h3>
            <p className="text-xs text-emerald-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block" />
              Online
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 lg:p-6 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-[80%] ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  msg.from === 'user' ? 'bg-burgundy text-white' : 'bg-gray-100 text-slate-500'
                }`}>
                  {msg.from === 'user' ? <HiUser className="text-sm" /> : <HiChip className="text-sm" />}
                </div>
                <div className={`px-4 py-2.5 rounded-xl text-sm leading-relaxed ${
                  msg.from === 'user'
                    ? 'bg-burgundy text-white rounded-tr-sm'
                    : 'bg-gray-100 text-slate-900 rounded-tl-sm'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                  <HiChip className="text-sm text-slate-500" />
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

        <form onSubmit={handleSend} className="px-5 lg:px-6 py-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
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
      </Card>
    </div>
  );
}
