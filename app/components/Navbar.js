'use client';

import Link from 'next/link';
import { ShoppingBag, LogOut } from 'lucide-react'; // Added LogOut icon
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    // 1. Clear the login data
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    
    // 2. Send the user back to the login screen
    router.push('/login');
    
    // 3. Force a slight refresh to ensure the Layout logic triggers
    window.location.reload();
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-[#8A38F5]/10 rounded-lg group-hover:bg-[#8A38F5]/20 transition-colors">
                <img 
                 src="/ramen.png" 
                 alt="Gamcheon Mart Logo" 
                  className="h-10 w-auto object-contain transition-transform group-hover:scale-105" 
                />              
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#8A38F5] to-[#D91A9C] bg-clip-text text-transparent">
              Gamcheon Mart
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-[#8A38F5] font-semibold hover:opacity-80 transition-opacity">
              Home
            </Link>
            <Link href="/shop" className="text-gray-600 hover:text-[#8A38F5] transition-colors">
              Products
            </Link>
            <a href="/#contact" className="text-gray-600 hover:text-[#8A38F5] transition-colors cursor-pointer">
              Contact
            </a>

            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-red-100 text-red-500 hover:bg-red-50 transition-colors font-medium text-sm"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}