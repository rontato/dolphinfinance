"use client";
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function QuizResultSaver() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const LOCAL_STORAGE_KEY = 'unsaved_quiz_result';
    if (status === 'authenticated' && typeof window !== 'undefined') {
      const local = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (local) {
        const quizData = JSON.parse(local);
        fetch('/api/quiz/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(quizData),
        }).then(() => {
          localStorage.removeItem(LOCAL_STORAGE_KEY);
          router.push('/history');
        });
      }
    }
  }, [status, router]);

  return null;
} 