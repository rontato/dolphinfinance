import { motion } from 'framer-motion';
import { calculatePercentiles, getPercentileDescription } from './PercentileCalculator';
import Recommendations from './Recommendations';
import { useSession, signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface ResultsProps {
  answers: Record<number, string | string[] | number>;
}

interface ScoreBreakdown {
  section: string;
  score: number;
  maxScore: number;
  details: string[];
}

interface PercentileData {
  groupSize: number;
  totalPercentile?: number;
  categoryPercentiles?: Record<string, number>;
}

const LOCAL_STORAGE_KEY = 'unsaved_quiz_result';

// Use browser-compatible hash function
async function hashAnswers(answers: Record<number, string | string[] | number>) {
  const msgUint8 = new TextEncoder().encode(JSON.stringify(answers));
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const Results: React.FC<ResultsProps> = ({ answers }) => {
  const { data: session, status } = useSession();
  const [saved, setSaved] = useState(false);
  const [scoreBreakdownOpen, setScoreBreakdownOpen] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState("");
  const [resultHash, setResultHash] = useState<string | null>(null);
  const [percentileData, setPercentileData] = useState<PercentileData | null>(null);
  const [percentileLoading, setPercentileLoading] = useState(false);
  const [percentileError, setPercentileError] = useState("");
  // Comment out email-related state
  // const [email, setEmail] = useState('');
  // const [isSubmitting, setIsSubmitting] = useState(false);
  // const [emailSubmitted, setEmailSubmitted] = useState(false);

  const calculateIncomeAndBudgetingScore = (): ScoreBreakdown => {
    let score = 0;
    const details: string[] = [];

    // Income Presence (5 points)
    if (answers[1] === 'yes') {
      score += 5;
      details.push('✓ Has income (+5 points)');
    } else {
      details.push('✗ No income (+0 points)');
    }

    // Income-to-Spending Ratio (15 points, scaled)
    const monthlyIncome = Number(answers[2]) || 0;
    const monthlySpending = Number(answers[3]) || 0;

    if (monthlyIncome > 0) {
      const spendingRatio = monthlySpending / monthlyIncome;
      if (spendingRatio <= 0.7) {
        score += 15;
        details.push('✓ Excellent spending ratio - You\'re saving at least 30% of your income! (+15 points)');
      } else if (spendingRatio <= 0.9) {
        score += 10;
        details.push('✓ Good spending ratio - You\'re saving at least 10% of your income! (+10 points)');
      } else if (spendingRatio <= 1.1) {
        score += 7;
        details.push('⚠ High spending ratio - You\'re living paycheck to paycheck (+7 points)');
      } else {
        score += 0;
        details.push('✗ Very high spending ratio - You\'re spending more money than you make! (+0 point)');
      }
    }

    return {
      section: "Income & Budgeting",
      score,
      maxScore: 20,
      details
    };
  };

  const calculateBankingScore = (): ScoreBreakdown => {
    let score = 0;
    const details: string[] = [];

    // Checking Account (10 points)
    if (answers[4] === 'yes') {
      score += 10;
      details.push('✓ Has checking account (+10 points)');
    } else {
      details.push('✗ No checking account (+0 points)');
    }

    // High-Yield Savings Account (10 points)
    if (answers[7] === 'yes') {
      score += 10;
      details.push('✓ Has high-yield savings account (+10 points)');
    } else {
      details.push('✗ No high-yield savings account (+0 points)');
    }

    // Checking Account Balance (5 points)
    const checkingBalance = Number(answers[6]) || 0;
    const monthlySpending = Number(answers[3]) || 0;
    if (checkingBalance > 2 * monthlySpending && monthlySpending > 0) {
      score += 5;
      details.push('✓ Checking account balance is more than 2x your monthly spending (+5 points)');
    } else if (checkingBalance > monthlySpending && monthlySpending > 0) {
      score += 2;
      details.push('✓ Checking account balance is higher than your monthly spending (+2 points)');
    } else if (checkingBalance > 0) {
      score += 1;
      details.push('✓ Has a positive checking account balance (+1 point)');
    } else {
      details.push('✗ No checking account balance (+0 points)');
    }

    return {
      section: "Banking & Accounts",
      score,
      maxScore: 25,
      details
    };
  };

  const calculateDebtScore = (): ScoreBreakdown => {
    let score = 0;
    const details: string[] = [];
    const monthlyIncome = Number(answers[2]) || 0;

    // Calculate total monthly debt payments (rough estimation)
    const studentLoanDebt = Number(answers[14]) || 0;
    const carLoanDebt = Number(answers[16]) || 0;
    const creditCardDebt = Number(answers[20]) || 0;

    // Rough monthly payment estimation (rebalance weights)
    const monthlyDebtPayment = 
      (studentLoanDebt * 0.012) + // ~1.2% of student loan balance
      (carLoanDebt * 0.025) +    // ~2.5% of car loan balance
      (creditCardDebt * 0.035); // ~3.5% of credit card balance

    // Debt-to-Income Ratio (3 points)
    if (monthlyIncome > 0) {
      const dti = monthlyDebtPayment / monthlyIncome;
      if (dti === 0) {
        score += 3;
        details.push('✓ No debt (DTI: 0%) (+3 points)');
      } else if (dti <= 0.15) {
        score += 4;
        details.push('✓ Low debt-to-income ratio (DTI: 1-15%) (+4 points)');
      } else if (dti <= 0.30) {
        score += 3;
        details.push('✓ Moderate debt-to-income ratio (DTI: 16-30%) (+3 points)');
      } else if (dti <= 0.45) {
        score += 2;
        details.push('⚠ High debt-to-income ratio (DTI: 31-45%) (+2 points)');
      } else {
        details.push('✗ Very high debt-to-income ratio (DTI: >45%) (+0 points)');
      }
    }

    // Debt Diversification & Type (2 points, rebalance)
    const hasStudentLoan = answers[13] === 'yes';
    const hasCarLoan = answers[15] === 'yes';
    const hasCreditCardDebt = answers[19] === 'yes';

    if (!hasStudentLoan && !hasCarLoan && !hasCreditCardDebt) {
      score += 2;
      details.push('✓ No debt (+2 points)');
    } else if ((hasStudentLoan || hasCarLoan) && !hasCreditCardDebt) {
      score += 1;
      details.push('✓ Only manageable debt (+1 point)');
    } else if (hasCreditCardDebt) {
      score += 1;
      details.push('⚠ Has high-interest debt (+1 point)');
    }

    return {
      section: "Debt Management",
      score,
      maxScore: 5,
      details
    };
  };

  const calculateCreditScore = (): ScoreBreakdown => {
    let score = 0;
    const details: string[] = [];

    // Credit Score (12 points)
    const creditScore = answers[25] as string;
    if (creditScore === 'excellent') {
      score += 12;
      details.push('✓ Excellent credit score: 800+ (+12 points)');
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

    // Number of Credit Cards (8 points max)
    const creditCards = answers[24] as string;
    if (creditCards === 'none' || creditCards === 'unknown') {
      details.push('✗ No credit cards (+0 points)');
    } else if (creditCards === 'one') {
      score += 3;
      details.push('✓ Has one credit card (+3 points)');
    } else if (creditCards === 'two') {
      score += 4;
      details.push('✓ Has two credit cards (+4 points)');
    } else if (creditCards === 'three') {
      score += 5;
      details.push('✓ Has three credit cards (+5 points)');
    } else if (creditCards === 'four_plus') {
      score += 6;
      details.push('✓ Has four or more credit cards (+6 points)');
    }

    return {
      section: "Credit Score",
      score,
      maxScore: 20,
      details
    };
  };

  const calculateInvestingScore = (): ScoreBreakdown => {
    let score = 0;
    const details: string[] = [];

    // Brokerage Account (7 points)
    if (answers[26] === 'yes') {
      score += 7;
      details.push('✓ Has brokerage account (+7 points)');
    } else {
      details.push('✗ No brokerage account (+0 points)');
    }

    // Investment Diversity (7 points)
    const investmentTypes = Array.isArray(answers[29]) ? answers[29] : [];
    if (investmentTypes.length > 1) {
      score += 7;
      details.push('✓ Diversified investments (+7 points)');
    } else if (investmentTypes.length === 1) {
      score += 3;
      details.push('⚠ Single investment type (+3 points)');
    } else {
      details.push('✗ No investments (+0 points)');
    }

    // Investment Amount (6 points)
    const investmentAmount = Number(answers[28]) || 0;
    if (investmentAmount > 0) {
      score += 6;
      details.push('✓ Has investments (+6 points)');
    } else {
      details.push('✗ No investment amount (+0 points)');
    }

    return {
      section: "Investing",
      score,
      maxScore: 20,
      details
    };
  };

  const calculateRetirementScore = (): ScoreBreakdown => {
    let score = 0;
    const details: string[] = [];

    // Roth IRA (4 points)
    if (answers[30] === 'yes') {
      score += 4;
      details.push('✓ Has Roth IRA (+4 points)');
    } else {
      details.push('✗ No Roth IRA (+0 points)');
    }

    // Retirement Savings Amount (6 points, diminishing returns)
    const rothAmount = Number(answers[32]) || 0;
    const totalRetirement = rothAmount;

    if (totalRetirement >= 25000) {
      score += 6;
      details.push('✓ Excellent retirement savings (+6 points)');
    } else if (totalRetirement >= 17500) {
      score += 5;
      details.push('✓ Very strong retirement savings (+5 points)');
    } else if (totalRetirement >= 10000) {
      score += 4;
      details.push('✓ Strong retirement savings (+4 points)');
    } else if (totalRetirement >= 5000) {
      score += 3;
      details.push('✓ Good retirement savings (+3 points)');
    } else if (totalRetirement > 0) {
      score += 2;
      details.push('✓ Has some retirement savings (+2 points)');
    } else {
      details.push('✗ No retirement savings (+0 points)');
    }

    return {
      section: "Retirement",
      score,
      maxScore: 10,
      details
    };
  };

  const calculateTotalScore = () => {
    const breakdowns = [
      calculateIncomeAndBudgetingScore(),
      calculateBankingScore(),
      calculateDebtScore(),
      calculateCreditScore(),
      calculateInvestingScore(),
      calculateRetirementScore()
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

  const { totalScore, maxScore, percentage, breakdowns } = calculateTotalScore();

  // Fetch percentiles if logged in
  useEffect(() => {
    const age = answers[3.5];
    if (session && age && typeof age === 'number') {
      setPercentileLoading(true);
      setPercentileError("");
      fetch('/api/quiz/percentiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ age, score: totalScore, breakdowns }),
      })
        .then(res => res.json())
        .then(data => setPercentileData(data))
        .catch(err => setPercentileError('Failed to load percentiles'))
        .finally(() => setPercentileLoading(false));
    }
  }, [session, answers, totalScore, breakdowns]);

  useEffect(() => {
    hashAnswers(answers).then(setResultHash);
  }, [answers]);

  // Save results to localStorage if not logged in
  useEffect(() => {
    if (!session && !saved && resultHash) {
      const quizData = {
        answers,
        score: percentage,
        maxScore,
        breakdowns,
        hash: resultHash,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(quizData));
    }
  }, [session, saved, answers, percentage, maxScore, breakdowns, resultHash]);

  // For logged-in users, save result only once on first render if not already saved and nothing in localStorage
  useEffect(() => {
    if (session && !saved && resultHash) {
      console.log('Attempting to save quiz result', { resultHash, session });
      const local = localStorage.getItem(LOCAL_STORAGE_KEY);
      const saveResults = async (payload: any) => {
        try {
          setSigningIn(true);
          setError("");
          console.log('Checking for duplicate result with hash:', payload.hash);
          const checkRes = await fetch('/api/quiz/result/check-duplicate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ hash: payload.hash }),
          });
          const checkData = await checkRes.json();
          console.log('Duplicate check result:', checkData);
          if (!checkData.exists) {
            console.log('Saving quiz result to API:', payload);
          const res = await fetch('/api/quiz/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
      });
          if (!res.ok) {
            const data = await res.json();
              console.error('Save failed:', data);
            throw new Error(data.error || 'Failed to save results');
            }
            console.log('Quiz result saved successfully');
          } else {
            console.log('Quiz result already exists, not saving');
          }
      setSaved(true);
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        } catch (err: any) {
          setError(err.message || 'Failed to save results');
          console.error('Save error:', err);
    } finally {
          setSigningIn(false);
    }
  };
      if (local) {
        let quizData;
        try {
          quizData = JSON.parse(local);
        } catch {}
        const payload = quizData || { answers, score: percentage, maxScore, breakdowns, hash: resultHash };
        saveResults(payload);
      } else {
        const payload = { answers, score: percentage, maxScore, breakdowns, hash: resultHash };
        saveResults(payload);
      }
    }
  }, [session, saved, resultHash, answers, percentage, maxScore, breakdowns]);

  return (
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
                  strokeDasharray={`${percentage * 2.83}, 283`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                  style={{ transition: 'stroke-dasharray 1s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold text-gray-900">{percentage}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Percentile Comparison (Live) */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 flex flex-col items-center justify-center">
          <div className="text-center w-full">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">How do you compare?</h3>
            <p className="text-base text-gray-600 mb-4">See how your financial health stacks up against other students your age.</p>
            {!session && (
              <Link href="/login">
                <button
                  className="inline-block bg-[#0058C0] text-white px-6 py-2 rounded-full font-semibold hover:opacity-90 transition duration-150 active:scale-95 active:opacity-80 mt-2"
                >
                  Sign in to unlock this feature
                </button>
              </Link>
            )}
            {session && percentileLoading && <p className="text-gray-500">Loading percentile data...</p>}
            {session && percentileError && <p className="text-red-500">{percentileError}</p>}
            {session && percentileData && (
              percentileData.groupSize < 100 ? (
                <>
                  <p className="text-lg text-gray-600 mb-2">Percentile results are coming soon!</p>
                  <p className="text-sm text-gray-400 mb-4">{`Only ${percentileData.groupSize} result${percentileData.groupSize === 1 ? '' : 's'} in your age group so far.`}</p>
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <div className="text-4xl font-bold mb-2 text-[#0058C0]">{percentileData.totalPercentile}th Percentile</div>
                    <div className="text-xl text-gray-600 mb-2">Overall</div>
                  </div>
                  <div className="w-full max-w-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
                    {percentileData.categoryPercentiles && Object.entries(percentileData.categoryPercentiles).map(([section, pct]) => (
                      <div key={section} className="mb-2">
                        <div className="flex justify-between mb-1">
                          <span className="font-semibold text-gray-700">{section}</span>
                          <span className="font-semibold text-[#0058C0]">{pct}th</span>
                  </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-[#0058C0] h-2 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-4">Based on {percentileData.groupSize} results in your age group.</p>
                </>
              )
            )}
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
              {breakdowns.map((rec) => (
                <div key={rec.section} className="bg-gray-50 rounded-md p-3">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-base font-semibold text-[#0058C0]">{rec.section}</h4>
                    <span className="text-gray-900 font-semibold text-sm">{rec.score}/{rec.maxScore}</span>
                  </div>
                  <div className="bg-gray-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#0058C0] h-full"
                      style={{ width: `${(rec.score / rec.maxScore) * 100}%` }}
                    />
                  </div>
                  <ul className="mt-2 space-y-1">
                    {rec.details.map((detail, index) => (
                      <li key={index} className="text-gray-600 text-sm">{detail}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
          </div>

        {/* Product Recommendations */}
        <Recommendations answers={answers} />

        {/* Call to Action */}
        {!session && (
          <div className="bg-[#e6f0fa] rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold text-[#0058C0] mb-2">Save Your Results</h3>
            <p className="text-gray-600 mb-4">Create an account to save your results and track your financial health over time.</p>
            <button
              onClick={() => { window.location.href = '/auth'; }}
              className="inline-block bg-[#0058C0] text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition duration-150 active:scale-95 active:opacity-80"
              disabled={signingIn}
            >
              Sign In / Create Account
            </button>
            {error && <div className="text-red-500 mt-2">{error}</div>}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Results; 