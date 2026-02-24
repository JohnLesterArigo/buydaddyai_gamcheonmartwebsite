'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // ✅ Fixed: Added router import
import { ProductCard, FeatureCard } from '../components/ProductCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWeixin } from '@fortawesome/free-brands-svg-icons';
import { faTruckFast } from '@fortawesome/free-solid-svg-icons';
import Chatbot from '../components/chatbot';

export default function HomePage() {
  const router = useRouter(); // ✅ Fixed: Initialize router
  const [allProducts, setAllProducts] = useState([]);
  const [displayProducts, setDisplayProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [hasOrdered, setHasOrdered] = useState(false);

  const categories = [
  { name: 'Ramen', icon: '/ramen.png', color: '#FFF5EB', textColor: '#FF9500' },
  { name: 'Snacks', icon: '/snacks.png', color: '#FFF0F9', textColor: '#FF00E1' },
  { name: 'Drinks', icon: '/drinks.png', color: '#F5F0FF', textColor: '#8A38F5' },
  { name: 'Meals', icon: '/meal.png', color: '#FFF8EE', textColor: '#FFB800' }
];

  // 1. Fetch initial best sellers for the home page display
  useEffect(() => {
    const orderFlag = localStorage.getItem('hasRecentOrder');
    if (orderFlag === 'true') setHasOrdered(true);

    async function loadProducts() {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setAllProducts(data);
        // Initially show only best sellers on Home
        setDisplayProducts(data.filter(p => p.is_best_seller === true));
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, []);

  useEffect(() => {
  const handleStorageChange = () => {
    const orderFlag = localStorage.getItem('hasRecentOrder');
    if (orderFlag === 'true') setHasOrdered(true); // Show the button!
  };

  // Listen for the custom event we added in the chatbot component
  window.addEventListener('storage', handleStorageChange);
  return () => window.removeEventListener('storage', handleStorageChange);
}, []);

  // 2. Navigation logic for categories
  const filterByCategory = (catName) => {
    if (catName === 'All') {
      setActiveCategory('All');
      setDisplayProducts(allProducts.filter(p => p.is_best_seller === true));
    } else {
      // ✅ Redirect to shop page with query parameter
      router.push(`/shop?category=${catName}`);
    }
  };

  return (
    <>
      {hasOrdered && (
        <Link href="/my-orders" className="fixed top-24 right-6 z-50 px-6 py-3 bg-white text-[#8A38F5] font-black rounded-2xl shadow-xl hover:scale-110 transition-transform border-2 border-[#8A38F5] flex items-center gap-2 animate-bounce">
          📦 TRACK MY ORDERS
        </Link>
      )}

      <div className="min-h-screen bg-white">
        {/* HERO SECTION */}
        <section className="relative py-20 px-4 text-center" style={{ background: 'linear-gradient(135deg, #8A38F5 0%, #FF00E1 100%)' }}>
          <div className="relative h-[30vh] flex flex-col items-center justify-center">
            <div className="mb-4">
              <img src="/gamcheon_logo trans.png" alt="Logo" className="h-24 md:h-40 lg:h-48 w-auto object-contain" />
            </div>
            <Link href="/shop" className="inline-block px-8 py-4 bg-white rounded-lg text-xl font-medium transition-transform hover:scale-105" style={{ color: '#8A38F5' }}>
              Shop Now
            </Link>
          </div>
        </section>

        {/* SHOP BY CATEGORY SECTION */}
        <section className="py-16 px-4 max-w-7xl mx-auto">
  <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Shop by Category</h2>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
    {categories.map((cat) => (
      <div 
        key={cat.name}
        onClick={() => filterByCategory(cat.name)}
        className="group p-8 rounded-3xl bg-white border border-gray-100 flex flex-col items-center gap-4 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer"
      >
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden" 
          style={{ backgroundColor: cat.color }}
        >
          <img 
            src={cat.icon} 
            alt={cat.name} 
            className="w-10 h-10 object-contain group-hover:scale-110 transition-transform" 
          />
        </div>

        <span className="font-bold text-lg" style={{ color: cat.textColor }}>
          {cat.name}
        </span>
      </div>
    ))}
  </div>
</section>

        {/* BEST SELLERS LIST */}
        <section className="py-16 px-4 bg-gray-50/50">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800">
                {activeCategory === 'All' ? 'Best Sellers' : `${activeCategory} (Preview)`}
              </h2>
              {activeCategory !== 'All' && (
                <button onClick={() => filterByCategory('All')} className="text-[#8A38F5] font-bold hover:underline">
                  View All Best Sellers
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="text-center py-20 text-gray-400 font-bold animate-pulse">Loading...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayProducts.map((product) => (
                  <ProductCard key={product.id} product={{ ...product, image: product.image_url }} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* FEATURES */}
        <section className="py-16 px-4 border-t border-gray-100">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard emoji={<img src="/flag.png" className="w-10 h-10" alt="KR flag" />} title="100% Authentic" desc="Imported directly from Korea" color="#8A38F5" />
            <FeatureCard emoji={<FontAwesomeIcon icon={faTruckFast} />} title="Fast Shipping" desc="Free over $50" color="#FF9500" />
            <FeatureCard emoji={<FontAwesomeIcon icon={faWeixin} />} title="24/7 Support" desc="AI chatbot ready" color="#FF00E1" />
          </div>
        </section>

        <Chatbot menu={allProducts} />
      </div>
    </>
  );
}