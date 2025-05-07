// Removed import { ProductCategory } from './generateProductRecommendations';
import { getCreditCardRecommendations } from '../recommendations/CreditCardRecommendations';
import { getBankingRecommendations } from '../recommendations/BankingRecommendations';
import { getInvestmentRecommendations } from '../recommendations/InvestmentRecommendations';
import { getRetirementRecommendations } from '../recommendations/RetirementRecommendations';
import { getToolRecommendations } from '../recommendations/ToolRecommendations';

export interface RecommendationProduct {
  name: string;
  description: string;
  applicationLink: string;
  isAffiliate: boolean;
}

export interface ProductCategory {
  title: string;
  description: string;
  products: RecommendationProduct[];
}

export function generateProductRecommendations(answers: Record<number, string | string[] | number>): ProductCategory[] {
  return [
    ...getCreditCardRecommendations(answers),
    ...getBankingRecommendations(answers),
    ...getInvestmentRecommendations(answers),
    ...getRetirementRecommendations(answers),
    ...getToolRecommendations(answers),
  ];
} 