"use client";
import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Signup failed');
      return;
    }
    // Auto sign in after registration
    await signIn('credentials', { email, password, callbackUrl: '/' });
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md py-12 px-4">
        <h1 className="text-2xl font-bold mb-6" style={{ color: '#0058C0' }}>Sign Up</h1>
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
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
          <button type="submit" className="w-full px-4 py-2 rounded bg-[#0058C0] text-white font-semibold hover:bg-[#004494] transition">Sign Up</button>
        </form>
        <div className="mt-6 text-center">
          <span style={{ color: '#0058C0' }}>Already have an account? </span>
          <Link href="/login" className="text-[#0058C0] hover:underline font-semibold">Sign in</Link>
        </div>
      </div>
    </div>
  );
} 