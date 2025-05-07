import { RecommendationProduct, ProductCategory } from '../lib/generateProductRecommendations';

export function getInvestmentRecommendations(answers: Record<number, string | string[] | number>): ProductCategory[] {
  const hasBrokerage = answers[26] as string;
  const investmentTypes = answers[29] as string[] || [];
  const categories: ProductCategory[] = [];
  if (hasBrokerage === 'no' || hasBrokerage === 'unknown') {
    categories.push({
      title: "📈 Investment Accounts",
      description: "Since you don't have an investment account, these platforms are a great way to start building wealth.",
      products: [
        {
          name: "Fidelity Investments",
          description: "Low fees, fractional shares, and powerful research tools — Fidelity is ideal for new investors building smart habits.",
          applicationLink: "https://www.fidelity.com/open-account/overview",
          isAffiliate: false
        },
        {
          name: "Robinhood",
          description: "Get started in minutes with Robinhood's easy mobile app, commission-free trades, and fractional shares — perfect for beginners.",
          applicationLink: "https://join.robinhood.com/",
          isAffiliate: false
        }
      ]
    });
  } else if (investmentTypes.length > 0) {
    categories.push({
      title: "📊 Advanced Investment Platforms",
      description: "Take your investing to the next level with these full-featured platforms.",
      products: [
        {
          name: "Charles Schwab",
          description: "Full-service brokerage with zero commissions, robust trading platforms, and top-tier research access.",
          applicationLink: "https://www.schwab.com/open-an-account",
          isAffiliate: false
        },
        {
          name: "E*TRADE",
          description: "Active traders love ETRADE's powerful trading tools and huge selection of investment choices — from stocks to options.",
          applicationLink: "https://us.etrade.com/what-we-offer/our-accounts/brokerage",
          isAffiliate: false
        }
      ]
    });
  }
  return categories;
} 