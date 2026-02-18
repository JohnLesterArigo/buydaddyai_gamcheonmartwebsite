'use client'
import { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'

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

  // Send message to API
  async function sendMessage() {
    if (!input) return
    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const systemPrompt = `
You are a friendly Korean mart assistant.
Answer naturally using the menu and Q&A provided.
Include availability numbers.
Never say "I don't know"; give the best answer possible.
Menu:
${menu.map(i => `${i.name}: ₱${i.price}, ${i.description}, ${i.available} available`).join('\n')}
Q&A:
${qna.map(q => `Q: ${q.question} A: ${q.answer}`).join('\n')}
`

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: '@cf/meta/llama-3-8b-instruct',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: input },
          ],
        }),
      })

      const data = await res.json()
      const botReply = data.result?.response || 'Sorry, AI did not return a response.'
      setMessages(prev => [...prev, { role: 'assistant', content: botReply }])
    } catch (err) {
      console.error('Chatbot error:', err)
      setMessages(prev => [...prev, { role: 'assistant', content: 'AI request failed 😢' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end z-[9999]">
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden">
          {/* HEADER */}
          <div className="p-4 bg-gradient-to-r from-[#8A38F5] to-[#D91A9C] text-white flex justify-between items-center">
            <span className="font-bold">Gamcheon AI Support</span>
            <button onClick={() => setIsOpen(false)}><X size={20} /></button>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 h-80 p-4 bg-gray-50 overflow-y-auto text-sm space-y-2">
            {messages.map((msg, i) => (
              <div key={i} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
                <div className={`inline-block px-3 py-2 rounded-xl max-w-[80%] ${
                  msg.role === 'user' ? 'bg-[#8A38F5] text-white' : 'bg-white border border-gray-100 text-gray-800'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && <p className="text-gray-500 italic">AI is typing...</p>}
            <div ref={messagesEndRef}></div>
          </div>

          {/* INPUT */}
          <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8A38F5]"
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage} className="p-2 bg-[#8A38F5] text-white rounded-full">
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {/* TOGGLE BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-gradient-to-r from-[#8A38F5] to-[#D91A9C] rounded-full shadow-lg flex items-center justify-center text-white"
      >
        {isOpen ? <X size={32} /> : <MessageCircle size={32} />}
      </button>
    </div>
  )
}
