import { motion } from 'framer-motion';
import { calculatePercentiles, getPercentileDescription } from './PercentileCalculator';
import Recommendations from './Recommendations';

interface ResultsProps {
  answers: Record<number, string | string[] | number>;
}

interface ScoreBreakdown {
  section: string;
  score: number;
  maxScore: number;
  details: string[];
}

const Results: React.FC<ResultsProps> = ({ answers }) => {
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

  const calculateDebtScore = (): ScoreBreakdown => {
    let score = 0;
    const details: string[] = [];
    const monthlyIncome = Number(answers[2]) || 0;

    // Calculate total monthly debt payments (rough estimation)
    const studentLoanDebt = Number(answers[14]) || 0;
    const carLoanDebt = Number(answers[16]) || 0;
    const mortgageDebt = Number(answers[18]) || 0;
    const creditCardDebt = Number(answers[20]) || 0;
    const otherDebt = Number(answers[23]) || 0;

    // Rough monthly payment estimation
    const monthlyDebtPayment = 
      (studentLoanDebt * 0.01) + // ~1% of student loan balance
      (carLoanDebt * 0.02) +    // ~2% of car loan balance
      (mortgageDebt * 0.005) +  // ~0.5% of mortgage balance
      (creditCardDebt * 0.03) + // ~3% of credit card balance
      (otherDebt * 0.02);      // ~2% of other debt balance

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
    const hasMortgage = answers[17] === 'yes';
    const hasCreditCardDebt = answers[19] === 'yes';
    const hasOtherDebt = answers[21] === 'yes';
    const otherDebtTypes = Array.isArray(answers[22]) ? answers[22] : [];

    if (!hasStudentLoan && !hasCarLoan && !hasMortgage && !hasCreditCardDebt && !hasOtherDebt) {
      score += 10;
      details.push('✓ No debt (+10 points)');
    } else if (hasMortgage && !hasCreditCardDebt && !hasOtherDebt) {
      score += 8;
      details.push('✓ Only mortgage debt (+8 points)');
    } else if (hasMortgage && (hasStudentLoan || hasCarLoan) && !hasCreditCardDebt && !hasOtherDebt) {
      score += 7;
      details.push('✓ Mortgage + manageable debt (+7 points)');
    } else if ((hasStudentLoan || hasCarLoan) && !hasMortgage && !hasCreditCardDebt && !hasOtherDebt) {
      score += 6;
      details.push('✓ Only manageable debt (+6 points)');
    } else if (hasCreditCardDebt || otherDebtTypes.includes('personal')) {
      score += 2;
      details.push('⚠ Has high-interest debt (+2 points)');
    } else if (otherDebtTypes.includes('payday') || otherDebtTypes.includes('medical')) {
      score += 0;
      details.push('✗ Has payday loans or medical debt (+0 points)');
    }

    return {
      section: "Debt Consideration",
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
      section: "Debt & Credit Health",
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
    // Note: Age-based comparison would need to be implemented
    const investmentAmount = Number(answers[28]) || 0;
    if (investmentAmount > 0) {
      score += 5;
      details.push('✓ Has investments (+5 points)');
    } else {
      details.push('✗ No investment amount (+0 points)');
    }

    return {
      section: "Investing Knowledge & Habits",
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

    // Note: This would need to be adjusted based on age
    if (totalRetirement >= 100000) {
      score += 10;
      details.push('✓ Excellent retirement savings (+10 points)');
    } else if (totalRetirement >= 75000) {
      score += 7;
      details.push('✓ Good retirement savings (+7 points)');
    } else if (totalRetirement >= 50000) {
      score += 5;
      details.push('⚠ Moderate retirement savings (+5 points)');
    } else if (totalRetirement > 0) {
      score += 2;
      details.push('⚠ Low retirement savings (+2 points)');
    } else {
      details.push('✗ No retirement savings (+0 points)');
    }

    return {
      section: "Long-Term Savings & Retirement",
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
          <div className="text-4xl font-bold text-indigo-600 mb-2">
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
                  <span className="text-sm font-semibold text-indigo-600">
                    {percentileData.incomePercentile}th Percentile
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 bg-gray-200 rounded">
                <div
                  className="h-full bg-indigo-600 rounded"
                  style={{ width: `${percentileData.incomePercentile}%` }}
                />
              </div>
            </div>

            <div className="relative pt-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-sm font-semibold text-gray-700">Spending</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-indigo-600">
                    {percentileData.spendingPercentile}th Percentile
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 bg-gray-200 rounded">
                <div
                  className="h-full bg-indigo-600 rounded"
                  style={{ width: `${percentileData.spendingPercentile}%` }}
                />
              </div>
            </div>

            <div className="relative pt-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-sm font-semibold text-gray-700">Debt Management</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-indigo-600">
                    {percentileData.debtPercentile}th Percentile
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 bg-gray-200 rounded">
                <div
                  className="h-full bg-indigo-600 rounded"
                  style={{ width: `${percentileData.debtPercentile}%` }}
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
                  <span className="text-sm font-semibold text-indigo-600">
                    {percentileData.creditScorePercentile}th Percentile
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 bg-gray-200 rounded">
                <div
                  className="h-full bg-indigo-600 rounded"
                  style={{ width: `${percentileData.creditScorePercentile}%` }}
                />
              </div>
            </div>

            <div className="relative pt-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-sm font-semibold text-gray-700">Savings</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-indigo-600">
                    {percentileData.savingsPercentile}th Percentile
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 bg-gray-200 rounded">
                <div
                  className="h-full bg-indigo-600 rounded"
                  style={{ width: `${percentileData.savingsPercentile}%` }}
                />
              </div>
            </div>

            <div className="relative pt-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-sm font-semibold text-gray-700">Investments</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-indigo-600">
                    {percentileData.investmentPercentile}th Percentile
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 bg-gray-200 rounded">
                <div
                  className="h-full bg-indigo-600 rounded"
                  style={{ width: `${percentileData.investmentPercentile}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Your Financial Health Score
        </h2>
        
        <div className="relative inline-block">
          <svg className="w-48 h-48">
            <circle
              className="text-gray-200"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
              r="70"
              cx="96"
              cy="96"
            />
            <circle
              className="text-indigo-600"
              strokeWidth="8"
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="70"
              cx="96"
              cy="96"
              strokeDasharray={`${440 * (percentage / 100)} 440`}
              transform="rotate(-90 96 96)"
            />
          </svg>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <span className="text-4xl font-bold text-gray-900">{percentage}</span>
            <span className="text-xl font-semibold text-gray-600">/100</span>
          </div>
        </div>

        <details className="mt-8 text-left max-w-2xl mx-auto bg-white rounded-lg shadow-sm">
          <summary className="px-6 py-4 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors">
            <span className="font-semibold text-gray-900">View Score Breakdown</span>
            <span className="text-sm text-gray-500 ml-2">({totalScore}/{maxScore} points)</span>
          </summary>
          <div className="px-6 pb-4 space-y-6">
            {breakdowns.map((breakdown, index) => (
              <motion.div
                key={breakdown.section}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border-t pt-4 first:border-t-0 first:pt-0"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {breakdown.section}
                  </h3>
                  <span className="text-gray-600">
                    {breakdown.score}/{breakdown.maxScore}
                  </span>
                </div>
                <ul className="space-y-1 text-sm text-gray-600">
                  {breakdown.details.map((detail, i) => (
                    <li key={i}>{detail}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </details>
      </motion.div>

      {renderPercentileSection()}
      <Recommendations answers={answers} />
    </div>
  );
};

export default Results; 