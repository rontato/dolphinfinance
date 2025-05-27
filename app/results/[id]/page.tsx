'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { generateProductRecommendations, ProductCategory, RecommendationProduct } from '../../lib/generateProductRecommendations';

interface QuizResult {
  id: number;
  score: number;
  maxScore: number;
  recommendations: string;
  createdAt: string;
  answers?: string | Record<string, any>;
}

interface ScoreBreakdown {
  section: string;
  score: number;
  maxScore: number;
  details: string[];
}

const calculateIncomeAndBudgetingScore = (answers: Record<number, any>): ScoreBreakdown => {
  let score = 0;
  const details: string[] = [];

  // Income Presence (5 points)
  if (answers[1] === 'yes') {
    score += 5;
    details.push('✓ Has income (+5 points)');
  } else {
    details.push('✗ No income (+0 points)');
  }

  // Income-to-Spending Ratio (10 points)
  const monthlyIncome = Number(answers[2]) || 0;
  const monthlySpending = Number(answers[3]) || 0;

  if (monthlyIncome > 0) {
    const spendingRatio = monthlySpending / monthlyIncome;
    if (spendingRatio <= 0.5) {
      score += 10;
      details.push('✓ Excellent spending ratio - ≤50% of income (+10 points)');
    } else if (spendingRatio <= 0.7) {
      score += 7;
      details.push('✓ Good spending ratio - 51-70% of income (+7 points)');
    } else if (spendingRatio <= 0.9) {
      score += 4;
      details.push('⚠ High spending ratio - 71-90% of income (+4 points)');
    } else {
      score += 1;
      details.push('✗ Very high spending ratio - >90% of income (+1 point)');
    }
  }

  return {
    section: "Income & Budgeting",
    score,
    maxScore: 15,
    details
  };
};

const calculateBankingScore = (answers: Record<number, any>): ScoreBreakdown => {
  let score = 0;
  const details: string[] = [];

  // Checking Account (5 points)
  if (answers[4] === 'yes') {
    score += 5;
    details.push('✓ Has checking account (+5 points)');
  } else {
    details.push('✗ No checking account (+0 points)');
  }

  // Savings Account (5 points)
  if (answers[7] === 'yes') {
    score += 5;
    details.push('✓ Has savings account (+5 points)');
  } else {
    details.push('✗ No savings account (+0 points)');
  }

  // High-Yield Savings Account (5 points)
  if (answers[10] === 'yes') {
    score += 5;
    details.push('✓ Has high-yield savings account (+5 points)');
  } else {
    details.push('✗ No high-yield savings account (+0 points)');
  }

  return {
    section: "Banking & Accounts",
    score,
    maxScore: 15,
    details
  };
};

const calculateDebtScore = (answers: Record<number, any>): ScoreBreakdown => {
  let score = 0;
  const details: string[] = [];
  const monthlyIncome = Number(answers[2]) || 0;

  // Calculate total monthly debt payments (rough estimation)
  const studentLoanDebt = Number(answers[14]) || 0;
  const carLoanDebt = Number(answers[16]) || 0;
  const creditCardDebt = Number(answers[20]) || 0;

  // Rough monthly payment estimation
  const monthlyDebtPayment = 
    (studentLoanDebt * 0.012) + // ~1.2% of student loan balance
    (carLoanDebt * 0.025) +    // ~2.5% of car loan balance
    (creditCardDebt * 0.035);  // ~3.5% of credit card balance

  // Debt-to-Income Ratio (10 points)
  if (monthlyIncome > 0) {
    const dti = monthlyDebtPayment / monthlyIncome;
    if (dti === 0) {
      score += 10;
      details.push('✓ No debt (DTI: 0%) (+10 points)');
    } else if (dti <= 0.15) {
      score += 8;
      details.push('✓ Low debt-to-income ratio (DTI: 1-15%) (+8 points)');
    } else if (dti <= 0.30) {
      score += 6;
      details.push('✓ Moderate debt-to-income ratio (DTI: 16-30%) (+6 points)');
    } else if (dti <= 0.45) {
      score += 3;
      details.push('⚠ High debt-to-income ratio (DTI: 31-45%) (+3 points)');
    } else {
      details.push('✗ Very high debt-to-income ratio (DTI: >45%) (+0 points)');
    }
  }

  // Debt Diversification & Type (10 points)
  const hasStudentLoan = answers[13] === 'yes';
  const hasCarLoan = answers[15] === 'yes';
  const hasCreditCardDebt = answers[19] === 'yes';

  if (!hasStudentLoan && !hasCarLoan && !hasCreditCardDebt) {
    score += 10;
    details.push('✓ No debt (+10 points)');
  } else if ((hasStudentLoan || hasCarLoan) && !hasCreditCardDebt) {
    score += 7;
    details.push('✓ Only manageable debt (+7 points)');
  } else if (hasCreditCardDebt) {
    score += 2;
    details.push('⚠ Has high-interest debt (+2 points)');
  }

  return {
    section: "Debt Management",
    score,
    maxScore: 20,
    details
  };
};

const calculateCreditScore = (answers: Record<number, any>): ScoreBreakdown => {
  let score = 0;
  const details: string[] = [];

  // Credit Score (10 points)
  const creditScore = answers[25] as string;
  if (creditScore === 'excellent') {
    score += 10;
    details.push('✓ Excellent credit score: 800+ (+10 points)');
  } else if (creditScore === 'very_good') {
    score += 8;
    details.push('✓ Very good credit score: 740-799 (+8 points)');
  } else if (creditScore === 'good') {
    score += 6;
    details.push('✓ Good credit score: 670-739 (+6 points)');
  } else if (creditScore === 'fair') {
    score += 4;
    details.push('⚠ Fair credit score: 580-669 (+4 points)');
  } else if (creditScore === 'poor') {
    score += 1;
    details.push('✗ Poor credit score: <580 (+1 point)');
  } else {
    details.push('✗ Unknown credit score (+0 points)');
  }

  // Number of Credit Cards (5 points)
  const creditCards = answers[24] as string;
  if (creditCards === 'multiple') {
    score += 5;
    details.push('✓ Has multiple credit cards (+5 points)');
  } else if (creditCards === 'one') {
    score += 3;
    details.push('✓ Has one credit card (+3 points)');
  } else {
    details.push('✗ No credit cards (+0 points)');
  }

  return {
    section: "Credit Score",
    score,
    maxScore: 15,
    details
  };
};

const calculateInvestingScore = (answers: Record<number, any>): ScoreBreakdown => {
  let score = 0;
  const details: string[] = [];

  // Brokerage Account (5 points)
  if (answers[26] === 'yes') {
    score += 5;
    details.push('✓ Has brokerage account (+5 points)');
  } else {
    details.push('✗ No brokerage account (+0 points)');
  }

  // Investment Diversity (5 points)
  const investmentTypes = Array.isArray(answers[29]) ? answers[29] : [];
  if (investmentTypes.length > 1) {
    score += 5;
    details.push('✓ Diversified investments (+5 points)');
  } else if (investmentTypes.length === 1) {
    score += 3;
    details.push('⚠ Single investment type (+3 points)');
  } else {
    details.push('✗ No investments (+0 points)');
  }

  // Investment Amount (5 points)
  const investmentAmount = Number(answers[28]) || 0;
  if (investmentAmount > 0) {
    score += 5;
    details.push('✓ Has investments (+5 points)');
  } else {
    details.push('✗ No investment amount (+0 points)');
  }

  return {
    section: "Investing",
    score,
    maxScore: 15,
    details
  };
};

const calculateRetirementScore = (answers: Record<number, any>): ScoreBreakdown => {
  let score = 0;
  const details: string[] = [];

  // Roth IRA (5 points)
  if (answers[30] === 'yes') {
    score += 5;
    details.push('✓ Has Roth IRA (+5 points)');
  } else {
    details.push('✗ No Roth IRA (+0 points)');
  }

  // 401(k) (5 points)
  if (answers[34] === 'yes') {
    score += 5;
    details.push('✓ Has 401(k) (+5 points)');
  } else {
    details.push('✗ No 401(k) (+0 points)');
  }

  // Retirement Savings Amount (10 points)
  const rothAmount = Number(answers[32]) || 0;
  const k401Amount = Number(answers[35]) || 0;
  const totalRetirement = rothAmount + k401Amount;

  if (totalRetirement >= 25000) {
    score += 10;
    details.push('✓ Excellent retirement savings (+10 points)');
  } else if (totalRetirement >= 17500) {
    score += 7;
    details.push('✓ Good retirement savings (+7 points)');
  } else if (totalRetirement >= 10000) {
    score += 5;
    details.push('⚠ Moderate retirement savings (+5 points)');
  } else if (totalRetirement > 0) {
    score += 2;
    details.push('⚠ Low retirement savings (+2 points)');
  } else {
    details.push('✗ No retirement savings (+0 points)');
  }

  return {
    section: "Retirement",
    score,
    maxScore: 20,
    details
  };
};

const calculateTotalScore = (answers: Record<number, any>) => {
  const breakdowns = [
    calculateIncomeAndBudgetingScore(answers),
    calculateBankingScore(answers),
    calculateDebtScore(answers),
    calculateCreditScore(answers),
    calculateInvestingScore(answers),
    calculateRetirementScore(answers)
  ];

  const totalScore = breakdowns.reduce((sum, b) => sum + b.score, 0);
  const maxScore = breakdowns.reduce((sum, b) => sum + b.maxScore, 0);
  const percentage = Math.round((totalScore / maxScore) * 100);

  return {
    totalScore,
    maxScore,
    percentage,
    breakdowns
  };
};

export default function QuizResultPage() {
  const params = useParams();
  const id = params?.id;
  const [result, setResult] = useState<QuizResult | null>(null);
  const [recommendations, setRecommendations] = useState<ProductCategory[]>([]);
  const [scoreBreakdowns, setScoreBreakdowns] = useState<ScoreBreakdown[]>([]);
  const [loading, setLoading] = useState(true);
  const [scoreBreakdownOpen, setScoreBreakdownOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchResult = async () => {
      try {
        const res = await fetch(`/api/quiz/result/${id}`);
        if (!res.ok) throw new Error('Failed to fetch quiz result');
        const data = await res.json();
        setResult(data);

        // Calculate score breakdowns
        const answers = typeof data.answers === 'string' ? JSON.parse(data.answers) : data.answers;
        const { breakdowns } = calculateTotalScore(answers);
        setScoreBreakdowns(breakdowns);

        // Generate recommendations
        const recs = generateProductRecommendations(answers);
        setRecommendations(recs);
      } catch (error) {
        console.error('Error fetching quiz result:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [id]);

  const handleLearnMoreClick = async (product: RecommendationProduct) => {
    window.open(product.applicationLink, '_blank');
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
                {scoreBreakdowns.map((breakdown) => (
                  <div key={breakdown.section} className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{breakdown.section}</h3>
                      <div className="text-right">
                        <span className="text-lg font-bold text-gray-900">{breakdown.score}/{breakdown.maxScore}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {breakdown.details.map((detail, index) => (
                        <p key={index} className="text-sm text-gray-600">{detail}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Recommendations */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Personalized Product Recommendations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendations.map((rec) => (
                <div key={rec.title} className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-[#0058C0] mb-4">{rec.title}</h3>
                  <div className="space-y-4">
                    {rec.products?.map((product) => (
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