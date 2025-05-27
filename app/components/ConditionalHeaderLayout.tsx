"use client";
import { usePathname } from 'next/navigation';
import Header from './Header';
import ClientLayout from './ClientLayout';

export default function ConditionalHeaderLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideHeader = pathname === '/login' || pathname === '/signup';
  return (
    <ClientLayout>
      {!hideHeader && <Header />}
      {children}
    </ClientLayout>
  );
} 