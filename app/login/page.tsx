"use client";
import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const LOCAL_STORAGE_KEY = 'unsaved_quiz_result';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    if (res?.error) {
      setError('Invalid email or password');
      setLoading(false);
      return;
    }
    // If login successful, check for unsaved quiz result
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
    <div className="min-h-screen flex flex-col bg-white">
      {/* Logo combo in top left */}
      <div className="absolute top-6 left-6 z-10">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/assets/NEW_DolphinFinance_Logo_NO_BACKGROUND.png" alt="Dolphin Logo" width={36} height={36} className="cursor-pointer" />
          <Image src="/assets/Logo Text.svg" alt="Dolphin Finance" width={120} height={40} className="cursor-pointer" />
        </Link>
      </div>
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-8 mx-2">
          <div className="flex justify-center mb-6">
            <span className="text-2xl font-bold text-[#0058C0]">Sign in</span>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email or Phone"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0058C0]"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0058C0]"
              required
            />
            <div className="flex justify-end">
              <button type="button" className="text-[#0058C0] text-sm font-semibold hover:underline">Forgot password?</button>
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            {loading && <div className="text-blue-500 text-sm">Saving your quiz result...</div>}
            <button type="submit" className="w-full px-4 py-2 rounded-full bg-[#0058C0] text-white font-semibold hover:opacity-90 transition duration-150 active:scale-95 active:opacity-80">Sign in</button>
          </form>
          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-gray-200" />
            <span className="mx-2 text-gray-400 text-sm">or</span>
            <div className="flex-grow h-px bg-gray-200" />
          </div>
          <button
            type="button"
            onClick={() => signIn('google')}
            className="w-full flex items-center justify-center px-4 py-2 rounded-full bg-white border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition mb-2"
          >
            <img src="/assets/Google G logo.png" alt="Google" className="w-5 h-5 mr-2" />
            Sign in with Google
          </button>
          <div className="mt-6 text-center text-sm text-gray-600">
            New to Dolphin Finance?{' '}
            <Link href="/signup" className="text-[#0058C0] hover:underline font-semibold">Join now</Link>
          </div>
        </div>
      </div>
      <footer className="text-xs text-gray-400 text-center py-4">&copy; {new Date().getFullYear()} Dolphin Finance</footer>
    </div>
  );
} 