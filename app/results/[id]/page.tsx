'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

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

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function QuizResultPage({ params }: Props) {
  const [result, setResult] = useState<QuizResult | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await fetch(`/api/quiz/result/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch result');
        }
        const data = await response.json();
        setResult(data);
        setRecommendations(
          typeof data.recommendations === 'string'
            ? JSON.parse(data.recommendations)
            : data.recommendations
        );
      } catch (error) {
        console.error('Error fetching result:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [params.id]);

  const handleLearnMoreClick = async (product: { name: string; link: string }) => {
    try {
      await fetch('/api/track-link-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizResultId: Number(params.id),
          productName: product.name,
          productLink: product.link,
        }),
  });
    } catch (error) {
      console.error('Error tracking link click:', error);
    }
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Score Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Financial Health Assessment Results</h1>
          
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48 mb-6">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#e9ecef"
                  strokeWidth="8"
                />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#0058C0"
                  strokeWidth="8"
                  strokeDasharray={`${scorePercentage * 2.827}, 283`}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-4xl font-bold text-gray-900">{result.score}</span>
                  <span className="text-2xl text-gray-500">/{result.maxScore}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Percentile Visualization */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">How You Compare</h2>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            {/* Add your percentile visualization component here */}
            <p className="text-gray-500">Percentile visualization coming soon</p>
          </div>
        </div>

        {/* Product Recommendations */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Personalized Product Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((rec: Recommendation) => (
              <div key={rec.section} className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-[#0058C0] mb-4">{rec.section}</h3>
                <div className="space-y-4">
                  {rec.products?.map((product) => (
                    <div key={product.name} className="bg-white rounded-lg p-4 shadow-sm">
                      <h4 className="font-semibold text-gray-900 mb-2">{product.name}</h4>
                      <p className="text-gray-600 mb-4">{product.description}</p>
                      <a
                        href={product.link}
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

        {/* Score Breakdown */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Score Breakdown</h2>
          <div className="space-y-6">
            {recommendations.map((rec: Recommendation) => (
              <div key={rec.section} className="bg-gray-50 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-[#0058C0]">{rec.section}</h3>
                  <span className="text-gray-900 font-semibold">{rec.score}/{rec.maxScore}</span>
                </div>
                <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#0058C0] h-full"
                    style={{ width: `${(rec.score / rec.maxScore) * 100}%` }}
                  />
                </div>
                <ul className="mt-4 space-y-2">
                  {rec.details.map((detail, index) => (
                    <li key={index} className="text-gray-600">{detail}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
} 