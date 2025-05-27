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

  const calculateBankingScore = (): ScoreBreakdown => {
    let score = 0;
    const details: string[] = [];

    // Checking Account (5 points)
    if (answers[4] === 'yes') {
      score += 5;
      details.push('✓ Has checking account (+5 points)');
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

    return {
      section: "Banking & Accounts",
      score,
      maxScore: 15,
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

    // Debt Diversification & Type (10 points, rebalance)
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

  const calculateCreditScore = (): ScoreBreakdown => {
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

  const calculateInvestingScore = (): ScoreBreakdown => {
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

  const calculateRetirementScore = (): ScoreBreakdown => {
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

  // --- Percentile Breakdown Feature (Commented Out) ---
  /*
  const calculatePercentileInputs = () => {
    // Calculate total debt
    const studentLoanDebt = Number(answers[14]) || 0;
    const carLoanDebt = Number(answers[16]) || 0;
    const mortgageDebt = Number(answers[18]) || 0;
    const creditCardDebt = Number(answers[20]) || 0;
    const otherDebt = Number(answers[23]) || 0;
    const totalDebt = studentLoanDebt + carLoanDebt + mortgageDebt + creditCardDebt + otherDebt;

    // Calculate total savings
    const checkingBalance = Number(answers[6]) || 0;
    const savingsBalance = Number(answers[9]) || 0;
    const hysaBalance = Number(answers[12]) || 0;
    const totalSavings = checkingBalance + savingsBalance + hysaBalance;

    // Get investment and retirement balances
    const investmentBalance = Number(answers[28]) || 0;
    const rothBalance = Number(answers[32]) || 0;
    const k401Balance = Number(answers[35]) || 0;
    const retirementSavings = rothBalance + k401Balance;

    return {
      age: 30, // TODO: Add age question to quiz
      monthlyIncome: Number(answers[2]) || 0,
      monthlySpending: Number(answers[3]) || 0,
      creditScore: answers[25] as string || 'unknown',
      totalDebt,
      totalSavings,
      investmentBalance,
      retirementSavings
    };
  };

  const percentileData = calculatePercentiles(calculatePercentileInputs());

  const renderPercentileSection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-lg shadow-lg p-6 mb-8"
    >
      <h3 className="text-2xl font-bold text-gray-900 mb-6">How You Compare to Your Peers</h3>
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-4xl font-bold mb-2" style={{ color: '#0058C0' }}>
            {percentileData.finalPercentile}th Percentile
          </div>
          <div className="text-xl text-gray-600">
            {getPercentileDescription(percentileData.finalPercentile)}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="relative pt-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-sm font-semibold text-gray-700">Income</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold" style={{ color: '#0058C0' }}>
                    {percentileData.incomePercentile}th Percentile
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 bg-gray-200 rounded">
                <div
                  className="h-full rounded"
                  style={{ width: `${percentileData.incomePercentile}%`, backgroundColor: '#0058C0' }}
                />
              </div>
            </div>

            <div className="relative pt-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-sm font-semibold text-gray-700">Spending</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold" style={{ color: '#0058C0' }}>
                    {percentileData.spendingPercentile}th Percentile
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 bg-gray-200 rounded">
                <div
                  className="h-full rounded"
                  style={{ width: `${percentileData.spendingPercentile}%`, backgroundColor: '#0058C0' }}
                />
              </div>
            </div>

            <div className="relative pt-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-sm font-semibold text-gray-700">Debt Management</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold" style={{ color: '#0058C0' }}>
                    {percentileData.debtPercentile}th Percentile
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 bg-gray-200 rounded">
                <div
                  className="h-full rounded"
                  style={{ width: `${percentileData.debtPercentile}%`, backgroundColor: '#0058C0' }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative pt-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-sm font-semibold text-gray-700">Credit Score</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold" style={{ color: '#0058C0' }}>
                    {percentileData.creditScorePercentile}th Percentile
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 bg-gray-200 rounded">
                <div
                  className="h-full rounded"
                  style={{ width: `${percentileData.creditScorePercentile}%`, backgroundColor: '#0058C0' }}
                />
              </div>
            </div>

            <div className="relative pt-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-sm font-semibold text-gray-700">Savings</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold" style={{ color: '#0058C0' }}>
                    {percentileData.savingsPercentile}th Percentile
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 bg-gray-200 rounded">
                <div
                  className="h-full rounded"
                  style={{ width: `${percentileData.savingsPercentile}%`, backgroundColor: '#0058C0' }}
                />
              </div>
            </div>

            <div className="relative pt-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-sm font-semibold text-gray-700">Investments</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold" style={{ color: '#0058C0' }}>
                    {percentileData.investmentPercentile}th Percentile
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 bg-gray-200 rounded">
                <div
                  className="h-full rounded"
                  style={{ width: `${percentileData.investmentPercentile}%`, backgroundColor: '#0058C0' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
  */
  // --- End Percentile Breakdown Feature ---

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

        {/* Percentile Comparison (Commented Out) */}
        {/**
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-2xl font-semibold text-[#0058C0] mb-4">How You Compare to Your Peers</h3>
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2" style={{ color: '#0058C0' }}>
                {percentileData.finalPercentile}th Percentile
              </div>
              <div className="text-xl text-gray-600">
                {getPercentileDescription(percentileData.finalPercentile)}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative pt-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-sm font-semibold text-gray-700">Income</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold" style={{ color: '#0058C0' }}>
                        {percentileData.incomePercentile}th Percentile
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 bg-gray-200 rounded">
                    <div
                      className="h-full rounded"
                      style={{ width: `${percentileData.incomePercentile}%`, backgroundColor: '#0058C0' }}
                    />
                  </div>
                </div>

                <div className="relative pt-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-sm font-semibold text-gray-700">Spending</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold" style={{ color: '#0058C0' }}>
                        {percentileData.spendingPercentile}th Percentile
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 bg-gray-200 rounded">
                    <div
                      className="h-full rounded"
                      style={{ width: `${percentileData.spendingPercentile}%`, backgroundColor: '#0058C0' }}
                    />
                  </div>
                </div>

                <div className="relative pt-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-sm font-semibold text-gray-700">Debt Management</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold" style={{ color: '#0058C0' }}>
                        {percentileData.debtPercentile}th Percentile
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 bg-gray-200 rounded">
                    <div
                      className="h-full rounded"
                      style={{ width: `${percentileData.debtPercentile}%`, backgroundColor: '#0058C0' }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative pt-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-sm font-semibold text-gray-700">Credit Score</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold" style={{ color: '#0058C0' }}>
                        {percentileData.creditScorePercentile}th Percentile
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 bg-gray-200 rounded">
                    <div
                      className="h-full rounded"
                      style={{ width: `${percentileData.creditScorePercentile}%`, backgroundColor: '#0058C0' }}
                    />
                  </div>
                </div>

                <div className="relative pt-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-sm font-semibold text-gray-700">Savings</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold" style={{ color: '#0058C0' }}>
                        {percentileData.savingsPercentile}th Percentile
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 bg-gray-200 rounded">
                    <div
                      className="h-full rounded"
                      style={{ width: `${percentileData.savingsPercentile}%`, backgroundColor: '#0058C0' }}
                    />
                  </div>
                </div>

                <div className="relative pt-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-sm font-semibold text-gray-700">Investments</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold" style={{ color: '#0058C0' }}>
                        {percentileData.investmentPercentile}th Percentile
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 bg-gray-200 rounded">
                    <div
                      className="h-full rounded"
                      style={{ width: `${percentileData.investmentPercentile}%`, backgroundColor: '#0058C0' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        */}

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