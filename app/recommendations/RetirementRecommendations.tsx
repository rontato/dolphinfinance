import { RecommendationProduct, ProductCategory } from '../lib/generateProductRecommendations';

export function getRetirementRecommendations(answers: Record<number, string | string[] | number>): ProductCategory[] {
  const hasRothIRA = answers[30] as string;
  const has401k = answers[34] as string;
  const categories: ProductCategory[] = [];
  if (hasRothIRA === 'no' || hasRothIRA === 'unknown') {
    categories.push({
      title: "🏦 Retirement Accounts",
      description: "Because you don't have a Roth IRA, these options can help you start saving for retirement tax-free.",
      products: [
        {
          name: "Fidelity Roth IRA",
          description: "Start growing your retirement savings with Fidelity's no-fee, easy-to-use Roth IRA — flexible for all investment goals.",
          applicationLink: "https://www.fidelity.com/retirement-ira/roth-ira",
          isAffiliate: false
        },
        {
          name: "Vanguard Roth IRA",
          description: "Known for its ultra-low fees and reliable index funds, Vanguard is a retirement savings staple for millions of investors.",
          applicationLink: "https://investor.vanguard.com/ira/roth-ira",
          isAffiliate: false
        }
      ]
    });
  }
  if (has401k === 'no' || has401k === 'unknown') {
    categories.push({
      title: "💼 401(k) Information",
      description: "Since you don't have a 401(k), here's what you need to know about employer retirement plans.",
      products: [
        {
          name: "401(k) Education",
          description: "You don't have a 401(k) yet — and that's completely normal! Most people only get access through an employer-sponsored plan once they start working full-time.",
          applicationLink: "",
          isAffiliate: false
        }
      ]
    });
  }
  return categories;
} 