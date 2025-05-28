import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function getAgeGroup(age: number) {
  if (age < 18) return null;
  if (age <= 24) return String(age); // 18, 19, 20, 21, 22, 23, 24 as individual brackets
  if (age <= 30) return '25-30';
  if (age <= 40) return '31-40';
  if (age <= 50) return '41-50';
  return '51+';
}

export async function POST(req: NextRequest) {
  try {
    const { age, score, breakdowns } = await req.json();
    if (!age || !score || !breakdowns) {
      return NextResponse.json({ error: 'Missing age, score, or breakdowns' }, { status: 400 });
    }
    const ageGroup = getAgeGroup(Number(age));
    if (!ageGroup) {
      return NextResponse.json({ error: 'Invalid age' }, { status: 400 });
    }
    // Fetch all quiz results in this age group
    const allResults = await prisma.quizResult.findMany({
      where: {
        answers: {
          path: ["3.5"],
          equals: Number(age),
        },
      },
    });
    // If not enough data, return group size
    if (allResults.length < 100) {
      return NextResponse.json({ groupSize: allResults.length });
    }
    // Calculate percentiles
    const totalScores = allResults.map(r => r.score);
    const totalPercentile = (totalScores.filter(s => s < score).length / totalScores.length) * 100;
    // Per-category percentiles
    const categoryPercentiles: Record<string, number> = {};
    const userBreakdowns = breakdowns;
    // Assume breakdowns is an array of { section, score, maxScore }
    for (const userCat of userBreakdowns) {
      const catScores = allResults.map(r => {
        try {
          const parsed = typeof r.answers === 'string' ? JSON.parse(r.answers) : r.answers;
          // Find the same section in their breakdowns
          const b = parsed.breakdowns?.find((b: any) => b.section === userCat.section);
          return b ? b.score : null;
        } catch {
          return null;
        }
      }).filter((s: number | null) => typeof s === 'number');
      categoryPercentiles[userCat.section] = (catScores.filter((s: number) => s < userCat.score).length / catScores.length) * 100;
    }
    return NextResponse.json({
      groupSize: allResults.length,
      totalPercentile: Math.round(totalPercentile),
      categoryPercentiles: Object.fromEntries(
        Object.entries(categoryPercentiles).map(([k, v]) => [k, Math.round(v)])
      ),
    });
  } catch (error) {
    console.error('Percentile API error:', error);
    return NextResponse.json({ error: 'Failed to calculate percentiles' }, { status: 500 });
  }
} 