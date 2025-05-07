import { RecommendationProduct, ProductCategory } from '../lib/generateProductRecommendations';

export function getCreditCardRecommendations(answers: Record<number, string | string[] | number>): ProductCategory[] {
  const creditScore = answers[25] as string;
  const numCreditCards = answers[24] as string;
  const categories: ProductCategory[] = [];
  // High-Tier Credit Cards
  if (creditScore === 'excellent' || creditScore === 'very_good') {
    if (numCreditCards === 'three' || numCreditCards === 'four_plus') {
      categories.push({
        title: "🔥 Premium Travel Credit Cards",
        description: "With your strong credit and experience, these premium travel cards can unlock luxury perks and big rewards.",
        products: [
          {
            name: "American Express Platinum Card",
            description: "If you travel frequently, the Amex Platinum is built for you. Enjoy premium lounge access, top-tier travel perks, and luxury hotel benefits that elevate every trip.",
            applicationLink: "https://americanexpress.com/en-us/referral/platinum-card?ref=RONALW9f3v&xl=cp15",
            isAffiliate: true
          },
          {
            name: "Chase Sapphire Reserve",
            description: "If you want exceptional value on travel and dining, the Sapphire Reserve offers huge point multipliers, top-tier protections, and a $300 travel credit each year.",
            applicationLink: "https://www.referyourchasecard.com/19r/HWKKN4IRXS",
            isAffiliate: true
          }
        ]
      });
    }
  }
  // Mid-Tier Credit Cards
  if (creditScore === 'excellent' || creditScore === 'very_good' || creditScore === 'good') {
    if (numCreditCards === 'one' || numCreditCards === 'two') {
      categories.push({
        title: "🌟 Rewards Credit Cards",
        description: "Given your habits, these rewards cards are a great way to get more value from your spending.",
        products: [
          {
            name: "American Express Gold Card",
            description: "Perfect if you spend heavily on groceries and dining. The Amex Gold rewards foodies and travelers with generous points and bonus dining credits.",
            applicationLink: "https://americanexpress.com/en-us/referral/gold-card?ref=RONALW36mP&xl=cp15",
            isAffiliate: true
          },
          {
            name: "Chase Sapphire Preferred",
            description: "A top choice for travelers looking to earn flexible rewards without a huge annual fee. Great for dining, travel, and everyday spending.",
            applicationLink: "https://www.referyourchasecard.com/19r/HWKKN4IRXS",
            isAffiliate: false
          }
        ]
      });
    }
  }
  // No Annual Fee Cards
  if ((creditScore === 'good' || creditScore === 'fair') && 
      (numCreditCards === 'none' || numCreditCards === 'one')) {
    categories.push({
      title: "💸 No Annual Fee Credit Cards",
      description: "Because you're looking to maximize rewards without extra costs, these no annual fee cards are a great fit for your situation.",
      products: [
        {
          name: "Discover it® Cash Back Card",
          description: "A favorite for cashback beginners — earn 5% on rotating categories and get all your first year's cash back matched automatically.",
          applicationLink: "https://refer.discover.com/ronnius318!8dba911ec3!a",
          isAffiliate: true
        },
        {
          name: "Chase Freedom Unlimited",
          description: "For simple, unlimited cashback on everything you buy, the Freedom Unlimited card is a no-brainer with valuable Chase ecosystem benefits.",
          applicationLink: "https://www.referyourchasecard.com/18m/0C3YK8TID9",
          isAffiliate: true
        }
      ]
    });
  }
  // Secured Cards
  if (creditScore === 'poor' || creditScore === 'unknown' || numCreditCards === 'none') {
    categories.push({
      title: "🔒 Credit Building Cards",
      description: "Because you're building or rebuilding credit, these secured cards are a safe way to start improving your score.",
      products: [
        {
          name: "Chase Freedom Rise",
          description: "Building your credit? The Freedom Rise helps you earn rewards while establishing positive credit habits with no annual fee.",
          applicationLink: "https://www.referyourchasecard.com/18m/0C3YK8TID9",
          isAffiliate: true
        },
        {
          name: "Discover it® Secured Card",
          description: "If you're rebuilding your credit, Discover lets you earn cashback while reporting monthly to all three major credit bureaus.",
          applicationLink: "https://www.discover.com/credit-cards/secured/",
          isAffiliate: false
        }
      ]
    });
  }
  return categories;
} 