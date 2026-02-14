import { NextRequest, NextResponse } from 'next/server';
import {
  createSubmission,
  getResultsByQuestion,
  getTotalSubmissions,
  emailExists,
} from '@/lib/db';
import type {
  CreateSubmissionRequest,
  CreateSubmissionResponse,
  GetResultsResponse,
} from '@/types';

// POST - Create a new submission
export async function POST(request: NextRequest) {
  try {
    const body: CreateSubmissionRequest = await request.json();
    const { name, email, answers } = body;

    // Validate required fields
    if (!name || !email || !answers) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, email, answers' } as CreateSubmissionResponse,
        { status: 400 }
      );
    }

    // Validate name length
    if (name.trim().length < 2 || name.trim().length > 255) {
      return NextResponse.json(
        { success: false, error: 'Name must be between 2 and 255 characters' } as CreateSubmissionResponse,
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' } as CreateSubmissionResponse,
        { status: 400 }
      );
    }

    // Check if email already exists
    const exists = await emailExists(email);
    if (exists) {
      return NextResponse.json(
        {
          success: false,
          error: 'This email has already submitted predictions. Contact admin if you need to update.',
        } as CreateSubmissionResponse,
        { status: 409 }
      );
    }

    // Validate answers array
    if (!Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one answer is required' } as CreateSubmissionResponse,
        { status: 400 }
      );
    }

    // Validate each answer
    for (const answer of answers) {
      if (!answer.question_id || !answer.answer) {
        return NextResponse.json(
          { success: false, error: 'Each answer must have question_id and answer' } as CreateSubmissionResponse,
          { status: 400 }
        );
      }

      if (answer.answer !== 'OVER' && answer.answer !== 'UNDER') {
        return NextResponse.json(
          { success: false, error: 'Answer must be either OVER or UNDER' } as CreateSubmissionResponse,
          { status: 400 }
        );
      }
    }

    // Create submission
    const submission = await createSubmission({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      answers,
    });

    return NextResponse.json({
      success: true,
      submission_id: submission.id,
    } as CreateSubmissionResponse);

  } catch (error: any) {
    console.error('Submission error:', error);

    // Handle database unique constraint violation (duplicate email)
    if (error.message?.includes('unique_email') || error.code === '23505') {
      return NextResponse.json(
        {
          success: false,
          error: 'This email has already submitted predictions. Contact admin if you need to update.',
        } as CreateSubmissionResponse,
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to save submission. Please try again.' } as CreateSubmissionResponse,
      { status: 500 }
    );
  }
}

// GET - Fetch aggregated results
export async function GET() {
  try {
    const questions = await getResultsByQuestion();
    const total_submissions = await getTotalSubmissions();

    return NextResponse.json({
      questions,
      total_submissions,
    } as GetResultsResponse);

  } catch (error: any) {
    console.error('Results fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch results' },
      { status: 500 }
    );
  }
}
