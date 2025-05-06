"use client";
import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    if (res?.error) {
      setError('Invalid email or password');
      return;
    }
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md py-12 px-4">
        <h1 className="text-2xl font-bold mb-6" style={{ color: '#0058C0' }}>Sign In</h1>
        <form onSubmit={handleLogin} className="space-y-4">
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
          <button type="submit" className="w-full px-4 py-2 rounded bg-[#0058C0] text-white font-semibold hover:bg-[#004494] transition">Sign In</button>
        </form>
        <div className="mt-6 text-center">
          <span style={{ color: '#0058C0' }}>Don't have an account? </span>
          <Link href="/signup" className="text-[#0058C0] hover:underline font-semibold">Sign up</Link>
        </div>
      </div>
    </div>
  );
} 