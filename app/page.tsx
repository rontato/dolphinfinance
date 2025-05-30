'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Quiz from './components/Quiz';

export default function Home() {
  const [showQuiz, setShowQuiz] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (!showQuiz && !showResults) {
      document.body.classList.add('overflow-hidden', 'h-screen');
    } else {
      document.body.classList.remove('overflow-hidden', 'h-screen');
    }
    return () => {
      document.body.classList.remove('overflow-hidden', 'h-screen');
    };
  }, [showQuiz, showResults]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      {/* Hero Section */}
      {!showResults && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl mb-4 leading-[1.1]">
              <span className="block text-blue-gradient-home">Dive into your Finances</span>
            </h1>
            <p className="mt-0 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-0 md:text-xl md:max-w-3xl">
              The 2-min quiz helping college students master money with personalized financial insights. 📊✨
            </p>
          </div>
        </div>
      )}
      {/* Quiz Section */}
      <div id="quiz-section" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8" style={{ color: '#000' }}>
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
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white md:py-4 md:text-lg md:px-10 bg-[#0058C0] hover:opacity-90 transition duration-150 active:scale-95 active:opacity-80"
                >
                  🚀 Get Your Score!
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Credibility / Social Proof Section */}
      {!showQuiz && !showResults && (
        <div className="w-full flex flex-col items-center justify-center mt-16">
          <img
            src="/assets/Anthropic Logo.png"
            alt="Anthropic Logo"
            className="h-7 w-auto mb-1"
            style={{ filter: 'grayscale(1) brightness(0.5) invert(0.3) opacity(0.85)' }}
          />
          <div className="text-center">
            <div className="text-sm font-semibold text-gray-400">Backed by the Anthropic Student Builders</div>
          </div>
        </div>
      )}
    </main>
  );
}
