interface AverageData {
  monthlyIncome: number;
  monthlySpending: number;
  totalDebt: number;
  totalSavings: number;
  investmentBalance: number;
  retirementSavings: number;
}

const AGE_GROUP_AVERAGES: Record<string, AverageData> = {
  '18-25': {
    monthlyIncome: 3200,
    monthlySpending: 2800,
    totalDebt: 18000,
    totalSavings: 5000,
    investmentBalance: 10000,
    retirementSavings: 15000
  },
  '26-35': {
    monthlyIncome: 5500,
    monthlySpending: 4300,
    totalDebt: 50000,
    totalSavings: 15000,
    investmentBalance: 25000,
    retirementSavings: 50000
  },
  '36-45': {
    monthlyIncome: 7500,
    monthlySpending: 5500,
    totalDebt: 120000,
    totalSavings: 35000,
    investmentBalance: 50000,
    retirementSavings: 140000
  },
  '46-55': {
    monthlyIncome: 8200,
    monthlySpending: 6200,
    totalDebt: 140000,
    totalSavings: 55000,
    investmentBalance: 100000,
    retirementSavings: 300000
  }
};

const CREDIT_SCORE_PERCENTILES: Record<string, number> = {
  'excellent': 95,
  'very_good': 85,
  'good': 70,
  'fair': 40,
  'poor': 15,
  'unknown': 10
};

interface PercentileInputs {
  age: number;
  monthlyIncome: number;
  monthlySpending: number;
  creditScore: string;
  totalDebt: number;
  totalSavings: number;
  investmentBalance: number;
  retirementSavings: number;
}

interface PercentileResults {
  incomePercentile: number;
  spendingPercentile: number;
  debtPercentile: number;
  creditScorePercentile: number;
  savingsPercentile: number;
  investmentPercentile: number;
  retirementPercentile: number;
  finalPercentile: number;
}

export const calculatePercentiles = (inputs: PercentileInputs): PercentileResults => {
  // Determine age group
  const ageGroup = 
    inputs.age <= 25 ? '18-25' :
    inputs.age <= 35 ? '26-35' :
    inputs.age <= 45 ? '36-45' :
    '46-55';

  const averages = AGE_GROUP_AVERAGES[ageGroup];

  // Calculate individual percentiles
  const incomePercentile = Math.min(99, (inputs.monthlyIncome / averages.monthlyIncome) * 50 + 50);
  
  const spendingPercentile = Math.min(99, Math.max(1, 
    100 - ((inputs.monthlySpending / averages.monthlySpending) * 50)
  ));
  
  const debtPercentile = Math.min(99, Math.max(1,
    100 - ((inputs.totalDebt / averages.totalDebt) * 50)
  ));
  
  const creditScorePercentile = CREDIT_SCORE_PERCENTILES[inputs.creditScore] || 10;
  
  const savingsPercentile = Math.min(99, (inputs.totalSavings / averages.totalSavings) * 50 + 50);
  
  const investmentPercentile = Math.min(99, (inputs.investmentBalance / averages.investmentBalance) * 50 + 50);
  
  const retirementPercentile = Math.min(99, (inputs.retirementSavings / averages.retirementSavings) * 50 + 50);

  // Calculate final weighted percentile
  const finalPercentile = Math.round(
    (0.15 * incomePercentile) +
    (0.15 * spendingPercentile) +
    (0.15 * debtPercentile) +
    (0.15 * creditScorePercentile) +
    (0.10 * savingsPercentile) +
    (0.15 * investmentPercentile) +
    (0.15 * retirementPercentile)
  );

  return {
    incomePercentile: Math.round(incomePercentile),
    spendingPercentile: Math.round(spendingPercentile),
    debtPercentile: Math.round(debtPercentile),
    creditScorePercentile,
    savingsPercentile: Math.round(savingsPercentile),
    investmentPercentile: Math.round(investmentPercentile),
    retirementPercentile: Math.round(retirementPercentile),
    finalPercentile
  };
};

export const getPercentileDescription = (percentile: number): string => {
  if (percentile >= 95) return "Top 5%";
  if (percentile >= 90) return "Top 10%";
  if (percentile >= 75) return "Top 25%";
  if (percentile >= 50) return "Above Average";
  if (percentile >= 25) return "Below Average";
  return "Bottom 25%";
}; 