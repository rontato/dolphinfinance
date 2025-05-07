import { RecommendationProduct, ProductCategory } from '../lib/generateProductRecommendations';

export function getBankingRecommendations(answers: Record<number, string | string[] | number>): ProductCategory[] {
  const hasChecking = answers[4] as string;
  const hasHYSA = answers[10] as string;
  const categories: ProductCategory[] = [];
  if (hasChecking === 'no' || hasChecking === 'unknown') {
    categories.push({
      title: "🏦 Checking Accounts",
      description: "Since you don't have a checking account, these options make managing your money easy and fee-free.",
      products: [
        {
          name: "SoFi Checking & Savings",
          description: "Earn up to 4.60% APY, skip annoying fees, and get early access to direct deposits — SoFi makes managing money effortless.",
          applicationLink: "https://www.sofi.com/invite/money?gcp=3f922b34-1509-40fe-968c-d732c7562168&isAliasGcp=false",
          isAffiliate: true
        },
        {
          name: "Capital One 360 Checking",
          description: "No fees, early paycheck access, and 40,000+ ATMs make Capital One 360 Checking a strong choice for daily banking.",
          applicationLink: "https://www.capitalone.com/bank/checking-accounts/online-checking-account/",
          isAffiliate: false
        }
      ]
    });
  }
  if (hasHYSA === 'no' || hasHYSA === 'unknown') {
    categories.push({
      title: "💰 High-Yield Savings",
      description: "Because you don't have a high-yield savings account, these options can help you grow your savings faster.",
      products: [
        {
          name: "SoFi Checking & Savings",
          description: "Earn up to 4.60% APY, skip annoying fees, and get early access to direct deposits — SoFi makes managing money effortless.",
          applicationLink: "https://www.sofi.com/invite/money?gcp=3f922b34-1509-40fe-968c-d732c7562168&isAliasGcp=false",
          isAffiliate: true
        },
        {
          name: "Marcus by Goldman Sachs",
          description: "If you're serious about saving, Marcus offers high APYs with no fees or minimums — perfect for maximizing your interest.",
          applicationLink: "https://www.marcus.com/us/en/savings/high-yield-savings",
          isAffiliate: false
        }
      ]
    });
  }
  return categories;
} 