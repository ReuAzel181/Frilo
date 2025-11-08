"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (res.ok) {
      router.push('/signin');
    } else {
      // Handle error
      console.error('Sign up failed');
    }
  };

  return (
    <section>
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
        <h1 className="font-bold mb-4 text-center">Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2" htmlFor="username">Username</label>
            <input 
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" 
              type="text" 
              id="username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2" htmlFor="email">Email</label>
            <input 
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" 
              type="email" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-400 mb-2" htmlFor="password">Password</label>
            <input 
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="gap-before-buttons">
            <button type="submit" className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-full transition-all transform hover:scale-105">
              Sign Up
            </button>
          </div>
        </form>
        <p className="text-center text-gray-400 mt-6">
          Already have an account? <Link href="/signin" className="text-yellow-400 hover:underline">Sign In</Link>
        </p>
      </div>
    </section>
  );
};

export default SignUpPage;