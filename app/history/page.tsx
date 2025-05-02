'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface Recommendation {
  section: string;
  score: number;
  maxScore: number;
  details: string[];
}

interface QuizResult {
  id: number;
  score: number;
  maxScore: number;
  createdAt: string;
  answers: any;
  recommendations: string;
}

export default function HistoryPage() {
  const { data: session } = useSession();
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedResult, setExpandedResult] = useState<number | null>(null);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0058C0]"></div>
          <span className="ml-3 text-gray-600">Loading your quiz history...</span>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
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
      <div className="max-w-4xl mx-auto py-12 px-4">
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
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Quiz History</h1>
      
      <div className="space-y-4">
        {results.map((result) => (
          <div key={result.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <button
              onClick={() => setExpandedResult(expandedResult === result.id ? null : result.id)}
              className="w-full text-left p-6 focus:outline-none hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl font-semibold text-[#0058C0] mb-2">
                    Score: {result.score}/{result.maxScore} ({Math.round((result.score / result.maxScore) * 100)}%)
                  </div>
                  <div className="text-gray-500 text-sm">
                    {formatDate(result.createdAt)}
                  </div>
                </div>
                {expandedResult === result.id ? (
                  <ChevronUpIcon className="h-6 w-6 text-gray-400" />
                ) : (
                  <ChevronDownIcon className="h-6 w-6 text-gray-400" />
                )}
              </div>
            </button>

            {expandedResult === result.id && (
              <div className="px-6 pb-6 border-t border-gray-200">
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Score Breakdown</h3>
                  {result.recommendations && (
                    <div className="space-y-3">
                      {JSON.parse(result.recommendations).map((rec: Recommendation, index: number) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-[#0058C0]">{rec.section}</span>
                            <span className="text-gray-600">
                              {rec.score}/{rec.maxScore} points
                            </span>
                          </div>
                          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                            {rec.details.map((detail: string, i: number) => (
                              <li key={i}>{detail}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link 
          href="/" 
          className="inline-block px-6 py-3 bg-[#0058C0] text-white rounded-md hover:bg-[#004494] transition-colors"
        >
          Take Another Quiz
        </Link>
      </div>
    </div>
  );
} 