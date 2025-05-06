import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Helper function to get product recommendations based on scores
function getProductRecommendations(scores: unknown) {
  const recommendations = [];
  
  // High-Yield Savings Account
  if ((scores as any[]).some((s: any) => s.section === "Income & Budgeting" && s.score / s.maxScore >= 0.7)) {
    recommendations.push({
      category: "High-Yield Savings Account",
      explanation: "With your strong income and budgeting habits, you&apos;re well-positioned to maximize your savings. A high-yield savings account can help your money work harder for you.",
      products: [
        {
          name: "Premium Savings Account",
          description: "Earn up to 4.5% APY with no minimum balance requirements.",
          link: "https://dolphinfinance.io/apply/savings-premium"
        },
        {
          name: "Money Market Account",
          description: "Earn competitive rates while maintaining liquidity.",
          link: "https://dolphinfinance.io/apply/savings-money-market"
        }
      ]
    });
  }

  // Investment Portfolio
  if ((scores as any[]).some((s: any) => s.section === "Investing" && s.score / s.maxScore < 0.5)) {
    recommendations.push({
      category: "Investment Portfolio",
      explanation: "Your quiz results indicate room for growth in your investment strategy. Our professionally managed portfolios can help you build long-term wealth with minimal effort.",
      products: [
        {
          name: "Managed Investment Portfolio",
          description: "Start investing with as little as $100. Professional management and automatic rebalancing.",
          link: "https://dolphinfinance.io/apply/invest-managed"
        },
        {
          name: "Index Fund Portfolio",
          description: "Low-cost, diversified investing in major market indices.",
          link: "https://dolphinfinance.io/apply/invest-index"
        }
      ]
    });
  }

  // Retirement Planning
  if ((scores as any[]).some((s: any) => s.section === "Retirement" && s.score / s.maxScore < 0.6)) {
    recommendations.push({
      category: "Retirement Planning",
      explanation: "Your retirement readiness score suggests an opportunity to strengthen your long-term financial security. Our retirement tools can help you get on track.",
      products: [
        {
          name: "IRA Optimizer",
          description: "Maximize your retirement savings with tax-advantaged accounts.",
          link: "https://dolphinfinance.io/apply/retirement-ira"
        },
        {
          name: "401(k) Rollover Service",
          description: "Consolidate and optimize your retirement accounts.",
          link: "https://dolphinfinance.io/apply/retirement-rollover"
        }
      ]
    });
  }

  // Credit Building
  if ((scores as any[]).some((s: any) => s.section === "Credit Score" && s.score / s.maxScore < 0.7)) {
    recommendations.push({
      category: "Credit Building Tools",
      explanation: "Your credit score has room for improvement. Our credit building tools can help you track and improve your creditworthiness.",
      products: [
        {
          name: "Credit Score Monitor",
          description: "Real-time credit score tracking and improvement recommendations.",
          link: "https://dolphinfinance.io/apply/credit-monitor"
        },
        {
          name: "Credit Builder Account",
          description: "Build credit history while saving money.",
          link: "https://dolphinfinance.io/apply/credit-builder"
        }
      ]
    });
  }

  return recommendations;
}

export async function POST(req: Request) {
  // This is a placeholder to ensure the file is a valid module.
  return NextResponse.json({ success: true });
} 