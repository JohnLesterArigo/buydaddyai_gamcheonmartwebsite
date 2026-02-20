
'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '../components/ProductCard';
import Chatbot from '../components/chatbot';

function ShopContent() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const searchParams = useSearchParams();
  const categories = ['All', 'Ramen', 'Snacks', 'Drinks', 'Meals'];
  const [activeCategory, setActiveCategory] = useState('All');

  // 1. Fetch products from Neon DB
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // 2. SYNC EFFECT: Listen specifically for URL changes
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      const match = categories.find(c => c.toLowerCase() === categoryFromUrl.toLowerCase());
      if (match) {
        setActiveCategory(match);
      }
    }
  }, [searchParams]);

  // 3. Filter the displayed products
  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (p) => p.category?.toLowerCase() === activeCategory.toLowerCase()
      );
      setFilteredProducts(filtered);
    }
  }, [activeCategory, products]);

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* HEADER SECTION - Description Text Removed */}
      <header className="bg-[#8A38F5] pt-24 pb-20 px-6 text-center text-white">
        <h1 className="text-5xl font-black uppercase italic tracking-tighter">
          {activeCategory === 'All' ? 'Gamcheon Market' : activeCategory}
        </h1>
      </header>

      {/* ADJUSTED PLACEMENT: 
          Changed '-mt-8' to 'mt-12' to lower the filter buttons 
          so they sit clearly in the white section.
      */}
      <div className="max-w-7xl mx-auto px-6 mt-12">
        {/* Category Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-3 rounded-2xl text-xs font-black uppercase transition-all shadow-sm ${
                activeCategory === cat 
                ? 'bg-[#8A38F5] text-white scale-110 shadow-xl border-2 border-[#8A38F5]' 
                : 'bg-white text-gray-400 hover:bg-gray-100 hover:text-gray-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="h-80 bg-gray-200 rounded-[32px] animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={{
                  ...product,
                  image: product.image_url //
                }} 
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[40px] shadow-inner border-2 border-dashed border-gray-200">
            <h3 className="text-xl font-black text-gray-400 uppercase tracking-tight">No {activeCategory} Found</h3>
            <button 
              onClick={() => setActiveCategory('All')}
              className="mt-4 text-[#8A38F5] font-bold underline"
            >
              Clear Filter
            </button>
          </div>
        )}
      </div>

      <Chatbot menu={products} />
    </main>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}