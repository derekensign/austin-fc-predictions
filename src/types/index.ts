// Core database entities

export interface Question {
  id: number;
  text: string;
  category?: string;
  order_index: number;
  is_active: boolean;
  created_at?: string;
}

export interface Submission {
  id: number;
  name: string;
  email: string;
  submitted_at: string;
}

export interface Answer {
  id: number;
  submission_id: number;
  question_id: number;
  answer: 'OVER' | 'UNDER';
  created_at?: string;
}

// Aggregated results for display

export interface QuestionWithResults extends Question {
  over_count: number;
  under_count: number;
  over_percentage: number;
  under_percentage: number;
  total_answers: number;
}

// Submission with full answer details (for admin)

export interface SubmissionWithAnswers extends Submission {
  answers: {
    question_id: number;
    question_text: string;
    answer: 'OVER' | 'UNDER';
  }[];
  score?: number; // Number of correct predictions (majority picks)
}

// API request/response types

export interface CreateSubmissionRequest {
  name: string;
  email: string;
  answers: {
    question_id: number;
    answer: 'OVER' | 'UNDER';
  }[];
}

export interface CreateSubmissionResponse {
  success: boolean;
  submission_id?: number;
  error?: string;
}

export interface GetResultsResponse {
  questions: QuestionWithResults[];
  total_submissions: number;
}

export interface AdminAuthRequest {
  password: string;
}

export interface AdminAuthResponse {
  success: boolean;
  token?: string;
  error?: string;
}

export interface AdminResultsResponse {
  submissions: SubmissionWithAnswers[];
  questions: QuestionWithResults[];
}

// CSV import types

export interface QuestionCSVRow {
  text: string;
  category?: string;
  order_index: string | number;
}
