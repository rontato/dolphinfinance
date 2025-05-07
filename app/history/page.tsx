'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { generateProductRecommendations, ProductCategory } from '../lib/generateProductRecommendations';

interface QuizResult {
  id: number;
  score: number;
  maxScore: number;
  answers: string;
  createdAt: string;
}

export default function HistoryPage() {
  const { data: session } = useSession();
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      fetch('/api/quiz/history')
        .then(res => res.json())
        .then(data => {
          setResults(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching quiz history:', error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [session]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0058C0]"></div>
        <span className="ml-3 text-gray-600">Loading your quiz history...</span>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign in to View Your History</h2>
          <p className="text-gray-600 mb-6">Please sign in to access your quiz history and track your financial health progress.</p>
          <Link 
            href="/login" 
            className="inline-block px-6 py-3 bg-[#0058C0] text-white rounded-md hover:bg-[#004494] transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Quiz Results Yet</h2>
          <p className="text-gray-600 mb-6">Take your first financial health assessment to start tracking your progress!</p>
          <Link 
            href="/" 
            className="inline-block px-6 py-3 bg-[#0058C0] text-white rounded-md hover:bg-[#004494] transition-colors"
          >
            Take Quiz
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Quiz History</h1>
        
        <div className="grid grid-cols-1 gap-6">
          {results.map((result) => {
            const answers = typeof result.answers === 'string' ? JSON.parse(result.answers) : result.answers;
            const recommendations: ProductCategory[] = generateProductRecommendations(answers);
            const scorePercentage = (result.score / result.maxScore) * 100;
            const date = new Date(result.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });

            return (
              <Link 
                key={result.id} 
                href={`/results/${result.id}`}
                className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Financial Health Assessment</h2>
                      <p className="text-gray-500">{date}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {result.score}/{result.maxScore}
                      </div>
                      <div className="text-sm text-gray-500">Score</div>
                    </div>
                  </div>

                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#0058C0]"
                      style={{ width: `${scorePercentage}%` }}
                    />
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendations.slice(0, 2).map((rec: ProductCategory) => (
                      <div key={rec.title} className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-[#0058C0]">{rec.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {rec.products?.[0]?.name || 'No recommendations'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
} 