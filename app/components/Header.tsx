"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [latestScore, setLatestScore] = useState<number | null>(null);

  useEffect(() => {
    if (session?.user) {
      fetch('/api/quiz/latest')
        .then(res => res.json())
        .then(data => setLatestScore(data?.score ?? null));
    }
  }, [session]);

  return (
    <header className="w-full bg-white shadow flex items-center justify-between px-6 py-3">
      <div className="flex items-center space-x-2">
        <Link href="/" className="flex items-center space-x-1" style={{ textDecoration: 'none', alignItems: 'center' }} onClick={() => { window.location.href = '/'; }}>
          <Image src="/assets/NEW_DolphinFinance_Logo_NO_BACKGROUND.png" alt="Logo" width={36} height={36} style={{ objectFit: 'contain' }} />
          <Image src="/assets/Logo_Text.png" alt="Dolphin Finance" width={120} height={40} style={{ objectFit: 'contain' }} />
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        {session?.user ? (
          <>
            {latestScore !== null && (
              <div className="flex items-center space-x-2">
                <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0058C0] transition-all duration-500"
                    style={{ width: `${latestScore}%` }}
                  />
                </div>
                <span className="font-bold text-[#0058C0] text-lg">{latestScore}/100</span>
              </div>
            )}
            <div className="relative">
              <button onClick={() => setDropdownOpen(v => !v)} className="focus:outline-none">
                <Image src={(session.user as { image?: string })?.image ?? "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="Profile" width={36} height={36} className="rounded-full" />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
                  <Link href="/settings" className="block px-4 py-2 hover:bg-gray-100" style={{ color: '#000' }} onClick={() => setDropdownOpen(false)}>Settings</Link>
                  <Link href="/history" className="block px-4 py-2 hover:bg-gray-100" style={{ color: '#000' }} onClick={() => setDropdownOpen(false)}>History</Link>
                  <button onClick={() => { setDropdownOpen(false); signOut({ callbackUrl: '/' }); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100" style={{ color: '#000' }}>Logout</button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link href="/login" className="text-[#0058C0] font-semibold hover:underline">Sign In</Link>
            <Link href="/signup">
              <button className="px-4 py-2 rounded-full bg-blue-gradient text-white font-semibold hover:opacity-90 transition duration-150 active:scale-95 active:opacity-80 ml-2">Sign Up</button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
} 