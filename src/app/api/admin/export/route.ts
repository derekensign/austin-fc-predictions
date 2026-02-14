import { NextRequest, NextResponse } from 'next/server';
import { extractAndValidateToken } from '@/lib/auth';
import { calculateScores, getResultsByQuestion } from '@/lib/db';

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

    // Get all submissions with scores
    const submissions = await calculateScores();
    const questions = await getResultsByQuestion();

    // Build CSV content
    const headers = ['Name', 'Email', 'Score', 'Submitted At', ...questions.map(q => q.text)];
    const rows = submissions.map(sub => {
      const answerCells = questions.map(q => {
        const answer = sub.answers.find(a => a.question_id === q.id);
        return answer ? answer.answer : 'N/A';
      });

      return [
        sub.name,
        sub.email,
        sub.score?.toString() || '0',
        new Date(sub.submitted_at).toLocaleString(),
        ...answerCells,
      ];
    });

    // Convert to CSV format
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    // Return CSV file
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="austin-fc-predictions-${Date.now()}.csv"`,
      },
    });

  } catch (error: any) {
    console.error('Admin export error:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}
