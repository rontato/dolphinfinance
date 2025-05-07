import { RecommendationProduct, ProductCategory } from '../lib/generateProductRecommendations';

export function getToolRecommendations(answers: Record<number, string | string[] | number>): ProductCategory[] {
  const creditScore = answers[25] as string;
  const monthlyIncome = Number(answers[2]) || 0;
  const monthlySpending = Number(answers[3]) || 0;
  const categories: ProductCategory[] = [];
  if (creditScore === 'unknown') {
    categories.push({
      title: "📊 Credit Monitoring",
      description: "Keep track of your credit score and get personalized improvement tips.",
      products: [
        {
          name: "Credit Karma",
          description: "Instantly access your free credit scores and get personalized financial recommendations to start improving your profile.",
          applicationLink: "https://www.creditkarma.com/",
          isAffiliate: false
        }
      ]
    });
  }
  if (monthlySpending / monthlyIncome > 0.8 || monthlySpending > monthlyIncome) {
    categories.push({
      title: "💰 Budgeting Tools",
      description: "Take control of your spending with these powerful budgeting apps.",
      products: [
        {
          name: "Rocket Money",
          description: "Stop overpaying — Rocket Money helps you cancel unused subscriptions and negotiates your bills down automatically.",
          applicationLink: "https://rocketmoney.com/",
          isAffiliate: false
        },
        {
          name: "YNAB (You Need a Budget)",
          description: "YNAB teaches you to master your cash flow, save more, and finally break the paycheck-to-paycheck cycle.",
          applicationLink: "https://www.youneedabudget.com/",
          isAffiliate: false
        }
      ]
    });
  }
  return categories;
} 