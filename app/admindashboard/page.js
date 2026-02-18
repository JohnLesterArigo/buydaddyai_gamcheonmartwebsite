'use client';

import { useState, useEffect } from 'react';
import Chatbot from '../components/chatbot';

export default function AdminDashboard() {
  // ---------------- DATA STATES ----------------
  const [menu, setMenu] = useState([]);
  const [qna, setQna] = useState([]);

  // MENU INPUT
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [available, setAvailable] = useState(0);

  // Q&A INPUT
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  // Import buffers
  const [menuImportText, setMenuImportText] = useState('');
  const [qaImportText, setQaImportText] = useState('');

  // ---------------- LOAD SAVED DATA ----------------
  useEffect(() => {
    const savedMenu = JSON.parse(localStorage.getItem('menu') || '[]');
    const savedQna = JSON.parse(localStorage.getItem('qna') || '[]');

    setMenu(savedMenu.length ? savedMenu : [
      { name: 'Samgyeopsal Set', price: '499', description: 'Pork belly set for grilling', available: 10 },
      { name: 'Kimbap', price: '120', description: 'Korean rice roll', available: 20 },
      { name: 'Tteokbokki', price: '180', description: 'Spicy rice cakes', available: 15 },
    ]);

    setQna(savedQna);
  }, []);

  // ---------------- SAVE DATA TO LOCALSTORAGE ----------------
  useEffect(() => { localStorage.setItem('menu', JSON.stringify(menu)); }, [menu]);
  useEffect(() => { localStorage.setItem('qna', JSON.stringify(qna)); }, [qna]);

  // ---------------- MENU FUNCTIONS ----------------
  function addItem() {
    if (!name || !price) return;
    setMenu(prev => [...prev, { name, price, description, available: Number(available) }]);
    setName(''); setPrice(''); setDescription(''); setAvailable(0);
  }

  function deleteItem(idx) {
    setMenu(prev => prev.filter((_, i) => i !== idx));
  }

  function incrementAvailable(idx) {
    setMenu(prev => {
      const updated = [...prev];
      updated[idx].available += 1;
      return updated;
    });
  }

  function decrementAvailable(idx) {
    setMenu(prev => {
      const updated = [...prev];
      updated[idx].available = Math.max(0, updated[idx].available - 1);
      return updated;
    });
  }

  // ---------------- Q&A FUNCTIONS ----------------
  function addQna() {
    if (!question || !answer) return;
    setQna(prev => [...prev, { question, answer }]);
    setQuestion(''); setAnswer('');
  }

  function deleteQna(idx) {
    setQna(prev => prev.filter((_, i) => i !== idx));
  }

  // ---------------- IMPORT FUNCTIONS ----------------
  function importMenu() {
    try {
      const parsed = JSON.parse(menuImportText);
      setMenu(parsed);
      alert('Menu imported!');
    } catch {
      alert('Invalid JSON for Menu');
    }
  }

  function importQna() {
    try {
      const parsed = JSON.parse(qaImportText);
      setQna(parsed);
      alert('Q&A imported!');
    } catch {
      alert('Invalid JSON for Q&A');
    }
  }

  // ---------------- EXPORT FUNCTIONS ----------------
  function copyToClipboard(data, label) {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    alert(`${label} copied to clipboard!`);
  }

  // ---------------- RENDER ----------------
  return (
    <main className="p-10 space-y-10 bg-gray-50 min-h-screen relative">
      <h1 className="text-3xl font-bold text-[#8A38F5]">Admin Dashboard</h1>

      {/* ---------- MENU EDITOR ---------- */}
      <section className="bg-white p-6 rounded-2xl shadow-md space-y-4">
        <h2 className="font-bold text-xl text-[#8A38F5]">Menu Editor</h2>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="border p-2 w-full rounded-lg" />
        <input placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} className="border p-2 w-full rounded-lg" />
        <input type="number" placeholder="Available" value={available} onChange={e => setAvailable(Number(e.target.value))} className="border p-2 w-full rounded-lg" />
        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="border p-2 w-full rounded-lg" />
        <button onClick={addItem} className="bg-[#8A38F5] text-white px-4 py-2 rounded-xl">Add Item</button>

        {menu.map((item, i) => (
          <div key={i} className="flex justify-between border-b py-2 items-center">
            <div className="flex gap-3 items-center">
              <span>{item.name} — ₱{item.price} (Available: {item.available})</span>
              <button onClick={() => incrementAvailable(i)} className="px-2 bg-green-200 rounded">+</button>
              <button onClick={() => decrementAvailable(i)} className="px-2 bg-red-200 rounded">-</button>
            </div>
            <button onClick={() => deleteItem(i)} className="text-red-500">Delete</button>
          </div>
        ))}
      </section>

      {/* ---------- Q&A EDITOR ---------- */}
      <section className="bg-white p-6 rounded-2xl shadow-md space-y-4">
        <h2 className="font-bold text-xl text-[#8A38F5]">Q&A Editor</h2>
        <input placeholder="Question" value={question} onChange={e => setQuestion(e.target.value)} className="border p-2 w-full rounded-lg" />
        <textarea placeholder="Answer" value={answer} onChange={e => setAnswer(e.target.value)} className="border p-2 w-full rounded-lg" />
        <button onClick={addQna} className="bg-[#8A38F5] text-white px-4 py-2 rounded-xl">Add Q&A</button>

        {qna.map((item, i) => (
          <div key={i} className="flex justify-between border-b py-2">
            <span>{item.question} — {item.answer}</span>
            <button onClick={() => deleteQna(i)} className="text-red-500">Delete</button>
          </div>
        ))}
      </section>

      {/* ---------- DATA MANAGEMENT ---------- */}
      <section className="bg-white p-6 rounded-2xl shadow-md space-y-4">
        <h2 className="font-bold text-xl text-[#8A38F5]">Data Management</h2>

        {/* Export Menu */}
        <div className="space-y-2">
          <h3 className="font-semibold">Export Menu</h3>
          <button onClick={() => copyToClipboard(menu, 'Menu')} className="bg-blue-500 text-white px-4 py-2 rounded-xl">Copy Menu JSON</button>
        </div>

        {/* Import Menu */}
        <div className="space-y-2">
          <h3 className="font-semibold">Import Menu</h3>
          <textarea value={menuImportText} onChange={e => setMenuImportText(e.target.value)} className="border p-2 w-full rounded-lg h-32" placeholder="Paste menu JSON" />
          <button onClick={importMenu} className="bg-green-500 text-white px-4 py-2 rounded-xl">Apply</button>
        </div>

        {/* Export Q&A */}
        <div className="space-y-2">
          <h3 className="font-semibold">Export Q&A</h3>
          <button onClick={() => copyToClipboard(qna, 'Q&A')} className="bg-blue-500 text-white px-4 py-2 rounded-xl">Copy Q&A JSON</button>
        </div>

        {/* Import Q&A */}
        <div className="space-y-2">
          <h3 className="font-semibold">Import Q&A</h3>
          <textarea value={qaImportText} onChange={e => setQaImportText(e.target.value)} className="border p-2 w-full rounded-lg h-32" placeholder="Paste Q&A JSON" />
          <button onClick={importQna} className="bg-green-500 text-white px-4 py-2 rounded-xl">Apply</button>
        </div>
      </section>

      {/* ---------- CHATBOT ---------- */}
      <Chatbot menu={menu} qna={qna} />
    </main>
  );
}
