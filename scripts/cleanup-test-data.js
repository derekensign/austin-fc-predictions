/**
 * Cleanup script to remove test questions and submissions
 */

import { neon } from '@neondatabase/serverless';

async function cleanupTestData() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable not found');
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);

  console.log('Starting cleanup of test data...\n');

  // First, check what we're about to delete
  const oldQuestions = await sql`
    SELECT id, text
    FROM questions
    WHERE id IN (1, 2, 3, 4, 5, 6)
  `;

  console.log('📋 Old test questions to be deleted:');
  oldQuestions.forEach(q => {
    console.log(`  [ID: ${q.id}] ${q.text}`);
  });

  const submissionCount = await sql`
    SELECT COUNT(*)::int as count
    FROM submissions
  `;
  console.log(`\n👥 Test submissions to be deleted: ${submissionCount[0].count}`);

  const answerCount = await sql`
    SELECT COUNT(*)::int as count
    FROM answers
  `;
  console.log(`📊 Test answers to be deleted: ${answerCount[0].count}`);

  console.log('\n⚠️  Starting deletion...\n');

  // Delete answers first (foreign key constraint)
  const deletedAnswers = await sql`
    DELETE FROM answers
    RETURNING id
  `;
  console.log(`✓ Deleted ${deletedAnswers.length} answers`);

  // Delete submissions
  const deletedSubmissions = await sql`
    DELETE FROM submissions
    RETURNING id
  `;
  console.log(`✓ Deleted ${deletedSubmissions.length} submissions`);

  // Delete old test questions
  const deletedQuestions = await sql`
    DELETE FROM questions
    WHERE id IN (1, 2, 3, 4, 5, 6)
    RETURNING id
  `;
  console.log(`✓ Deleted ${deletedQuestions.length} old test questions`);

  // Verify final state
  const remainingQuestions = await sql`
    SELECT COUNT(*)::int as count
    FROM questions
  `;

  console.log(`\n✅ Cleanup complete!`);
  console.log(`📋 Remaining questions: ${remainingQuestions[0].count} (your 20 new Austin FC predictions)`);
  console.log(`👥 Remaining submissions: 0`);
  console.log(`📊 Remaining answers: 0`);
}

cleanupTestData().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
