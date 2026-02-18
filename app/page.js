'use client'; 

import Link from 'next/link';
import { Package, Flame, Sparkles, Wine } from 'lucide-react';
import { mockProducts } from './data/mockData'; 
import { ProductCard, FeatureCard } from './components/ProductCard';
import Footer from './components/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWeixin } from '@fortawesome/free-brands-svg-icons';
import { faTruckFast } from '@fortawesome/free-solid-svg-icons';
import Chatbot from './components/chatbot';

export default function HomePage() {

  const bestSellers = mockProducts.filter((p) => p.isBestSeller);

  const categories = [
    { name: 'Ramen', icon: Flame, color: '#FF9500' },
    { name: 'Snacks', icon: Sparkles, color: '#FF00E1' },
    { name: 'Drinks', icon: Wine, color: '#8A38F5' },
    { name: 'Meals', icon: Package, color: '#FF9500' },
  ];

  return (
    <div className="min-h-screen">
      {}
      <section
        className="relative py-20 px-4 text-center"
        style={{
          background: 'linear-gradient(135deg, #8A38F5 0%, #FF00E1 100%)',
        }}
      >
        <div className="relative h-[30vh] flex flex-col items-center justify-center ">
         <div className="mb-4">
            <img 
              src="/gamcheon_logo trans.png" 
              alt="Gamcheon Mart Logo" 
              className="h-24 md:h-40 lg:h-48 w-auto object-contain"
             />
            </div>
          <Link
            href="/shop"
            className="inline-block px-8 py-4 bg-white rounded-lg text-xl font-medium transition-transform hover:scale-105"
            style={{ color: '#8A38F5' }}
          >
            Shop Now
          </Link>
        </div>
      </section>

      {}
      <section className="py-16 px-4 bg-gray-50 dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.name}
                  href={`/shop?category=${category.name}`}
                  className="bg-white dark:bg-zinc-800 rounded-lg p-6 text-center hover:shadow-lg transition-shadow border border-transparent hover:border-border"
                >
                  <div
                    className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: category.color + '20' }}
                  >
                    <Icon className="w-8 h-8" style={{ color: category.color }} />
                  </div>
                  <h3 className="text-xl font-semibold" style={{ color: category.color }}>
                    {category.name}
                  </h3>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Best Sellers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/shop"
              className="inline-block px-6 py-3 rounded-lg text-white font-medium transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#8A38F5' }}
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {}
      <section className="py-16 px-4 bg-gray-50 dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose Gamcheon Mart?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <FeatureCard 
              emoji={
                    <img 
                    src="/flag.png" 
                    alt="Authentic Korea" 
                   className="w-10 h-10 object-contain" 
      />
    } 
                   title="100% Authentic" 
                   desc="All products imported directly from Korea" 
                   color="#8A38F5" 
/>
            <FeatureCard 
                emoji={<FontAwesomeIcon icon={faTruckFast} />}
                title="Fast Shipping" 
                desc="Free shipping on orders over $50" 
                color="#FF9500" 
            />
            <FeatureCard 
               emoji={<FontAwesomeIcon icon={faWeixin} />}
                title="24/7 Support" 
                desc="AI chatbot ready to help anytime" 
                color="#FF00E1" 
            />
          </div>
        </div>
      </section>
      <Footer />
      <Chatbot />
    </div>
    
  );
}

