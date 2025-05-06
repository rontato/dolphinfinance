import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface CreditCard {
  name: string;
  bank: string;
  logo: string;
  description: string;
  benefits: string[];
  affiliateLink: string;
  score: number; // Minimum recommended credit score
}

interface CreditCardRecommendationsProps {
  creditScore: number;
  monthlyIncome: number;
}

const creditCards: CreditCard[] = [
  {
    name: 'Chase Freedom Unlimited®',
    bank: 'Chase',
    logo: '/images/chase-logo.svg',
    description: 'Excellent for everyday spending with unlimited cash back',
    benefits: [
      '1.5% cash back on all purchases',
      'No annual fee',
      'Sign-up bonus available',
      'Additional bonus categories',
    ],
    affiliateLink: 'https://www.chase.com/referafriend/freedomunlimited',
    score: 670,
  },
  {
    name: 'Discover it® Cash Back',
    bank: 'Discover',
    logo: '/images/discover-logo.svg',
    description: 'Great for rotating 5% cash back categories',
    benefits: [
      '5% cash back in rotating quarterly categories',
      'Cash back match in first year',
      'No annual fee',
      'Free FICO® Score monitoring',
    ],
    affiliateLink: 'https://www.discover.com/credit-cards/cash-back/it-card.html',
    score: 600,
  },
  {
    name: 'American Express® Gold Card',
    bank: 'American Express',
    logo: '/images/amex-logo.svg',
    description: 'Perfect if you spend heavily on groceries and dining. The Amex Gold rewards foodies and travelers with generous points and bonus dining credits.',
    benefits: [
      '4X points at restaurants, including takeout and delivery',
      '4X points at U.S. supermarkets (up to $25,000/year)',
      '3X points on flights booked directly or on amextravel.com',
      '$120 annual dining credit',
      'No foreign transaction fees',
    ],
    affiliateLink: 'https://www.americanexpress.com/us/credit-cards/card/gold-card/',
    score: 680,
  },
];

export default function CreditCardRecommendations({ creditScore, monthlyIncome }: CreditCardRecommendationsProps) {
  const recommendedCards = creditCards.filter(card => creditScore >= card.score);

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Recommended Credit Cards</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendedCards.map((card, index) => (
          <motion.div
            key={card.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-lg p-6 border border-gray-200"
          >
            <div className="flex items-center mb-4">
              <img
                src={card.logo}
                alt={`${card.bank} logo`}
                width={120}
                height={40}
                style={{ objectFit: 'contain' }}
              />
            </div>
            <h3 className="text-xl font-semibold mb-2">{card.name}</h3>
            <p className="text-gray-600 mb-4">{card.description}</p>
            <ul className="space-y-2 mb-6">
              {card.benefits.map((benefit, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            <a
              href={card.affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-[#0058C0] text-white text-center py-3 rounded-lg hover:bg-[#004494] transition-colors"
            >
              Apply Now
            </a>
          </motion.div>
        ))}
      </div>
      {recommendedCards.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">
            Based on your credit score, we recommend focusing on improving your credit before applying for these cards.
            Consider a secured credit card to help build your credit history.
          </p>
        </div>
      )}
    </div>
  );
} 