'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Chatbot from '../components/chatbot';
import NavbarforAdmin from '../components/NavbarforAdmin';

export default function admindashboard() {
  const router = useRouter();
  
  // --- States ---
  const [menu, setMenu] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(''); 
  const [stock, setStock] = useState('');       
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [qna, setQna] = useState([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [orders, setOrders] = useState([]);
  const [editingStockId, setEditingStockId] = useState(null);
 const [newStockValue, setNewStockValue] = useState('');
  
  const fileInputRef = useRef(null);

 const deleteOrder = async (orderId) => {
  if (!confirm("Are you sure?")) return;
  
  try {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      // ✅ Only remove from UI if the database confirmed deletion
      setOrders((prevOrders) => prevOrders.filter(order => order.id !== orderId));
      alert("Order permanently deleted from database!");
    } else {
      // ❌ If this alert pops up, your API route in Step 1 is broken
      alert("Server Error: The database did not delete the order.");
    }
  } catch (err) {
    console.error("Network Error:", err);
  }
};

const handleRestock = async (productId) => {
  try {
    const response = await fetch(`/api/products/${productId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock_quantity: Number(newStockValue) }),
    });

    // ✅ Fix: Only parse JSON if there is content in the response
    let result = {};
    const text = await response.text(); 
    if (text) {
      result = JSON.parse(text);
    }

    if (response.ok) {
      fetchProducts(); 
      setEditingStockId(null);
      setNewStockValue('');
      alert("Stock updated successfully!");
    } else {
      alert("Failed: " + (result.error || "Server error occurred"));
    }
  } catch (error) {
    console.error("Restock failed:", error);
    alert("Check your internet or server terminal.");
  }
};
  // --- Handlers ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreviewUrl(URL.createObjectURL(file));
  };

  const fetchProducts = useCallback(() => {
    fetch('/api/products').then(res => res.json()).then(data => setMenu(data));
  }, []);

  const fetchQna = useCallback(() => {
    fetch('/api/train').then(res => res.json()).then(data => setQna(data));
  }, []);
const fetchOrders = useCallback(async () => {
  // Use 'no-store' to tell the browser: "Do not use a saved copy of this list"
  const res = await fetch('/api/orders', { 
    cache: 'no-store',
    headers: { 'Pragma': 'no-cache' } 
  }); 
  if (res.ok) {
    const data = await res.json();
    setOrders(Array.isArray(data) ? data : []);
  }
}, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) fetchOrders();
    else alert("404: Ensure app/api/orders/[id]/route.js exists!");
  };

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'admin') router.push('/shop');
    else { fetchProducts(); fetchQna(); fetchOrders(); }
  }, [router, fetchProducts, fetchQna, fetchOrders]);

  async function toggleBestSeller(id, currentStatus) {
  try {
    const response = await fetch(`/api/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }, // 🛡️ Added header
      body: JSON.stringify({ is_best_seller: !currentStatus }),
    });

    if (response.ok) {
      fetchProducts(); // Refresh UI
    } else {
      const errorData = await response.json();
      console.error("Toggle failed:", errorData.error);
    }
  } catch (err) {
    console.error("Network Error:", err);
  }
}

  async function handleDelete(id) {
    if (!confirm("Are you sure?")) return;
    const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (response.ok) fetchProducts();
  }

  async function handleProductSave(e) {
    e.preventDefault();
    setIsSaving(true);
    const file = fileInputRef.current?.files[0];
    let finalImageUrl = '/placeholder.jpg';

    try {
      if (file) {
        const response = await fetch(`/api/upload?filename=${file.name}`, {
          method: 'POST',
          body: file,
        });
        if (response.ok) {
          const newBlob = await response.json();
          finalImageUrl = newBlob.url;
        }
      }

      const stockToSave = category === 'Meals' ? -1 : (parseInt(stock) || 0);

      const dbResponse = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, price: parseFloat(price), description, 
          image_url: finalImageUrl, category, 
          stock_quantity: stockToSave, is_best_seller: isBestSeller 
        }),
      });

      if (dbResponse.ok) {
        fetchProducts();
        setName(''); setPrice(''); setDescription(''); setCategory(''); setStock(''); 
        setPreviewUrl(null); setIsBestSeller(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } catch (error) { console.error("Save failed:", error); }
    finally { setIsSaving(false); }
  }

  async function handleQnaSave(e) {
    e.preventDefault();
    if (!question || !answer) return;
    const response = await fetch('/api/train', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, answer }),
    });
    if (response.ok) {
      fetchQna();
      setQuestion(''); setAnswer('');
    }
  }

  

const safeMenu = Array.isArray(menu) ? menu : [];

const filteredMenu = activeFilter === 'All' 
  ? safeMenu 
  : safeMenu.filter(item => item.category === activeFilter);

const bestSellersList = safeMenu.filter(item => item.is_best_seller);

  return (
    <main className="min-h-screen bg-[#8A38F5] p-6 font-sans text-gray-800">
      {/* TOP NAVIGATION BAR */}
    <NavbarforAdmin />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* PANEL 1: PRODUCT EDITOR */}
        <section className="bg-[#FFD18B] p-8 rounded-[40px] shadow-2xl flex flex-col gap-6">
          <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight italic">Add New Product</h2>
          <form onSubmit={handleProductSave} className="space-y-4">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Item Name" className="w-full p-4 rounded-2xl border-none shadow-inner text-sm" required />
            
            <div className="flex gap-2">
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-2/3 p-4 rounded-2xl border-none shadow-inner bg-white font-bold text-gray-500 text-sm" required>
                <option value="">Category</option>
                <option value="Ramen">Ramen</option>
                <option value="Snacks">Snacks</option>
                <option value="Drinks">Drinks</option>
                <option value="Meals">Meals</option>
              </select>
              <input value={price} onChange={e => setPrice(e.target.value)} type="number" placeholder="₱" className="w-1/3 p-4 rounded-2xl border-none shadow-inner text-sm" required />
            </div>

            <input value={stock} onChange={e => setStock(e.target.value)} type="number" placeholder="Stock Quantity" className="w-full p-4 rounded-2xl border-none shadow-inner text-sm" />
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="w-full p-4 rounded-2xl h-24 border-none shadow-inner text-sm" required />
            
            <div className="bg-white p-3 rounded-2xl shadow-inner text-center">
              <input type="file" ref={fileInputRef} onChange={handleImageChange} className="text-[10px] w-full" />
            </div>


            <button type="submit" className="w-full bg-[#8A38F5] text-white font-black py-4 rounded-2xl shadow-lg hover:bg-[#742ed4] transition-all uppercase text-sm">Save Product</button>
          </form>
        </section>

        {/* PANEL 2: ACTIVE BEST SELLERS */}
        <section className="bg-white p-8 rounded-[40px] shadow-2xl border-4 border-[#FFD18B]">
         <h2 className="text-xl font-black text-[#8A38F5] mb-6 uppercase italic flex items-center gap-2">
         <img 
               src="/bestsellingicon.png" 
               alt="Best Seller" 
               className="w-8 h-8 object-contain" 
          /> Active Best Sellers </h2>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {bestSellersList.map(item => (
              <div key={item.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100 group">
                <div className="flex items-center gap-3">
                  <img src={item.image_url} className="w-10 h-10 rounded-lg object-cover" alt="" />
                  <div>
                    <p className="font-black text-xs uppercase text-gray-800">{item.name}</p>
                    <p className="text-[9px] text-purple-500 font-bold uppercase">{item.category}</p>
                  </div>
                </div>
                <button 
                  onClick={() => toggleBestSeller(item.id, true)}
                  className="bg-red-50 text-red-400 p-2 rounded-xl text-[9px] font-black hover:bg-red-500 hover:text-white transition-all uppercase"
                >
                  Remove
                </button>
              </div>
            ))}
            {bestSellersList.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-300 text-xs italic font-bold">No best sellers selected.</p>
                <p className="text-gray-300 text-[9px] uppercase mt-1">Star a product in the inventory below!</p>
              </div>
            )}
          </div>
        </section>

        {/* PANEL 3: AI KNOWLEDGE */}
        <section className="bg-[#5D1DB4] p-8 rounded-[40px] shadow-2xl text-white">
          <h2 className="text-xl font-black mb-6 text-purple-200 uppercase tracking-tight italic">Frequently Ask Questions</h2>
          <form onSubmit={handleQnaSave} className="space-y-4 mb-6">
            <input value={question} onChange={e => setQuestion(e.target.value)} placeholder="User Question?" className="w-full p-4 rounded-2xl border-none text-gray-800 shadow-inner text-sm" required />
            <textarea value={answer} onChange={e => setAnswer(e.target.value)} placeholder="AI Answer..." className="w-full p-4 rounded-2xl h-24 border-none text-gray-800 shadow-inner text-sm" required />
            <button type="submit" className="w-full bg-purple-400 text-white font-black py-4 rounded-2xl shadow-lg hover:bg-purple-300 transition-all uppercase text-sm">Train AI</button>
          </form>
          <div className="bg-purple-900/40 p-6 rounded-3xl overflow-y-auto max-h-40 space-y-3">
            {Array.isArray(qna) && qna.map((item, i) => (
              <div key={i} className="text-[10px] border-b border-purple-700 pb-3 flex justify-between items-start">
                <div className="pr-2"><p className="font-bold text-purple-200">Q: {item.question}</p></div>
                <button onClick={() => deleteQna(i)} className="text-red-400 font-bold uppercase hover:text-red-300">Delete</button>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="bg-white p-8 rounded-[40px] shadow-2xl mt-8 border-4 border-[#8A38F5]">
  <h2 className="text-2xl font-black text-[#8A38F5] mb-6 uppercase italic tracking-tighter">📦 Incoming Customer Orders</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {orders.map(order => (
      <div key={order.id} className="bg-gray-50 p-6 rounded-[32px] border-2 border-gray-100 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
            order.status === 'Pending' ? 'bg-orange-100 text-orange-600' : 
            order.status === 'Processing' ? 'bg-blue-100 text-blue-600' : 
            'bg-green-100 text-green-600'
          }`}>
            {order.status}
          </span>
          <span className="text-[10px] text-gray-400 font-bold">{new Date(order.created_at).toLocaleDateString()}</span>
        </div>

        <div>
  <h3 className="font-black text-gray-800 uppercase">{order.customer_name}</h3>
  {/* ✅ FIX: Match the column name from your SQL table */}
  <p className="text-[10px] text-[#8A38F5] font-black uppercase">
    {order.user_phone || order.phone_number || 'Guest / No Number'}
  </p>
  <p className="text-[10px] text-gray-500 italic">{order.address}</p>
</div>

       <div className="bg-white p-3 rounded-2xl">
{(() => {
    try {
      const itemsList = Array.isArray(order.items) 
        ? order.items 
        : JSON.parse(order.items || "[]");
        
      return itemsList.map((item, idx) => (
        <p key={idx} className="text-[10px] font-bold text-gray-600">
          • {item.name} (x{item.quantity})
        </p>
      ));
    } catch (e) {
      console.error("Parse error for order:", order.id, e);
      return <p className="text-[10px] text-red-500 italic">Error loading items</p>;
    }
  })()}
  <p className="mt-2 text-sm font-black text-[#8A38F5]">Total: ₱{order.total_price}</p>
</div>

        <div className="flex gap-2 mt-auto">
          {order.status === 'Pending' && (
            <button onClick={() => updateOrderStatus(order.id, 'Processing')} className="flex-1 bg-blue-500 text-white py-3 rounded-xl text-[10px] font-black uppercase">Process</button>
          )}
          {order.status === 'Processing' && (
            <button onClick={() => updateOrderStatus(order.id, 'Delivering')} className="flex-1 bg-purple-500 text-white py-3 rounded-xl text-[10px] font-black uppercase">Deliver</button>
          )}
          {order.status === 'Delivering' && (
            <button onClick={() => updateOrderStatus(order.id, 'Completed')} className="flex-1 bg-green-500 text-white py-3 rounded-xl text-[10px] font-black uppercase">Finish</button>
          )}

          {order.status === 'Completed' && (
    <button 
      onClick={() => deleteOrder(order.id)} 
      className="flex-1 bg-red-100 text-red-600 hover:bg-red-600 hover:text-white py-3 rounded-xl text-[10px] font-black uppercase transition-colors"
    >
      Clear Order
    </button>
  )}
        </div>
      </div>
    ))}
  </div>
</section>

      {/* MASTER INVENTORY SECTION */}
      <div className="mt-8 bg-white p-8 rounded-[40px] shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-2xl font-black text-[#8A38F5] uppercase tracking-tighter">📦 Master Inventory</h2>
          
          {/* CATEGORY FILTER BAR */}
          <div className="flex flex-wrap gap-2 bg-gray-100 p-2 rounded-2xl">
            {['All', 'Ramen', 'Snacks', 'Drinks', 'Meals'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                  activeFilter === cat ? 'bg-[#8A38F5] text-white shadow-md' : 'text-gray-500 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredMenu.map((item) => (
            <div key={item.id} className="bg-gray-50 border-2 border-gray-100 p-6 rounded-[32px] flex flex-col gap-4 relative group hover:border-[#8A38F5]/30 transition-all">
              
              {/* INTERACTIVE STAR TOGGLE */}
              <button 
                onClick={() => toggleBestSeller(item.id, item.is_best_seller)}
                className={`absolute -top-2 -right-2 w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all z-10 ${
                item.is_best_seller === true 
                 ? 'bg-yellow-400 scale-110' 
                 : 'bg-white text-gray-200 hover:text-yellow-400'
            }`}
              >
               ⭐
             </button>

              <div className="h-32 w-full bg-gray-200 rounded-2xl overflow-hidden">
                 <img src={item.image_url} className="w-full h-full object-cover" alt="" />
              </div>

              <div className="flex flex-col">
                <span className="font-black text-sm text-gray-800 uppercase leading-tight">{item.name}</span>
                <span className="text-green-600 font-black text-sm">₱{item.price}</span>
                <div className="mt-2 flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${item.category === 'Meals' ? 'bg-blue-400' : (item.stock_quantity > 0 ? 'bg-green-400' : 'bg-red-400')}`}></div>
                  <span className="text-[9px] text-gray-400 font-black uppercase">
                    {item.category === 'Meals' ? 'Freshly Prepared' : `Stock: ${item.stock_quantity ?? 0}`} 
                  </span>
                </div>
                {item.category !== 'Meals' && (
    <div className="flex gap-1">
      {editingStockId === item.id ? (
        <>
          <input 
            type="number" 
            value={newStockValue} 
            onChange={(e) => setNewStockValue(e.target.value)}
            className="w-16 p-1 text-[10px] border rounded-lg outline-none focus:ring-1 focus:ring-[#8A38F5]"
            placeholder="Qty"
          />
          <button 
            onClick={() => handleRestock(item.id)}
            className="bg-green-500 text-white px-2 py-1 rounded-lg text-[8px] font-bold uppercase"
          >
            Confirm
          </button>
          <button 
            onClick={() => setEditingStockId(null)}
            className="bg-gray-200 text-gray-600 px-2 py-1 rounded-lg text-[8px] font-bold uppercase"
          >
            X
          </button>
        </>
      ) : (
        <button 
          onClick={() => {
            setEditingStockId(item.id);
            setNewStockValue(item.stock_quantity);
          }}
          className="text-[9px] text-[#8A38F5] font-black uppercase hover:underline"
        >
          + Restock Item
        </button>
      )}
    </div>
  )}
              </div>

              <button onClick={() => handleDelete(item.id)} className="w-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white py-4 rounded-2xl text-[10px] font-black transition-all uppercase">Delete</button>
            </div>
          ))}
        </div>
      </div>
      <Chatbot menu={menu} qna={qna} />
    </main>
  );
}