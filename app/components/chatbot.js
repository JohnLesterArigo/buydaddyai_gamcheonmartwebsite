'use client'
import { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'
import { createOrderAction } from '../actions/orders'

let isProcessingOrder = false;

export default function Chatbot({ menu = [], qna = [] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Annyeong! 👋 How can I help you today?' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const messagesEndRef = useRef(null)
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  useEffect(scrollToBottom, [messages])

  // ✅ Automatically load confetti library
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js";
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  function triggerConfetti() {
    if (window.confetti) {
      window.confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8A38F5', '#D91A9C', '#FFFFFF']
      });
    }
  }

  async function sendMessage() {
  if (!input || loading) return;

  const userMessage = { role: 'user', content: input };
  setMessages(prev => [...prev, userMessage]);
  setInput('');
  setLoading(true);

  try {
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: messages.concat(userMessage).map(m => ({
          role: m.role,
          content: m.content
        })),
        menu: menu 
      }),
    });

    const data = await res.json();
    let botReply = data.text || 'Annyeong! I am having trouble checking our shelves right now.';

    // 1. Check if the AI sent an Order Signal
    if (botReply.includes('{') && (botReply.includes('customer_name') || botReply.includes('items'))) {
      const startIndex = botReply.indexOf('{');
      const lastIndex = botReply.lastIndexOf('}'); 
      
      if (startIndex !== -1 && lastIndex !== -1) {
        let signalPart = botReply.substring(startIndex, lastIndex + 1).trim();

        try {
          const orderInfo = JSON.parse(signalPart);
          
          // 2. Call the server action
         const result = await createOrderAction({
  customer_name: orderInfo.customer_name,
  address: orderInfo.address,
  payment_method: orderInfo.payment_method,
  
  // 🛡️ Safety: Ensure items is an array so the stock loop doesn't crash
  items: Array.isArray(orderInfo.items) ? orderInfo.items : JSON.parse(orderInfo.items || '[]'),
  
  total_price: orderInfo.total_price || orderInfo.total,
  
  // 🚀 FIXING THE NULL BUG:
  user_email: localStorage.getItem('userEmail') || 'Guest',
  phone_number: localStorage.getItem('userPhone') || 'No Number', //
  user_role: localStorage.getItem('userRole') || 'user'           //
});

          // 3. Handle "Delayed Success" to show confetti
          if (result.success || result.isDelayed) {
            if (typeof window !== 'undefined' && window.confetti) {
              window.confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
            }
            localStorage.setItem('hasRecentOrder', 'true');
            if (typeof setHasOrdered === 'function') setHasOrdered(true);
            
            botReply = "Annyeong! Your order has been placed! 🎊 Check 'Track My Orders'.";
          }
        } catch (e) {
          console.error("Signal parsing failed, order might not have processed.");
        } finally {
          // Clean the code out of the chat bubble
          botReply = botReply.replace(/\[ORDER_SIGNAL:[\s\S]*?\]|\{[\s\S]*?\}|\*\*ORDER SIGNAL:\*\*|\*\*/g, '').trim();
        }
      }
    }

    setMessages(prev => [...prev, { role: 'assistant', content: botReply }]);

  } catch (err) {
    console.error('Chatbot error:', err);
  } finally {
    setLoading(false);
  }
}

  async function handleAutoOrder(orderInfo) {
    if (isProcessingOrder) return;

    try {
      isProcessingOrder = true;

      const rawItems = orderInfo.items || orderInfo.order || [];
      const itemsWithData = rawItems.map(item => {
        const menuItem = menu.find(m => Number(m.id) === Number(item.id));
        return {
          id: item.id,
          name: item.name || menuItem?.name || "Item",
          price: item.price || menuItem?.price || 0,
          quantity: item.quantity || 1
        };
      });

      const finalTotal = itemsWithData.reduce((sum, i) => sum + (i.price * i.quantity), 0);

      const orderData = {
  customer_name: orderInfo.customer_name || "Guest User",
  address: orderInfo.address || "No Address Provided",
  payment_method: orderInfo.payment_method || "Cash on Delivery",
  items: itemsWithData, // Pass the array directly if createOrderAction stringifies it
  total_price: finalTotal,
  status: 'Pending',
  // 🚀 Added these here too
  user_email: localStorage.getItem('userEmail') || 'Guest',
  phone_number: localStorage.getItem('userPhone') || 'No Number',
  user_role: localStorage.getItem('userRole') || 'user'
};

      const result = await createOrderAction(orderData);
      
      if (result.success) {
        localStorage.setItem('hasRecentOrder', 'true');
        window.dispatchEvent(new Event('storage'));
        
        // 🎊 Trigger Confetti!
        triggerConfetti(); 

        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `✅ Order confirmed for ${orderData.customer_name}! You can track it now in the Shop page.` 
        }]);
      }
    } catch (error) {
      console.error("Neon Save Error:", error);
    } finally {
      setTimeout(() => { isProcessingOrder = false; }, 3000);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end z-[9999]">
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 max-h-[70vh] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-[#8A38F5] to-[#D91A9C] text-white flex justify-between items-center">
             <div className="flex flex-col">
                 <span className="font-bold text-sm leading-tight">
                  Gamcheon mart </span>
                 <span className="text-[10px] opacity-80 font-medium">
                 Your AI Daddy Support.</span> </div>
                 <button onClick={() => setIsOpen(false)}>
                 <X size={20} />
                 </button>
                 </div>
          <div className="chat-scroll flex-1 h-80 p-4 bg-gray-50 overflow-y-scroll text-sm space-y-2">
            {messages.map((msg, i) => (
              <div key={i} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
                <div className={`inline-block px-3 py-2 rounded-xl max-w-[80%] ${
                  msg.role === 'user' ? 'bg-[#8A38F5] text-white' : 'bg-white border border-gray-100 text-gray-800'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && <p className="text-gray-400 text-xs italic px-2">Daddy is Replying...</p>}
            <div ref={messagesEndRef}></div>
          </div>

          <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Order here or ask a question..."
              disabled={loading}
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8A38F5]"
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage} disabled={loading} className="p-2 bg-[#8A38F5] text-white rounded-full">
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-gradient-to-r from-[#8A38F5] to-[#D91A9C] rounded-full shadow-lg flex items-center justify-center text-white"
      >
        {isOpen ? <X size={32} /> : <MessageCircle size={32} />}
      </button>

      <style jsx global>{`
        .chat-scroll { scrollbar-width: thin; scrollbar-color: #e5e7eb transparent; }
      `}</style>
    </div>
  )
}