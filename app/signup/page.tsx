"use client";
import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const LOCAL_STORAGE_KEY = 'unsaved_quiz_result';

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Signup failed');
      setLoading(false);
      return;
    }
    const loginRes = await signIn('credentials', { email, password, redirect: false });
    if (loginRes?.error) {
      setError('Auto-login failed');
      setLoading(false);
      return;
    }
    if (typeof window !== 'undefined') {
      const local = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (local) {
        try {
          const quizData = JSON.parse(local);
          await fetch('/api/quiz/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(quizData),
          });
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        } catch (err) {
          setError('Failed to save quiz result. Please try again.');
          setLoading(false);
          return;
        }
      }
    }
    setLoading(false);
    router.push('/history');
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side */}
      <div className="flex flex-col justify-center w-3/5 max-w-md mx-auto px-6 py-12 relative" style={{ minHeight: '100vh' }}>
        {/* Dolphin Logo above heading */}
        <div className="flex justify-center mb-8">
          <Link href="/">
            <Image src="/assets/NEW_DolphinFinance_Logo_NO_BACKGROUND.png" alt="Dolphin Logo" width={80} height={80} className="cursor-pointer" />
          </Link>
        </div>
        <h1 className="text-2xl font-bold mb-2 text-[#0058C0] text-center">Welcome to Dolphin Finance</h1>
        <p className="mb-6 text-gray-700 text-center">Save your results, track progress over time, unlock peer comparison feature.</p>
        <button
          type="button"
          onClick={() => signIn('google')}
          className="w-full flex items-center justify-center px-4 py-2 rounded-full bg-white border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition mb-4"
        >
          <img src="/assets/Google G logo.png" alt="Google" className="w-5 h-5 mr-2" />
          Continue with Google
        </button>
        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-200" />
          <span className="mx-2 text-gray-400 text-sm">Or</span>
          <div className="flex-grow h-px bg-gray-200" />
        </div>
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-[#0058C0] rounded bg-white text-[#0058C0] placeholder-[#0058C0] focus:outline-none focus:ring-2 focus:ring-[#0058C0]"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-[#0058C0] rounded bg-white text-[#0058C0] placeholder-[#0058C0] focus:outline-none focus:ring-2 focus:ring-[#0058C0]"
            required
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {loading && <div className="text-blue-500 text-sm">Saving your quiz result...</div>}
          <button type="submit" className="w-full px-4 py-2 rounded-full bg-[#0058C0] text-white font-semibold hover:opacity-90 transition duration-150 active:scale-95 active:opacity-80">Continue</button>
        </form>
        <div className="mt-4 text-xs text-gray-500 text-center">
          <span className="text-black font-medium">By signing up, you'll be automatically added to our mobile app waitlist!</span>
        </div>
        <div className="mt-6 text-center">
          <span className="text-[#0058C0]">Already have an account? </span>
          <Link href="/login" className="text-[#0058C0] hover:underline font-semibold">Log in</Link>
        </div>
      </div>
      {/* Right Side */}
      <div className="hidden md:flex flex-col items-center justify-center w-2/5 p-8" style={{ background: 'radial-gradient(circle at 60% 40%, #6EC6FF 0%, #1976D2 60%, #0058C0 100%)', fontFamily: 'Poppins, sans-serif' }}>
        <div className="text-white text-3xl font-extrabold mb-8 text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>🚀 Mobile app coming soon!</div>
        <Image src="/assets/WIP DolphinFinance App in iPhone BACKGROUND REMOVED.png" alt="Mobile App Preview" width={300} height={600} className="mb-8" />
        <div className="text-white text-xl text-center font-semibold flex flex-col items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Dive even deeper into your personal finances
        </div>
      </div>
    </div>
  );
} 