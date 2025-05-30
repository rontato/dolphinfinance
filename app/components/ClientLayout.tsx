"use client";
import { SessionProvider } from 'next-auth/react';
import QuizResultSaver from './QuizResultSaver';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QuizResultSaver />
      {children}
    </SessionProvider>
  );
} 