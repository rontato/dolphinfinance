'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Quiz from './components/Quiz';

export default function Home() {
  const [showQuiz, setShowQuiz] = useState(false);
  const [showResults, setShowResults] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      {/* Hero Section */}
      {!showResults && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block" style={{ color: '#0058C0' }}>Dive into your Finances</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              In college and don't know where to get started with personal finance? Take this quiz to find out what your financial health score is and how you stack up compared to your peers. Get personalized recommendations on how to improve your finances! 🚀
            </p>
          </div>
        </div>
      )}
      {/* Quiz Section */}
      <div id="quiz-section" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white shadow-xl rounded-lg p-6 md:p-8" style={{ color: '#000' }}>
          {showQuiz ? (
            <Quiz onShowResults={() => setShowResults(true)} />
          ) : (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Financial Health Assessment</h2>
              <p className="text-gray-600">
                Answer a few questions about your financial habits and get:
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">Your personalized financial health score</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">How you compare to your peers</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">Tailored recommendations to improve your score</p>
                </li>
              </ul>
              <div className="mt-8">
                <button
                  onClick={() => setShowQuiz(true)}
                  type="button"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white md:py-4 md:text-lg md:px-10"
                  style={{ backgroundColor: '#0058C0' }}
                  onMouseOver={e => (e.currentTarget.style.backgroundColor = '#004494')}
                  onMouseOut={e => (e.currentTarget.style.backgroundColor = '#0058C0')}
                >
                  Start Quiz
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
