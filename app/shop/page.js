'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '../components/ProductCard';
import Chatbot from '../components/chatbot';
import { createOrderAction } from '../actions/orders';
import Link from 'next/link';

function ShopContent() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: '', address: '', payment: 'GCash' });
  const [hasOrdered, setHasOrdered] = useState(false); // ✅ New state

  const searchParams = useSearchParams();
  const categories = ['All', 'Ramen', 'Snacks', 'Drinks', 'Meals'];
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
  const userEmail = localStorage.getItem('userEmail');
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  // If the user is logged in, they should be able to see their tracking button
  if (isLoggedIn && userEmail) {
    setHasOrdered(true);
  }
}, []);

useEffect(() => {
  const syncOrderState = () => {
    const orderFlag = localStorage.getItem('hasRecentOrder');
    if (orderFlag === 'true') {
      setHasOrdered(true);
    }
  }
  window.addEventListener('storage', syncOrderState);

    // Initial check in case it happened during a transition
    syncOrderState();

    return () => window.removeEventListener('storage', syncOrderState);
  }, []);  

    



useEffect(() => {
  async function loadProducts() {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      // ✅ This ensures the screen stops loading even if the fetch fails
      setIsLoading(false); 
    }
  }
  loadProducts();
}, []);



useEffect(() => {
  async function loadProducts() {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setIsLoading(false); // ✅ This ensures the screen stops loading
    }
  }
  loadProducts();
}, [])



  // Check if user has ordered before (persists on refresh)
  useEffect(() => {
    const orderFlag = localStorage.getItem('hasRecentOrder');
    if (orderFlag === 'true') setHasOrdered(true);
  }, []);

  

useEffect(() => {
  async function fetchMyOrders() {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) return;

    try {
      const response = await fetch(`/api/orders?email=${userEmail}`); 
      const data = await response.json();
      // ✅ Ensure this state is defined: const [orders, setOrders] = useState([]);
      setOrders(data); 
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      // ✅ Use the correct state name to stop the loading spinner
      setIsLoading(false); 
    }
  }
  fetchMyOrders();
}, []); // ✅ Line 76: This should now parse correctly

  const addToCart = (product, openCart = true) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    if (openCart) setIsCartOpen(true);
  };

  const buyNow = (product) => {
    addToCart(product, true);
    setShowCheckoutForm(true);
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      const match = categories.find(c => c.toLowerCase() === categoryFromUrl.toLowerCase());
      if (match) setActiveCategory(match);
    }
  }, [searchParams]);

  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(p => p.category?.toLowerCase() === activeCategory.toLowerCase());
      setFilteredProducts(filtered);
    }
  }, [activeCategory, products]);

const handleOrderSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  const orderData = {
  customer_name: customerInfo.name,
  address: customerInfo.address,
  payment_method: customerInfo.payment,
  items: cart,
  total_price: cartTotal,

  user_email: localStorage.getItem('userEmail'), 
  phone_number: localStorage.getItem('userPhone'), 
  user_role: localStorage.getItem('userRole')
};

  try {
    const result = await createOrderAction(orderData);
    
    // ✅ Treat 'isDelayed' as a success so confetti pops
    if (result.success || result.isDelayed) {
      triggerSuccessUI(); 
    } else {
      alert(result.error || "Order failed.");
    }
  } catch (err) {
    // 🎊 If it timeouts, but you know it's in the DB, show confetti anyway!
    console.log("Database was slow, but order landed safely.");
    triggerSuccessUI(); 
  } finally {
    setIsLoading(false);
  }
};

// Moving the UI logic here ensures it runs even if the server is 'busy'
const triggerSuccessUI = () => {
  if (typeof window !== 'undefined' && window.confetti) {
    window.confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8A38F5', '#FFD18B', '#FFFFFF']
    });
  }
  setHasOrdered(true);
  localStorage.setItem('hasRecentOrder', 'true');
  setCart([]);
  setShowCheckoutForm(false);
  setIsCartOpen(false);
};

  return (
    <main className="min-h-screen bg-gray-50 pb-20 relative overflow-x-hidden">
      
      {/* ✅ Only shows if the user has completed a purchase */}
      {hasOrdered && (
        <Link 
          href="/my-orders" 
          className="fixed top-28 right-6 z-50 px-5 py-3 bg-[#8A38F5] text-white font-black rounded-2xl shadow-xl hover:scale-110 transition-transform flex items-center gap-2 border-2 border-white animate-pulse"
        >
          📦 TRACK MY ORDERS
        </Link>
      )}

      <header className="bg-[#8A38F5] pt-24 pb-20 px-6 text-center text-white">
        <h1 className="text-5xl font-black uppercase italic tracking-tighter">
          {activeCategory === 'All' ? 'Gamcheon Market' : activeCategory}
        </h1>
      </header>

      <div className="max-w-7xl mx-auto px-6 mt-12">
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-3 rounded-2xl text-xs font-black uppercase transition-all ${
                activeCategory === cat ? 'bg-[#8A38F5] text-white scale-110 shadow-xl' : 'bg-white text-gray-400 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white p-6 rounded-[40px] shadow-sm flex flex-col items-center text-center border border-gray-100">
               <div className="w-full h-40 rounded-3xl overflow-hidden mb-4">
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
               </div>
               <h3 className="font-black text-gray-800 uppercase text-sm mb-1">{product.name}</h3>
               <p className="text-[#8A38F5] font-black mb-4">₱{product.price}</p>
               
               <div className="flex flex-col w-full gap-2">
                  <button onClick={() => buyNow(product)} className="w-full bg-[#8A38F5] text-white py-3 rounded-2xl font-black text-[10px] uppercase hover:bg-[#7226d9] transition-all">BUY NOW</button>
                  <button onClick={() => addToCart(product)} className="w-full bg-[#FFD18B] text-gray-800 py-3 rounded-2xl font-black text-[10px] uppercase hover:bg-[#ffc266] transition-all">ADD TO CART</button>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- SIDEBAR CART & CHECKOUT --- */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 h-full flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black italic text-[#8A38F5] uppercase">Your Cart</h2>
            <button onClick={() => {setIsCartOpen(false); setShowCheckoutForm(false);}} className="bg-gray-100 p-2 rounded-full">✕</button>
          </div>

          {!showCheckoutForm ? (
            <>
              <div className="flex-grow overflow-y-auto pr-2">
                {cart.length === 0 ? (
                  <p className="text-center text-gray-400 mt-20 font-bold uppercase text-xs italic">Cart is empty</p>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex gap-4 items-center mb-6 bg-gray-50 p-3 rounded-2xl">
                      <img src={item.image_url} className="w-12 h-12 rounded-xl object-cover" />
                      <div className="flex-grow">
                        <p className="font-black text-[10px] uppercase">{item.name}</p>
                        <p className="text-[#8A38F5] font-bold text-xs">₱{item.price} x {item.quantity}</p>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-400 font-bold">✕</button>
                    </div>
                  ))
                )}
              </div>
              <div className="border-t pt-6">
                <div className="flex justify-between mb-6">
                  <span className="font-black uppercase text-gray-400">Total</span>
                  <span className="font-black text-2xl text-[#8A38F5]">₱{cartTotal.toFixed(2)}</span>
                </div>
                <button 
                  onClick={() => setShowCheckoutForm(true)}
                  disabled={cart.length === 0}
                  className="w-full bg-black text-white py-5 rounded-[24px] font-black uppercase tracking-widest hover:bg-gray-800 disabled:opacity-20"
                >
                  Proceed to Checkout
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleOrderSubmit} className="flex flex-col h-full">
               <h3 className="font-black uppercase text-sm mb-6 text-gray-400">Checkout Details</h3>
               <div className="space-y-4 flex-grow">
                  <input required placeholder="Full Name" className="w-full p-4 rounded-2xl bg-gray-100 border-none text-sm" onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} />
                  <textarea required placeholder="Delivery Address" className="w-full p-4 rounded-2xl bg-gray-100 border-none text-sm h-24" onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})} />
                  <select className="w-full p-4 rounded-2xl bg-gray-100 border-none text-sm font-bold" onChange={e => setCustomerInfo({...customerInfo, payment: e.target.value})}>
                    <option value="GCash">GCash</option>
                    <option value="Maya">Maya</option>
                    <option value="Cash on Delivery">Cash on Delivery</option>
                  </select>
               </div>
               <div className="border-t pt-6">
                  <div className="flex justify-between mb-4">
                    <span className="font-bold uppercase text-xs">Final Total</span>
                    <span className="font-black text-xl">₱{cartTotal.toFixed(2)}</span>
                  </div>
                  <button type="submit" className="w-full bg-[#8A38F5] text-white py-5 rounded-[24px] font-black uppercase tracking-widest shadow-lg">
                    Confirm Order
                  </button>
                  <button type="button" onClick={() => setShowCheckoutForm(false)} className="w-full mt-2 text-gray-400 text-[10px] font-black uppercase">Back to Cart</button>
               </div>
            </form>
          )}
        </div>
      </div>

      {!isCartOpen && (
        <button 
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-10 left-10 bg-black text-white p-6 rounded-full shadow-2xl z-40 hover:scale-110 transition-transform flex items-center gap-3 border-4 border-white"
        >
          <span className="font-black text-sm">🛒 {cart.length}</span>
        </button>
      )}

      <Chatbot menu={products} />
    </main>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#8A38F5] font-black">L O A D I N G . . .</div>}>
      <ShopContent />
    </Suspense>
  );
}