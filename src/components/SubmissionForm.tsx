'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import QuestionCard from './QuestionCard';
import type { Question } from '@/types';

export default function SubmissionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [answers, setAnswers] = useState<Record<number, 'OVER' | 'UNDER'>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  // Check for redirect message
  useEffect(() => {
    const message = searchParams.get('message');
    if (message === 'submit-first') {
      setInfoMessage('Please submit your predictions first to see the results!');
      // Clear the message after 5 seconds
      setTimeout(() => setInfoMessage(''), 5000);
    }
  }, [searchParams]);

  // Load questions on mount
  useEffect(() => {
    loadQuestions();
  }, []);

  async function loadQuestions() {
    try {
      const response = await fetch('/api/submissions');
      const data = await response.json();
      setQuestions(data.questions || []);
    } catch (err) {
      setError('Failed to load questions. Please refresh the page.');
      console.error('Failed to load questions:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleAnswer(questionId: number, answer: 'OVER' | 'UNDER') {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
  }

  function validateForm(): string | null {
    if (!name.trim()) {
      return 'Please enter your name';
    }
    if (name.trim().length < 2) {
      return 'Name must be at least 2 characters';
    }
    if (!email.trim()) {
      return 'Please enter your email';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    if (Object.keys(answers).length < questions.length) {
      return 'Please answer all questions';
    }
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          answers: Object.entries(answers).map(([question_id, answer]) => ({
            question_id: parseInt(question_id, 10),
            answer,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit predictions');
      }

      // Store submission token in localStorage to grant access to results
      localStorage.setItem('predictions_submitted', 'true');
      localStorage.setItem('submission_timestamp', Date.now().toString());

      // Redirect to results page
      router.push('/results');

    } catch (err: any) {
      setError(err.message || 'Failed to submit predictions. Please try again.');
      console.error('Submission error:', err);
    } finally {
      setSubmitting(false);
    }
  }

  const answeredCount = Object.keys(answers).length;
  const progress = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-verde-500 text-xl">Loading questions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Info Message */}
        {infoMessage && (
          <div className="mb-6 bg-verde-500/10 border border-verde-500 text-verde-500 px-4 py-3 rounded-lg text-center">
            {infoMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Info */}
          <div className="card">
            <h2 className="text-2xl font-bold text-verde-500 mb-6">
              Your Information
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-verde-500 mb-2 uppercase tracking-wide">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                    }
                  }}
                  placeholder="Enter your name"
                  disabled={submitting}
                  required
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-verde-500 mb-2 uppercase tracking-wide">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                    }
                  }}
                  placeholder="Enter your email"
                  disabled={submitting}
                  required
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-verde-500 border-b-2 border-verde-500 pb-3">
              Your Predictions
            </h2>
            {questions.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                selectedAnswer={answers[question.id]}
                onAnswer={handleAnswer}
                disabled={submitting}
              />
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Progress Bar */}
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-verde-500 uppercase tracking-wide">
                Progress: {answeredCount} / {questions.length} questions answered
              </span>
              <span className="text-lg font-bold text-verde-500">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || answeredCount < questions.length}
            className="btn-primary w-full py-4 text-xl"
          >
            {submitting ? 'Submitting...' : 'Submit Predictions'}
          </button>
        </form>
      </div>
    </div>
  );
}
