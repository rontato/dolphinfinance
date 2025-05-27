"use client";
import Link from 'next/link';

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md py-12 px-4 text-center">
        <h1 className="text-2xl font-bold mb-6" style={{ color: '#0058C0' }}>Welcome!</h1>
        <p className="mb-8 text-gray-700">To save your results and track your financial health, please log in or create an account.</p>
        <div className="flex flex-col gap-4">
          <Link href="/login">
            <button className="w-full px-4 py-3 rounded-full bg-[#0058C0] text-white font-semibold hover:opacity-90 transition duration-150 active:scale-95 active:opacity-80">Sign In</button>
          </Link>
          <Link href="/signup">
            <button className="w-full px-4 py-3 rounded border border-[#0058C0] text-[#0058C0] font-semibold hover:bg-[#e6f0fa] transition">Create Account</button>
          </Link>
        </div>
      </div>
    </div>
  );
} 