import { NextRequest, NextResponse } from 'next/server';
import { extractAndValidateToken } from '@/lib/auth';
import { calculateScores, getResultsByQuestion } from '@/lib/db';
import type { AdminResultsResponse } from '@/types';

export async function GET(request: NextRequest) {
  try {
    // Validate admin token
    const authHeader = request.headers.get('Authorization');
    const isValid = extractAndValidateToken(authHeader);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all submissions with scores and results
    const submissions = await calculateScores();
    const questions = await getResultsByQuestion();

    return NextResponse.json({
      submissions,
      questions,
    } as AdminResultsResponse);

  } catch (error: any) {
    console.error('Admin results error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin results' },
      { status: 500 }
    );
  }
}
