'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authStatus = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!authStatus && pathname !== '/login') {
      router.push('/login');
    } else if (authStatus && pathname === '/login') {
      router.push('/');
    }

    // Give the router a moment to process before hiding the loading screen
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [pathname, router]);

  const isLoginPage = pathname === '/login';

  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {isLoading ? (
          
          <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8A38F5]"></div>
          </div>
        ) : (
          <>
            {!isLoginPage && <Navbar />}
            <main className={!isLoginPage ? "pt-20" : ""}>
              {children}
            </main>
            {!isLoginPage && <Footer />}
          </>
        )}
      </body>
    </html>
  );
}