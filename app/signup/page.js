'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUpAction } from '../actions/auth';

export default function SignUpPage() {
  const router = useRouter();
  
  // ✅ FIXED: Added all missing fields to formData state
  const [formData, setFormData] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    password: '', 
    phoneNumber: '' 
  });
  
  // ✅ FIXED: Added missing 'const'
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // ✅ FIXED: Changed loginAction back to signUpAction
      const result = await signUpAction(formData); 
      
      if (result.success) {
        // ✅ CRITICAL: Saves the email so "Guest" logic stops happening
        localStorage.setItem('userEmail', formData.email); 
        localStorage.setItem('isLoggedIn', 'true');
        
        alert("Account created successfully!");
        router.push('/home');
      } else {
        alert(result.error || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      alert("Signup Error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#8A38F5] p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-2xl">
        <h2 className="text-3xl font-black text-[#8A38F5] text-center mb-6 uppercase italic">Join Gamcheon Mart</h2>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex gap-4">
            <input name="firstName" placeholder="First Name" required
              className="w-1/2 px-4 py-3 border rounded-xl text-black outline-none focus:ring-2 focus:ring-[#8A38F5]"
              onChange={handleChange} value={formData.firstName} />
            <input name="lastName" placeholder="Last Name" required
              className="w-1/2 px-4 py-3 border rounded-xl text-black outline-none focus:ring-2 focus:ring-[#8A38F5]"
              onChange={handleChange} value={formData.lastName} />
          </div>

          <input name="email" type="email" placeholder="Email Address" required
            className="block w-full px-4 py-3 border rounded-xl text-black outline-none focus:ring-2 focus:ring-[#8A38F5]"
            onChange={handleChange} value={formData.email} />

          <input name="phoneNumber" type="tel" placeholder="Phone Number" required
            className="block w-full px-4 py-3 border rounded-xl text-black outline-none focus:ring-2 focus:ring-[#8A38F5]"
            onChange={handleChange} value={formData.phoneNumber} />

          <input name="password" type="password" placeholder="Password" required
            className="block w-full px-4 py-3 border rounded-xl text-black outline-none focus:ring-2 focus:ring-[#8A38F5]"
            onChange={handleChange} value={formData.password} />

          <button type="submit" disabled={isLoading}
            className="w-full py-4 font-bold rounded-xl text-white bg-[#8A38F5] hover:opacity-90 disabled:bg-gray-400 transition-all">
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          Already a member? <Link href="/" className="text-[#8A38F5] font-bold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}