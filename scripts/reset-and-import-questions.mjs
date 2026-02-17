/**
 * Reset and reimport questions script
 * WARNING: This will delete ALL questions and answers (submissions will be deleted too due to cascade)
 *
 * Usage:
 *   source .env.local && node scripts/reset-and-import-questions.js
 */

import { neon } from '@neondatabase/serverless';

const QUESTIONS = [
  { prop: "Austin FC Hat tricks", line: 0.5 },
  { prop: "Austin FC Away Wins", line: 4.5 },
  { prop: "Combined \"Owen\" goals (Wolff + OG)", line: 8.5 },
  { prop: "Number of teams Owen Wolff is on", line: 1.5 },
  { prop: "Number of penalties taken by Myrto Uzuni", line: 1.5 },
  { prop: "Number of players who score more goals than Uzuni", line: 2.5 },
  { prop: "Brad Stuver Clean Sheets", line: 7.5 },
  { prop: "Number of starts by Damian Las (all Comps)", line: 3.5 },
  { prop: "Brandon Vazquez apperances", line: 23.5 },
  { prop: "Facundo Torres G+A", line: 14.5 },
  { prop: "Number of CJ Fodrey goals after the 80'", line: 2.5 },
  { prop: "Dani Pereira Yellow Cards", line: 6.5 },
  { prop: "Copa Tejas points", line: 5.5 },
  { prop: "Number of McConoughey in stadium appearances during an Austin FC game (all competitions)", line: 3.5 },
  { prop: "Number of Austin FC matches where teams combine for 2 or fewer goals", line: 19.5 },
  { prop: "Number of Knock Out matches (LC/USOC/MLS Playoffs)", line: 2.5 },
  { prop: "Number of the first goal scorer for Austin FC", line: 10.5 },
  { prop: "Number of announced Sell Outs at Q2", line: 16.5 },
  { prop: "% of goals Austin FC scores attacking the South End", line: 56.5 },
  { prop: "Austin FC final finish (Higher is a better seed)", line: 7.5 },
];

async function resetAndImport() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable not found');
    console.error('Make sure you have a .env.local file with DATABASE_URL set');
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);

  console.log('⚠️  WARNING: This will delete ALL questions, answers, and submissions!\n');

  // Check current state
  const questionCount = await sql`SELECT COUNT(*)::int as count FROM questions`;
  const submissionCount = await sql`SELECT COUNT(*)::int as count FROM submissions`;
  const answerCount = await sql`SELECT COUNT(*)::int as count FROM answers`;

  console.log('Current database state:');
  console.log(`  Questions: ${questionCount[0].count}`);
  console.log(`  Submissions: ${submissionCount[0].count}`);
  console.log(`  Answers: ${answerCount[0].count}\n`);

  console.log('Starting cleanup...\n');

  // Delete all data (cascades will handle answers due to ON DELETE CASCADE)
  await sql`DELETE FROM answers`;
  console.log('✓ Deleted all answers');

  await sql`DELETE FROM submissions`;
  console.log('✓ Deleted all submissions');

  await sql`DELETE FROM questions`;
  console.log('✓ Deleted all questions\n');

  // Reset the sequence for questions ID
  await sql`ALTER SEQUENCE questions_id_seq RESTART WITH 1`;
  console.log('✓ Reset question ID sequence\n');

  // Import new questions
  console.log(`Importing ${QUESTIONS.length} questions...\n`);

  let count = 0;
  for (let i = 0; i < QUESTIONS.length; i++) {
    const q = QUESTIONS[i];
    const text = `${q.prop}: Over/Under ${q.line}`;
    const orderIndex = i + 1;

    try {
      await sql`
        INSERT INTO questions (text, category, order_index, is_active)
        VALUES (${text}, ${null}, ${orderIndex}, true)
      `;
      count++;
      console.log(`✓ ${orderIndex}. ${text}`);
    } catch (error) {
      console.error(`✗ Failed to import question ${orderIndex}:`, error.message);
    }
  }

  console.log(`\n✅ Successfully imported ${count} of ${QUESTIONS.length} questions`);
  console.log('Database is ready for new submissions!');
}

resetAndImport().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
