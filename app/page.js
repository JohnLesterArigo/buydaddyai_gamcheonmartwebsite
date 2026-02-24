'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginAction } from './actions/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ EFFECT: Load saved email on page mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // ✅ FIX: Create the object to send to loginAction
      const loginData = { email, password };
      const result = await loginAction(loginData);
      
      if (result.success) {
  // ✅ Save identity and status
  localStorage.setItem('userEmail', email); 
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('userRole', result.role); 

 
  if (result.role === 'admin') {
    router.push('/admindashboard');
  } else {
    router.push('/home');
  }
      } else {
        alert(result.error || "Invalid credentials");
      }
    } catch (err) {
      alert("Login Error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat relative px-4 py-12"
      style={{ backgroundImage: "url('/crops.jpg')", backgroundColor: '#8A38F5' }}
    >
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      <div className="relative z-10 max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-2xl">
        <div className="text-center">
          <div>
            <img src="/gamcheon_logo trans.png"/>
          </div>
          <h2 className="text-3xl font-black text-[#8A38F5]">Welcome</h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              type="email"
              required
              value={email}
              className="block w-full px-4 py-3 border border-gray-200 rounded-xl text-black outline-none focus:ring-2 focus:ring-[#8A38F5]"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              required
              value={password}
              className="block w-full px-4 py-3 border border-gray-200 rounded-xl text-black outline-none focus:ring-2 focus:ring-[#8A38F5]"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-[#8A38F5] focus:ring-[#8A38F5] border-gray-300 rounded cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                Remember me
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 font-bold rounded-xl text-white bg-[#8A38F5] hover:opacity-90 transition-opacity disabled:bg-gray-400"
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
        
        <p className="text-center mt-6 text-sm text-gray-600">
           Don't have an account?{' '}
           <Link 
             href="/signup" 
             className="text-[#8A38F5] font-bold hover:text-blue-800 hover:underline transition-colors"
           >
             Create one here
           </Link>
        </p>
      </div>
    </div>
  );
}