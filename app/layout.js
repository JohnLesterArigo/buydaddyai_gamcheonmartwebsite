'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const isAuthPage = useMemo(() => pathname === '/' || pathname === '/signup', [pathname]);

  useEffect(() => {
  if (typeof window === "undefined") return; 

  const authStatus = localStorage.getItem('isLoggedIn') === 'true';
  const userRole = localStorage.getItem('userRole'); 
  
  // 1. If we are already on the login/signup page, stop loading immediately
  if (isAuthPage) {
    setIsLoading(false);
    return;
  }

  // 2. If not logged in and NOT on an auth page, redirect to login
  if (!authStatus) {
    router.push('/');
    return;
  }

  // 3. Admin protection
  if (pathname === '/admindashboard' && userRole !== 'admin') {
    router.push('/shop'); 
    return;
  }

  // 4. If all checks pass, show the content
  setIsLoading(false);
}, [pathname, router, isAuthPage]);

  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}>
        {isLoading ? (
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8A38F5]"></div>
          </div>
        ) : (
          <div className="flex flex-col min-h-screen">
            {!isAuthPage && <Navbar />}
            
            <main className={`flex-grow ${!isAuthPage ? "pt-20" : ""}`}>
              {children}
            </main>

            {!isAuthPage && <Footer />}
          </div>
        )}
      </body>
    </html>
  );
}