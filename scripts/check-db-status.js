/**
 * Check current database status
 */

import { neon } from '@neondatabase/serverless';

async function checkDatabase() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable not found');
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);

  console.log('Checking database status...\n');

  // Check questions
  const questions = await sql`
    SELECT id, text, order_index, is_active, created_at
    FROM questions
    ORDER BY order_index ASC
  `;

  console.log(`📋 Total Questions: ${questions.length}`);
  if (questions.length > 0) {
    console.log('\nQuestions in database:');
    questions.forEach(q => {
      console.log(`  ${q.order_index}. [ID: ${q.id}] ${q.text.substring(0, 60)}...`);
    });
  }

  // Check submissions
  const submissions = await sql`
    SELECT COUNT(*)::int as count
    FROM submissions
  `;
  console.log(`\n👥 Total Submissions: ${submissions[0].count}`);

  // Check answers
  const answers = await sql`
    SELECT COUNT(*)::int as count
    FROM answers
  `;
  console.log(`📊 Total Answers: ${answers[0].count}`);

  // Get aggregated results
  if (submissions[0].count > 0) {
    const results = await sql`
      SELECT
        q.text,
        COUNT(CASE WHEN a.answer = 'OVER' THEN 1 END)::int as over_count,
        COUNT(CASE WHEN a.answer = 'UNDER' THEN 1 END)::int as under_count
      FROM questions q
      LEFT JOIN answers a ON q.id = a.question_id
      GROUP BY q.id, q.text
      ORDER BY q.order_index ASC
    `;

    console.log('\n📈 Current Results:');
    results.forEach(r => {
      if (r.over_count > 0 || r.under_count > 0) {
        console.log(`  ${r.text.substring(0, 50)}... → OVER: ${r.over_count}, UNDER: ${r.under_count}`);
      }
    });
  }
}

checkDatabase().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
