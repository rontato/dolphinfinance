'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { generateProductRecommendations, ProductCategory } from '../../lib/generateProductRecommendations';

interface QuizResult {
  id: number;
  score: number;
  maxScore: number;
  recommendations: string;
  createdAt: string;
}

interface Recommendation {
  section: string;
  score: number;
  maxScore: number;
  details: string[];
  products?: {
    name: string;
    description: string;
    link: string;
  }[];
}

export default function QuizResultPage({ params, searchParams }: any) {
  const [result, setResult] = useState<QuizResult | null>(null);
  const [recommendations, setRecommendations] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [scoreBreakdownOpen, setScoreBreakdownOpen] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('/api/quiz/history');
        if (!response.ok) {
          throw new Error('Failed to fetch history');
        }
        const data = await response.json();
        const found = data.find((r: QuizResult) => String(r.id) === params.id);
        if (!found) {
          setResult(null);
          setLoading(false);
          return;
        }
        setResult(found);
        const answers = typeof found.answers === 'string' ? JSON.parse(found.answers) : found.answers;
        setRecommendations(generateProductRecommendations(answers));
      } catch (error) {
        console.error('Error fetching result:', error);
        setResult(null);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [params.id]);

  const handleLearnMoreClick = async (product: { name: string; link: string }) => {
    // Link tracking removed
    window.open(product.link, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0058C0]"></div>
        <span className="ml-3 text-gray-600">Loading results...</span>
      </div>
    );
  }

  if (!result) {
    return notFound();
  }

  const scorePercentage = (result.score / result.maxScore) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back button */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link 
              href="/history" 
              className="flex items-center text-gray-500 hover:text-gray-700"
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to History
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Your Financial Health Assessment Results
          </h2>
          
          {/* Financial Health Score */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-2xl font-semibold text-[#0058C0] mb-4">Financial Health Score</h3>
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-40 h-40 mb-4">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e9ecef"
                    strokeWidth="10"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#0058C0"
                    strokeWidth="10"
                    strokeDasharray={`${scorePercentage * 2.83}, 283`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                    style={{ transition: 'stroke-dasharray 1s ease' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold text-gray-900">{scorePercentage}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Score Breakdown (Dropdown) */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
            <button
              className="flex items-center justify-between w-full text-xl font-semibold text-[#0058C0] mb-2 focus:outline-none"
              onClick={() => setScoreBreakdownOpen((open) => !open)}
              aria-expanded={scoreBreakdownOpen}
            >
              <span>Score Breakdown</span>
              <svg
                className={`w-6 h-6 ml-2 transition-transform ${scoreBreakdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {scoreBreakdownOpen && (
              <div className="space-y-3">
                {recommendations.filter((rec: any) => rec.details && rec.score !== undefined && rec.maxScore !== undefined).map((rec: any) => (
                  <div key={rec.title} className="bg-gray-50 rounded-md p-3">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-base font-semibold text-[#0058C0]">{rec.title}</h4>
                      <span className="text-gray-900 font-semibold text-sm">{rec.score}/{rec.maxScore}</span>
                    </div>
                    <div className="bg-gray-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#0058C0] h-full"
                        style={{ width: `${(rec.score / rec.maxScore) * 100}%` }}
                      />
                    </div>
                    <ul className="mt-2 space-y-1">
                      {rec.details.map((detail: string, index: number) => (
                        <li key={index} className="text-gray-600 text-sm">{detail}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Recommendations */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Personalized Product Recommendations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendations.map((rec: ProductCategory) => (
                <div key={rec.title} className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-[#0058C0] mb-4">{rec.title}</h3>
                  <div className="space-y-4">
                    {rec.products?.map((product: any) => (
                      <div key={product.name} className="bg-white rounded-lg p-4 shadow-sm">
                        <h4 className="font-semibold text-gray-900 mb-2">{product.name}</h4>
                        <p className="text-gray-600 mb-4">{product.description}</p>
                        <a
                          href={product.applicationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => handleLearnMoreClick(product)}
                          className="inline-block bg-[#0058C0] text-white px-4 py-2 rounded-md hover:bg-[#004494] transition-colors"
                        >
                          Learn More
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 