'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchMyOrders() {
      const userEmail = localStorage.getItem('userEmail');
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

      // 1. Security Check: Redirect if not logged in
      if (!isLoggedIn || !userEmail) {
        router.push('/');
        return;
      }

      try {
        // 2. Fetch orders filtered by the logged-in user's email
        const response = await fetch(`/api/orders?email=${userEmail}`);
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMyOrders();
  }, [router]);

  // Status Badge Styling Logic
  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || 'pending';
    switch (s) {
      case 'processing': return 'bg-blue-500 text-white';
      case 'delivering': return 'bg-amber-500 text-white animate-pulse';
      case 'delivered': return 'bg-green-500 text-white';
      default: return 'bg-zinc-400 text-white';
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6 pt-24 font-[family-name:var(--font-poetsen)]">
      <div className="max-w-2xl mx-auto">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black italic text-[#8A38F5] uppercase tracking-tighter">
            Order Tracking
          </h1>
          <Link href="/shop" className="text-xs font-bold uppercase bg-white px-6 py-3 rounded-2xl shadow-sm hover:bg-gray-100 transition-all border border-gray-100">
            ← Back to Shop
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#8A38F5] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 font-bold uppercase italic animate-pulse">Loading Your Orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center bg-white p-16 rounded-[40px] shadow-sm border border-gray-100">
            <div className="text-5xl mb-6">📦</div>
            <p className="text-gray-400 font-bold uppercase italic mb-6">No orders found for your account</p>
            <Link href="/shop" className="inline-block px-8 py-4 bg-[#8A38F5] text-white rounded-2xl font-black uppercase text-sm shadow-lg hover:scale-105 transition-transform">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-8">
            {orders.map((order) => {
              // ✅ SAFE PARSING: Handles cases where items might be a string or an array
              let parsedItems = [];
              try {
                parsedItems = Array.isArray(order.items) ? order.items : JSON.parse(order.items || "[]");
              } catch (e) {
                console.error("Error parsing items for order:", order.id);
                parsedItems = [];
              }

              return (
                <div key={order.id} className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 relative overflow-hidden transition-all hover:shadow-md">
                  {/* Status Badge */}
                  <div className={`absolute top-0 right-0 px-8 py-3 font-black uppercase text-[10px] rounded-bl-[32px] tracking-widest ${getStatusBadge(order.status)}`}>
                    {order.status || 'Pending'}
                  </div>

                  <div className="mb-6">
                    <h3 className="font-black text-gray-800 uppercase text-lg">Order #{order.id}</h3>
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                      {order.created_at ? new Date(order.created_at).toLocaleString('en-PH') : 'Date Unknown'}
                    </p>
                  </div>

                  {/* Items List */}
                  <div className="space-y-4 mb-8 bg-gray-50/50 p-6 rounded-[32px] border border-gray-50">
                    {parsedItems.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs font-bold uppercase tracking-tight">
                        <div className="flex items-center gap-3">
                          <span className="bg-[#8A38F520] text-[#8A38F5] px-2 py-1 rounded-lg text-[10px]">{item.quantity}x</span>
                          <span className="text-gray-700">{item.name}</span>
                        </div>
                        <span className="text-gray-900">₱{(Number(item.price) * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer / Total */}
                  <div className="flex justify-between items-end border-t border-dashed pt-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Payment Method</span>
                      <span className="text-xs font-bold text-gray-600 uppercase italic">{order.payment_method}</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Final Total</span>
                      <span className="text-3xl font-black text-[#8A38F5]">₱{Number(order.total_price).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}