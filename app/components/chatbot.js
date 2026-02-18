'use client';

import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      
      
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
         
          <div className="p-4 bg-gradient-to-r from-[#8A38F5] to-[#D91A9C] text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-bold">Gamcheon AI Support</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform">
              <X size={20} />
            </button>
          </div>

        
          <div className="h-80 p-4 bg-gray-50 overflow-y-auto text-sm">
            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm mb-4 max-w-[80%] border border-gray-100">
              <p className="text-gray-800">Annyeong! 👋 How can I help you find your favorite Korean snacks today?</p>
            </div>
          </div>

       
          <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
            <input 
              type="text" 
              placeholder="Ask me anything..." 
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8A38F5] transition-all"
            />
            <button className="p-2 bg-[#8A38F5] text-white rounded-full hover:scale-110 transition-transform">
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

    
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-gradient-to-r from-[#8A38F5] to-[#D91A9C] rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform active:scale-95 group"
      >
        {isOpen ? (
          <X size={32} />
        ) : (
          <>
            <MessageCircle size={32} />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-pink-500"></span>
            </span>
          </>
        )}
      </button>
    </div>
  );
}