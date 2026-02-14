import { neon, neonConfig } from '@neondatabase/serverless';
import type {
  Question,
  Submission,
  Answer,
  QuestionWithResults,
  SubmissionWithAnswers,
  CreateSubmissionRequest,
} from '@/types';

// Configure Neon for serverless
neonConfig.fetchConnectionCache = true;

// Get database connection
function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  return neon(process.env.DATABASE_URL);
}

// Get all active questions
export async function getQuestions(): Promise<Question[]> {
  const sql = getDb();
  const result = await sql`
    SELECT id, text, category, order_index, is_active, created_at
    FROM questions
    WHERE is_active = true
    ORDER BY order_index ASC
  `;
  return result as Question[];
}

// Create a new submission with answers (uses transaction)
export async function createSubmission(
  request: CreateSubmissionRequest
): Promise<Submission> {
  const sql = getDb();
  const { name, email, answers } = request;

  // Start transaction by inserting submission
  const submissionResult = await sql`
    INSERT INTO submissions (name, email)
    VALUES (${name}, ${email})
    RETURNING id, name, email, submitted_at
  `;

  const submission = submissionResult[0] as Submission;

  // Insert all answers
  for (const answer of answers) {
    await sql`
      INSERT INTO answers (submission_id, question_id, answer)
      VALUES (${submission.id}, ${answer.question_id}, ${answer.answer})
    `;
  }

  return submission;
}

// Get aggregated results by question
export async function getResultsByQuestion(): Promise<QuestionWithResults[]> {
  const sql = getDb();
  const result = await sql`
    SELECT
      q.id,
      q.text,
      q.category,
      q.order_index,
      q.is_active,
      q.created_at,
      COUNT(CASE WHEN a.answer = 'OVER' THEN 1 END)::int as over_count,
      COUNT(CASE WHEN a.answer = 'UNDER' THEN 1 END)::int as under_count,
      COUNT(a.id)::int as total_answers,
      CASE
        WHEN COUNT(a.id) = 0 THEN 0
        ELSE ROUND(100.0 * COUNT(CASE WHEN a.answer = 'OVER' THEN 1 END) / COUNT(a.id), 1)
      END as over_percentage,
      CASE
        WHEN COUNT(a.id) = 0 THEN 0
        ELSE ROUND(100.0 * COUNT(CASE WHEN a.answer = 'UNDER' THEN 1 END) / COUNT(a.id), 1)
      END as under_percentage
    FROM questions q
    LEFT JOIN answers a ON q.id = a.question_id
    WHERE q.is_active = true
    GROUP BY q.id, q.text, q.category, q.order_index, q.is_active, q.created_at
    ORDER BY q.order_index ASC
  `;
  return result as QuestionWithResults[];
}

// Get total number of submissions
export async function getTotalSubmissions(): Promise<number> {
  const sql = getDb();
  const result = await sql`
    SELECT COUNT(*)::int as count
    FROM submissions
  `;
  return result[0].count as number;
}

// Get all submissions with answers (admin view)
export async function getAllSubmissions(): Promise<SubmissionWithAnswers[]> {
  const sql = getDb();

  // Get all submissions
  const submissions = await sql`
    SELECT id, name, email, submitted_at
    FROM submissions
    ORDER BY submitted_at DESC
  `;

  // Get all answers with question text
  const answers = await sql`
    SELECT
      a.submission_id,
      a.question_id,
      q.text as question_text,
      a.answer
    FROM answers a
    JOIN questions q ON a.question_id = q.id
    ORDER BY a.submission_id, q.order_index
  `;

  // Group answers by submission
  const submissionsWithAnswers: SubmissionWithAnswers[] = submissions.map((sub: any) => {
    const submissionAnswers = answers.filter(
      (ans: any) => ans.submission_id === sub.id
    );

    return {
      id: sub.id,
      name: sub.name,
      email: sub.email,
      submitted_at: sub.submitted_at,
      answers: submissionAnswers.map((ans: any) => ({
        question_id: ans.question_id,
        question_text: ans.question_text,
        answer: ans.answer,
      })),
    };
  });

  return submissionsWithAnswers;
}

// Calculate scores for all submissions (number of majority picks)
export async function calculateScores(): Promise<SubmissionWithAnswers[]> {
  const submissions = await getAllSubmissions();
  const results = await getResultsByQuestion();

  return submissions.map(sub => {
    const score = sub.answers.filter(ans => {
      const questionResult = results.find(r => r.id === ans.question_id);
      if (!questionResult || questionResult.total_answers === 0) return false;

      // Determine majority answer
      const majority = questionResult.over_count > questionResult.under_count ? 'OVER' : 'UNDER';
      return ans.answer === majority;
    }).length;

    return {
      ...sub,
      score,
    };
  }).sort((a, b) => (b.score || 0) - (a.score || 0)); // Sort by score descending
}

// Import questions from CSV data
export async function importQuestions(questions: { text: string; category?: string; order_index: number }[]): Promise<number> {
  const sql = getDb();
  let count = 0;

  for (const q of questions) {
    await sql`
      INSERT INTO questions (text, category, order_index, is_active)
      VALUES (${q.text}, ${q.category || null}, ${q.order_index}, true)
    `;
    count++;
  }

  return count;
}

// Check if email already submitted
export async function emailExists(email: string): Promise<boolean> {
  const sql = getDb();
  const result = await sql`
    SELECT COUNT(*)::int as count
    FROM submissions
    WHERE email = ${email}
  `;
  return result[0].count > 0;
}
