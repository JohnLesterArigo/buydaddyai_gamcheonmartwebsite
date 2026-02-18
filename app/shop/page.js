'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { mockProducts } from '../data/mockData';
import { ProductCard } from '../components/ProductCard';
import { Filter } from 'lucide-react';

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'All');
  const [products, setProducts] = useState(mockProducts);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setProducts(mockProducts);
    } else {
      setProducts(mockProducts.filter((p) => p.category === selectedCategory));
    }
  }, [selectedCategory]);

  const categories = ['All', 'Ramen', 'Snacks', 'Drinks', 'Meals'];

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative px-4 py-12"
      style={{ 
        backgroundImage: `url('/mart-background.jpg')`, // Put your image in the public folder
      }}
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-black text-center mb-12 bg-gradient-to-r from-[#8A38F5] to-[#D91A9C] bg-clip-text text-transparent">
          Our Products
        </h1>

        {}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Filter className="w-5 h-5 text-[#8A38F5]" />
            <h2 className="text-xl font-bold text-gray-800">
              Filter by Category
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-[#8A38F5] text-white shadow-lg shadow-[#8A38F5]/30 scale-105'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 text-xl font-medium">
              No products found in this category yet! 🍜
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Mart...</div>}>
      <ShopContent />
    </Suspense>
  );
}