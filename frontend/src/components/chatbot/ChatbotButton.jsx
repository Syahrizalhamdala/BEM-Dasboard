import { useState } from 'react';
import { HiChatAlt2, HiX } from 'react-icons/hi';
import ChatbotModal from './ChatbotModal';

export default function ChatbotButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-burgundy hover:bg-burgundy-dark text-white rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
      >
        {isOpen ? <HiX className="text-2xl" /> : <HiChatAlt2 className="text-2xl" />}
      </button>
      {isOpen && <ChatbotModal onClose={() => setIsOpen(false)} />}
    </>
  );
}
