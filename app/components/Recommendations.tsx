import { motion } from 'framer-motion';

interface RecommendationProduct {
  name: string;
  description: string;
  applicationLink: string;
  isAffiliate: boolean;
}

interface ProductCategory {
  title: string;
  description: string;
  products: RecommendationProduct[];
}

interface RecommendationsProps {
  answers: Record<number, string | string[] | number>;
}

const Recommendations: React.FC<RecommendationsProps> = ({ answers }) => {
  const getCreditCardRecommendations = (): ProductCategory[] => {
    const creditScore = answers[25] as string;
    const numCreditCards = answers[24] as string;
    const categories: ProductCategory[] = [];

    // High-Tier Credit Cards
    if (creditScore === 'excellent' || creditScore === 'very_good') {
      if (numCreditCards === 'three' || numCreditCards === 'four_plus') {
        categories.push({
          title: "🔥 Premium Travel Credit Cards",
          description: "Unlock luxury perks and free travel with a premium travel card. Don't let exclusive benefits and valuable rewards pass you by.",
          products: [
            {
              name: "American Express Platinum Card",
              description: "If you travel frequently, the Amex Platinum is for you. Enjoy premium lounge access, TSA precheck, a ton of credits, and luxury hotel benefits to elevate every trip.",
              applicationLink: "https://americanexpress.com/en-us/referral/platinum-card?ref=RONALW9f3v&xl=cp15",
              isAffiliate: true
            },
            {
              name: "Chase Sapphire Reserve",
              description: "If you want exceptional value on travel and dining within the Chase ecosystem, the Sapphire Reserve offers lounge access, TSA precheck, top-tier protections, and a $300 travel credit each year.",
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
          description: "Maximize your spending power with these rewards cards. Big sign-up bonuses and free travel are waiting for you—don't miss out!",
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
              isAffiliate: true
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
        description: "Start building your credit with one of these no-fee cards—it's the smartest way to unlock better loan rates and earn rewards as you spend.",
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
        description: "Secured cards are your best first step to rebuilding credit. Take action now and open the door to better cards and loans down the road.",
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
  };

  const getBankingRecommendations = (): ProductCategory[] => {
    const hasChecking = answers[4] as string;
    const hasHYSA = answers[10] as string;
    const categories: ProductCategory[] = [];

    if (hasChecking === 'no' || hasChecking === 'unknown') {
      categories.push({
        title: "🏦 Checking Accounts",
        description: "Open a checking account that makes managing your money easy and fee-free. Stop paying unnecessary fees and enjoy modern banking features.",
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
        description: "Grow your savings faster with a high-yield account. The sooner you start, the more you'll earn in interest and financial security.",
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
  };

  const getInvestmentRecommendations = (): ProductCategory[] => {
    const hasBrokerage = answers[26] as string;
    const investmentTypes = answers[29] as string[] || [];
    const categories: ProductCategory[] = [];

    if (hasBrokerage === 'no' || hasBrokerage === 'unknown') {
      categories.push({
        title: "📈 Investment Accounts",
        description: "Investing early is the key to building wealth. Open an investment account and let compounding returns work for your future.",
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
  };

  const getRetirementRecommendations = (): ProductCategory[] => {
    const hasRothIRA = answers[30] as string;
    const has401k = answers[34] as string;
    const categories: ProductCategory[] = [];

    if (hasRothIRA === 'no' || hasRothIRA === 'unknown') {
      categories.push({
        title: "🏦 Retirement Accounts",
        description: "A Roth IRA is your ticket to tax-free retirement growth. The earlier you start, the more you'll benefit from years of compounding.",
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
        description: "Understanding 401(k)s now sets you up for long-term success. Don't leave employer contributions and retirement savings on the table.",
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
  };

  const getToolRecommendations = (): ProductCategory[] => {
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
  };

  const allRecommendations = [
    ...getCreditCardRecommendations(),
    ...getBankingRecommendations(),
    ...getInvestmentRecommendations(),
    ...getRetirementRecommendations(),
    ...getToolRecommendations()
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Personalized Recommendations
        </h2>
        <p className="text-xl text-gray-600">
          Here is what you need to do today to improve your finances
        </p>
      </motion.div>

      <div className="space-y-12">
        {allRecommendations.map((category, index) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {category.title}
            </h3>
            <p className="text-gray-600 mb-6">{category.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {category.products.map((product) => (
                <div
                  key={product.name}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    {product.name}
                  </h4>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  {product.applicationLink && (
                    <a
                      href={product.applicationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-2 rounded-md text-white bg-[#0058C0] hover:bg-[#004494] transition-colors"
                    >
                      Learn More
                    </a>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations; 