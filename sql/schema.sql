-- Austin FC Predictions Database Schema
-- For use with Neon PostgreSQL (via @neondatabase/serverless)

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  category VARCHAR(50),
  order_index INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Submissions table (one per email)
CREATE TABLE IF NOT EXISTS submissions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  submitted_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT unique_email UNIQUE(email)
);

-- Answers table (many-to-one with submissions)
CREATE TABLE IF NOT EXISTS answers (
  id SERIAL PRIMARY KEY,
  submission_id INTEGER NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  answer VARCHAR(10) NOT NULL CHECK (answer IN ('OVER', 'UNDER')),
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT unique_submission_question UNIQUE(submission_id, question_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_answers_submission ON answers(submission_id);
CREATE INDEX IF NOT EXISTS idx_answers_question ON answers(question_id);
CREATE INDEX IF NOT EXISTS idx_submissions_email ON submissions(email);
CREATE INDEX IF NOT EXISTS idx_questions_active ON questions(is_active);
