// Quick script to set up database schema
const { neon } = require('@neondatabase/serverless');

async function setupDatabase() {
  try {
    const sql = neon(process.env.DATABASE_URL);

    console.log('Setting up database tables...');

    // Create questions table
    await sql`
      CREATE TABLE IF NOT EXISTS questions (
        id SERIAL PRIMARY KEY,
        text TEXT NOT NULL,
        category VARCHAR(50),
        order_index INTEGER NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create submissions table
    await sql`
      CREATE TABLE IF NOT EXISTS submissions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        submitted_at TIMESTAMP DEFAULT NOW(),
        CONSTRAINT unique_email UNIQUE(email)
      )
    `;

    // Create answers table
    await sql`
      CREATE TABLE IF NOT EXISTS answers (
        id SERIAL PRIMARY KEY,
        submission_id INTEGER NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
        question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
        answer VARCHAR(10) NOT NULL CHECK (answer IN ('OVER', 'UNDER')),
        created_at TIMESTAMP DEFAULT NOW(),
        CONSTRAINT unique_submission_question UNIQUE(submission_id, question_id)
      )
    `;

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_answers_submission ON answers(submission_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_answers_question ON answers(question_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_submissions_email ON submissions(email)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_questions_active ON questions(is_active)`;

    console.log('✓ Database schema created successfully!');
    console.log('✓ Tables: questions, submissions, answers');
    console.log('✓ Indexes created');

  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();
