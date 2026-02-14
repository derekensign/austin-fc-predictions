import { NextRequest, NextResponse } from 'next/server';
import { importQuestions } from '@/lib/db';
import type { QuestionCSVRow } from '@/types';

export async function POST(request: NextRequest) {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Seed endpoint is disabled in production' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { questions } = body as { questions: QuestionCSVRow[] };

    if (!questions || !Array.isArray(questions)) {
      return NextResponse.json(
        { error: 'Invalid request body. Expected { questions: QuestionCSVRow[] }' },
        { status: 400 }
      );
    }

    // Validate and parse questions
    const parsedQuestions = questions.map((q, index) => {
      if (!q.text) {
        throw new Error(`Question at index ${index} is missing text field`);
      }

      const order_index = typeof q.order_index === 'string'
        ? parseInt(q.order_index, 10)
        : q.order_index;

      if (isNaN(order_index)) {
        throw new Error(`Question at index ${index} has invalid order_index`);
      }

      return {
        text: q.text.trim(),
        category: q.category?.trim() || undefined,
        order_index,
      };
    });

    // Import questions
    const count = await importQuestions(parsedQuestions);

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${count} questions`,
      count,
    });

  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to import questions' },
      { status: 500 }
    );
  }
}

// GET endpoint for testing
export async function GET() {
  return NextResponse.json({
    message: 'CSV Import Seed Endpoint',
    usage: 'POST /api/seed with body: { questions: QuestionCSVRow[] }',
    format: {
      questions: [
        {
          text: 'Will Austin FC make the playoffs?',
          category: 'Team Performance',
          order_index: 1
        }
      ]
    },
    note: 'This endpoint is only available in development mode'
  });
}
