/**
 * Script to upload Austin FC season prediction questions
 *
 * Usage: npx tsx scripts/upload-questions.ts
 */

const QUESTIONS = [
  { prop: "Austin FC Hat tricks", line: 0.5 },
  { prop: "Austin FC Away Wins", line: 4.5 },
  { prop: "Combined \"Owen\" goals (Wolff + OG)", line: 8.5 },
  { prop: "Number of Owen Wolff goal involvements", line: 11.5 },
  { prop: "Number of penalties taken by Myrto Uzuni", line: 1.5 },
  { prop: "Number of players who score more goals than Uzuni", line: 2.5 },
  { prop: "Brad Stuver Clean Sheets", line: 7.5 },
  { prop: "Number of starts by Damian Las (all Comps)", line: 3.5 },
  { prop: "Brandon Vazquez apperances", line: 23.5 },
  { prop: "Facundo Torres G+A", line: 14.5 },
  { prop: "Number of CJ Fodrey goals after the 80'", line: 2.5 },
  { prop: "Dani Pereira Yellow Cards", line: 6.5 },
  { prop: "Copa Tejas points", line: 5.5 },
  { prop: "Number of McConoughey in stadium appearances", line: 3.5 },
  { prop: "Number of Austin FC matches where teams combine for 2 or fewer goals", line: 18.5 },
  { prop: "Number of Knock Out matches (LC/USOC/MLS Playoffs)", line: 2.5 },
  { prop: "Number of the first goal scorer for Austin FC", line: 10.5 },
  { prop: "Number of announced Sell Outs at Q2", line: 16.5 },
  { prop: "% of goals Austin FC scores attacking the South End", line: 56.5 },
  { prop: "Austin FC final finish (Higher is a better seed)", line: 7.5 },
];

// Format questions for the API
const questions = QUESTIONS.map((q, index) => ({
  text: `${q.prop}: Over/Under ${q.line}`,
  category: undefined, // You can add categories if you want to group them
  order_index: index + 1,
}));

async function uploadQuestions() {
  const API_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  try {
    console.log(`Uploading ${questions.length} questions to ${API_URL}/api/seed...`);

    const response = await fetch(`${API_URL}/api/seed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ questions }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to upload questions');
    }

    console.log('✓ Success!', data.message);
    console.log(`✓ Imported ${data.count} questions`);

    console.log('\nQuestions uploaded:');
    questions.forEach((q, i) => {
      console.log(`  ${i + 1}. ${q.text}`);
    });

  } catch (error: any) {
    console.error('✗ Error uploading questions:', error.message);
    process.exit(1);
  }
}

uploadQuestions();
