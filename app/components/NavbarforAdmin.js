'use client';

import Link from 'next/link';
import { ShoppingBag, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NavbarforAdmin() {
  const router = useRouter();

  const handleLogout = () => {
    // 1. Clear Local Storage for UI state
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');

    localStorage.removeItem('userEmail');
    localStorage.removeItem('hasRecentOrder');

    // 2. Clear the cookie so Middleware stops letting you into /home
    // We set the expiration to a past date to delete it
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    
    // 3. IMPORTANT: Redirect to '/' (Root), NOT '/login'
    // Since you deleted the /login folder, /login causes a 404 error
    router.push('/');
    
    // 4. Force a refresh to reset the state and let Middleware check the empty cookie
    window.location.reload();
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo - Updated to point to /home if logged in, or / if not */}
          <Link href="/home" className="flex items-center gap-2 group">
            <div>
                <img 
                 src="/gamcheon_logo_icon-.png" 
                 alt="Gamcheon Mart Logo" 
                  className="h-15 w-auto object-contain transition-transform group-hover:scale-105" 
                />              
            </div>
             <span className="text-2xl font-bold flex gap-2 Poetsen One"> 
              <span className="text-[#800080]">Gamcheon</span>
              <span className="text-[#FF4500]">Mart</span>
             </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">

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