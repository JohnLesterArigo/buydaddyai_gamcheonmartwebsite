'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faStore } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === 'admin@gmail.com' && password === 'admin123') {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', 'admin');
      router.push('/admin'); 
    } 
    else if (email === 'user@gmail.com' && password === 'user123') {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', 'user');
      router.push('/'); 
    } 
    else {
      alert("Invalid email or password!");
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative px-4 py-12"
      style={{ 
        backgroundImage: `url('/crops.jpg')`, // Added url() and forward slash
      }}
    >

      {/* 2. The Login Card: Keeps your content centered and readable */}
      <div className="relative max-w-md w-full space-y-8 bg-white/95 p-10 rounded-3xl shadow-2xl border border-white/20">
        
        {/* Logo & Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-[#8A38F5]/10 rounded-2xl flex items-center justify-center mb-4">
            <FontAwesomeIcon icon={faStore} className="text-3xl text-[#8A38F5]" />
          </div>
          <h2 className="text-3xl font-black bg-gradient-to-r from-[#8A38F5] to-[#D91A9C] bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Log in to your Gamcheon Mart account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Email Address</label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <FontAwesomeIcon icon={faEnvelope} />
                </span>
                <input
                  type="email"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8A38F5] focus:bg-white transition-all text-black"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="relative">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Password</label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <FontAwesomeIcon icon={faLock} />
                </span>
                <input
                  type="password"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8A38F5] focus:bg-white transition-all text-black"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input type="checkbox" className="h-4 w-4 text-[#8A38F5] focus:ring-[#8A38F5] border-gray-300 rounded" />
              <label className="ml-2 text-gray-600">Remember me</label>
            </div>
            <Link href="#" className="font-medium text-[#8A38F5] hover:text-[#D91A9C]">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-bold rounded-xl text-white bg-gradient-to-r from-[#8A38F5] to-[#D91A9C] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8A38F5] transition-all transform hover:scale-[1.02]"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link href="/signup" className="font-bold text-[#8A38F5] hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}